#!/usr/bin/env python3
"""Bounded staging workflow commands. Importing this module never calls AWS."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener

try:
    from . import gate
except ImportError:
    import gate

LEASE = "releases/in-progress.json"
POINTER = "releases/last-known-healthy.json"
MAX_METADATA = 2 * 1024 * 1024
ROOT = Path(__file__).resolve().parents[2]
TF_ROOT = ROOT / "infra/terraform/staging"


def command(args, *, input=None, env=None, timeout=120):
    clean = os.environ | {"AWS_IGNORE_CONFIGURED_ENDPOINT_URLS": "true", "TF_IN_AUTOMATION": "1"}
    if env:
        for key, value in env.items():
            if value is None:
                clean.pop(key, None)
            else:
                clean[key] = value
    try:
        result = subprocess.run(args, input=input, text=True, capture_output=True, timeout=timeout, env=clean)
        gate.require(result.returncode == 0, "Staging command failed; inspect privately, do not retry with broader credentials")
        return result.stdout
    except (OSError, subprocess.TimeoutExpired):
        raise gate.GateError("Staging command failed or timed out; operator investigation required") from None


def aws(service, operation, *args, env=None):
    region = "us-east-1" if service in {"ce", "freetier"} else gate.REGION
    output = command(["aws", service, operation, "--region", region, "--no-cli-pager", "--no-cli-auto-prompt",
                      "--output", "json", "--cli-connect-timeout", "5", "--cli-read-timeout", "30", *args],
                     env={"AWS_MAX_ATTEMPTS": "1"} | (env or {}))
    try:
        return json.loads(output or "{}")
    except (ValueError, UnicodeError):
        raise gate.GateError("AWS returned an invalid response") from None


def read_json(path):
    gate.require(path.is_file() and not path.is_symlink() and path.stat().st_size <= MAX_METADATA,
                 "Missing or oversized workflow metadata")
    return json.loads(path.read_text())


def write_json(path, value):
    path.write_text(json.dumps(value, sort_keys=True, indent=2) + "\n")
    path.chmod(0o600)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()).hexdigest()


def identity(role, env=None):
    current = aws("sts", "get-caller-identity", env=env)
    gate.require(current.get("Account") == gate.ACCOUNT and gate.matches(
        current.get("Arn"), rf"arn:aws:sts::{gate.ACCOUNT}:assumed-role/examtopics-staging-{role}/[^/]+"),
        "Workflow identity does not match the approved staging role")


def s3_get(config, key, path):
    aws("s3api", "get-object", "--bucket", config["release_bucket"], "--key", key,
        "--expected-bucket-owner", gate.ACCOUNT, "--range", f"bytes=0-{MAX_METADATA}", str(path))
    return read_json(path)


def check_baseline(config, work):
    approved = s3_get(config, "baseline/config.json", work / "approved-config.json")
    gate.require(config == approved, "Workflow configuration differs from the human-approved baseline")
    return s3_get(config, "baseline/inventory.json", work / "inventory.json")


def check_tip(sha):
    gate.require(gate.matches(sha, gate.SHA_PATTERN), "Invalid candidate commit")
    tip = command(["gh", "api", f"repos/{gate.REPO}/git/ref/heads/staging", "--jq", ".object.sha"]).strip()
    gate.require(gate.matches(tip, gate.SHA_PATTERN), "Staging branch identity could not be verified")
    if tip == sha:
        return
    command(["git", "fetch", "--no-tags", "origin", tip])
    command(["git", "merge-base", "--is-ancestor", sha, tip])
    changed = command(["git", "diff", "--no-ext-diff", "--no-textconv", "--name-only", "-z", sha, tip]).split("\0")
    gate.require(not gate.deployment_paths_changed(changed), "A newer deployment-relevant merge superseded this release")


def cumulative_changes(previous, sha):
    gate.require(gate.matches(previous, gate.SHA_PATTERN) and gate.matches(sha, gate.SHA_PATTERN),
                 "Healthy release commit is invalid")
    command(["git", "merge-base", "--is-ancestor", previous, sha])
    return command(["git", "diff", "--no-ext-diff", "--no-textconv", "--name-only", "-z", previous, sha]).split("\0")


def monitor(config, path, now=None, env=None):
    identity("monitor", env)
    now = now or datetime.now(timezone.utc)
    plan = aws("freetier", "get-account-plan-state", env=env)
    start, end = gate.cost_window(now)
    costs = aws("ce", "get-cost-and-usage", "--time-period", f"Start={start},End={end}",
                "--granularity", "MONTHLY", "--metrics", "UnblendedCost", "--filter",
                json.dumps({"Not": {"Dimensions": {"Key": "RECORD_TYPE", "Values": ["Credit", "Refund"]}}}), env=env)
    credits, spend, projected = gate.check_budget(plan, costs, config["cost_model"], now)
    write_json(path, {"config_sha256": digest(config), "checked_at": now.isoformat(),
                      "plan_expires_at": plan["accountPlanExpirationDate"], "credits_usd": str(credits), "gross_spend_usd": str(spend), "projected_usd": str(projected)})


def fresh_receipt(config, path):
    receipt = read_json(path)
    checked = datetime.fromisoformat(receipt["checked_at"])
    age = (datetime.now(timezone.utc) - checked).total_seconds()
    gate.require(receipt.get("config_sha256") == digest(config) and 0 <= age <= 300,
                 "Monitoring receipt is missing, stale or belongs to another configuration")
    expiry = datetime.fromisoformat(receipt.get("plan_expires_at", "1970-01-01T00:00:00+00:00"))
    gate.require(expiry.tzinfo is not None and expiry > datetime.now(timezone.utc), "Monitored Free plan expired")


def monitor_credentials():
    """Use this trusted reusable job's OIDC identity without replacing publisher credentials."""
    url = os.environ.get("ACTIONS_ID_TOKEN_REQUEST_URL", "")
    parsed = urlsplit(url)
    token = os.environ.get("ACTIONS_ID_TOKEN_REQUEST_TOKEN", "")
    gate.require(parsed.scheme == "https" and parsed.hostname is not None
                 and parsed.hostname.endswith(".actions.githubusercontent.com")
                 and parsed.port in (None, 443) and parsed.username is None and token,
                 "Trusted GitHub OIDC context is unavailable")

    class NoRedirect(HTTPRedirectHandler):
        def redirect_request(self, *args):
            return None

    try:
        endpoint = url + ("&" if "?" in url else "?") + "audience=sts.amazonaws.com"
        request = Request(endpoint, headers={"Authorization": f"Bearer {token}"})
        with build_opener(ProxyHandler({}), NoRedirect()).open(request, timeout=10) as response:
            jwt = json.loads(response.read(16384))["value"]
        gate.require(gate.matches(jwt, r"[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+"), "Invalid GitHub OIDC response")
        with tempfile.TemporaryDirectory(prefix="examtopics-oidc-") as directory:
            private = Path(directory) / "token"
            private.write_text(jwt)
            private.chmod(0o600)
            assumed = aws("sts", "assume-role-with-web-identity", "--role-arn",
                          f"arn:aws:iam::{gate.ACCOUNT}:role/examtopics-staging-monitor",
                          "--role-session-name", "staging-phase-monitor", "--duration-seconds", "900",
                          "--web-identity-token", f"file://{private}")
        credentials = assumed["Credentials"]
        gate.require(all(isinstance(credentials.get(key), str) and credentials[key]
                         for key in ("AccessKeyId", "SecretAccessKey", "SessionToken")), "Invalid monitoring session")
        return {"AWS_ACCESS_KEY_ID": credentials["AccessKeyId"], "AWS_SECRET_ACCESS_KEY": credentials["SecretAccessKey"],
                "AWS_SESSION_TOKEN": credentials["SessionToken"], "AWS_PROFILE": None, "AWS_DEFAULT_PROFILE": None}
    except (OSError, ValueError, KeyError, TypeError):
        raise gate.GateError("Monitoring OIDC session could not be verified") from None


