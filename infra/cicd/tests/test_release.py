from email.message import EmailMessage
import io
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import subprocess
import sys
import tempfile
from threading import Event
import unittest
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import release


ACCOUNT = "450114866570"
REGION = "ap-southeast-2"
REPO = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com/examtopics-staging"
OLD_SHA, NEW_SHA = "a" * 40, "b" * 40
OLD_IMAGE, NEW_IMAGE, PROXY = [f"{REPO}@sha256:{letter * 64}" for letter in "abc"]
VERSION = "25c4a386-464e-4587-824d-98baa6f0da50"
API_NOT_FOUND = b'{"success":false,"error":"Endpoint not found"}'
TARGETS = {
    "account_id": ACCOUNT,
    "region": REGION,
    "api_instance_id": "i-1234567890abcdef0",
    "api_public_ipv4": "1.2.3.4",
    "frontend_bucket": f"examtopics-staging-web-{ACCOUNT}",
    "frontend_distribution_id": "E063VS097D6UIU",
    "frontend_distribution_domain": "d1example.cloudfront.net",
    "api_environment_secret_arn": (
        f"arn:aws:secretsmanager:{REGION}:{ACCOUNT}:secret:/examtopics/staging/api-environment-a1b2c3"
    ),
    "release_repository_url": REPO,
    "frontend_url": "https://app.staging.finbert.ngo",
    "api_url": "https://api.staging.finbert.ngo",
}
CONFIG = {
    "account_id": ACCOUNT,
    "region": REGION,
    "staging_domain": "staging.finbert.ngo",
    "state_bucket": f"examtopics-staging-tfstate-{ACCOUNT}",
    "state_key": "staging/terraform.tfstate",
    "release_bucket": f"examtopics-staging-releases-{ACCOUNT}",
    "ssm_document": "ExamTopicsStagingDeploy",
    "ssm_document_version": "1",
    "secret_version_id": VERSION,
    "proxy_image": PROXY,
    "max_release_bytes": 10_000,
    "cost_model": {},
}


