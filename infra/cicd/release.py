#!/usr/bin/env python3
"""Publish the staging app and restore the previous verified release on failure."""

import argparse
import base64
from concurrent.futures import ThreadPoolExecutor
import gzip
import hashlib
from html.parser import HTMLParser
import ipaddress
import json
import mimetypes
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from threading import Event
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener


ACCOUNT = "450114866570"
REGION = "ap-southeast-2"
REPOSITORY = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com/examtopics-staging"
RELEASE_BUCKET = f"examtopics-staging-releases-{ACCOUNT}"
STATE_BUCKET = f"examtopics-staging-tfstate-{ACCOUNT}"
FRONTEND_BUCKET = f"examtopics-staging-web-{ACCOUNT}"
POINTER = "releases/last-known-healthy.json"
DOCUMENT = "ExamTopicsStagingDeploy"
UUID = r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}"
MAX_METADATA_BYTES = 1024 * 1024
MAX_FILES = 3000
IMMUTABLE = ("--if-none-match", "*")


class ReleaseError(Exception):
    pass


class AwsError(ReleaseError):
    def __init__(self, code):
        super().__init__("AWS request failed")
        self.code = code


class UncertainDeployment(ReleaseError):
    pass


class HostDeploymentFailed(ReleaseError):
    pass


def require(condition, message):
    if not condition:
        raise ReleaseError(message)


def matches(value, pattern):
    return isinstance(value, str) and re.fullmatch(pattern, value) is not None


def validate_image(uri):
    require(matches(uri, re.escape(REPOSITORY) + r"@sha256:[0-9a-f]{64}"), "Invalid staging image digest")


def validate_inputs(config, targets, release_id, api_image):
    require(isinstance(config, dict) and isinstance(targets, dict), "Invalid staging configuration")
    require(config.get("account_id") == targets.get("account_id") == ACCOUNT
            and config.get("region") == targets.get("region") == REGION, "Invalid staging account or region")
    domain = config.get("staging_domain")
    require(matches(domain, r"staging(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?){2,}") and len(domain) <= 249,
            "Invalid staging domain")
    require(config.get("release_bucket") == RELEASE_BUCKET and config.get("state_bucket") == STATE_BUCKET
            and config.get("state_key") == "staging/terraform.tfstate", "Invalid staging buckets or state key")
    require(config.get("ssm_document") == DOCUMENT
            and matches(str(config.get("ssm_document_version")), r"[1-9][0-9]{0,8}"), "Invalid staging SSM document")
    require(type(config.get("max_release_bytes")) is int and 0 < config["max_release_bytes"] <= 512 * 1024**2,
            "Invalid release size limit")
    require(matches(config.get("secret_version_id"), UUID), "Invalid staging secret version ID")
    require(matches(release_id, r"[0-9a-f]{40}"), "Invalid release commit")
    validate_image(api_image)
    validate_image(config.get("proxy_image"))
    expected = {
        "frontend_bucket": FRONTEND_BUCKET,
        "release_repository_url": REPOSITORY,
        "frontend_url": f"https://app.{domain}",
        "api_url": f"https://api.{domain}",
    }
    require(all(targets.get(key) == value for key, value in expected.items()), "Invalid staging application targets")
    patterns = {
        "api_instance_id": r"i-[0-9a-f]{17}",
        "frontend_distribution_id": r"E[A-Z0-9]{8,20}",
        "frontend_distribution_domain": r"[a-z0-9]+\.cloudfront\.net",
        "api_environment_secret_arn": (
            f"arn:aws:secretsmanager:{REGION}:{ACCOUNT}:secret:/examtopics/staging/api-environment-[A-Za-z0-9]{{6}}"
        ),
        "api_public_ipv4": r"[0-9]{1,3}(?:\.[0-9]{1,3}){3}",
    }
    require(set(targets) == set(expected) | set(patterns) | {"account_id", "region"}, "Unexpected staging target fields")
    require(all(matches(targets.get(key), pattern) for key, pattern in patterns.items()), "Invalid staging resource ID")
    try:
        address = ipaddress.IPv4Address(targets["api_public_ipv4"])
        require(address.is_global and not address.is_multicast, "Invalid staging IPv4 address")
    except ipaddress.AddressValueError:
        raise ReleaseError("Invalid staging IPv4 address") from None


