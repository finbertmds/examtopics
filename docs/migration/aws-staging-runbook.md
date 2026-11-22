# ExamTopics AWS staging runbook

For the reusable Vietnamese walkthrough with sanitized examples, troubleshooting, repeat releases and production preparation, see [Hướng dẫn triển khai ExamTopics lên AWS](huong-dan-deploy-aws.md).

## Architecture

See the [Mermaid architecture and AWS Console review guide](aws-staging-architecture.md) for traffic flows, runtime dependencies and the resource checklist.

`app.staging.finbert.ngo` serves the React build from CloudFront and a private, versioned S3 REST origin. A CloudFront Function rewrites the application's browser routes to `index.html` and preserves origin errors for missing static files and exam data. The viewer uses an ACM certificate in `us-east-1` and redirects HTTP to HTTPS. Regional resources use Sydney (`ap-southeast-2`); CloudFront and IAM are global services. The Terraform provider sets the region explicitly and does not change the operator's AWS CLI profile.

`api.staging.finbert.ngo` terminates TLS at Caddy on an Amazon Linux 2023 `t3.micro`. An Elastic IP gives DNS and the staging Atlas allowlist a stable address. Caddy uses public ACME issuance and forwards to Express on a private Docker bridge. The security group exposes TCP 80 and 443 for redirects, ACME and HTTPS. Use Session Manager for administration. The host uses encrypted 12 GiB gp3, IMDSv2 and standard CPU credits. Private ECR holds immutable release images. A Secrets Manager secret stores the Docker environment file. Terraform provisions the secret metadata and the operator supplies its value separately. Terraform does not install Docker, configure Caddy, publish artifacts or start the application.

Use a dedicated standalone AWS staging account and the [staging Terraform root](../../infra/terraform/staging). Use a separate Atlas staging project or cluster, a database user restricted to the staging database and synthetic fixtures. Use staging Google OAuth credentials and test users, a staging Sheets fixture and a separate service account. Keep Render serving production throughout staging.

## Local validation

Use the Node version in `.nvmrc`. Run Terraform with no AWS credentials or profile. The provider download uses the public HashiCorp registry. The included test file uses a mock AWS provider and runs only plan-mode assertions locally.

```sh
terraform -chdir=infra/terraform/staging fmt -check -recursive
terraform -chdir=infra/terraform/staging init -backend=false -input=false -lockfile=readonly
terraform -chdir=infra/terraform/staging validate
terraform -chdir=infra/terraform/staging test -filter=tests/staging.tftest.hcl
```

The mock tests cover private S3 access, instance hardening, budget notifications, cross-account and wrong-region certificate rejection, and the `finbert.ngo` hostnames, CloudFront alias and CSP. If validation fails with a provider handshake error, inspect the provider's diagnostic output before changing versions. A sandbox error such as `listen unix ... bind: operation not permitted` means the local provider socket is blocked; rerun the reviewed offline check in an authorized environment that permits local sockets, without AWS credentials. Live planning, release publication and integration verification remain subject to separate approval.

Before preparing a live plan, review the [cost guardrails](../policies/aws-cost-guardrails.md), [deployment approval policy](../policies/aws-deployment-approval.md), [cost estimate](aws-staging-costs.md), [security audit](../audit/security-report.md), and QA verdict. Failed relevant tests and unresolved Critical or High findings block deployment. The local SEC-03 and SEC-04 patches still require approved staging verification. Rehearse the [question ownership cutover](../audit/sec-04-question-ownership.md) with verified fixtures before deploying against any database with legacy questions.

