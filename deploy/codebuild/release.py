"""CodeBuild PUSH/develop controller. No AWS calls when imported by offline tests."""
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time

from deploy_support import (assume_role, aws, changed_components, deploy_backend,
                            guard, put_record, read_record, require_current_head)


def run(*command, **kwargs):
    subprocess.run(command, check=True, **kwargs)


def validate_event():
    if (os.environ.get('CODEBUILD_WEBHOOK_EVENT') != 'PUSH'
            or os.environ.get('CODEBUILD_WEBHOOK_HEAD_REF') != 'refs/heads/develop'
            or os.environ.get('CODEBUILD_WEBHOOK_TRIGGER') != 'branch/develop'):
        raise ValueError('Only PUSH webhooks for develop can publish; manual builds are rejected')
    head = os.environ['CODEBUILD_RESOLVED_SOURCE_VERSION']
    if not re.fullmatch(r'[0-9a-f]{40}', head):
        raise ValueError('Expected an immutable source commit')
    actual = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
    if actual != head:
        raise ValueError('Checkout does not match webhook commit')
    expected = os.environ['GITHUB_REPOSITORY_URL'].removesuffix('.git')
    origin = subprocess.check_output(['git', 'remote', 'get-url', 'origin'], text=True).strip()
    if (not re.fullmatch(r'https://github.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', expected)
            or origin.removesuffix('.git') != expected):
        raise ValueError('Wrong source repository')
    return head