def sha256(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def read_json(path):
    try:
        require(path.stat().st_size <= MAX_METADATA_BYTES, "Release metadata exceeds size limit")
        value = json.loads(path.read_bytes())
        require(isinstance(value, dict), "Invalid release metadata")
        return value
    except (OSError, ValueError, UnicodeError):
        raise ReleaseError("Invalid or inaccessible release metadata") from None


def write_json(path, value):
    path.write_text(json.dumps(value, sort_keys=True, indent=2) + "\n", encoding="utf-8")


def key_is_safe(key):
    return (matches(key, r"[A-Za-z0-9_][A-Za-z0-9._/-]{0,499}")
            and all(part and not part.startswith(".") for part in key.split("/"))
            and not any(suffix in key.casefold() for suffix in (".tfstate", ".tfvars"))
            and not key.casefold().endswith(".pem")
            and all(not part.casefold().startswith("client_secret_") for part in key.split("/")))


def hashed_asset(key):
    return matches(key, r"assets/(?:[\w.-]+/)*[\w.-]+-[A-Za-z0-9_-]{8,}\.[A-Za-z0-9]+")


class IndexLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = set()

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "script" and attrs.get("src"):
            self.assets.add(attrs["src"])
        if tag == "link" and attrs.get("rel") in {"stylesheet", "modulepreload"} and attrs.get("href"):
            self.assets.add(attrs["href"])


def check_index(build_dir, files, targets):
    require(0 < files.get("index.html", {}).get("size", 0) <= MAX_METADATA_BYTES, "Missing or oversized frontend index")
    html = IndexLinks()
    html.feed((build_dir / "index.html").read_text(encoding="utf-8"))
    require(all(path.startswith("/assets/") and path[1:] in files for path in html.assets),
            "Frontend references an unknown entry asset")
    scripts = [path[1:] for path in html.assets if path.endswith((".js", ".mjs"))]
    require(scripts, "Frontend index lacks an entry script")
    require(any(all(origin.encode() in body for origin in (targets["api_url"], targets["frontend_url"]))
                for body in ((build_dir / key).read_bytes() for key in scripts)),
            "Frontend entry script lacks the staging origins")


def validate_files(files, max_bytes):
    require(isinstance(files, dict) and "index.html" in files and len(files) <= MAX_FILES,
            "Invalid frontend manifest file inventory")
    total = 0
    for key, info in files.items():
        require(key_is_safe(key) and (not key.startswith("assets/") or hashed_asset(key))
                and isinstance(info, dict) and matches(info.get("sha256"), r"[0-9a-f]{64}")
                and type(info.get("size")) is int and 0 <= info["size"] <= max_bytes,
                "Invalid frontend manifest entry")
        total += info["size"]
        require(total <= max_bytes, "Frontend files exceed release size limit")


def build_artifact(config, targets, build_dir, api_image, release_id, directory):
    require(build_dir.is_dir() and not build_dir.is_symlink(), "Missing frontend build directory")
    files = {}
    require(all(not path.is_symlink() for path in build_dir.rglob("*")), "Frontend contains a symbolic link")
    paths = sorted(path for path in build_dir.rglob("*") if not path.is_dir())
    require(len(paths) <= MAX_FILES and all(path.is_file() for path in paths), "Invalid frontend build files")
    require(sum(path.stat().st_size for path in paths) <= config["max_release_bytes"],
            "Frontend files exceed release size limit")
    for path in paths:
        key = path.relative_to(build_dir).as_posix()
        require(key_is_safe(key), "Invalid frontend build path")
        files[key] = {"sha256": sha256(path), "size": path.stat().st_size}
    validate_files(files, config["max_release_bytes"])
    check_index(build_dir, files, targets)

    archive = directory / "frontend.tar.gz"
    with archive.open("wb") as output, gzip.GzipFile(filename="", fileobj=output, mode="wb", mtime=0) as compressed:
        with tarfile.open(fileobj=compressed, mode="w|", format=tarfile.USTAR_FORMAT) as tar:
            for key, info in files.items():
                entry = tarfile.TarInfo(key)
                entry.size = info["size"]
                with (build_dir / key).open("rb") as source:
                    tar.addfile(entry, source)
    require(archive.stat().st_size <= config["max_release_bytes"], "Frontend archive exceeds release size limit")
    manifest = {
        "release": release_id,
        "api_image": api_image,
        "proxy_image": config["proxy_image"],
        "secret_version_id": config["secret_version_id"],
        "frontend_sha256": sha256(archive),
        "files": files,
        "targets": targets,
    }
    write_json(directory / "manifest.json", manifest)
    return manifest


def extract_artifact(archive, manifest, destination):
    require(sha256(archive) == manifest["frontend_sha256"], "Rollback frontend archive checksum mismatch")
    files = manifest["files"]
    remaining = set(files)
    try:
        with tarfile.open(archive, "r|gz") as tar:
            for entry in tar:
                require(entry.isfile() and entry.name in remaining and files[entry.name]["size"] == entry.size,
                        "Unexpected rollback archive entry")
                remaining.remove(entry.name)
                output = destination / entry.name
                output.parent.mkdir(parents=True, exist_ok=True)
                with output.open("xb") as target:
                    shutil.copyfileobj(tar.extractfile(entry), target)
                require(sha256(output) == files[entry.name]["sha256"], "Rollback frontend file checksum mismatch")
    except (OSError, ValueError, EOFError, tarfile.TarError):
        raise ReleaseError("Invalid rollback frontend archive") from None
    require(not remaining, "Rollback frontend archive is incomplete")


def valid_version(value):
    return matches(value, r"[A-Za-z0-9_./+=-]{1,1024}") and value != "null"


def make_pointer(release_id, previous_id, manifest, version_id):
    require(valid_version(version_id), "Expected a versioned frontend index")
    return {
        "release": release_id,
        "previous_release": previous_id,
        "manifest_sha256": sha256(manifest),
        "frontend_index_version_id": version_id,
    }


def prepare_baseline(config, targets, build_dir, api_image, release_id, index_version, output):
    validate_inputs(config, targets, release_id, api_image)
    require(valid_version(index_version), "Invalid deployed frontend index version ID")
    require(not output.exists(), "Baseline output directory must be new")
    output.mkdir(mode=0o700)
    manifest = build_artifact(config, targets, build_dir, api_image, release_id, output)
    with tempfile.TemporaryDirectory(prefix="examtopics-baseline-") as directory:
        extract_artifact(output / "frontend.tar.gz", manifest, Path(directory))
    pointer = make_pointer(release_id, None, output / "manifest.json", index_version)
    write_json(output / "last-known-healthy.json", pointer)


class Aws:
    def call(self, service, operation, *args, once=False):
        command = ["aws", service, operation, "--region", REGION, "--no-cli-pager", "--no-cli-auto-prompt",
                   "--output", "json", "--cli-connect-timeout", "5", "--cli-read-timeout", "30", *args]
        try:
            result = subprocess.run(command, capture_output=True, check=False, timeout=90,
                                    env=os.environ | {"AWS_MAX_ATTEMPTS": "1" if once else "2",
                                                      "AWS_IGNORE_CONFIGURED_ENDPOINT_URLS": "true"})
        except (OSError, subprocess.TimeoutExpired):
            raise AwsError("Uncertain") from None
        if result.returncode:
            code = re.search(rb"\(([A-Za-z0-9]+)\) when calling", result.stderr)
            raise AwsError(code[1].decode("ascii") if code else "Uncertain")
        try:
            return json.loads(result.stdout or b"{}")
        except (ValueError, UnicodeError):
            raise AwsError("Uncertain") from None

    def get(self, bucket, key, path, limit):
        metadata = self.call("s3api", "get-object", "--bucket", bucket, "--key", key,
                             "--expected-bucket-owner", ACCOUNT, "--range", f"bytes=0-{limit}", str(path))
        require(path.stat().st_size <= limit, "S3 release object exceeds size limit")
        return metadata

    def put(self, bucket, key, path, *, content_type, cache_control=None, condition=None):
        checksum = base64.b64encode(bytes.fromhex(sha256(path))).decode("ascii")
        args = ["--bucket", bucket, "--key", key, "--expected-bucket-owner", ACCOUNT,
                "--body", str(path), "--checksum-sha256", checksum, "--content-type", content_type]
        if cache_control:
            args.extend(("--cache-control", cache_control))
        if condition:
            args.extend(condition)
        return self.call("s3api", "put-object", *args, once=True)


def media_matches(expected, actual):
    current = actual.split(";", 1)[0]
    wanted = expected.split(";", 1)[0]
    return current == wanted or {current, wanted} == {"application/javascript", "text/javascript"}


def put_immutable(aws, bucket, key, path, content_type, cache_control=None):
    try:
        return aws.put(bucket, key, path, content_type=content_type, cache_control=cache_control, condition=IMMUTABLE)
    except AwsError as error:
        if error.code not in {"PreconditionFailed", "ConditionalRequestConflict"}:
            raise
        with tempfile.TemporaryDirectory() as directory:
            existing = Path(directory) / "existing"
            result = aws.get(bucket, key, existing, path.stat().st_size)
            require(sha256(existing) == sha256(path)
                    and media_matches(content_type, result.get("ContentType", "")),
                    "Immutable release object conflicts with existing content")
            return result


def read_previous(aws, config, targets, directory):
    pointer_path = directory / "pointer.json"
    metadata = aws.get(RELEASE_BUCKET, POINTER, pointer_path, MAX_METADATA_BYTES)
    etag = metadata.get("ETag")
    require(matches(etag, r'"[a-f0-9]{32}(?:-[0-9]+)?"') and valid_version(metadata.get("VersionId")),
            "Invalid previous pointer S3 metadata")
    pointer = read_json(pointer_path)
    previous_id = pointer.get("release")
    require(matches(previous_id, r"[0-9a-f]{40}") and valid_version(pointer.get("frontend_index_version_id"))
            and matches(pointer.get("manifest_sha256"), r"[0-9a-f]{64}"), "Invalid last known healthy release pointer")
    prefix = f"releases/{previous_id}"
    saved_manifest = directory / "manifest.json"
    aws.get(RELEASE_BUCKET, f"{prefix}/manifest.json", saved_manifest, MAX_METADATA_BYTES)
    require(sha256(saved_manifest) == pointer["manifest_sha256"], "Rollback manifest checksum mismatch")
    manifest = read_json(saved_manifest)
    require(manifest.get("release") == previous_id and manifest.get("targets") == targets
            and matches(manifest.get("frontend_sha256"), r"[0-9a-f]{64}")
            and matches(manifest.get("secret_version_id"), UUID), "Rollback manifest targets or metadata are invalid")
    validate_image(manifest.get("api_image"))
    validate_image(manifest.get("proxy_image"))
    validate_files(manifest.get("files"), config["max_release_bytes"])
    archive = directory / "frontend.tar.gz"
    aws.get(RELEASE_BUCKET, f"{prefix}/frontend.tar.gz", archive, config["max_release_bytes"])
    extract_artifact(archive, manifest, directory / "build")
    check_index(directory / "build", manifest["files"], targets)
    return pointer, etag, manifest


def verify_rollback_dependencies(aws, targets, current, previous):
    digests = {record[key].rsplit("@", 1)[1] for record in (current, previous) for key in ("api_image", "proxy_image")}
    response = aws.call("ecr", "describe-images", "--registry-id", ACCOUNT, "--repository-name", "examtopics-staging",
                        "--image-ids", *(f"imageDigest={digest}" for digest in sorted(digests)))
    tagged = {item.get("imageDigest") for item in response.get("imageDetails", []) if item.get("imageTags")}
    require(digests <= tagged, "Release images must exist with retained ECR tags")
    versions = aws.call("secretsmanager", "describe-secret", "--secret-id", targets["api_environment_secret_arn"])
    require(all(versions.get("VersionIdsToStages", {}).get(record["secret_version_id"])
                for record in (current, previous)), "Release secret versions must exist with retained staging labels")


def poll_command(aws, instance, command_id, seconds):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        try:
            result = aws.call("ssm", "get-command-invocation", "--instance-id", instance, "--command-id", command_id,
                              "--query", "{Status:Status,ResponseCode:ResponseCode}", once=True)
            if not isinstance(result, dict):
                return "unknown"
            status = result.get("Status")
            code = result.get("ResponseCode")
            if status == "Success":
                return "success" if type(code) is int and code == 0 else "unknown"
            if status == "Failed":
                # -1 means the command was never observed starting. Signal exits may have left subprocesses running.
                return "failure" if type(code) is int and 0 < code < 128 else "unknown"
            if status in {"TimedOut", "Cancelled", "Cancelling"}:
                return "unknown"
        except AwsError:
            # Invocation records are eventually consistent and poll failures are retriable.
            pass
        time.sleep(5)
    return "unknown"


def deploy_host(aws, config, targets, manifest):
    instance = targets["api_instance_id"]
    parameters = {
        "ReleaseId": [manifest["release"]],
        "ApiImage": [manifest["api_image"]],
        "ProxyImage": [manifest["proxy_image"]],
        "SecretVersionId": [manifest["secret_version_id"]],
    }
    try:
        result = aws.call("ssm", "send-command", "--document-name", DOCUMENT, "--document-version",
                          str(config["ssm_document_version"]), "--instance-ids", instance, "--timeout-seconds", "60",
                          "--parameters", json.dumps(parameters), "--query", "Command.CommandId",
                          "--comment", f"ExamTopics staging release {manifest['release']}", once=True)
        command_id = result.get("Command", {}).get("CommandId") if isinstance(result, dict) else result
        if not matches(command_id, UUID):
            raise AwsError("Uncertain")
    except AwsError as error:
        if error.code in {"AccessDenied", "AccessDeniedException", "InvalidDocument", "InvalidDocumentVersion",
                          "InvalidInstanceId", "InvalidParameters"}:
            raise ReleaseError("SSM rejected the staging command") from None
        raise UncertainDeployment("SSM command delivery is unconfirmed; investigate the staging host") from None

    # Allow the pinned document its 600-second execution limit and SSM delivery delay.
    status = poll_command(aws, instance, command_id, 690)
    if status == "unknown":
        raise UncertainDeployment("SSM command has no confirmed terminal helper result; investigate the staging host")
    if status == "failure":
        raise HostDeploymentFailed("SSM host deployment or readiness failed")


def content_type(key):
    media = {".js": "text/javascript", ".mjs": "text/javascript", ".ico": "image/x-icon",
             ".json": "application/json", ".html": "text/html; charset=utf-8"}
    return media.get(Path(key).suffix, mimetypes.guess_type(key)[0] or "application/octet-stream")


def publish_frontend(aws, build_dir, files):
    stopped = Event()
    confirmed_rejections = {
        "AccessDenied", "AccessDeniedException", "BadDigest", "ConditionalRequestConflict",
        "EntityTooLarge", "InvalidArgument", "InvalidDigest", "InvalidRequest", "NoSuchBucket", "PreconditionFailed",
    }

    def upload(key):
        if stopped.is_set():
            return
        try:
            path = build_dir / key
            require(sha256(path) == files[key]["sha256"], "Frontend file changed after packaging")
            mime = content_type(key)
            if stopped.is_set():
                return
            if key.startswith("assets/"):
                result = put_immutable(aws, FRONTEND_BUCKET, key, path, mime, "public,max-age=31536000,immutable")
            else:
                result = aws.put(FRONTEND_BUCKET, key, path, content_type=mime, cache_control="no-cache")
            if not isinstance(result, dict) or not valid_version(result.get("VersionId")):
                raise UncertainDeployment("Staging frontend write is unconfirmed; investigate the release")
            return result["VersionId"]
        except (ReleaseError, OSError) as error:
            stopped.set()
            if isinstance(error, AwsError) and error.code not in confirmed_rejections:
                raise UncertainDeployment("Staging frontend write is unconfirmed; investigate the release") from None
            raise

    with ThreadPoolExecutor(max_workers=12) as executor:
        uploads = [executor.submit(upload, key) for key in files if key != "index.html"]
        failure = None
        # Observe every in-flight result. A definite rejection must never mask an unconfirmed write.
        for pending in uploads:
            try:
                pending.result()
            except (ReleaseError, OSError) as error:
                if failure is None or isinstance(error, UncertainDeployment):
                    failure = error
        if failure is not None:
            raise failure
    return upload("index.html")


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, result, code, message, headers, new_url):
        return None


