# ExamTopics AWS staging runbook

## Architecture

`app.staging.example.com` serves the React build from CloudFront and a private, versioned S3 REST origin. A CloudFront Function rewrites the application's browser routes to `index.html` and preserves origin errors for missing static files and exam data. The viewer uses an ACM certificate in `us-east-1` and redirects HTTP to HTTPS. Replace the example suffix with the approved staging DNS suffix.

`api.staging.example.com` terminates TLS at Caddy on an Amazon Linux 2023 `t3.micro`. An Elastic IP gives DNS and the staging Atlas allowlist a stable address. Caddy uses public ACME issuance and forwards to Express on a private Docker bridge. The security group exposes TCP 80 and 443 for redirects, ACME and HTTPS. Use Session Manager for administration. The host uses encrypted 12 GiB gp3, IMDSv2 and standard CPU credits. Private ECR holds immutable release images. A Secrets Manager secret stores the Docker environment file. Terraform provisions the secret metadata and the operator supplies its value separately.

Use a dedicated standalone AWS staging account and the [staging Terraform root](../../infra/terraform/staging). Use a separate Atlas staging project or cluster, a database user restricted to the staging database and synthetic fixtures. Use staging Google OAuth credentials and test users, a staging Sheets fixture and a separate service account. Keep Render serving production throughout staging.

## Local validation

Use the Node version in `.nvmrc`. Run Terraform with no AWS credentials or profile. The provider download uses the public HashiCorp registry. The included test file uses a mock AWS provider and runs only plan-mode assertions locally.

```sh
terraform -chdir=infra/terraform/staging fmt -check -recursive
terraform -chdir=infra/terraform/staging init -backend=false -lockfile=readonly
terraform -chdir=infra/terraform/staging validate
terraform -chdir=infra/terraform/staging test -filter=tests/staging.tftest.hcl
```

Local verification on November 15, 2026 passed formatting, configuration validation and all three mocked plan tests with Terraform 1.17.2 and AWS provider 6.73.0. Ten local CloudFront Function route checks and Bash syntax checks for all four shell examples also passed. Live planning, release publication and integration verification are pending approval and deployment readiness.

Before preparing a live plan, review the [cost guardrails](../policies/aws-cost-guardrails.md), [deployment approval policy](../policies/aws-deployment-approval.md), [cost estimate](aws-staging-costs.md), [security audit](../audit/security-report.md), and QA verdict. Failed relevant tests and unresolved Critical or High findings block deployment. The local SEC-03 and SEC-04 patches still require approved staging verification. Rehearse the [question ownership cutover](../audit/sec-04-question-ownership.md) with verified fixtures before deploying against any database with legacy questions.

1. With authorized reads, verify the distinct staging account, active Free plan, expiration, actual USD credit balance of at least $20 and current reported monthly spend. Confirm exact service features, Free-plan eligibility and how credits apply. Record read timestamps and credit treatment. Preserve the Free plan and stop on a failed check.
2. Arrange a dedicated staging DNS suffix and an issued, non-exportable public ACM certificate for the frontend hostname in the staging account. Obtain separate approvals for any ACM issuance, DNS validation, parent-zone delegation, Atlas provisioning or Google changes. Retain DNS certificate validation records for renewal.
3. Select a Free Tier eligible Amazon-owned standard x86_64 AL2023 AMI in `us-east-1` with an SSM Agent version of 3.3.40.0 or later for the narrow `ssmmessages` policy. Copy the example to a private `staging.tfvars` and fill the staging account, staging DNS suffix, AMI and ACM ARN. Fill the email only when including the $20 AWS Budget and its notifications in the exact approval.
4. Keep Terraform's local state, saved plans and backups on restricted encrypted storage with a designated operator. Back up state securely before and after each approved apply. Any move to a remote backend requires its own approval for the backend and state operation.
5. Separate billing, planning, provisioning, EC2 administration and artifact publication permissions. Bind provisioning to the approved staging resources, including `iam:PassRole` restricted to the staging instance role with `iam:PassedToService=ec2.amazonaws.com`. Restrict `ssm:StartSession` to the staging instance and approved document. Restrict operators to terminating their own sessions. The host role can register with SSM, pull from one ECR repository and read one staging secret. Verify the exact SSM capabilities in the target account before release.

## Release preparation and approval

Use Bash for the shell examples. Build from a reviewed commit in a clean checkout. Review base and proxy image digests, scan release images with the project's approved tooling and record the image digests, frontend build manifest and commit. Set `api_url` and `frontend_url` to the exact staging origins. Tracked build inputs keep local `.env` and untracked data out of the build context. The frontend can fall back to Render if an origin is blank. Verify the public exam files and images are suitable for staging delivery and check the built bundle along with a staging browser network trace for unexpected Render API or OAuth requests.

