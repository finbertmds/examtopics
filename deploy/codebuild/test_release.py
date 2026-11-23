import json
import os
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent))
import release


class ReleaseTests(unittest.TestCase):
    def test_only_develop_push_and_matching_checkout_are_accepted(self):
        sha = 'a' * 40
        env = dict(CODEBUILD_WEBHOOK_EVENT='PUSH', CODEBUILD_WEBHOOK_HEAD_REF='refs/heads/develop',
                   CODEBUILD_WEBHOOK_TRIGGER='branch/develop', CODEBUILD_RESOLVED_SOURCE_VERSION=sha,
                   GITHUB_REPOSITORY_URL='https://github.com/owner/repo')
        with patch.dict(os.environ, env, clear=True), \
                patch.object(release.subprocess, 'check_output', side_effect=[sha, env['GITHUB_REPOSITORY_URL']]):
            self.assertEqual(release.validate_event(), sha)
        for key, value in [('CODEBUILD_WEBHOOK_EVENT', 'PULL_REQUEST_CREATED'),
                           ('CODEBUILD_WEBHOOK_HEAD_REF', 'refs/heads/master'),
                           ('CODEBUILD_WEBHOOK_TRIGGER', ''),
                           ('CODEBUILD_RESOLVED_SOURCE_VERSION', 'develop')]:
            with self.subTest(key=key), patch.dict(os.environ, dict(env, **{key: value}), clear=True):
                with self.assertRaises(ValueError):
                    release.validate_event()

    def test_missing_or_diverged_baseline_rebuilds_both(self):
        self.assertEqual(release.select_components({}, 'head'), {'frontend': True, 'backend': True})
        with patch.object(release.subprocess, 'run', return_value=subprocess.CompletedProcess([], 1)):
            self.assertTrue(all(release.select_components({'commit': 'old'}, 'head').values()))

    def test_manual_build_requires_develop_and_matching_checkout(self):
        sha = 'a' * 40
        for source in ['develop', 'refs/heads/develop']:
            env = dict(CODEBUILD_SOURCE_VERSION=source, CODEBUILD_RESOLVED_SOURCE_VERSION=sha,
                       GITHUB_REPOSITORY_URL='https://github.com/owner/repo')
            with self.subTest(source=source), patch.dict(os.environ, env, clear=True), \
                    patch.object(release.subprocess, 'check_output', side_effect=[sha, env['GITHUB_REPOSITORY_URL']]):
                self.assertTrue(release.is_manual_build())
                self.assertEqual(release.validate_event(), sha)
        for source in ['', 'master', 'refs/tags/develop', sha, 'pr/123']:
            with self.subTest(source=source), patch.dict(os.environ, {'CODEBUILD_SOURCE_VERSION': source}, clear=True):
                with self.assertRaisesRegex(ValueError, 'source version develop'):
                    release.validate_event()
        with patch.dict(os.environ, env, clear=True), \
                patch.object(release.subprocess, 'check_output', return_value='b' * 40):
            with self.assertRaisesRegex(ValueError, 'Checkout does not match'):
                release.validate_event()

    def test_partial_webhook_metadata_cannot_be_treated_as_manual(self):
        for key in ['CODEBUILD_WEBHOOK_EVENT', 'CODEBUILD_WEBHOOK_HEAD_REF', 'CODEBUILD_WEBHOOK_TRIGGER']:
            env = {key: 'unexpected', 'CODEBUILD_SOURCE_VERSION': 'develop'}
            with self.subTest(key=key), patch.dict(os.environ, env, clear=True):
                self.assertFalse(release.is_manual_build())
                with self.assertRaisesRegex(ValueError, 'Only PUSH webhooks'):
                    release.validate_event()

    def test_stale_manual_build_fails_before_build_or_aws_access(self):
        with patch.object(release, 'validate_event', return_value='a' * 40), \
                patch.object(release, 'is_manual_build', return_value=True), \
                patch.object(release, 'require_current_head', side_effect=RuntimeError('Stale develop commit')), \
                patch.object(release, 'read_record') as read, patch.object(release, 'build') as build:
            with self.assertRaisesRegex(RuntimeError, 'Stale develop'):
                release.main()
            read.assert_not_called()
            build.assert_not_called()

    def test_manual_build_redeploys_same_commit_using_current_build_environment(self):
        sha = 'a' * 40
        env = dict(RELEASE_BUCKET='private-release-bucket', FRONTEND_BUCKET='frontend-bucket',
                   CODEBUILD_BUILD_ID='project:12345678-1234-1234-1234-123456789abc',
                   AWS_ACCOUNT_ID='123456789012', REACT_APP_BACKEND_URL='https://new-api.example.invalid')
        seen_origins = []
        with patch.dict(os.environ, env), patch.object(release, 'validate_event', return_value=sha), \
                patch.object(release, 'is_manual_build', return_value=True), \
                patch.object(release, 'require_current_head'), \
                patch.object(release, 'read_record', return_value={'commit': sha}), \
                patch.object(release, 'select_components') as select, \
                patch.object(release, 'build', side_effect=lambda selected: seen_origins.append(os.environ['REACT_APP_BACKEND_URL'])) as build, \
                patch.object(release, 'guard'), patch.object(release, 'assume_role', return_value={}), \
                patch.object(release, 'put_record', return_value={'ETag': 'etag'}) as put, \
                patch.object(release, 'publish_backend', return_value='new-image') as backend, \
                patch.object(release, 'publish_frontend', return_value='new-index') as frontend, \
                patch.object(release, 'aws'):
            release.main()
            select.assert_not_called()
            build.assert_called_once_with({'frontend': True, 'backend': True})
            backend.assert_called_once()
            frontend.assert_called_once()
            self.assertEqual(put.call_args.args[1], 'state.json')
            self.assertEqual(put.call_args.args[2]['trigger'], 'manual')
            self.assertEqual(seen_origins, [env['REACT_APP_BACKEND_URL']])

    def test_webhook_same_commit_still_skips_unchanged_applications(self):
        sha = 'a' * 40
        env = dict(RELEASE_BUCKET='private-release-bucket', FRONTEND_BUCKET='frontend-bucket')
        with patch.dict(os.environ, env), patch.object(release, 'validate_event', return_value=sha), \
                patch.object(release, 'is_manual_build', return_value=False), \
                patch.object(release, 'require_current_head'), \
                patch.object(release, 'read_record', return_value={'commit': sha}), \
                patch.object(release, 'select_components', return_value={'frontend': False, 'backend': False}) as select, \
                patch.object(release, 'build') as build, patch.object(release, 'assume_role') as assume:
            release.main()
            select.assert_called_once_with({'commit': sha}, sha)
            build.assert_not_called()
            assume.assert_not_called()

    def test_build_failure_prevents_any_publication_or_role_assumption(self):
        env = dict(RELEASE_BUCKET='private-release-bucket', FRONTEND_BUCKET='frontend-bucket')
        with patch.dict(os.environ, env), patch.object(release, 'validate_event', return_value='a' * 40), \
                patch.object(release, 'require_current_head'), patch.object(release, 'read_record', return_value={}), \
                patch.object(release, 'build', side_effect=RuntimeError('tests failed')), \
                patch.object(release, 'assume_role') as assume:
            with self.assertRaisesRegex(RuntimeError, 'tests failed'):
                release.main()
            assume.assert_not_called()

    def test_backend_failure_blocks_frontend_and_state_commit(self):
        env = dict(RELEASE_BUCKET='private-release-bucket', FRONTEND_BUCKET='frontend-bucket',
                   CODEBUILD_BUILD_ID='project:12345678-1234-1234-1234-123456789abc', AWS_ACCOUNT_ID='123456789012')
        with patch.dict(os.environ, env), patch.object(release, 'validate_event', return_value='a' * 40), \
                patch.object(release, 'require_current_head'), patch.object(release, 'read_record', return_value={}), \
                patch.object(release, 'build'), patch.object(release, 'guard'), \
                patch.object(release, 'assume_role', return_value={}), \
                patch.object(release, 'put_record', return_value={'ETag': 'etag'}) as put, \
                patch.object(release, 'publish_backend', side_effect=RuntimeError('readiness failed')), \
                patch.object(release, 'publish_frontend') as frontend, patch.object(release, 'aws') as aws:
            with self.assertRaisesRegex(RuntimeError, 'readiness failed'):
                release.main()
            frontend.assert_not_called()
            self.assertEqual([call.args[1] for call in put.call_args_list], ['lock.json'])
            aws.assert_not_called()  # No lock deletion after an uncertain/failed publication.

    def test_success_archives_release_then_commits_state_then_releases_lock(self):
        env = dict(RELEASE_BUCKET='private-release-bucket', FRONTEND_BUCKET='frontend-bucket',
                   CODEBUILD_BUILD_ID='project:12345678-1234-1234-1234-123456789abc', AWS_ACCOUNT_ID='123456789012')
        events = []

        def put(bucket, key, record, environment, *conditions):
            events.append(key)
            return {'ETag': 'etag'}

        with patch.dict(os.environ, env), patch.object(release, 'validate_event', return_value='a' * 40), \
                patch.object(release, 'require_current_head'), patch.object(release, 'read_record', return_value={}), \
                patch.object(release, 'build'), patch.object(release, 'guard'), \
                patch.object(release, 'assume_role', return_value={}), \
                patch.object(release, 'put_record', side_effect=put), \
                patch.object(release, 'publish_backend', side_effect=lambda *args: events.append('api') or 'image'), \
                patch.object(release, 'publish_frontend', side_effect=lambda *args: events.append('frontend') or 'version'), \
                patch.object(release, 'aws', side_effect=lambda *args, **kwargs: events.append('unlock')):
            release.main()
        self.assertEqual(events[:3], ['lock.json', 'api', 'frontend'])
        self.assertTrue(events[3].endswith('/release.json'))
        self.assertEqual(events[4:], ['state.json', 'unlock'])

    def test_publication_finishes_pinned_release_when_remote_head_advances(self):
        # The controller checks freshness immediately before publication. Once
        # locked/publication has started, a new push must not strand that lock.
        env = dict(AWS_ACCOUNT_ID='123456789012', AWS_REGION='ap-southeast-2',
                   ECR_REPOSITORY_URL='123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/staging',
                   FRONTEND_BUCKET='frontend-bucket', RELEASE_BUCKET='release-bucket')
        with patch.dict(os.environ, env), \
                patch.object(release, 'require_current_head', side_effect=RuntimeError('new head')) as current, \
                patch.object(release, 'run'), patch.object(release, 'deploy_backend') as backend, \
                patch.object(release, 'aws', return_value={'imageDetails': [{'imageDigest': 'sha256:' + 'a' * 64}]}), \
                patch.object(release.subprocess, 'check_output', return_value=b'mock-password'), \
                patch.object(release.subprocess, 'run'):
            release.publish_backend('api-fixture', {})
            backend.assert_called_once()
            current.assert_not_called()
        with patch.dict(os.environ, env), \
                patch.object(release, 'require_current_head', side_effect=RuntimeError('new head')) as current, \
                patch.object(release, 'run'), patch.object(release, 'put_record'), \
                patch.object(release, 'aws', side_effect=[{'Status': 'Enabled'}, {'Versions': []}, {'VersionId': 'new-index'}]):
            self.assertEqual(release.publish_frontend('releases/test', {}), 'new-index')
            current.assert_not_called()

    def test_lock_is_conditional_and_waits_without_stealing(self):
        busy = subprocess.CalledProcessError(1, ['aws'], stderr='PreconditionFailed')
        with patch.object(release, 'require_current_head'), patch.object(release.time, 'sleep'), \
                patch.object(release, 'put_record', side_effect=[busy, {'ETag': 'owner-etag'}]) as put, \
                patch.object(release, 'aws') as aws, patch.dict(os.environ, {'AWS_ACCOUNT_ID': '123456789012'}):
            with release.ReleaseLock('bucket', {'build': 'test'}, {}) as lock:
                self.assertEqual(lock.etag, 'owner-etag')
            self.assertIn('--if-none-match', put.call_args.args)
            self.assertIn('--if-match', aws.call_args.args)
            self.assertIn('owner-etag', aws.call_args.args)

    def test_failed_publication_retains_lock_but_preflight_failure_releases_it(self):
        for publishing in [False, True]:
            with self.subTest(publishing=publishing), patch.object(release, 'require_current_head'), \
                    patch.object(release, 'put_record', return_value={'ETag': 'etag'}), \
                    patch.object(release, 'aws') as aws, patch.dict(os.environ, {'AWS_ACCOUNT_ID': '123456789012'}):
                with self.assertRaises(RuntimeError):
                    with release.ReleaseLock('bucket', {}, {}) as lock:
                        lock.publishing = publishing
                        raise RuntimeError('failed')
                self.assertEqual(aws.call_count, 0 if publishing else 1)

    def test_monitor_credentials_do_not_replace_source_credentials(self):
        from deploy_support import assume_role
        base = dict(AWS_ACCOUNT_ID='123456789012', MONITOR_ROLE_ARN='arn:aws:iam::123456789012:role/monitor',
                    AWS_CONTAINER_CREDENTIALS_RELATIVE_URI='/codebuild/credentials')
        with patch.dict(os.environ, base, clear=True), patch('deploy_support.aws', return_value={
                'Credentials': {'AccessKeyId': 'temporary', 'SecretAccessKey': 'fixture', 'SessionToken': 'fixture'}}):
            monitor = assume_role('MONITOR_ROLE_ARN')
            self.assertEqual(monitor['AWS_ACCESS_KEY_ID'], 'temporary')
            self.assertNotIn('AWS_ACCESS_KEY_ID', os.environ)
            self.assertEqual(os.environ['AWS_CONTAINER_CREDENTIALS_RELATIVE_URI'], '/codebuild/credentials')


if __name__ == '__main__':
    unittest.main()