1. With authorized reads, verify the distinct staging account, active Free plan, expiration, actual USD credit balance of at least $20 and current reported monthly spend. Confirm exact service features, Free-plan eligibility and how credits apply. Record read timestamps and credit treatment. Preserve the Free plan and stop on a failed check.
2. Use the dedicated suffix `staging.finbert.ngo` in the existing Cloudflare DNS zone. Request an issued, non-exportable public ACM certificate for `app.staging.finbert.ngo` in **`us-east-1`**, using DNS validation. Obtain separate approvals for ACM issuance, Cloudflare DNS validation, Atlas provisioning or Google changes. Retain DNS certificate validation records for renewal. No Route 53 hosted zone or nameserver change is needed.
3. Select a Free Tier eligible Amazon-owned standard x86_64 AL2023 AMI in **`ap-southeast-2`** with an SSM Agent version of 3.3.40.0 or later for the narrow `ssmmessages` policy. AMI IDs are region-specific; do not reuse a Virginia AMI ID. An authorized operator prepares a private input file with `staging_domain = "staging.finbert.ngo"`, the verified `staging_account_id`, Sydney `api_ami_id`, and Virginia `frontend_certificate_arn`. Agents must not read or print `*.tfvars`. Fill `budget_alert_email` only when including the $20 AWS Budget and its notifications in the exact approval.
4. Keep Terraform's local state, saved plans and backups on restricted encrypted storage with a designated operator. Back up state securely before and after each approved apply. Any move to a remote backend requires its own approval for the backend and state operation.
5. Separate billing, planning, provisioning, EC2 administration and artifact publication permissions. Bind provisioning to the approved staging resources, including `iam:PassRole` restricted to the staging instance role with `iam:PassedToService=ec2.amazonaws.com`. Restrict `ssm:StartSession` to the staging instance and approved document. Restrict operators to terminating their own sessions. The host role can register with SSM, pull from one ECR repository and read one staging secret. Verify the exact SSM capabilities in the target account before release.

## Deployment inputs recorded for this staging account

The operator supplied the following non-secret identifiers on November 21, 2026, including input values pasted in chat from their original checkout. Agents have not opened or copied the operator's `staging.tfvars`. The authorized preflight below subsequently verified the certificate and AMI metadata; Cloudflare validation CNAME creation remains operator-reported. Recheck time-sensitive prerequisites before deployment.

| Terraform input | Value |
| --- | --- |
| `staging_account_id` | `450114866570` |
| `staging_domain` | `staging.finbert.ngo` |
| `frontend_certificate_arn` | `arn:aws:acm:us-east-1:450114866570:certificate/2f47ff51-c8d0-489d-9814-6082a5fe3fea` |
| `api_ami_id` | `ami-09a2f74ce8538e414` (Sydney metadata verified in the preflight below; installed SSM Agent version still unverified) |
| `budget_alert_email` | Optional; pending explicit approval for Budget creation |

The operator supplied `staging-plan` as the read-only planning profile; STS verified its role identity in the preflight below, but effective IAM restrictions have not been independently verified. The `default` profile's reported session uses `AccountFullAccessRole`; do not use that broad session for agent Terraform planning or fall back to it on access denial. Keep billing/credit monitoring access separate from planning and deployment. Current monthly spend, fresh Free-plan/credit checks, effective planning permissions and the SSM Agent prerequisite remain outstanding before deployment approval.

### Read-only preflight proposal: staging-preflight-20261121-v1

Target account: `450114866570`. Environment: staging. Profile: `staging-plan`. Regional target: `ap-southeast-2`; certificate lookup: `us-east-1`. Status: **authorized and executed** using the exact approval `APPROVE AWS STAGING PREFLIGHT staging-preflight-20261121-v1 450114866570`. This proposal covers only the three reads below, in order. Stop immediately if STS returns a different account or the broad `AccountFullAccessRole`, or if a read is denied. No resource changes, paid Cost Explorer requests, Terraform live plan, state access, DNS changes or fallback credentials are included. No rollback is needed for these reads. Local output is limited to identity and the listed resource metadata.

