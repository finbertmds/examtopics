import copy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from infra.cicd import gate, pipeline, release


ACCOUNT = "450114866570"
REGION = "ap-southeast-2"
REPOSITORY = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com/examtopics-staging"
SHA = "a" * 40


def staging_config():
    return {
        "account_id": ACCOUNT,
        "region": REGION,
        "controller_sha": "f" * 40,
        "staging_domain": "staging.finbert.ngo",
        "api_instance_id": "i-0123456789abcdef0",
        "api_public_ipv4": "16.178.165.197",
        "frontend_bucket": f"examtopics-staging-web-{ACCOUNT}",
        "frontend_distribution_id": "E123AB456C",
        "frontend_distribution_domain": "d012345abcdef.cloudfront.net",
        "api_environment_secret_arn": (
            f"arn:aws:secretsmanager:{REGION}:{ACCOUNT}:secret:/examtopics/staging/api-environment-abcD12"
        ),
        "release_repository_url": REPOSITORY,
        "frontend_url": "https://app.staging.finbert.ngo",
        "api_url": "https://api.staging.finbert.ngo",
        "state_bucket": f"examtopics-staging-tfstate-{ACCOUNT}",
        "state_key": "staging/terraform.tfstate",
        "release_bucket": f"examtopics-staging-releases-{ACCOUNT}",
        "ssm_document": "ExamTopicsStagingDeploy",
        "ssm_document_version": "1",
        "secret_version_id": "01234567-89ab-cdef-0123-456789abcdef",
        "proxy_image": f"{REPOSITORY}@sha256:" + "c" * 64,
        "max_release_bytes": 500000000,
        "max_api_image_bytes": 200000000,
        "max_ecr_repository_bytes": 1000000000,
        "max_release_storage_bytes": 2000000000,
        "cost_model": {"monthly_usd": "18", "metering_lag_reserve_usd": "1", "deployment_reserve_usd": "0.50"},
        "terraform_variables": {
            "api_ami_id": "ami-0123456789abcdef0",
            "staging_account_id": ACCOUNT,
            "staging_domain": "staging.finbert.ngo",
            "runtime_permissions_boundary_arn": f"arn:aws:iam::{ACCOUNT}:policy/examtopics-staging-runtime-boundary",
            "frontend_certificate_arn": (
                f"arn:aws:acm:us-east-1:{ACCOUNT}:certificate/01234567-89ab-cdef-0123-456789abcdef"
            ),
        },
    }


class ConfigTests(unittest.TestCase):
    def test_gate_and_release_use_the_same_bootstrap_contract(self):
        config = staging_config()
        config["api_public_ipv4"] = "16.178.165.197"
        gate.validate_config(config)
        targets = {key: config[key] for key in gate.TARGET_FIELDS}
        release.validate_inputs(config, targets, SHA, config["proxy_image"])

    def test_config_and_outputs_cannot_retarget_staging_operations(self):
        config = staging_config()
        gate.validate_config(config)
        for key, value in (
            ("account_id", "000000000000"), ("region", "us-east-1"),
            ("api_url", "https://example.com"),
            ("state_key", "another/terraform.tfstate"),
            ("frontend_bucket", config["release_bucket"]),
            ("proxy_image", config["release_repository_url"] + ":proxy-latest"),
            ("max_api_image_bytes", True), ("max_ecr_repository_bytes", 2),
        ):
            with self.subTest(key=key):
                with self.assertRaises(gate.GateError):
                    gate.validate_config({**config, key: value})

        outputs = {
            key: {"value": config[key], "sensitive": False, "type": "string"}
            for key in (
                "api_instance_id", "api_public_ipv4", "frontend_bucket",
                "frontend_distribution_id", "frontend_distribution_domain",
                "api_environment_secret_arn", "release_repository_url", "frontend_url", "api_url",
            )
        }
        self.assertEqual(gate.validated_targets(outputs, config)["region"], REGION)
        for key, value in (
            ("api_instance_id", {"value": "i-other", "sensitive": False, "type": "string"}),
            ("api_url", {"value": config["api_url"], "sensitive": True, "type": "string"}),
        ):
            with self.subTest(key=key):
                other = copy.deepcopy(outputs)
                other[key] = value
                with self.assertRaises(gate.GateError):
                    gate.validated_targets(other, config)


