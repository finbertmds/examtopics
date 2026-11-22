# AWS staging CI/CD implementation plan

Goal: owner-merged same-repository `develop` → `staging` PRs automatically release their exact merge commit to AWS staging, including bounded Terraform updates and application rollback.

## Constraints

- Account `450114866570`, Sydney; existing EC2/S3/CloudFront/ECR architecture and Free plan/$20 budget.
- Local implementation only. No commits, pushes, merges, GitHub settings, AWS operations, state migration or activation during implementation.
- Render production workflows remain untouched.
- Separately approved bootstrap owns OIDC roles/boundary, state/release buckets, fixed SSM document and baseline. Workflow cannot modify its control plane.
- Protected staged resource identity/inventory; unknown resources, deletion/replacement, IAM escalation or unknown cost stop the release.
- Secrets remain on EC2/Secrets Manager; never public plan/state/logs. Roll back applications only, never database or Terraform automatically.

## Work packages and ownership

1. Workflow/CI, pure safety gates and pipeline CLI; offline event, plan, identity and cost fixtures.
2. Separate bootstrap Terraform root and mock tests; staging S3 backend, optional runtime boundary and retention integration.
3. EC2 deployment helper, immutable release records, application publish/rollback and fake AWS/Docker failure tests.
4. Canonical policy exception, configuration example, bootstrap/branch/environment instructions and integration review.

## Acceptance

- Unmerged/fork/direct-push/wrong-owner events never deploy. Exact commit builds and AWS-free CI precede short-lived OIDC credentials.
- Missing state/baseline, billing failure, wrong account/plan/currency, insufficient credits, budget overflow, security drift, new resource, deletion and replacement fail closed.
- Saved plan and apply share an ephemeral runner; identity/credits refresh immediately before writes. No force-unlock or automatic apply retries.
- Superseded releases do not lose pending infrastructure/application changes: compare deployment-relevant paths to the previous healthy release.
- Digest-pinned SSM deploy keeps Caddy volumes, pulls before stopping, atomically writes secrets and preserves the previous release on errors.
- Only backend plus frontend health success advances the healthy pointer; application rollback retains the old pointer on failure.
- Offline Python tests, workflow lint, Terraform fmt/validate/mock tests, independent security and QA reviews pass before activation instructions are handed off.

## Activation order

After local review, separately authorize integration into develop, create staging from updated origin/develop, configure branch protections/environment, bootstrap control plane, migrate state and establish a known-healthy release/baseline. Enable the environment only after those checks. A subsequent owner-merged canary PR exercises the release; no deployment is triggered by merely creating the staging branch.

## Security review refinements

- Anchor enforcement in a protected immutable reusable-controller tag and reviewed commit, customized OIDC subject, SHA-pinned actions and immutable artifact IDs. Candidate HCL/providers cannot execute with credentials; automatic infrastructure source currently permits only the bounded CloudFront function file.
- Run read-only refresh on app-only releases to detect security drift. Validate both new and rollback artifacts before apply; recheck image/storage bounds before publication.
- Use a persistent conditional release lease; uncertain remote command or object-write outcomes stop automation for operator reconciliation. Fresh cost/credit monitoring and frozen-baseline checks guard each deployment/rollback phase.
- Count all current/noncurrent frontend/release versions and retained ECR images; reserve rollback writes and stop at reviewed storage caps.
