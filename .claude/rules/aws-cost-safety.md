---
paths:
  - "infra/**"
  - ".github/workflows/**"
  - "docs/migration/**"
  - "docs/policies/**"
---

# AWS, CI and deployment safety

The canonical rules are the root `AGENTS.md` safety section, `docs/policies/aws-cost-guardrails.md` and `docs/policies/aws-deployment-approval.md`. Read both policy files before working here. If either file is missing, stop cloud-related work.

What these rules mean when working in these paths:

- Offline checks only, without separate approval: `terraform fmt -check`, `terraform init -backend=false`, `terraform validate` and `terraform test` (which uses `mock_provider`). `init` downloads providers but makes no AWS calls.
- `terraform plan` against a real account, all `aws` CLI calls, and every apply/destroy/import need authorization first, using the approval report template in the deployment policy.
- Never add resources that bring recurring cost (NAT Gateway, load balancer, extra public IPv4, interface endpoints, hosted zones, larger instances) without an updated `docs/migration/aws-staging-costs.md` estimate and approval. The budget is $20/month.
- Never commit state, plans or `*.tfvars`. `infra/terraform/staging/.gitignore` covers them, so keep it that way.
- Workflow files: `deploy.yml` and `deploy-backend.yml` deploy Render **production** on `master` pushes. Editing them changes production deploy behaviour and needs explicit approval. Do not add secrets to jobs that don't need them, and keep `permissions: {}` at workflow level.
- Do not touch Render production, MongoDB Atlas or production DNS. Staging stays separate.

The canonical policies define one bounded exception for the separately activated `deploy-staging.yml` workflow after an owner-merged `develop` → `staging` PR. This is not authorization for agents to run live commands or activate the workflow while implementing it. Bootstrap, baseline changes, state migration, GitHub settings and all operations outside that workflow's enforced envelope still require exact approval. Keep this adapter consistent with the canonical policy; never expand the exception here.