def select_components(record, head):
    baseline = record.get('commit')
    if not baseline or subprocess.run(['git', 'merge-base', '--is-ancestor', baseline, head],
                                      stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode:
        return {'frontend': True, 'backend': True}
    return changed_components(baseline, head)


class ReleaseLock:
    """Never steal locks: a failed/unknown publication needs operator recovery."""
    def __init__(self, bucket, record, env):
        self.bucket, self.record, self.env = bucket, record, env
        self.etag = None
        self.publishing = False

    def __enter__(self):
        for _ in range(60):
            require_current_head()
            try:
                self.etag = put_record(self.bucket, 'lock.json', self.record, self.env,
                                       '--if-none-match', '*')['ETag']
                return self
            except subprocess.CalledProcessError as error:
                if not any(code in (error.stderr or '') for code in
                           ['PreconditionFailed', 'ConditionalRequestConflict']):
                    raise
                time.sleep(10)
        raise RuntimeError('Release lock busy; inspect CodeBuild/SSM before retrying')

    def __exit__(self, error_type, error, traceback):
        if error_type and self.publishing:
            print('Publication failed: retaining lock.json for approved operator recovery', flush=True)
            return False
        aws('s3api', 'delete-object', '--bucket', self.bucket, '--key', 'lock.json',
            '--if-match', self.etag, '--expected-bucket-owner', os.environ['AWS_ACCOUNT_ID'], env=self.env)


def build(selected):
    version = subprocess.check_output(['node', '--version'], text=True).strip().removeprefix('v')
    if version != Path('.nvmrc').read_text().strip().removeprefix('v'):
        raise ValueError('Node version must match .nvmrc; update buildspec runtime when changing it')
    for part, folder in [('backend', 'examtopics-backend'), ('frontend', 'examtopics-practice')]:
        if selected[part]:
            run('npm', 'ci', cwd=folder)
            run('npm', 'test', cwd=folder)
    if selected['frontend']:
        from urllib.parse import urlsplit
        for key in ['REACT_APP_BACKEND_URL', 'REACT_APP_FRONTEND_URL']:
            url = urlsplit(os.environ[key])
            if url.scheme != 'https' or not url.hostname or url.path or url.query or url.fragment or url.username:
                raise ValueError('Require explicit HTTPS staging origins')
        run('npm', 'run', 'build', cwd='examtopics-practice')
    if selected['backend']:
        run('docker', 'build', '--platform', 'linux/amd64', '-t', 'examtopics-api:release',
            'examtopics-backend')


def publish_backend(tag, env):
    repository = os.environ['ECR_REPOSITORY_URL']
    account, region = os.environ['AWS_ACCOUNT_ID'], os.environ['AWS_REGION']
    if not re.fullmatch(re.escape(f'{account}.dkr.ecr.{region}.amazonaws.com/')
                        + r'[a-z0-9][a-z0-9/_-]*', repository):
        raise ValueError('Wrong ECR target')
    registry = repository.split('/')[0]
    # Keep the password in a pipe/input buffer only; never print command output containing it.
    password = subprocess.check_output(['aws', 'ecr', 'get-login-password'], env=env)
    run('docker', 'login', '--username', 'AWS', '--password-stdin', registry, input=password)
    try:
        run('docker', 'tag', 'examtopics-api:release', f'{repository}:{tag}')
        run('docker', 'push', f'{repository}:{tag}')
        digest = aws('ecr', 'describe-images', '--repository-name', repository.split('/', 1)[1],
                     '--image-ids', f'imageTag={tag}', env=env)['imageDetails'][0]['imageDigest']
        image = f'{repository}@{digest}'
        os.environ['API_IMAGE'] = image
        deploy_backend(env)
        return image
    finally:
        subprocess.run(['docker', 'logout', registry], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def publish_frontend(prefix, env):
    bucket = os.environ['FRONTEND_BUCKET']
    control = os.environ['RELEASE_BUCKET']
    if bucket == control:
        raise ValueError('Release control bucket must be separate from frontend')
    account = os.environ['AWS_ACCOUNT_ID']
    if aws('s3api', 'get-bucket-versioning', '--bucket', bucket,
           '--expected-bucket-owner', account, env=env).get('Status') != 'Enabled':
        raise ValueError('Frontend versioning must be enabled')
    versions = aws('s3api', 'list-object-versions', '--bucket', bucket, '--prefix', 'index.html',
                   '--expected-bucket-owner', account, env=env)
    previous = [v['VersionId'] for v in versions.get('Versions', [])
                if v['Key'] == 'index.html' and v['IsLatest']]
    put_record(control, f'{prefix}/previous-index.json', previous, env)
    with tempfile.TemporaryDirectory() as directory:
        artifact = str(Path(directory) / 'frontend.tar.gz')
        run('tar', '-czf', artifact, '-C', 'examtopics-practice/build', '.')
        run('aws', 's3', 'cp', artifact, f's3://{control}/{prefix}/frontend.tar.gz',
            '--only-show-errors', env=env)
    run('aws', 's3', 'sync', 'examtopics-practice/build/', f's3://{bucket}/',
        '--exclude', 'index.html', '--no-follow-symlinks', '--only-show-errors', env=env)
    run('aws', 's3', 'cp', 'examtopics-practice/build/index.html', f's3://{bucket}/index.html',
        '--content-type', 'text/html; charset=utf-8', '--cache-control', 'no-cache',
        '--only-show-errors', env=env)
    return aws('s3api', 'head-object', '--bucket', bucket, '--key', 'index.html',
               '--expected-bucket-owner', account, env=env)['VersionId']


def main():
    head = validate_event()
    require_current_head()
    bucket = os.environ['RELEASE_BUCKET']
    for name in [bucket, os.environ['FRONTEND_BUCKET']]:
        if not re.fullmatch(r'[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]', name):
            raise ValueError('Invalid bucket name')
    selected = select_components(read_record(bucket), head)
    print(f'Changed applications: {selected}', flush=True)
    if not any(selected.values()):
        return
    build(selected)
    require_current_head()
    identifier = os.environ['CODEBUILD_BUILD_ID'].rsplit(':', 1)[-1]
    if not re.fullmatch(r'[0-9a-f-]{36}', identifier):
        raise ValueError('Invalid CodeBuild ID')
    prefix = f'releases/{head}-{identifier}'
    # Even controller bookkeeping writes require a verified account/credit check.
    guard(assume_role('MONITOR_ROLE_ARN'))
    deployment = assume_role('DEPLOY_ROLE_ARN')
    with ReleaseLock(bucket, {'commit': head, 'build': os.environ['CODEBUILD_BUILD_ID']}, deployment) as lock:
        require_current_head()
        previous = read_record(bucket, deployment)
        if previous.get('commit') == head:
            print('This commit was already released')
            return
        # Fresh monitoring credentials never replace base source credentials.
        guard(assume_role('MONITOR_ROLE_ARN'))
        require_current_head()
        lock.publishing = True
        record = dict(previous, commit=head, build=os.environ['CODEBUILD_BUILD_ID'])
        if selected['backend']:
            record['api_image'] = publish_backend(f'api-{head}-{identifier}', deployment)
        if selected['frontend']:
            record['index_version'] = publish_frontend(prefix, deployment)
        put_record(bucket, f'{prefix}/release.json', record, deployment)
        put_record(bucket, 'state.json', record, deployment)
        print(f'Release completed: {head}', flush=True)


if __name__ == '__main__':
    main()