```sh
(
  set -euo pipefail
  : "${reviewed_commit:?}" "${api_url:?}" "${frontend_url:?}"
  release_dir=$(mktemp -d)
  git archive "$reviewed_commit" examtopics-backend examtopics-practice | tar -x -C "$release_dir"
  cd "$release_dir/examtopics-practice"
  npm ci
  REACT_APP_BACKEND_URL="$api_url" REACT_APP_FRONTEND_URL="$frontend_url" npm run build
  rg --quiet --fixed-strings "$api_url" build/assets
  docker build --platform linux/amd64 --tag "examtopics-api:$reviewed_commit" "$release_dir/examtopics-backend"
  printf 'Frontend build: %s\n' "$release_dir/examtopics-practice/build"
)
```

1. After AWS read authorization, collect required account, Free-plan and credit information. Use separately scoped planning access to save a plan for the exact staging account, region, root, state and AMI. Review `terraform show` locally and compute the saved plan's SHA-256. Include the exact actions, digest, security impact, current spend, projected gross cost and rollback in the [approval report](../policies/aws-deployment-approval.md). Stop on an account mismatch, foreign state or projected monthly total over $20.
2. Obtain explicit approval for the exact saved plan. Recheck identity, root/state, plan digest, costs, current credits and Free-plan status before applying only that plan with short-lived credentials. Record completion and outputs securely. A changed plan or partial-failure retry requires fresh approval.
3. Obtain separate staging DNS approval and create the `app.<staging_domain>` CNAME to `frontend_distribution_domain` and `api.<staging_domain>` A record to `api_public_ipv4`. Use DNS-only records and check for stale API AAAA records. Obtain separate Atlas staging allowlist approval for the Elastic IP as a /32. Verify the isolated project, TLS and database privileges.
4. Obtain separate approvals for the secret version, image publications and host configuration. Set the SecretString for `api_environment_secret_arn` from a restricted file outside the checkout. Use Docker `--env-file` syntax with one `KEY=value` line per entry. Use escaped newlines for the Google key without surrounding quotes. Keep secret payloads out of Terraform, shell arguments, stdout, logs and session transcripts.