class MemoryAWS:
    def __init__(self):
        self.objects = {}
        self.writes = []
        self.events = []
        self.statuses = []
        self.pending_send_error = False
        self.send_error_code = None

    def get(self, bucket, key, path, limit):
        if (bucket, key) not in self.objects:
            raise release.AwsError("NoSuchKey")
        data, metadata = self.objects[bucket, key]
        path.write_bytes(data[:limit + 1])
        if len(data) > limit:
            raise release.ReleaseError("test fixture exceeds limit")
        return metadata

    def put(self, bucket, key, path, *, content_type, cache_control=None, condition=None):
        data = path.read_bytes()
        previous = self.objects.get((bucket, key))
        if condition == ("--if-none-match", "*") and previous:
            raise release.AwsError("PreconditionFailed")
        if condition and condition[0] == "--if-match":
            if previous[1]["ETag"] != condition[1]:
                raise release.AwsError("PreconditionFailed")
        self.events.append(("put", bucket, key))
        self.writes.append((bucket, key, data, cache_control))
        metadata = {"ETag": '"' + "a" * 32 + '"', "VersionId": "version-id", "ContentType": content_type}
        self.objects[bucket, key] = (data, metadata)
        return metadata

    def call(self, service, operation, *args, **kwargs):
        if operation == "describe-images":
            return {"imageDetails": [{"imageDigest": item.removeprefix(REPO + "@"), "imageTags": ["kept"]}
                                     for item in (OLD_IMAGE, NEW_IMAGE, PROXY)]}
        if operation == "describe-secret":
            return {"VersionIdsToStages": {VERSION: ["AWSCURRENT"]}}
        if operation == "send-command":
            release_id = json.loads(args[args.index("--parameters") + 1])["ReleaseId"][0]
            self.events.append(("ssm", release_id))
            if self.pending_send_error:
                raise release.AwsError("Uncertain")
            if self.send_error_code:
                raise release.AwsError(self.send_error_code)
            return {"Command": {"CommandId": VERSION}}
        if operation == "get-command-invocation":
            if self.statuses:
                status = self.statuses.pop(0)
                if status == "InvocationDoesNotExist":
                    raise release.AwsError(status)
            else:
                status = "Success"
            if isinstance(status, dict):
                return status
            return {"Status": status, "ResponseCode": 0 if status == "Success" else 1}
        if operation == "cancel-command":
            self.events.append(("cancel",))
            return {}
        raise AssertionError((service, operation, args))


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.tmp = Path(temp.name)
        self.old = self.build("old", "deadbeef")
        self.new = self.build("new", "beefdead")
        self.aws = MemoryAWS()

    def build(self, text, asset_hash):
        folder = self.tmp / text
        (folder / "assets").mkdir(parents=True)
        (folder / "index.html").write_text(
            f'<html><script type="module" src="/assets/app-{asset_hash}.js"></script>{text}</html>'
        )
        (folder / "assets" / f"app-{asset_hash}.js").write_text(
            f'const api="{TARGETS["api_url"]}", app="{TARGETS["frontend_url"]}"; /* {text} */'
        )
        (folder / "robots.txt").write_text(text)
        return folder

    def seed(self):
        seeded = self.tmp / "seed"
        release.prepare_baseline(CONFIG, TARGETS, self.old, OLD_IMAGE, OLD_SHA, "seed-index-version", seeded)
        for filename in ("manifest.json", "frontend.tar.gz", "last-known-healthy.json"):
            key = f"releases/{filename}" if filename.startswith("last-") else f"releases/{OLD_SHA}/{filename}"
            self.aws.put(CONFIG["release_bucket"], key, seeded / filename, content_type="application/json")
        self.aws.events.clear()
        self.aws.writes.clear()

    def run_deploy(self, **overrides):
        args = dict(config=CONFIG, targets=TARGETS, build_dir=self.new, api_image=NEW_IMAGE,
                    release_id=NEW_SHA, aws=self.aws)
        return release.deploy(**(args | overrides))

    def test_requires_previous_and_archive_before_any_writes(self):
        for remove_archive in (False, True):
            if remove_archive:
                self.seed()
                del self.aws.objects[CONFIG["release_bucket"], f"releases/{OLD_SHA}/frontend.tar.gz"]
            with self.assertRaises(release.ReleaseError):
                self.run_deploy()
            self.assertEqual(self.aws.writes, [])
            self.assertEqual(self.aws.events, [])

    def test_validates_cross_environment_and_untagged_rollback_images(self):
        self.seed()
        for targets, api_image in ((TARGETS | {"api_url": "https://api.example.com"}, NEW_IMAGE),
                                   (TARGETS, NEW_IMAGE.replace(ACCOUNT, "123456789012")),
                                   (TARGETS | {"frontend_bucket": CONFIG["release_bucket"]}, NEW_IMAGE)):
            with self.subTest(targets=targets, image=api_image):
                with self.assertRaises(release.ReleaseError):
                    self.run_deploy(targets=targets, api_image=api_image)
        with mock.patch.object(self.aws, "call", return_value={"imageDetails": []}):
            with self.assertRaises(release.ReleaseError):
                self.run_deploy()
        self.assertEqual(self.aws.events, [])

    def test_index_is_last_public_write_and_healthy_pointer_follows_http(self):
        self.seed()
        with mock.patch.object(release, "verify_public", side_effect=lambda *args: self.aws.events.append(("http",))):
            self.run_deploy()
        web_keys = [key for bucket, key, _, _ in self.aws.writes if bucket == TARGETS["frontend_bucket"]]
        self.assertEqual(web_keys[-1], "index.html")
        self.assertIn("assets/app-beefdead.js", web_keys[:-1])
        self.assertLess(self.aws.events.index(("ssm", NEW_SHA)),
                        self.aws.events.index(("put", TARGETS["frontend_bucket"], "index.html")))
        self.assertEqual(self.aws.events[-2], ("http",))
        self.assertEqual(self.aws.events[-1], ("put", CONFIG["release_bucket"], "releases/last-known-healthy.json"))
        pointer = json.loads(self.aws.writes[-1][2])
        self.assertEqual(pointer["release"], NEW_SHA)
        self.assertEqual(pointer["previous_release"], OLD_SHA)

    def test_each_release_phase_checks_guard_before_mutation(self):
        self.seed()
        guard = lambda phase: self.aws.events.append(("guard", phase))
        with mock.patch.object(release, "verify_public", side_effect=lambda *args: self.aws.events.append(("http",))):
            self.run_deploy(before_mutation=guard)
        events = self.aws.events
        evidence = {
            "artifact": ("put", CONFIG["release_bucket"], f"releases/{NEW_SHA}/frontend.tar.gz"),
            "backend": ("ssm", NEW_SHA),
            "frontend": ("put", TARGETS["frontend_bucket"], "index.html"),
            "pointer": ("put", CONFIG["release_bucket"], "releases/last-known-healthy.json"),
        }
        self.assertEqual([event[1] for event in events if event[0] == "guard"], list(evidence))
        for phase, mutation in evidence.items():
            self.assertLess(events.index(("guard", phase)), events.index(mutation))
        self.assertLess(events.index(("http",)), events.index(("guard", "pointer")))

    def test_failed_artifact_guard_allows_no_writes(self):
        self.seed()
        guard = mock.Mock(side_effect=release.ReleaseError("private guard diagnostic"))
        with self.assertRaisesRegex(release.UncertainDeployment, "guard failed before artifact") as failure:
            self.run_deploy(before_mutation=guard)
        self.assertNotIn("private guard diagnostic", str(failure.exception))
        guard.assert_called_once_with("artifact")
        self.assertEqual(self.aws.events, [])

    def test_failed_rollback_guards_stop_remaining_writes(self):
        self.seed()
        for blocked_phase in ("rollback_backend", "rollback_frontend"):
            with self.subTest(phase=blocked_phase):
                self.aws.events.clear()
                self.aws.writes.clear()

                def guard(phase):
                    self.aws.events.append(("guard", phase))
                    if phase == blocked_phase:
                        raise OSError("private diagnostic")

                with mock.patch.object(release, "verify_public", side_effect=release.ReleaseError("mismatch")):
                    with self.assertRaisesRegex(release.UncertainDeployment, f"guard failed before {blocked_phase}"):
                        self.run_deploy(before_mutation=guard)
                self.assertEqual(self.aws.events[-1], ("guard", blocked_phase))
                host_commands = [event for event in self.aws.events if event[0] == "ssm"]
                expected = [("ssm", NEW_SHA), ("ssm", OLD_SHA)] if blocked_phase == "rollback_frontend" else [("ssm", NEW_SHA)]
                self.assertEqual(host_commands, expected)
                self.assertEqual(self.aws.objects[TARGETS["frontend_bucket"], "index.html"][0],
                                 (self.new / "index.html").read_bytes())

    def test_cli_guard_uses_exact_phase_and_sanitizes_child_failure(self):
        config = self.tmp / "config.json"
        with mock.patch.object(release.subprocess, "run",
                               side_effect=subprocess.CalledProcessError(1, "guard", stderr=b"private diagnostic")) as call:
            with self.assertRaisesRegex(release.UncertainDeployment, "guard failed before backend") as failure:
                release.run_mutation_guard(config, self.tmp, NEW_SHA, "backend")
        self.assertNotIn("private diagnostic", str(failure.exception))
        self.assertEqual(call.call_args.args[0],
                         [sys.executable, str(Path(release.__file__).with_name("pipeline.py")), "guard",
                          "--config", str(config), "--work", str(self.tmp), "--sha", NEW_SHA, "--phase", "backend"])
        self.assertTrue(call.call_args.kwargs["capture_output"])

    def test_readiness_failure_restores_only_backend_and_preserves_pointer(self):
        self.seed()
        self.aws.statuses.extend(["Failed", "Success"])
        with mock.patch.object(release, "verify_public") as public:
            with self.assertRaisesRegex(release.ReleaseError, "previous application restored"):
                self.run_deploy()
        self.assertEqual(public.call_count, 1)
        commands = [event for event in self.aws.events if event[0] == "ssm"]
        self.assertEqual(commands, [("ssm", NEW_SHA), ("ssm", OLD_SHA)])
        self.assertFalse(any(key == "index.html" for _, key, _, _ in self.aws.writes))
        self.assertFalse(any(key == "releases/last-known-healthy.json" for _, key, _, _ in self.aws.writes))

    def test_public_mismatch_restores_old_files_then_index(self):
        self.seed()
        with mock.patch.object(release, "verify_public", side_effect=[release.ReleaseError("mismatch"), None]):
            with self.assertRaisesRegex(release.ReleaseError, "previous application restored"):
                self.run_deploy()
        frontend = [(key, data) for bucket, key, data, _ in self.aws.writes if bucket == TARGETS["frontend_bucket"]]
        self.assertEqual(frontend[-1], ("index.html", (self.old / "index.html").read_bytes()))
        self.assertIn(("robots.txt", b"old"), frontend)
        self.assertFalse(any(key == "releases/last-known-healthy.json" for _, key, _, _ in self.aws.writes))

    def test_uncertain_backend_rollback_stops_further_frontend_writes(self):
        self.seed()
        self.aws.statuses.extend(["Success", "TimedOut"])
        with mock.patch.object(release, "verify_public", side_effect=release.ReleaseError("mismatch")):
            with self.assertRaises(release.UncertainDeployment):
                self.run_deploy()
        published = self.aws.objects[TARGETS["frontend_bucket"], "index.html"][0]
        self.assertEqual(published, (self.new / "index.html").read_bytes())
        self.assertFalse(any(key == "releases/last-known-healthy.json" for _, key, _, _ in self.aws.writes))

    def test_uncertain_frontend_put_stops_without_restoration_or_pointer_update(self):
        self.seed()
        put = self.aws.put
        for key_to_fail, code in [
            ("robots.txt", "Uncertain"),
            ("robots.txt", "InternalError"),
            ("index.html", "ServiceUnavailable"),
            ("index.html", "RequestTimeout"),
        ]:
            with self.subTest(key=key_to_fail, error_code=code):
                self.aws.events.clear()
                self.aws.writes.clear()

                def fail_put(bucket, key, path, **kwargs):
                    if bucket == TARGETS["frontend_bucket"] and key == key_to_fail:
                        self.aws.events.append(("put-unconfirmed", key))
                        raise release.AwsError(code)
                    return put(bucket, key, path, **kwargs)

                with mock.patch.object(release, "verify_public"), mock.patch.object(self.aws, "put", side_effect=fail_put):
                    with self.assertRaisesRegex(release.UncertainDeployment, "frontend write is unconfirmed"):
                        self.run_deploy()
                self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])
                self.assertFalse(any(key in {"index.html", release.POINTER} for _, key, _, _ in self.aws.writes))

    def test_uncertain_parallel_upload_takes_precedence_over_definite_rejection(self):
        self.seed()
        put = self.aws.put
        mutable_in_flight = Event()

        def fail_put(bucket, key, path, **kwargs):
            if bucket == TARGETS["frontend_bucket"]:
                if key == "assets/app-beefdead.js":
                    self.assertTrue(mutable_in_flight.wait(2))
                    raise release.AwsError("AccessDenied")
                if key == "robots.txt":
                    mutable_in_flight.set()
                    raise release.AwsError("Uncertain")
            return put(bucket, key, path, **kwargs)

        with mock.patch.object(release, "verify_public"), mock.patch.object(self.aws, "put", side_effect=fail_put):
            with self.assertRaises(release.UncertainDeployment):
                self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])
        self.assertFalse(any(key == "index.html" for _, key, _, _ in self.aws.writes))

    def test_queued_frontend_upload_never_starts_after_uncertain_put(self):
        self.seed()
        put = self.aws.put

        def fail_first_frontend_put(bucket, key, path, **kwargs):
            if bucket == TARGETS["frontend_bucket"]:
                self.aws.events.append(("frontend-put", key))
                raise release.AwsError("Uncertain")
            return put(bucket, key, path, **kwargs)

        with mock.patch.object(release, "ThreadPoolExecutor", side_effect=lambda **kwargs: ThreadPoolExecutor(max_workers=1)), \
                mock.patch.object(self.aws, "put", side_effect=fail_first_frontend_put):
            with self.assertRaises(release.UncertainDeployment):
                self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "frontend-put"],
                         [("frontend-put", "assets/app-beefdead.js")])

    def test_missing_frontend_upload_acknowledgment_prevents_rollback(self):
        self.seed()
        put = self.aws.put

        def lose_frontend_acknowledgment(bucket, key, path, **kwargs):
            result = put(bucket, key, path, **kwargs)
            if bucket == TARGETS["frontend_bucket"] and key == "assets/app-beefdead.js":
                return {}
            return result

        with mock.patch.object(release, "verify_public"), mock.patch.object(
            self.aws, "put", side_effect=lose_frontend_acknowledgment
        ):
            with self.assertRaisesRegex(release.UncertainDeployment, "frontend write is unconfirmed"):
                self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])
        self.assertFalse(any(key == "index.html" for _, key, _, _ in self.aws.writes))

    def test_confirmed_frontend_put_rejection_still_restores_previous_release(self):
        self.seed()
        put = self.aws.put
        index = (self.new / "index.html").read_bytes()

        def reject_candidate_index(bucket, key, path, **kwargs):
            if bucket == TARGETS["frontend_bucket"] and key == "index.html" and path.read_bytes() == index:
                raise release.AwsError("AccessDenied")
            return put(bucket, key, path, **kwargs)

        with mock.patch.object(release, "verify_public"), mock.patch.object(self.aws, "put", side_effect=reject_candidate_index):
            with self.assertRaisesRegex(release.ReleaseError, "previous application restored"):
                self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA), ("ssm", OLD_SHA)])
        self.assertEqual(self.aws.objects[TARGETS["frontend_bucket"], "index.html"][0],
                         (self.old / "index.html").read_bytes())

    def test_immutable_asset_collision_fails_before_index(self):
        self.seed()
        data = self.tmp / "collision"
        data.write_bytes(b"unrelated")
        self.aws.put(TARGETS["frontend_bucket"], "assets/app-beefdead.js", data, content_type="text/javascript")
        with mock.patch.object(release, "verify_public"):
            with self.assertRaisesRegex(release.ReleaseError, "previous application restored"):
                self.run_deploy()
        self.assertEqual(self.aws.objects[TARGETS["frontend_bucket"], "assets/app-beefdead.js"][0], b"unrelated")
        self.assertNotIn((TARGETS["frontend_bucket"], "index.html", (self.new / "index.html").read_bytes(), "no-cache"),
                         self.aws.writes)

    def test_uncertain_ssm_send_never_races_rollback(self):
        self.seed()
        self.aws.pending_send_error = True
        with self.assertRaisesRegex(release.ReleaseError, "investigate"):
            self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])

    def test_ssm_poll_deadline_preserves_uncertain_host_without_cancel_or_rollback(self):
        self.seed()
        with mock.patch.object(release, "poll_command", side_effect=["unknown", "unknown"]):
            with self.assertRaisesRegex(release.ReleaseError, "no confirmed terminal"):
                self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] in {"ssm", "cancel"}],
                         [("ssm", NEW_SHA)])

    def test_ssm_timeout_cancel_and_unconfirmed_failed_status_skip_rollback(self):
        self.seed()
        for invocation in (
            "TimedOut",
            "Cancelled",
            {"Status": "Failed", "ResponseCode": -1},
            {"Status": "Failed", "ResponseCode": 137},
        ):
            with self.subTest(invocation=invocation):
                self.aws.events.clear()
                self.aws.statuses[:] = [invocation]
                with mock.patch.object(release, "verify_public"), self.assertRaises(release.UncertainDeployment):
                    self.run_deploy()
                self.assertEqual([event for event in self.aws.events if event[0] in {"ssm", "cancel"}],
                                 [("ssm", NEW_SHA)])

    def test_rejected_ssm_command_does_not_attempt_host_rollback(self):
        self.seed()
        self.aws.send_error_code = "AccessDeniedException"
        with mock.patch.object(release, "verify_public"), self.assertRaisesRegex(release.ReleaseError, "SSM rejected"):
            self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])

    def test_uncertain_pointer_write_cannot_rollback_without_verifiable_outcome(self):
        self.seed()
        put = self.aws.put

        def reject_pointer(bucket, key, path, **kwargs):
            if key == "releases/last-known-healthy.json":
                raise release.AwsError("Uncertain")
            return put(bucket, key, path, **kwargs)

        with mock.patch.object(release, "verify_public"), mock.patch.object(self.aws, "put", side_effect=reject_pointer):
            with self.assertRaisesRegex(release.ReleaseError, "pointer write is unconfirmed"):
                self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])

    def test_definite_pointer_write_failure_rolls_back_application(self):
        self.seed()
        put = self.aws.put

        def deny_pointer(bucket, key, path, **kwargs):
            if key == "releases/last-known-healthy.json":
                raise release.AwsError("AccessDenied")
            return put(bucket, key, path, **kwargs)

        with mock.patch.object(release, "verify_public"), mock.patch.object(self.aws, "put", side_effect=deny_pointer):
            with self.assertRaisesRegex(release.ReleaseError, "previous application restored"):
                self.run_deploy()
        self.assertIn(("ssm", OLD_SHA), self.aws.events)

    def test_confirmed_pointer_write_after_response_failure_keeps_application(self):
        self.seed()
        put = self.aws.put

        def lose_pointer_response(bucket, key, path, **kwargs):
            result = put(bucket, key, path, **kwargs)
            if key == "releases/last-known-healthy.json":
                raise release.AwsError("Uncertain")
            return result

        with mock.patch.object(release, "verify_public"), mock.patch.object(
            self.aws, "put", side_effect=lose_pointer_response
        ):
            self.run_deploy()
        self.assertEqual([event for event in self.aws.events if event[0] == "ssm"], [("ssm", NEW_SHA)])

    def test_bad_build_rejects_symlinks_and_unknown_origins(self):
        self.seed()
        js = self.new / "assets/app-beefdead.js"
        js.write_text('const api = "https://examtopics.onrender.com";')
        with self.assertRaises(release.ReleaseError):
            self.run_deploy()
        js.unlink()
        js.symlink_to(self.old / "assets/app-deadbeef.js")
        with self.assertRaises(release.ReleaseError):
            self.run_deploy()
        self.assertEqual(self.aws.events, [])

    def test_public_probe_verifies_served_index_bytes(self):
        with self.assertRaisesRegex(release.ReleaseError, "Public staging checks failed"):
            self.check_public_fixture(index=b"stale-index")

    def test_public_proxy_health_can_mask_unreachable_or_unexpected_api(self):
        for status, body, request_id in (
            (502, b"Bad Gateway", None),
            (404, API_NOT_FOUND, None),
            (404, API_NOT_FOUND, "not-a-uuid"),
            (404, b'{"success":false,"error":"other"}', VERSION),
        ):
            with self.subTest(status=status, body=body, request_id=request_id):
                with self.assertRaisesRegex(release.ReleaseError, "Public staging checks failed"):
                    self.check_public_fixture(api_status=status, api_body=body, api_request_id=request_id)

    def test_public_probe_accepts_read_only_express_route_response(self):
        self.check_public_fixture()

    def check_public_fixture(self, *, index=None, api_status=404, api_body=API_NOT_FOUND, api_request_id=VERSION):
        seeded = self.tmp / "seed/manifest.json"
        if not seeded.exists():
            self.seed()
        manifest = json.loads(seeded.read_bytes())

        def open_response(request, timeout):
            url = request.full_url
            if url == TARGETS["api_url"] + "/health":
                body, status, mime = b"", 404, "text/plain"
            elif url == TARGETS["api_url"] + "/":
                body, status, mime = api_body, api_status, "application/json"
            elif url == TARGETS["frontend_url"] + "/":
                body, status, mime = index if index is not None else (self.old / "index.html").read_bytes(), 200, "text/html"
            else:
                asset_path = url.removeprefix(TARGETS["frontend_url"] + "/")
                body, status, mime = (self.old / asset_path).read_bytes(), 200, "text/javascript"
            stream = io.BytesIO(body)
            stream.status = status
            stream.headers = EmailMessage()
            stream.headers["Content-Type"] = mime
            if url == TARGETS["api_url"] + "/" and api_request_id:
                stream.headers["X-Request-Id"] = api_request_id
            return stream

        with mock.patch.object(release, "build_opener") as opener, mock.patch.object(release.time, "sleep"):
            opener.return_value.open.side_effect = open_response
            release.verify_public(TARGETS, manifest)

    def test_public_probe_never_follows_redirects(self):
        redirect = release.NoRedirect()
        self.assertIsNone(redirect.redirect_request(None, None, 302, "", {}, "https://example.com"))


if __name__ == "__main__":
    unittest.main()