def mutation_guard(config, sha, work, phase):
    gate.require(phase in {"artifact", "backend", "frontend", "pointer", "rollback_backend", "rollback_frontend"},
                 "Unknown deployment mutation phase")
    identity("deploy")
    check_lease(config, sha, work)
    baseline = check_baseline(config, work)
    gate.require(read_json(work / "approval.json").get("baseline_sha256") == digest(baseline),
                 "The resource baseline changed during the release")
    monitor(config, work / "receipt.json", env=monitor_credentials())
    fresh_receipt(config, work / "receipt.json")


def assemble(sha, work):
    gate.require(gate.matches(sha, gate.SHA_PATTERN), "Invalid candidate commit")
    command(["git", "fetch", "--no-tags", "origin", sha])
    changes = command(["git", "diff", "--no-ext-diff", "--no-textconv", "--name-only", "-z", "HEAD", sha,
                       "--", "infra/terraform/staging"]).split("\0")
    gate.require(set(changes) <= {"", "infra/terraform/staging/frontend-route.js"},
                 "Terraform enforcement/root changes require a separately approved controller upgrade")
    tree = command(["git", "ls-tree", sha, "infra/terraform/staging/frontend-route.js"])
    gate.require(tree.startswith("100644 blob "), "Candidate function must be a regular tracked file")
    code = command(["git", "show", f"{sha}:infra/terraform/staging/frontend-route.js"])
    gate.require(0 < len(code.encode()) <= 10240, "Candidate CloudFront function exceeds the reviewed limit")
    target = work / "terraform-root"
    target.mkdir(mode=0o700, parents=True)
    for path in (*TF_ROOT.glob("*.tf"), TF_ROOT / ".terraform.lock.hcl"):
        gate.require(path.is_file() and not path.is_symlink(), "Trusted Terraform source is incomplete")
        shutil.copyfile(path, target / path.name)
    (target / "frontend-route.js").write_text(code)
    write_json(work / "source.json", {"release": sha})