| Settings | Staging value |
| --- | --- |
| `PORT`, `NODE_ENV` | `3001`, `production` |
| `FRONTEND_URL` | Exact staging frontend HTTPS origin |
| `GOOGLE_CALLBACK_URL` | Staging API HTTPS origin plus `/auth/google/callback`, registered with the staging OAuth client |
| `MONGO_URI` | TLS SRV URI for the staging-only database |
| `JWT_SECRET`, `SESSION_SECRET` | Independent, strong random staging values |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Staging OAuth client credentials |
| `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Staging Sheets fixture and service-account credentials, when exercised |

5. Publish the AMD64 API image to `release_repository_url` using immutable tag `api-<reviewed-commit>`, and mirror the approved Caddy image using `proxy-<release>`. Deploy both by their ECR digests. Use an ephemeral Docker login and short-lived publisher credentials scoped to that ECR repository and staging frontend bucket. Record known-good image digests and the corresponding secret version ID. ECR retains the latest ten API and three proxy tags. Preserve older rollback releases separately if needed.
6. On the staging host via the approved Session Manager session, install approved AL2023 updates and Docker, and ensure Docker starts on boot. Use the instance role to obtain an ECR login and pull the exact images. Clear cached registry credentials after pulling. Create a Docker bridge named `examtopics-staging` and persistent volumes `examtopics-caddy-data` and `examtopics-caddy-config`. Write this Caddyfile to `/etc/examtopics/Caddyfile` with the exact API hostname and root ownership.

```caddyfile
api.staging.example.com {
    header Strict-Transport-Security "max-age=31536000"
    @internalHealth path /health /health/*
    respond @internalHealth 404
    reverse_proxy examtopics-api:3001
}
```

Keep proxy access logs disabled because OAuth callbacks may contain sensitive URL parameters. Use Docker's rotating local logs. Use the following command forms for the approved host configuration. Run from a root shell with tracing disabled. Use a named secret version for deployment and rollback.

```sh
(
  set -eu
  umask 077
  install -d -m 0700 /etc/examtopics
  env_tmp=$(mktemp /etc/examtopics/api.env.XXXXXX)
  trap 'rm -f "$env_tmp"' EXIT
  aws secretsmanager get-secret-value --region us-east-1 --secret-id "$secret_arn" \
    --version-id "$secret_version_id" --query SecretString --output text > "$env_tmp"
  grep -q '^MONGO_URI=.' "$env_tmp"
  grep -q '^JWT_SECRET=.' "$env_tmp"
  grep -q '^SESSION_SECRET=.' "$env_tmp"
  mv -f "$env_tmp" /etc/examtopics/api.env
  docker run -d --name examtopics-api --network examtopics-staging \
    --restart unless-stopped --no-healthcheck --log-driver local \
    --cap-drop ALL --security-opt no-new-privileges:true \
    --env-file /etc/examtopics/api.env "$api_image_by_digest"
  docker run -d --name examtopics-proxy --network examtopics-staging \
    --restart unless-stopped --log-driver local \
    --cap-drop ALL --cap-add NET_BIND_SERVICE --security-opt no-new-privileges:true \
    -p 80:80 -p 443:443 \
    -v /etc/examtopics/Caddyfile:/etc/caddy/Caddyfile:ro \
    -v examtopics-caddy-data:/data -v examtopics-caddy-config:/config "$proxy_image_by_digest"
)
```

For upgrades, pull and verify both images before replacing affected containers. Preserve the proxy volumes and keep `/etc/examtopics` root-only. Docker operators and host root can read container environments. Limit Docker and SSM access accordingly.

7. After asset publication approval, upload the assets before replacing `index.html`. Omit deletes during publication and retain the previous build manifest and index version ID. Confirm MIME types for HTML, JS, JSON and images. Only `/assets/*` is cached at the edge. Check that each immutable key is content-hashed. Propose a separate invalidation if an incorrectly reused key requires eviction.

```sh
(
  set -eu
  aws s3 sync "$build_dir/" "s3://$frontend_bucket/" --exclude index.html
  aws s3 cp "$build_dir/index.html" "s3://$frontend_bucket/index.html" \
    --content-type 'text/html; charset=utf-8' --cache-control 'no-cache'
)
```

A future authorized GitHub Actions publishing workflow can use [GitHub OIDC](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws), audience `sts.amazonaws.com`, and exact subject `repo:FinbertMDS/examtopics:environment:aws-staging` after verifying the canonical repo. Scope the short-lived publisher role to staging artifact publication. Protect the environment with eligible refs and a required human reviewer. Preserve the repository's local operation-specific approval process. Workflow changes, OIDC/IAM setup and automated deployments each require separate authorization.

## Acceptance and monitoring

- Confirm DNS and HTTPS at both hosts, CloudFront deep links and missing static-file behavior. Verify the S3 origin denies anonymous requests, and public network access reaches neither SSH nor the Express port directly. Check browser traffic targets staging.
- Run one dependency check through the approved host session using `docker exec examtopics-api node -e 'fetch("http://127.0.0.1:3001/health/readiness").then(r => { console.log(r.status); process.exitCode = r.ok ? 0 : 1; })'`. Check Sheets independently because MongoDB success can return HTTP 200 when Sheets is disconnected. The readiness endpoint caches and coalesces dependency probes. Use `/health` for process liveness without dependency requests.
- Confirm the staging MongoDB deployment supports transactions before exercising question writes. Verify the OAuth login code and browser session TTL indexes and release frontend and backend together. Confirm reload and logout on the intended browser and hostnames. [Exam mutation rollout](../audit/sec-07-exam-mutations.md).
- Exercise Google OAuth, exact HTTPS callback, session state, logout and rejected origins. Verify exam reads, signed-in progress and per-user isolation, report writes to the staging fixture and admin-route denials for ordinary accounts. Verify staging secrets and data are separate. Record each remaining integration gap.
- Review the EC2 status alarm, CPU credits, drive headroom and bounded host logs after deploy. The CloudWatch alarm exposes status in the console and has no notifications. AWS Budgets can email actual and forecast spend separately. A single host and local logs suit limited staging and leave a service interruption risk during recovery.

## Rollback and production migration

For release rollback, identify the previous frontend assets and index version, API and proxy digests, and secret version. Review compatibility with staging data. Obtain operation-specific approvals for restoring frontend objects, changing containers, cache invalidations and any DNS changes. Verify old assets exist before restoring the previous index last. Recheck HTTPS, OAuth, MongoDB and Sheets with staging fixtures.

For Terraform rollback, start from prior reviewed staging code and current state, save and review a new plan and digest, and obtain fresh approval. To retire staging, propose removing only staging DNS and Atlas allowlist entries. Terraform uses safe bucket and registry deletion defaults, so approve cleanup of S3 object versions and delete markers and ECR manifests before deleting their resources. Include the Elastic IP and secret retirement in the teardown proposal. Preserve state backups and recheck cost and credits with authorized reads. ACM and its validation records have their own lifecycle.

A future production change requires a dedicated proposal with production targets and DNS TTLs, the previous Render targets, accepted staging test results, service health and latency thresholds, and an approved data compatibility and rollback plan. Keep Render available through migration acceptance and preserve backward compatibility with its database schema. If agreed availability, OAuth, latency or data integrity thresholds fail, stop writes as appropriate and use a separately approved rollback to the recorded Render DNS targets. Reconcile writes before retiring either path. Approve Render retirement, production DNS, Atlas changes and data migration independently.
