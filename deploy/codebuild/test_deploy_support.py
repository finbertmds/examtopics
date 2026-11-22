import copy
import importlib.util
from pathlib import Path
import unittest
import subprocess
import tempfile
from datetime import datetime, timezone
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('deploy_support', Path(__file__).with_name('deploy_support.py'))
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)


class DeploymentTests(unittest.TestCase):
    def test_host_pulls_before_replacement_and_readiness_controls_success(self):
        source = Path(__file__).with_name('replace-api.sh').read_text()
        for fail_pull, ready, expected in [('1', '1', 1), ('0', '1', 0), ('0', '0', 1)]:
            with self.subTest(fail_pull=fail_pull, ready=ready), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                (root / 'config').mkdir()
                (root / 'config/api.env').write_text('TEST_FIXTURE=true\n')
                binary = root / 'bin'
                binary.mkdir()
                mocks = {
                    'docker': '''#!/bin/bash
echo "$*" >> "$MOCK_LOG"
case "$1" in
  login) cat >/dev/null ;;
  inspect)
    if [[ "$3" == *State.Running* ]]; then echo true; else echo previous-digest; fi ;;
  pull) [[ "$FAIL_PULL" == 0 ]] ;;
  exec) [[ "$READY" == 1 ]] ;;
esac
''',
                    'aws': '#!/bin/bash\necho mock-login-password\n',
                    'flock': '#!/bin/bash\nexit 0\n',
                    'sleep': '#!/bin/bash\nexit 0\n',
                }
                for name, content in mocks.items():
                    script = binary / name
                    script.write_text(content)
                    script.chmod(0o700)
                host_script = source.replace('/etc/examtopics', str(root / 'config')).replace(
                    '/var/lock/examtopics-deploy.lock', str(root / 'lock'))
                env = dict(deploy.os.environ, PATH=str(binary) + ':' + deploy.os.environ['PATH'],
                           MOCK_LOG=str(root / 'calls'), FAIL_PULL=fail_pull, READY=ready,
                           AWS_REGION='ap-southeast-1', API_IMAGE='registry/repo@sha256:fixture')
                result = subprocess.run(['bash', '-c', host_script], env=env, capture_output=True)
                self.assertEqual(result.returncode, expected, result.stderr.decode())
                calls = (root / 'calls').read_text()
                if fail_pull == '1':
                    self.assertNotIn('stop examtopics-api', calls)
                else:
                    self.assertLess(calls.index('pull '), calls.index('stop examtopics-api'))
                    self.assertIn('--cap-drop ALL --security-opt no-new-privileges:true', calls)
                    self.assertIn('--network examtopics-staging', calls)
                    self.assertNotIn('-p 3001', calls)

    def test_reverted_backend_after_partial_deploy_is_still_selected(self):
        # A successful -> B API published/frontend failed -> C restores API to A.
        touched = b'examtopics-backend/index.js\0examtopics-practice/src/App.tsx\0examtopics-backend/index.js\0'
        with patch.object(deploy.subprocess, 'check_output', return_value=touched) as git:
            self.assertEqual(deploy.changed_components('A', 'C'), {'frontend': True, 'backend': True})
            command = git.call_args.args[0]
            self.assertEqual(command[1], 'log')
            self.assertIn('A..C', command)
            self.assertIn('--diff-merges=first-parent', command)

    def test_current_head_rejects_old_workflow_reruns(self):
        env = {'CODEBUILD_RESOLVED_SOURCE_VERSION': 'new'}
        with patch.dict(deploy.os.environ, env):
            with patch.object(deploy.subprocess, 'check_output', return_value='old\trefs/heads/develop\n'):
                with self.assertRaisesRegex(RuntimeError, 'Stale develop'):
                    deploy.require_current_head()
            with patch.object(deploy.subprocess, 'check_output', return_value='new\trefs/heads/develop\n'):
                deploy.require_current_head()

    def test_path_selection(self):
        for paths, expected in [
            (['examtopics-practice/public/exams/a.json'], (True, False)),
            (['examtopics-backend/package-lock.json'], (False, True)),
            (['examtopics-backend/index.js', 'examtopics-practice/src/App.tsx'], (True, True)),
            (['.nvmrc'], (True, True)),
            (['deploy/codebuild/replace-api.sh'], (True, True)),
            (['deploy/codebuild/buildspec.yml'], (True, True)),
            (['docs/x.md', 'infra/terraform/staging/api.tf', 'batch/exam.json'], (False, False)),
        ]:
            with self.subTest(paths=paths):
                self.assertEqual(tuple(deploy.components(paths).values()), expected)

    def test_plan_blocks_unsafe_accounts(self):
        now = datetime(2026, 11, 22, tzinfo=timezone.utc)
        plan = dict(accountId='123456789012', accountPlanType='FREE',
                    accountPlanStatus='ACTIVE', accountPlanExpirationDate='2026-12-01T00:00:00Z',
                    accountPlanRemainingCredits={'amount': 20, 'unit': 'USD'})
        self.assertTrue(deploy.valid_plan(plan, '123456789012', now))
        for key, value in [('accountId', '000000000000'), ('accountPlanType', 'PAID'),
                           ('accountPlanStatus', 'EXPIRED'),
                           ('accountPlanExpirationDate', '2026-11-01T00:00:00Z'),
                           ('accountPlanRemainingCredits', {'amount': 19.99, 'unit': 'USD'}),
                           ('accountPlanRemainingCredits', {'amount': 200, 'unit': 'JPY'})]:
            bad = copy.deepcopy(plan)
            bad[key] = value
            with self.subTest(key=key, value=value):
                self.assertFalse(deploy.valid_plan(bad, '123456789012', now))

    def test_reject_remote_shell_injection_before_aws(self):
        env = dict(AWS_ACCOUNT_ID='123456789012', AWS_REGION='ap-southeast-1',
                   ECR_REPOSITORY_URL='123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/examtopics-staging',
                   API_IMAGE="bad'; touch /tmp/injected", API_INSTANCE_ID='i-0123456789abcdef0')
        with patch.dict(deploy.os.environ, env), patch.object(deploy, 'aws') as aws:
            with self.assertRaises(AssertionError):
                deploy.deploy_backend()
            aws.assert_not_called()

    def test_guard_rejects_paid_plan_before_cost_query(self):
        with patch.dict(deploy.os.environ, {'AWS_ACCOUNT_ID': '123456789012'}), \
                patch.object(deploy, 'aws', side_effect=[{'Account': '123456789012'}, {
                    'accountId': '123456789012', 'accountPlanType': 'PAID',
                    'accountPlanStatus': 'ACTIVE', 'accountPlanExpirationDate': '2099-01-01T00:00:00Z',
                    'accountPlanRemainingCredits': {'amount': 200, 'unit': 'USD'}}]) as aws:
            with self.assertRaises(AssertionError):
                deploy.guard()
            self.assertEqual(aws.call_count, 2)

    def test_ssm_waits_for_readiness_and_fails_terminal_status(self):
        repo = '123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/examtopics-staging'
        env = dict(AWS_ACCOUNT_ID='123456789012', AWS_REGION='ap-southeast-1',
                   ECR_REPOSITORY_URL=repo, API_IMAGE=repo + '@sha256:' + 'a' * 64,
                   API_INSTANCE_ID='i-0123456789abcdef0')
        for terminal in ['Success', 'Failed', 'TimedOut', 'Cancelled']:
            results = [subprocess.CompletedProcess([], 1, '', 'InvocationDoesNotExist'),
                       subprocess.CompletedProcess([], 0, 'InProgress\n', ''),
                       subprocess.CompletedProcess([], 0, terminal + '\n', 'sensitive output')]
            with self.subTest(terminal=terminal), patch.dict(deploy.os.environ, env), \
                    patch.object(deploy, 'aws', return_value={'Command': {'CommandId': 'test-id'}}), \
                    patch.object(deploy.time, 'sleep'), \
                    patch.object(deploy.subprocess, 'run', side_effect=results), \
                    patch('builtins.print') as output:
                if terminal == 'Success':
                    deploy.deploy_backend()
                else:
                    with self.assertRaisesRegex(RuntimeError, terminal):
                        deploy.deploy_backend()
                self.assertNotIn('sensitive output', str(output.call_args_list))


if __name__ == '__main__':
    unittest.main()