def verify_public(targets, manifest):
    opener = build_opener(ProxyHandler({}), NoRedirect())
    files = manifest["files"]

    def open_response(url):
        request = Request(url, headers={"Accept-Encoding": "identity"})
        try:
            return opener.open(request, timeout=8)
        except HTTPError as error:
            return error

    def check_frontend(url, info, mime):
        with open_response(url) as response:
            require(response.status == 200, "Unexpected staging frontend status")
            require(media_matches(mime, response.headers.get_content_type()), "Unexpected staging content type")
            body = response.read(info["size"] + 1)
            require(len(body) == info["size"] and hashlib.sha256(body).hexdigest() == info["sha256"],
                    "Staging HTTP content checksum mismatch")

    for attempt in range(4):
        try:
            # Caddy intentionally hides /health. Real dependency readiness runs on the host.
            with open_response(targets["api_url"] + "/health") as response:
                require(response.status == 404, "Unexpected public staging health status")
            # The Express fallback proves the request reached the upstream without touching auth or data.
            with open_response(targets["api_url"] + "/") as response:
                require(response.status == 404 and response.headers.get_content_type() == "application/json"
                        and matches(response.headers.get("X-Request-Id"), UUID), "Unexpected staging API response")
                body = response.read(1025)
                require(len(body) <= 1024, "Unexpected staging API response")
                result = json.loads(body)
                require(result == {"success": False, "error": "Endpoint not found"} and result["success"] is False,
                        "Unexpected staging API response")
            check_frontend(targets["frontend_url"] + "/", files["index.html"], "text/html")
            for key, info in files.items():
                if key.startswith("assets/"):
                    check_frontend(f'{targets["frontend_url"]}/{quote(key, safe="/")}', info, content_type(key))
            return
        except (OSError, URLError, ReleaseError, ValueError):
            if attempt < 3:
                time.sleep(5)
    raise ReleaseError("Public staging checks failed")