```sh
aws sts get-caller-identity --profile staging-plan --region ap-southeast-2 --no-cli-pager

aws ec2 describe-images --profile staging-plan --region ap-southeast-2 --owners amazon \
  --image-ids ami-09a2f74ce8538e414 \
  --filters 'Name=name,Values=al2023-ami-2023.*-kernel-*-x86_64' \
    'Name=architecture,Values=x86_64' 'Name=state,Values=available' \
    'Name=free-tier-eligible,Values=true' \
  --query 'Images[].{ImageId:ImageId,Name:Name,Architecture:Architecture,OwnerId:OwnerId,State:State,RootDeviceType:RootDeviceType,VirtualizationType:VirtualizationType,CreationDate:CreationDate}' \
  --no-cli-pager

aws acm describe-certificate --profile staging-plan --region us-east-1 \
  --certificate-arn arn:aws:acm:us-east-1:450114866570:certificate/2f47ff51-c8d0-489d-9814-6082a5fe3fea \
  --query 'Certificate.{Status:Status,DomainName:DomainName,SubjectAlternativeNames:SubjectAlternativeNames,Type:Type,NotAfter:NotAfter,Options:Options}' \
  --no-cli-pager
```

Review the AMI result against the Terraform filters, EBS/HVM requirements and SSM Agent prerequisite; an empty result is a blocker. Confirm the certificate is `ISSUED`, covers `app.staging.finbert.ngo`, is unexpired and non-exportable. These reads alone do not prove effective IAM restrictions or the AMI's installed SSM Agent version. Any additional verification needs a separately described read scope. The completed authorization is not reusable for another preflight or a live Terraform plan.

### Preflight results

Recorded November 21, 2026 at 14:35:50 UTC (23:35:50 JST), immediately after the three successful reads:

| Check | Verified result |
| --- | --- |
| STS identity | Account `450114866570`, assumed role `ExamTopicsStagingPlanRole`, profile `staging-plan` |
| Sydney AMI | `ami-09a2f74ce8538e414`, name `al2023-ami-2023.12.20261120.0-kernel-6.18-x86_64`, Amazon owner `137112412989`, `available`, `x86_64`, root device `ebs`, virtualization `hvm`; returned with the `free-tier-eligible=true` filter |
| Frontend ACM certificate | `ISSUED`, `AMAZON_ISSUED`, domain/SAN `app.staging.finbert.ngo`, export `DISABLED`; expires June 7, 2027 at 23:00:17 JST |

All three commands exited successfully. The first STS attempt could not connect inside the network-restricted sandbox; the same authorized read succeeded with network access. No cloud resources were changed. Free-plan/credit refresh, current monthly spend, effective IAM policy review, installed SSM Agent version and live Terraform planning were **NOT RUN** because they were outside this preflight's approved read scope. Public metadata eligibility does not establish account-specific service access or zero cost.

## Cloudflare DNS and application origins

Create records only after approval for the exact DNS operation. In the existing `finbert.ngo` zone use **DNS only** (no Cloudflare proxy), with TTL Auto:

| When | Type | Name in Cloudflare | Target |
| --- | --- | --- | --- |
| Before the Terraform plan, for ACM validation | CNAME | Exact validation name supplied by ACM | Exact validation value supplied by ACM |
| After the approved apply | CNAME | `app.staging` | Terraform output `frontend_distribution_domain` |
| After the approved apply | A | `api.staging` | Terraform output `api_public_ipv4` |

Do not invent the validation record or deployment targets. Wait for the certificate to be `Issued` before using its ARN in a live plan. Keep its validation CNAME for renewal. Do not create an API AAAA record: this design exposes only IPv4. Keep apex, `www`, email and existing production records unchanged. If CAA records restrict certificate issuance, review their effect on both ACM and Caddy before proposing a separately approved DNS change.

| Setting | Staging value |
| --- | --- |
| Release `api_url` / frontend `REACT_APP_BACKEND_URL` | `https://api.staging.finbert.ngo` |
| Release `frontend_url` / frontend `REACT_APP_FRONTEND_URL` | `https://app.staging.finbert.ngo` |
| Backend `FRONTEND_URL` | `https://app.staging.finbert.ngo` |
| Backend `GOOGLE_CALLBACK_URL` | `https://api.staging.finbert.ngo/auth/google/callback` |
| Caddy site hostname | `api.staging.finbert.ngo` |

