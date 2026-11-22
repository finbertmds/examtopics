# Deployment

> Any deployment, workflow dispatch, push or merge to `master`, Render change, MongoDB Atlas change or AWS mutation needs explicit human approval. See `AGENTS.md`, `docs/policies/aws-cost-guardrails.md` and `docs/policies/aws-deployment-approval.md`.

## Production: Render (current)

| Workflow | Trigger | What it does |
|---|---|---|
| `.github/workflows/deploy.yml` | push to `master` touching `examtopics-practice/**`, or manual dispatch | Calls the Render deploy API for the frontend static site |
| `.github/workflows/deploy-backend.yml` | push to `master` touching `examtopics-backend/**`, or manual dispatch | Builds `examtopics-backend/` (context limited by `.dockerignore`), pushes `ngovanhuy0241/examtopics-backend:latest` to Docker Hub, then calls the Render deploy API |
| `.github/workflows/docker.yml` | manual dispatch on `master` only | `go build` + `go test -short`, then pushes `ghcr.io/<owner>/examtopics:latest` (multi-arch) through the `package-release` environment |

Facts and gaps (verified from YAML):
- **No tests run before the Render deploys.** No PR or push test workflow exists. Merging to `master` *is* a production deploy.
- The backend image is tagged only `:latest`. Rollback relies on Render's deploy history.
- Workflows set `permissions: {}` at workflow level and `persist-credentials: false`. Secrets are passed through environment variables with `:?` guards.
- Actions use mutable major tags, and Render deploys have no environment approval gate. The owner accepted these risks (SEC-10).
- Render service settings, environment variables, custom headers and branch protection are NOT VERIFIED from the repository.

Secrets (names): `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `RENDER_BACKEND_SERVICE_ID`, `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GITHUB_TOKEN`.

### Backend container

`examtopics-backend/Dockerfile`:
- Base image `node:26.12.1-alpine`.
- Runs `npm ci --omit=dev` and as non-root user `nodejs` (1001).
- Exposes 3001, with a `HEALTHCHECK` on `/health`.
- `.dockerignore` allowlists only manifests and runtime JS directories, so `.env`, the encrypted archive and the ownership manifest stay out of the image.

### Pre-deploy prerequisites

- MongoDB must support transactions (Atlas replica set) for exam mutations (`docs/audit/sec-07-exam-mutations.md`).
- SEC-04 ownership backfill must be completed and verified before or with the ownership code (`docs/audit/sec-04-question-ownership.md`). **Production status: NOT VERIFIED.** The code is already on `master`.
- Production must set distinct private `JWT_SECRET` and `SESSION_SECRET`. Startup fails otherwise (`utils/authSecrets.js`).
- Production must also set `FRONTEND_URL`, `GOOGLE_CALLBACK_URL`, the OAuth client and the Sheets service account variables (names in `env.example`).

Use the `release-readiness` skill (`.claude/skills/release-readiness/`) before any merge to `master`.

## Staging: AWS (planned, not deployed by automation)

- Terraform in `infra/terraform/staging/`, region `ap-southeast-2` (Sydney), `allowed_account_ids` pinned by variable. CloudFront's ACM certificate remains in `us-east-1`:
  - VPC with a public subnet and no NAT
  - EC2 t3.micro (IMDSv2 required, encrypted gp3 12 GB, SSM access)
  - Elastic IP
  - Security group: 80/443 ingress, 443 and 27015-27017 egress
  - ECR with a lifecycle policy
  - Secrets Manager secret for the API environment
  - Private S3 + CloudFront with OAC and a routing function
  - CloudWatch alarm
  - AWS Budget (only when `budget_alert_email` is supplied)
- State is **local** (no backend block). `.gitignore` excludes state, plans and tfvars.
- Offline tests: `terraform test` with `mock_provider` (`tests/staging.tftest.hcl`).
- Estimated Sydney cost: about $15.46/month before credits and tax, with an $18 planning allowance against the $20 budget (`docs/migration/aws-staging-costs.md`).
- Architecture and Console review: [AWS staging Mermaid diagrams](migration/aws-staging-architecture.md).
- Procedure: `docs/migration/aws-staging-runbook.md`. Approval: the report template in `docs/policies/aws-deployment-approval.md`.

Note: the "Enforcement gaps" paragraph in `aws-deployment-approval.md` says the repository had no Terraform configuration. That is stale, because `infra/terraform/staging/` now exists.

## Rollback

- Render: redeploy the previous successful deploy from Render. There is no versioned backend image tag.
- SEC-04 data cutover: follow "Recover from a failed cutover" in `docs/audit/sec-04-question-ownership.md`.
- AWS staging: follow "Rollback and production migration" in `docs/migration/aws-staging-runbook.md`.