def commit_pointer(aws, pointer_path, previous, etag):
    expected = read_json(pointer_path)
    try:
        aws.put(RELEASE_BUCKET, POINTER, pointer_path, content_type="application/json", condition=("--if-match", etag))
    except AwsError as error:
        with tempfile.TemporaryDirectory() as directory:
            observed_path = Path(directory) / "pointer.json"
            try:
                aws.get(RELEASE_BUCKET, POINTER, observed_path, MAX_METADATA_BYTES)
                observed = read_json(observed_path)
            except (OSError, ReleaseError):
                raise UncertainDeployment("Healthy pointer write is unconfirmed; investigate the staging release") from None
        if observed == expected:
            return
        if observed != previous:
            raise UncertainDeployment("Healthy pointer changed concurrently; investigate the staging release") from None
        if error.code not in {"PreconditionFailed", "ConditionalRequestConflict", "AccessDenied"}:
            raise UncertainDeployment("Healthy pointer write is unconfirmed; investigate the staging release") from None
        raise ReleaseError("Healthy release pointer was not advanced") from None


def deploy(config, targets, build_dir, api_image, release_id, aws=None, *, before_mutation=None):
    validate_inputs(config, targets, release_id, api_image)
    aws = aws or Aws()

    def guard(phase):
        if before_mutation is not None:
            try:
                before_mutation(phase)
            except Exception:
                raise UncertainDeployment(f"Staging mutation guard failed before {phase}; investigate the release") from None

    with tempfile.TemporaryDirectory(prefix="examtopics-release-") as work:
        current_dir, prior_dir = Path(work) / "new", Path(work) / "prior"
        current_dir.mkdir()
        prior_dir.mkdir()
        previous_pointer, etag, previous = read_previous(aws, config, targets, prior_dir)
        current = build_artifact(config, targets, build_dir, api_image, release_id, current_dir)
        extract_artifact(current_dir / "frontend.tar.gz", current, current_dir / "build")
        verify_rollback_dependencies(aws, targets, current, previous)
        if release_id == previous["release"]:
            require(sha256(current_dir / "manifest.json") == previous_pointer["manifest_sha256"],
                    "Release commit already points to a different artifact")
            verify_public(targets, current)
            return

        prefix = f"releases/{release_id}"
        guard("artifact")
        put_immutable(aws, RELEASE_BUCKET, f"{prefix}/frontend.tar.gz", current_dir / "frontend.tar.gz", "application/gzip")
        put_immutable(aws, RELEASE_BUCKET, f"{prefix}/manifest.json", current_dir / "manifest.json", "application/json")
        frontend_started = False
        try:
            guard("backend")
            deploy_host(aws, config, targets, current)
            guard("frontend")
            frontend_started = True
            index_version = publish_frontend(aws, current_dir / "build", current["files"])
            verify_public(targets, current)
            pointer = make_pointer(release_id, previous["release"], current_dir / "manifest.json", index_version)
            pointer_path = current_dir / "pointer.json"
            write_json(pointer_path, pointer)
            guard("pointer")
            commit_pointer(aws, pointer_path, previous_pointer, etag)
        except UncertainDeployment:
            raise
        except (ReleaseError, OSError) as failure:
            if not frontend_started and not isinstance(failure, HostDeploymentFailed):
                raise
            # Restore each affected surface independently, even if one rollback action fails.
            failures = []
            guard("rollback_backend")
            try:
                deploy_host(aws, config, targets, previous)
            except UncertainDeployment:
                raise
            except ReleaseError:
                failures.append("backend")
            if frontend_started:
                guard("rollback_frontend")
                try:
                    publish_frontend(aws, prior_dir / "build", previous["files"])
                except UncertainDeployment:
                    raise
                except (ReleaseError, OSError):
                    failures.append("frontend")
            try:
                verify_public(targets, previous)
            except ReleaseError:
                failures.append("public verification")
            if failures:
                raise ReleaseError("Staging deployment failed; rollback needs investigation (" + ", ".join(failures) + ")") from None
            reason = str(failure) if isinstance(failure, ReleaseError) else "release file operation failed"
            raise ReleaseError(f"{reason}; previous application restored") from None


