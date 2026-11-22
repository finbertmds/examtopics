"""Develop release helpers. Tests mock AWS; CLI commands require deployment access."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import tempfile
from datetime import datetime, timedelta, timezone
from decimal import Decimal


def aws(*args, env=None):
    try:
        return json.loads(subprocess.check_output(
            ['aws', *args, '--output', 'json', '--no-cli-pager'], text=True, env=env,
            stderr=subprocess.PIPE))
    except subprocess.CalledProcessError as error:
        # Preserve the original exception/stderr for conditional-lock handling,
        # but expose only the service error code, never raw AWS messages/payloads.
        match = re.search(r'An error occurred \(([A-Za-z0-9_.-]{1,80})\) when calling ',
                          error.stderr or '')
        code = match.group(1) if match else 'Unclassified'
        error.add_note(f'AWS {args[0]}/{args[1]} failed: code={code}, CLI exit={error.returncode}; '
                       'raw stderr suppressed')
        raise


def components(paths):
    shared = any(p == '.nvmrc' or p.startswith('deploy/codebuild/') for p in paths)
    return {part: shared or any(p.startswith(folder + '/') for p in paths)
            for part, folder in [('frontend', 'examtopics-practice'),
                                 ('backend', 'examtopics-backend')]}


def changed_components(baseline, head):
    # Include reverted edits: an earlier failed run may have deployed one part.
    paths = subprocess.check_output(
        ['git', 'log', '--format=', '--name-only', '--no-renames', '-z',
         '--diff-merges=first-parent', f'{baseline}..{head}']).decode().split('\0')
    return components(paths)


def require_current_head():
    ref = subprocess.check_output(
        ['git', 'ls-remote', '--exit-code', 'origin', 'refs/heads/develop'], text=True)
    if ref.split()[0] != os.environ['CODEBUILD_RESOLVED_SOURCE_VERSION']:
        raise RuntimeError('Stale develop commit; use the run for the current branch head')


def valid_plan(plan, account, now):
    expiry = datetime.fromisoformat(plan['accountPlanExpirationDate'].replace('Z', '+00:00'))
    credits = plan['accountPlanRemainingCredits']
    return (plan['accountId'] == account and plan['accountPlanType'] == 'FREE'
            and plan['accountPlanStatus'] == 'ACTIVE' and expiry > now
            and credits['unit'] == 'USD' and Decimal(str(credits['amount'])) >= 20)


def guard(env=None):
    account = os.environ['AWS_ACCOUNT_ID']
    assert re.fullmatch(r'\d{12}', account), 'Invalid account ID'
    assert aws('sts', 'get-caller-identity', env=env)['Account'] == account, 'Wrong AWS account'
    now = datetime.now(timezone.utc)
    plan = aws('freetier', 'get-account-plan-state', '--region', 'us-east-1', env=env)
    assert valid_plan(plan, account, now), 'Free plan/credits cannot authorize deployment'
    expected = Decimal(os.environ['AWS_EXPECTED_MONTHLY_USD'])
    assert expected.is_finite() and 0 < expected <= 20, 'Review monthly cost estimate'
    costs = aws('ce', 'get-cost-and-usage', '--region', 'us-east-1',
                '--time-period', f'Start={now:%Y-%m-01},End={(now + timedelta(days=1)):%Y-%m-%d}',
                '--granularity', 'MONTHLY', '--metrics', 'UnblendedCost',
                '--filter', json.dumps({'Not': {'Dimensions': {
                    'Key': 'RECORD_TYPE', 'Values': ['Credit', 'Refund']}}}), env=env)
    rows = costs['ResultsByTime']
    assert rows and all(r['Total']['UnblendedCost']['Unit'] == 'USD' for r in rows)
    gross = sum(Decimal(r['Total']['UnblendedCost']['Amount']) for r in rows)
    assert gross.is_finite() and 0 <= gross <= 20, 'Monthly gross cost exceeds budget'
    print(f'Checked {now.isoformat()}: Free ACTIVE, credits >= USD 20; '
          f'reported gross MTD USD {gross}, reviewed monthly estimate USD {expected}. '
          'Billing data may be delayed; credits/refunds excluded.')


def deploy_backend(env=None):
    account, region = os.environ['AWS_ACCOUNT_ID'], os.environ['AWS_REGION']
    repository, image = os.environ['ECR_REPOSITORY_URL'], os.environ['API_IMAGE']
    instance = os.environ['API_INSTANCE_ID']
    assert re.fullmatch(r'[a-z]{2}-[a-z]+-\d', region), 'Invalid region'
    assert re.fullmatch(re.escape(f'{account}.dkr.ecr.{region}.amazonaws.com/')
                        + r'[a-z0-9][a-z0-9/_-]*', repository), 'Wrong ECR target'
    assert re.fullmatch(re.escape(repository) + r'@sha256:[0-9a-f]{64}', image), 'Invalid digest'
    assert re.fullmatch(r'i-[0-9a-f]{17}', instance), 'Invalid instance ID'
    # Validated values contain no shell metacharacters. No secret values leave EC2.
    script = f"export AWS_REGION='{region}' API_IMAGE='{image}'\n"
    script += Path(__file__).with_name('replace-api.sh').read_text()
    command = aws('ssm', 'send-command', '--instance-ids', instance,
                  '--document-name', 'AWS-RunShellScript', '--timeout-seconds', '60',
                  '--parameters', json.dumps({'commands': ['bash -se <<\'DEPLOY_API\'\n'
                                                         + script + '\nDEPLOY_API'],
                                              'executionTimeout': ['600']}), env=env)['Command']['CommandId']
    print(f'SSM command: {command}', flush=True)
    for _ in range(150):
        time.sleep(5)
        # Run Command is eventually consistent. Never print remote stdout/stderr.
        result = subprocess.run(['aws', 'ssm', 'get-command-invocation',
                                 '--command-id', command, '--instance-id', instance,
                                 '--query', 'Status', '--output', 'text', '--no-cli-pager'],
                                capture_output=True, text=True, env=env)
        if result.returncode:
            if 'InvocationDoesNotExist' in result.stderr:
                continue
            raise RuntimeError(f'Cannot read status for SSM command {command}')
        status = result.stdout.strip()
        if status == 'Success':
            print('API replacement and internal readiness succeeded')
            return
        if status not in ('Pending', 'InProgress', 'Delayed'):
            raise RuntimeError(f'SSM command {command}: {status}; inspect safely on host')
    raise RuntimeError(f'SSM command {command} status unknown; inspect before retrying')


def assume_role(variable):
    account = os.environ['AWS_ACCOUNT_ID']
    role = os.environ[variable]
    if not re.fullmatch(re.escape(f'arn:aws:iam::{account}:role/') + r'[A-Za-z0-9+=,.@_/-]+', role):
        raise ValueError('Role must belong to the staging account')
    credentials = aws('sts', 'assume-role', '--role-arn', role,
                      '--role-session-name', 'codebuild-staging', '--duration-seconds', '3600')['Credentials']
    return dict(os.environ, AWS_ACCESS_KEY_ID=credentials['AccessKeyId'],
                AWS_SECRET_ACCESS_KEY=credentials['SecretAccessKey'],
                AWS_SESSION_TOKEN=credentials['SessionToken'])


def read_record(bucket, env=None):
    objects = aws('s3api', 'list-objects-v2', '--bucket', bucket, '--prefix', 'state.json',
                  '--expected-bucket-owner', os.environ['AWS_ACCOUNT_ID'], env=env)
    if not any(item['Key'] == 'state.json' for item in objects.get('Contents', [])):
        return {}
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / 'state.json'
        aws('s3api', 'get-object', '--bucket', bucket, '--key', 'state.json',
            '--expected-bucket-owner', os.environ['AWS_ACCOUNT_ID'], str(path), env=env)
        record = json.loads(path.read_text())
    if not re.fullmatch(r'[0-9a-f]{40}', record.get('commit', '')):
        raise ValueError('Invalid release state; review before deployment')
    return record


def put_record(bucket, key, record, env, *conditions):
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / 'record.json'
        path.write_text(json.dumps(record))
        return aws('s3api', 'put-object', '--bucket', bucket, '--key', key,
                   '--body', str(path), '--content-type', 'application/json',
                   '--expected-bucket-owner', os.environ['AWS_ACCOUNT_ID'], *conditions, env=env)


if __name__ == '__main__':
    if sys.argv[1] == 'changes':
        selected = changed_components(sys.argv[2], os.environ['CODEBUILD_RESOLVED_SOURCE_VERSION'])
        print('\n'.join(f'{key}={str(value).lower()}' for key, value in selected.items()))
    elif sys.argv[1] == 'guard':
        guard()
    elif sys.argv[1] == 'backend':
        deploy_backend()
    elif sys.argv[1] == 'current-head':
        require_current_head()
    else:
        raise SystemExit('Unknown command')