def tf(config, *args, timeout=120, root=None):
    env = {f"TF_VAR_{key}": json.dumps(value) if not isinstance(value, str) else value
           for key, value in config["terraform_variables"].items()}
    # An inherited CLI argument or input variable must not override the reviewed config.
    env.update({key: "" for key in os.environ if key.startswith(("TF_CLI_ARGS", "TF_VAR_")) and key not in env})
    env["TF_DATA_DIR"] = str(Path(os.environ.get("RUNNER_TEMP", tempfile.gettempdir())) / "examtopics-staging-tf")
    return command(["terraform", f"-chdir={root or TF_ROOT}", *args], env=env, timeout=timeout)


def prepare(config, sha, work):
    identity("plan")
    check_tip(sha)
    baseline = check_baseline(config, work)
    leases = aws("s3api", "list-objects-v2", "--bucket", config["release_bucket"], "--prefix", LEASE,
                 "--expected-bucket-owner", gate.ACCOUNT)
    gate.require(not leases.get("Contents") and not leases.get("IsTruncated", False),
                 "A previous staging release is unresolved; operator reconciliation is required")
    previous = s3_get(config, POINTER, work / "previous-pointer.json")
    changed = cumulative_changes(previous.get("release"), sha)
    terraform_changed, _ = gate.classify_paths(changed)
    head = aws("s3api", "head-object", "--bucket", config["state_bucket"], "--key", config["state_key"],
               "--expected-bucket-owner", gate.ACCOUNT)
    gate.require(type(head.get("ContentLength")) is int and head["ContentLength"] > 0,
                 "Migrated staging state is missing")
    root = work / "terraform-root"
    gate.require(read_json(work / "source.json").get("release") == sha and root.is_dir(),
                 "Trusted Terraform assembly is missing")
    tf(config, "init", "-input=false", "-lockfile=readonly", f'-backend-config=bucket={config["state_bucket"]}',
       f'-backend-config=key={config["state_key"]}', f'-backend-config=region={gate.REGION}',
       "-backend-config=encrypt=true", "-backend-config=use_lockfile=true", timeout=300, root=root)
    state = json.loads(tf(config, "show", "-json", root=root))
    gate.require(gate.inventory_from_state(state) == baseline, "Remote state does not match the approved baseline")
    targets = gate.validated_targets(json.loads(tf(config, "output", "-json", root=root)), config)
    write_json(work / "targets.json", targets)
    try:
        from . import release
    except ImportError:
        import release
    release.validate_inputs(config, targets, sha, config["proxy_image"])
    with tempfile.TemporaryDirectory(prefix="examtopics-preview-") as directory:
        preview = Path(directory)
        current = release.build_artifact(config, targets, work.parent / "frontend", config["proxy_image"], sha, preview)
        prior_dir = preview / "previous"
        prior_dir.mkdir()
        _, _, previous_manifest = release.read_previous(release.Aws(), config, targets, prior_dir)
        current["api_image"] = previous_manifest["api_image"]  # New API is not published until preflight passes.
        release.verify_rollback_dependencies(release.Aws(), targets, current, previous_manifest)
    inspect_api_image(config, sha)  # Fail before lease/apply; publication rechecks this inventory.
    approval = {"config_sha256": digest(config), "baseline_sha256": digest(baseline), "release": sha, "apply": False}
    if terraform_changed:
        plan_path = work / "release.tfplan"
        tf(config, "plan", "-input=false", "-lock-timeout=60s", f"-out={plan_path}", timeout=600, root=root)
        plan = json.loads(tf(config, "show", "-json", str(plan_path), root=root))
        approval["apply"] = gate.review_plan(plan, baseline)
        approval["plan_sha256"] = hashlib.sha256(plan_path.read_bytes()).hexdigest()
    else:
        refresh = work / "refresh.tfplan"
        tf(config, "plan", "-refresh-only", "-input=false", "-lock-timeout=60s", f"-out={refresh}", timeout=600, root=root)
        observed = json.loads(tf(config, "show", "-json", str(refresh), root=root))
        gate.review_refresh(observed, baseline)
    write_json(work / "approval.json", approval)