def run_mutation_guard(config_path, work, release_id, phase):
    command = [
        sys.executable, str(Path(__file__).with_name("pipeline.py")), "guard",
        "--config", str(config_path), "--work", str(work), "--sha", release_id, "--phase", phase,
    ]
    try:
        subprocess.run(command, capture_output=True, check=True, timeout=180)
    except (OSError, subprocess.SubprocessError):
        raise UncertainDeployment(f"Staging mutation guard failed before {phase}; investigate the release") from None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_subparsers(dest="mode", required=True)
    for mode in ("deploy", "prepare-baseline"):
        command = modes.add_parser(mode)
        for key in ("config", "targets", "build-dir"):
            command.add_argument(f"--{key}", type=Path, required=True)
        command.add_argument("--api-image", required=True)
        command.add_argument("--release", required=True)
        if mode == "prepare-baseline":
            command.add_argument("--index-version", required=True)
            command.add_argument("--output", type=Path, required=True)
        else:
            command.add_argument("--guard-work", type=Path, required=True)
    args = parser.parse_args()
    try:
        values = (read_json(args.config), read_json(args.targets), args.build_dir, args.api_image, args.release)
        if args.mode == "prepare-baseline":
            prepare_baseline(*values, args.index_version, args.output)
            print("Wrote local staging baseline artifacts.")
        else:
            def guard(phase):
                run_mutation_guard(args.config, args.guard_work, args.release, phase)

            deploy(*values, before_mutation=guard)
            print("Verified staging application release.")
    except (ReleaseError, OSError, UnicodeError, ValueError) as error:
        reason = str(error) if isinstance(error, ReleaseError) else "invalid release file or response"
        print(f"Staging release: {reason}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