class PublishTests(unittest.TestCase):
    def test_blocks_storage_growth_before_registry_login_and_push(self):
        config = staging_config()
        config["max_ecr_repository_bytes"] = 200000000
        details = {"imageDetails": [{
            "imageSizeInBytes": 199999990, "imageDigest": "sha256:" + "b" * 64, "imageTags": ["proxy-first"]
        }]}
        repo = {"repositories": [{"repositoryUri": REPOSITORY, "imageTagMutability": "IMMUTABLE"}]}
        local = [{"Id": "sha256:" + "c" * 64, "Size": 11, "Os": "linux", "Architecture": "amd64"}]
        with patch.object(pipeline, "aws", side_effect=[repo, details]), \
                patch.object(pipeline, "command", return_value=pipeline.json.dumps(local)) as command:
            with self.assertRaises(gate.GateError):
                pipeline.publish(config, SHA)
        self.assertEqual([call.args[0][:3] for call in command.call_args_list], [["docker", "image", "inspect"]])


class SequencingTests(unittest.TestCase):
    def test_image_preflight_blocks_before_any_registry_write(self):
        config = staging_config()
        with patch.object(pipeline, "aws", side_effect=[{"repositories": []}]), patch.object(pipeline, "command") as command:
            with self.assertRaises(gate.GateError):
                pipeline.inspect_api_image(config, SHA)
            command.assert_not_called()

    def test_fresh_receipt_also_requires_an_unexpired_plan(self):
        from datetime import datetime, timezone
        config = staging_config()
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "receipt.json"
            pipeline.write_json(path, {"config_sha256": pipeline.digest(config),
                                      "checked_at": datetime.now(timezone.utc).isoformat(),
                                      "plan_expires_at": "2000-01-01T00:00:00+00:00"})
            with self.assertRaises(gate.GateError):
                pipeline.fresh_receipt(config, path)

    def test_release_storage_gate_accounts_for_the_incoming_archive_before_a_write(self):
        config = staging_config()
        config["max_release_storage_bytes"] = 500000000
        with patch.object(pipeline, "aws", side_effect=[{"IsTruncated": False, "Versions": [{"Size": 1}]}, {"IsTruncated": False, "Versions": []}]):
            with self.assertRaises(gate.GateError):
                pipeline.check_release_storage(config)

    def test_cumulative_delta_keeps_undeployed_infrastructure_from_an_older_merge(self):
        previous = "b" * 40
        with patch.object(pipeline, "command", side_effect=["", "infra/terraform/staging/frontend-route.js\0examtopics-practice/src/App.tsx\0"]):
            paths = pipeline.cumulative_changes(previous, SHA)
        self.assertEqual(gate.classify_paths(paths), (True, True))

    def test_newer_docs_do_not_supersede_pending_app_but_newer_app_does(self):
        tip = "b" * 40
        for paths, blocked in (("docs/guide.md\0", False), ("examtopics-backend/index.js\0", True)):
            with self.subTest(paths=paths), patch.object(pipeline, "command", side_effect=[tip, "", "", paths]):
                if blocked:
                    with self.assertRaises(gate.GateError):
                        pipeline.check_tip(SHA)
                else:
                    pipeline.check_tip(SHA)

    def test_apply_requires_fresh_receipt_and_unchanged_saved_plan(self):
        config = staging_config()
        with tempfile.TemporaryDirectory() as directory:
            work = Path(directory)
            pipeline.write_json(work / "receipt.json", {"config_sha256": pipeline.digest(config),
                                                        "checked_at": "2020-01-01T00:00:00+00:00"})
            with patch.object(pipeline, "identity"), patch.object(pipeline, "tf") as tf:
                with self.assertRaises(gate.GateError):
                    pipeline.apply(config, SHA, work, work / "receipt.json")
                tf.assert_not_called()

    def test_lease_release_requires_recorded_healthy_commit(self):
        config = staging_config()
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(pipeline, "identity"), patch.object(pipeline, "fresh_receipt"), patch.object(pipeline, "check_lease", return_value={"etag": '"etag"'}), \
                    patch.object(pipeline, "s3_get", return_value={"release": "b" * 40}), \
                    patch.object(pipeline, "aws") as aws:
                with self.assertRaises(gate.GateError):
                    pipeline.finish(config, SHA, Path(directory))
                aws.assert_not_called()

    def test_baseline_change_blocks_saved_plan_before_apply(self):
        config = staging_config()
        with tempfile.TemporaryDirectory() as directory:
            work = Path(directory)
            pipeline.write_json(work / "approval.json", {"config_sha256": pipeline.digest(config), "release": SHA,
                                                         "baseline_sha256": pipeline.digest({"old": True}), "apply": True})
            with patch.object(pipeline, "identity"), patch.object(pipeline, "fresh_receipt"), \
                    patch.object(pipeline, "check_lease"), patch.object(pipeline, "check_baseline", return_value={"new": True}), \
                    patch.object(pipeline, "tf") as tf:
                with self.assertRaisesRegex(gate.GateError, "baseline changed"):
                    pipeline.apply(config, SHA, work, work / "receipt.json")
                tf.assert_not_called()

    def test_candidate_provider_or_hcl_changes_stop_before_initialization(self):
        for path in ("infra/terraform/staging/providers.tf", "infra/terraform/staging/.terraform.lock.hcl"):
            with self.subTest(path=path), tempfile.TemporaryDirectory() as directory:
                with patch.object(pipeline, "command", side_effect=["", path + "\0"]):
                    with self.assertRaisesRegex(gate.GateError, "controller upgrade"):
                        pipeline.assemble(SHA, Path(directory))
                self.assertFalse((Path(directory) / "terraform-root").exists())

    def test_oidc_monitor_never_sends_token_to_arbitrary_host_or_redirect(self):
        for url in ("http://run.actions.githubusercontent.com/token", "https://attacker.example/token"):
            with self.subTest(url=url), patch.dict(pipeline.os.environ, {
                    "ACTIONS_ID_TOKEN_REQUEST_URL": url, "ACTIONS_ID_TOKEN_REQUEST_TOKEN": "private"}), \
                    patch.object(pipeline, "build_opener") as opener:
                with self.assertRaises(gate.GateError):
                    pipeline.monitor_credentials()
                opener.assert_not_called()

    def test_each_mutation_phase_requires_fresh_monitoring_without_replacing_publisher_credentials(self):
        config = staging_config()
        baseline = {"protected": True}
        with tempfile.TemporaryDirectory() as directory:
            work = Path(directory)
            pipeline.write_json(work / "approval.json", {"baseline_sha256": pipeline.digest(baseline)})
            with patch.object(pipeline, "identity"), patch.object(pipeline, "check_lease"), \
                    patch.object(pipeline, "check_baseline", return_value=baseline), \
                    patch.object(pipeline, "monitor_credentials", return_value={"AWS_ACCESS_KEY_ID": "temporary"}), \
                    patch.object(pipeline, "monitor", side_effect=gate.GateError("Free plan expired")) as monitor:
                with self.assertRaisesRegex(gate.GateError, "expired"):
                    pipeline.mutation_guard(config, SHA, work, "backend")
                self.assertEqual(monitor.call_args.kwargs["env"], {"AWS_ACCESS_KEY_ID": "temporary"})

    def test_storage_pagination_cannot_hide_noncurrent_versions(self):
        responses = [
            {"IsTruncated": True, "Versions": [{"Size": 20}], "NextKeyMarker": "key", "NextVersionIdMarker": "version"},
            {"IsTruncated": False, "Versions": [{"Size": 30}]},
        ]
        with patch.object(pipeline, "aws", side_effect=responses) as aws:
            self.assertEqual(pipeline.version_bytes("bucket"), 50)
            self.assertIn("--version-id-marker", aws.call_args.args)
    def test_existing_immutable_release_tag_must_match_local_content(self):
        config = staging_config()
        remote_digest = "sha256:" + "b" * 64
        local_id = "sha256:" + "c" * 64
        tag = f"api-{SHA}"
        repo = {"repositories": [{"repositoryUri": REPOSITORY, "imageTagMutability": "IMMUTABLE"}]}
        details = {"imageDetails": [{"imageSizeInBytes": 1, "imageDigest": remote_digest, "imageTags": [tag]}]}
        local = [{"Id": local_id, "Size": 11, "Os": "linux", "Architecture": "amd64"}]
        image = {"images": [{
            "imageId": {"imageDigest": remote_digest, "imageTag": tag},
            "imageManifest": pipeline.json.dumps({"config": {"digest": local_id}}),
        }], "failures": []}
        with patch.object(pipeline, "aws", side_effect=[repo, details, image]), \
                patch.object(pipeline, "command", return_value=pipeline.json.dumps(local)):
            self.assertEqual(pipeline.publish(config, SHA), f"{REPOSITORY}@{remote_digest}")
        image["images"][0]["imageManifest"] = pipeline.json.dumps({"config": {"digest": remote_digest}})
        with patch.object(pipeline, "aws", side_effect=[repo, details, image]), \
                patch.object(pipeline, "command", return_value=pipeline.json.dumps(local)):
            with self.assertRaises(gate.GateError):
                pipeline.publish(config, SHA)