def version_bytes(bucket, prefix=None):
    total, markers = 0, []
    for _ in range(10):
        args = ["--bucket", bucket, "--expected-bucket-owner", gate.ACCOUNT, "--max-keys", "1000", "--no-paginate", *markers]
        if prefix is not None:
            args.extend(["--prefix", prefix])
        response = aws("s3api", "list-object-versions", *args)
        gate.require(type(response.get("IsTruncated")) is bool, "S3 storage inventory is incomplete")
        versions = response.get("Versions", [])
        gate.require(isinstance(versions, list) and all(type(item.get("Size")) is int and item["Size"] >= 0
                                                       for item in versions), "S3 storage size is unknown")
        total += sum(item["Size"] for item in versions)
        if not response["IsTruncated"]:
            return total
        key, version = response.get("NextKeyMarker"), response.get("NextVersionIdMarker")
        gate.require(isinstance(key, str) and key and isinstance(version, str) and version,
                     "S3 storage pagination is incomplete")
        upcoming = ["--key-marker", key, "--version-id-marker", version]
        gate.require(upcoming != markers, "S3 storage pagination did not advance")
        markers = upcoming
    raise gate.GateError("S3 version inventory exceeds the reviewed scan limit; operator cleanup required")


def check_release_storage(config):
    # Include all current/noncurrent versions and reserve rollback writes as well as the new release.
    total = version_bytes(config["release_bucket"], "releases/") + version_bytes(config["frontend_bucket"])
    gate.require(total + 3 * config["max_release_bytes"] + MAX_METADATA
                 <= config["max_release_storage_bytes"], "S3 storage would exceed the reviewed model")


def acquire(config, sha, work):
    identity("deploy")
    check_tip(sha)
    baseline = check_baseline(config, work)
    approval = read_json(work / "approval.json")
    gate.require(approval.get("baseline_sha256") == digest(baseline), "The approved baseline changed during planning")
    check_release_storage(config)
    lease_path = work / "lease-body.json"
    write_json(lease_path, {"release": sha, "run_id": os.environ.get("GITHUB_RUN_ID"),
                            "created_at": datetime.now(timezone.utc).isoformat()})
    fresh_receipt(config, work / "receipt.json")
    response = aws("s3api", "put-object", "--bucket", config["release_bucket"], "--key", LEASE,
                   "--expected-bucket-owner", gate.ACCOUNT, "--body", str(lease_path),
                   "--content-type", "application/json", "--if-none-match", "*")
    gate.require(gate.matches(response.get("ETag"), r'"[a-f0-9]{32}(?:-[0-9]+)?"'), "Lease write outcome is unverified")
    write_json(work / "lease.json", {"release": sha, "etag": response["ETag"]})