Register that exact callback URL in the staging Google OAuth client. Backend secrets remain separate from public frontend build settings. Caddy obtains the API certificate after DNS resolves to the Elastic IP, the proxy is running and ports 80/443 are reachable; the CloudFront ACM certificate does not configure API TLS.

This procedure is for the first staging deployment. If resources or state already exist, stop and inventory them with separately authorized access. Changing a provider region does not migrate resources, and global IAM/CloudFront names and S3 bucket names can conflict. Do not discard state to work around a conflict.

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

1. After AWS read authorization, collect required account, Free-plan and credit information. Use separately scoped planning access to save a plan for the exact staging account, `ap-southeast-2`, root, state and AMI. Review `terraform show` locally and compute the saved plan's SHA-256. Include the exact actions, digest, security impact, current spend, projected gross cost and rollback in the [approval report](../policies/aws-deployment-approval.md). Stop on an account mismatch, foreign state or projected monthly total over $20. Obtain `APPROVE AWS STAGING APPLY <PLAN_ID> <ACCOUNT_ID>` for the exact report before applying the saved plan; this does not authorize DNS, publication, host configuration or later retries.
2. Obtain explicit approval for the exact saved plan. Recheck identity, root/state, plan digest, costs, current credits and Free-plan status before applying only that plan with short-lived credentials. Record completion and outputs securely. A changed plan or partial-failure retry requires fresh approval.
3. Obtain separate staging DNS approval and create the `app.<staging_domain>` CNAME to `frontend_distribution_domain` and `api.<staging_domain>` A record to `api_public_ipv4`. Use DNS-only records and check for stale API AAAA records. Obtain separate Atlas staging allowlist approval for the Elastic IP as a /32. Verify the isolated project, TLS and database privileges.
4. Obtain separate approvals for the secret version, image publications and host configuration. Set the SecretString for `api_environment_secret_arn` from a restricted file outside the checkout. Use Docker `--env-file` syntax with one `KEY=value` line per entry. Use escaped newlines for the Google key without surrounding quotes. Keep secret payloads out of Terraform, shell arguments, stdout, logs and session transcripts.

| Settings | Staging value |
| --- | --- |
| `PORT`, `NODE_ENV` | `3001`, `production` |
| `FRONTEND_URL` | `https://app.staging.finbert.ngo` |
| `GOOGLE_CALLBACK_URL` | `https://api.staging.finbert.ngo/auth/google/callback`, registered with the staging OAuth client |
| `MONGO_URI` | TLS SRV URI for the staging-only database |
| `JWT_SECRET`, `SESSION_SECRET` | Independent, strong random staging values |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Staging OAuth client credentials |
| `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Staging Sheets fixture and service-account credentials, when exercised |

5. Publish the AMD64 API image to `release_repository_url` using immutable tag `api-<reviewed-commit>`, and mirror the approved Caddy image using `proxy-<release>`. Deploy both by their ECR digests. Use an ephemeral Docker login and short-lived publisher credentials scoped to that ECR repository and staging frontend bucket. Record known-good image digests and the corresponding secret version ID. ECR retains the latest ten API and three proxy tags. Preserve older rollback releases separately if needed.
6. On the staging host via the approved Session Manager session, install approved AL2023 updates and Docker, and ensure Docker starts on boot. Use the instance role to obtain an ECR login and pull the exact images. Clear cached registry credentials after pulling. Create a Docker bridge named `examtopics-staging` and persistent volumes `examtopics-caddy-data` and `examtopics-caddy-config`. Write this Caddyfile to `/etc/examtopics/Caddyfile` with the exact API hostname and root ownership.

```caddyfile
api.staging.finbert.ngo {
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
  aws secretsmanager get-secret-value --region ap-southeast-2 --secret-id "$secret_arn" \
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
  aws s3 sync "$build_dir/" "s3://$frontend_bucket/" --region ap-southeast-2 --exclude index.html
  aws s3 cp "$build_dir/index.html" "s3://$frontend_bucket/index.html" --region ap-southeast-2 \
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
