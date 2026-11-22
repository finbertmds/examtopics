import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).parents[1].resolve() / "host-deploy.sh"
ACCOUNT = "450114866570"
REGION = "ap-southeast-2"
REPO = f"{ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com/examtopics-staging"
API, PROXY = [f"{REPO}@sha256:{letter * 64}" for letter in "ab"]
SHA = "c" * 40
VERSION = "25c4a386-464e-4587-824d-98baa6f0da50"


class HostDeployTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.bin = self.root / "bin"
        self.bin.mkdir()
        for executable in ("aws", "docker", "flock"):
            script = self.bin / executable
            script.write_text(Path(__file__).with_name("host-deploy-double.sh").read_text())
            script.chmod(0o700)
        self.config = self.root / "etc"
        self.config.mkdir(mode=0o700)
        (self.config / "Caddyfile").write_text("fixture")
        (self.config / "deploy-config.json").write_text(json.dumps({
            "account_id": ACCOUNT,
            "region": REGION,
            "repository_url": REPO,
            "secret_arn": f"arn:aws:secretsmanager:{REGION}:{ACCOUNT}:secret:/examtopics/staging/api-environment-a1b2c3",
            "api_host": "api.staging.finbert.ngo",
        }))
        (self.config / "api.env").write_text("fixture-existing-private-file")
        for path in self.config.iterdir():
            path.chmod(0o600)
        self.env = {
            "PATH": f"{self.bin}:{os.environ['PATH']}",
            "FIXTURE_ROOT": str(self.root),
            "FIXTURE_VERSION": VERSION,
            "FIXTURE_PROXY": PROXY,
        }

    def run_host(self, **values):
        command = [
            shutil.which("bash"), "-c",
            'source "$1"; shift; deploy "$@"',
            "fixture", str(SCRIPT), str(self.config), "--release", SHA, "--api-image", API,
            "--proxy-image", PROXY, "--secret-version", VERSION,
        ]
        return subprocess.run(command, env=self.env | values, capture_output=True, text=True, timeout=15)

    def commands(self):
        return (self.root / "commands").read_text() if (self.root / "commands").exists() else ""

    def test_failed_pull_leaves_current_containers_and_env_file(self):
        result = self.run_host(FIXTURE_FAIL="pull")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("image pull failed", result.stderr)
        self.assertNotIn("docker rm", self.commands())
        self.assertEqual((self.config / "api.env").read_text(), "fixture-existing-private-file")
        self.assertNotIn("fixture-sensitive-value", result.stderr + result.stdout)

    def test_wrong_named_version_preserves_current_env(self):
        result = self.run_host(FIXTURE_FAIL="version")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("secret validation failed", result.stderr)
        self.assertNotIn("docker rm", self.commands())
        self.assertEqual((self.config / "api.env").read_text(), "fixture-existing-private-file")
        self.assertNotIn("fixture-sensitive-value", result.stderr + result.stdout)

    def test_untrusted_origin_is_rejected_before_reads_or_replacement(self):
        result = self.run_host(FIXTURE_FAIL="origin")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("secret validation failed", result.stderr)
        self.assertNotIn("docker rm", self.commands())

    def test_verified_api_replacement_keeps_running_proxy_at_same_digest(self):
        result = self.run_host()
        self.assertEqual(result.returncode, 0, result.stderr)
        commands = self.commands()
        self.assertLess(commands.index("docker pull "), commands.index("docker rm -f examtopics-api"))
        self.assertNotIn("docker rm -f examtopics-proxy", commands)
        self.assertIn("--env-file", commands)
        self.assertNotIn("3001:3001", commands)
        self.assertFalse((self.config / "api.env").stat().st_mode & 0o077)
        metadata = json.loads((self.config / "current-release.json").read_text())
        self.assertEqual(metadata, {"release": SHA, "api_image": API, "proxy_image": PROXY, "secret_version_id": VERSION})
        self.assertNotIn("fixture-sensitive-value", result.stderr + result.stdout + commands)

    def test_proxy_replacement_reuses_tls_volumes_after_api_readiness(self):
        result = self.run_host(FIXTURE_PROXY=API)
        self.assertEqual(result.returncode, 0, result.stderr)
        commands = self.commands()
        self.assertLess(commands.index("docker exec examtopics-api"), commands.index("docker rm -f examtopics-proxy"))
        self.assertIn("examtopics-caddy-data:/data", commands)
        self.assertIn("examtopics-caddy-config:/config", commands)
        self.assertNotIn("docker volume rm", commands)

    def test_readiness_failure_leaves_metadata_uncommitted(self):
        result = self.run_host(FIXTURE_FAIL="readiness")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("readiness failed", result.stderr)
        self.assertIn("docker rm -f examtopics-api", self.commands())
        self.assertFalse((self.config / "current-release.json").exists())


if __name__ == "__main__":
    unittest.main()