def check_lease(config, sha, work):
    lease = read_json(work / "lease.json")
    actual = s3_get(config, LEASE, work / "observed-lease.json")
    gate.require(actual.get("release") == lease.get("release") == sha
                 and actual.get("run_id") == os.environ.get("GITHUB_RUN_ID"), "Release does not own the staging lease")
    return lease


def apply(config, sha, work, receipt):
    identity("apply")
    fresh_receipt(config, receipt)
    check_lease(config, sha, work)
    approval = read_json(work / "approval.json")
    baseline = check_baseline(config, work)
    gate.require(approval.get("baseline_sha256") == digest(baseline), "The approved baseline changed before apply")
    gate.require(approval.get("config_sha256") == digest(config) and approval.get("release") == sha,
                 "Plan approval does not match this release")
    if approval.get("apply") is True:
        plan_path = work / "release.tfplan"
        gate.require(hashlib.sha256(plan_path.read_bytes()).hexdigest() == approval.get("plan_sha256"),
                     "Saved Terraform plan changed after review")
        tf(config, "apply", "-input=false", "-lock-timeout=60s", str(plan_path), timeout=1200, root=work / "terraform-root")
    targets = gate.validated_targets(json.loads(tf(config, "output", "-json", root=work / "terraform-root")), config)
    write_json(work / "targets.json", targets)


def inspect_api_image(config, sha):
    repository = aws("ecr", "describe-repositories", "--registry-id", gate.ACCOUNT,
                     "--repository-names", "examtopics-staging")
    gate.require(len(repository.get("repositories", [])) == 1
                 and repository["repositories"][0].get("repositoryUri") == gate.ECR_REPO
                 and repository["repositories"][0].get("imageTagMutability") == "IMMUTABLE",
                 "Staging repository is missing or mutable")
    images = aws("ecr", "describe-images", "--registry-id", gate.ACCOUNT, "--repository-name", "examtopics-staging")
    gate.require(not images.get("nextToken") and isinstance(images.get("imageDetails"), list), "Incomplete ECR inventory")
    local = json.loads(command(["docker", "image", "inspect", f"examtopics-staging-api:{sha}"]))
    gate.require(len(local) == 1 and local[0].get("Os") == "linux" and local[0].get("Architecture") == "amd64"
                 and gate.matches(local[0].get("Id"), gate.DIGEST_PATTERN), "API image is not the reviewed AMD64 build")
    size = local[0].get("Size")
    gate.require(type(size) is int and 0 < size <= config["max_api_image_bytes"], "API image exceeds the storage model")
    by_digest = {}
    for image in images["imageDetails"]:
        value = image.get("imageSizeInBytes")
        gate.require(gate.matches(image.get("imageDigest"), gate.DIGEST_PATTERN) and type(value) is int and value >= 0,
                     "ECR storage size is unknown")
        by_digest[image["imageDigest"]] = value
    gate.require(sum(by_digest.values()) <= config["max_ecr_repository_bytes"],
                 "Existing ECR storage exceeds the approved model")
    tag = f"api-{sha}"
    existing = [item for item in images["imageDetails"] if tag in item.get("imageTags", [])]
    if existing:
        gate.require(len(existing) == 1, "Immutable release tag has ambiguous identity")
        result = aws("ecr", "batch-get-image", "--registry-id", gate.ACCOUNT,
                     "--repository-name", "examtopics-staging", "--image-ids", f"imageTag={tag}")
        entries = result.get("images", [])
        gate.require(not result.get("failures") and len(entries) == 1
                     and json.loads(entries[0]["imageManifest"]).get("config", {}).get("digest") == local[0]["Id"],
                     "Existing immutable release tag does not match the reviewed build")
        return f'{gate.ECR_REPO}@{existing[0]["imageDigest"]}'
    gate.require(sum(by_digest.values()) + size <= config["max_ecr_repository_bytes"],
                 "ECR storage would exceed the approved model")
    return None


def publish(config, sha):
    existing = inspect_api_image(config, sha)
    if existing:
        return existing
    tag = f"api-{sha}"
    with tempfile.TemporaryDirectory(prefix="examtopics-registry-") as directory:
        env = {"DOCKER_CONFIG": directory}
        password = command(["aws", "ecr", "get-login-password", "--region", gate.REGION], timeout=60)
        command(["docker", "login", "--username", "AWS", "--password-stdin", gate.REGISTRY], input=password, env=env)
        try:
            command(["docker", "tag", f"examtopics-staging-api:{sha}", f"{gate.ECR_REPO}:{tag}"])
            command(["docker", "push", f"{gate.ECR_REPO}:{tag}"], env=env, timeout=600)
        finally:
            command(["docker", "logout", gate.REGISTRY], env=env)
    result = aws("ecr", "describe-images", "--registry-id", gate.ACCOUNT,
                 "--repository-name", "examtopics-staging", "--image-ids", f"imageTag={tag}")
    details = result.get("imageDetails", [])
    gate.require(len(details) == 1 and gate.matches(details[0].get("imageDigest"), gate.DIGEST_PATTERN),
                 "Published image digest could not be verified")
    return f'{gate.ECR_REPO}@{details[0]["imageDigest"]}'


def finish(config, sha, work):
    identity("deploy")
    fresh_receipt(config, work / "receipt.json")
    lease = check_lease(config, sha, work)
    pointer = s3_get(config, POINTER, work / "healthy-pointer.json")
    gate.require(pointer.get("release") == sha, "Release is not recorded healthy; lease retained")
    aws("s3api", "delete-object", "--bucket", config["release_bucket"], "--key", LEASE,
        "--expected-bucket-owner", gate.ACCOUNT, "--if-match", lease["etag"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["event", "inventory", "monitor", "prepare", "acquire", "apply", "publish", "finish", "tip", "assemble", "guard"])
    for name in ("config", "work", "receipt", "event", "files", "github-output", "state-json", "output"):
        parser.add_argument(f"--{name}", type=Path)
    parser.add_argument("--sha")
    parser.add_argument("--phase")
    args = parser.parse_args()
    os.umask(0o077)
    try:
        if args.mode == "event":
            event = read_json(args.event)
            valid = os.environ.get("GITHUB_RUN_ATTEMPT", "1") == "1" and gate.eligible_merge(
                event, args.sha, os.environ.get("GITHUB_REF"))
            paths = read_json(args.files) if args.files else {"files": []}
            relevant = valid and gate.deployment_paths_changed(paths["files"])
            with args.github_output.open("a") as output:
                output.write(f"eligible={str(valid).lower()}\nrelevant={str(relevant).lower()}\nsha={args.sha if valid else ''}\n")
            return 0
        if args.mode == "inventory":
            write_json(args.output, gate.inventory_from_state(read_json(args.state_json)))
            return 0
        if args.mode == "tip":
            check_tip(args.sha)
            return 0
        if args.mode == "assemble":
            assemble(args.sha, args.work)
            return 0
        config = read_json(args.config)
        gate.validate_config(config)
        args.work.mkdir(mode=0o700, parents=True, exist_ok=True)
        if args.mode == "monitor":
            monitor(config, args.receipt)
        elif args.mode == "prepare":
            prepare(config, args.sha, args.work)
        elif args.mode == "acquire":
            fresh_receipt(config, args.receipt)
            acquire(config, args.sha, args.work)
        elif args.mode == "apply":
            apply(config, args.sha, args.work, args.receipt)
        elif args.mode == "publish":
            identity("deploy")
            fresh_receipt(config, args.receipt)
            check_lease(config, args.sha, args.work)
            args.output.write_text(publish(config, args.sha))
        elif args.mode == "guard":
            mutation_guard(config, args.sha, args.work, args.phase)
        else:
            finish(config, args.sha, args.work)
    except (gate.GateError, OSError, ValueError, KeyError, TypeError) as error:
        message = str(error) if isinstance(error, gate.GateError) else "Invalid workflow input or response"
        print(f"Staging pipeline: {message}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
