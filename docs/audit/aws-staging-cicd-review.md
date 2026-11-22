# AWS staging CI/CD local review — 2026-11-22

Scope: uncommitted staging automation implementation on `codex/aws-sydney-staging`: three CI/deployment workflows, `infra/cicd/`, bootstrap Terraform, staging Terraform backend/boundary/retention changes and canonical policies. This report records local evidence; it is not bootstrap or deployment approval.

## Independent reviews

- Security auditor: **No Critical/High findings** after rereview of the implemented fixes below. Read-only source review; no tests or cloud calls by this reviewer.
- QA reviewer: **APPROVE, code quality only** after independently running 61 mocked Python tests, actionlint on three workflows, Bash syntax and diff whitespace checks. The rename regression and uncertain-write handling were independently checked.

## Findings and dispositions

| ID | Severity when found | Finding and implemented fix | Regression evidence |
| --- | --- | --- | --- |
| STG-SEC-01 | High | Candidate scripts/providers could affect privileged enforcement. Protected immutable reusable-controller tag, exact reviewed controller SHA/customized OIDC subject, pinned actions, trusted Terraform assembly and immutable artifact IDs isolate enforcement. Candidate HCL/provider changes stop before initialization. | `test_candidate_provider_or_hcl_changes_stop_before_initialization`; workflow/actionlint review |
| STG-SEC-02 | High | App-only release could miss live resource drift. Read-only refresh-only plan now checks the frozen inventory. | `test_app_only_live_refresh_blocks_drift_without_an_apply` |
| STG-SEC-03 | High | Proxy health 404 could hide a failed upstream. Verify backend root’s exact JSON and request UUID in addition to internal readiness. | `test_public_proxy_health_can_mask_unreachable_or_unexpected_api` |
| STG-SEC-04 | High | Uncertain SSM completion could race rollback. Unknown/timeout/cancel outcomes stop further commands and retain the release lease. | `test_ssm_poll_deadline_preserves_uncertain_host_without_cancel_or_rollback`; timeout/send/rollback variants |
| STG-SEC-05 | High | Storage growth and stale billing could exceed the cost envelope. All-version S3/ECR inventory caps, rollback storage reserve, pre-apply artifact/image checks and fresh OIDC monitoring per mutation phase now fail closed. | Storage pagination/growth, image preflight, expired receipt and phase-guard tests |
| STG-SEC-06 | Medium | Broad remote cancellation permission. Removed `ssm:CancelCommand` from code and IAM. | Bootstrap mock-policy assertions; SSM timeout tests |
| STG-SEC-07 | Medium | Baseline could change after planning. Bind its digest in approval and recheck before lease/apply and every deployment phase. | `test_baseline_change_blocks_saved_plan_before_apply` |
| STG-SEC-08 | High | Build commands shared the scanner runner. Scan the exact immutable API artifact on a fresh credential-free runner and require scan success; bound archive size before loading it. | Workflow isolation review and actionlint |
| STG-SEC-09 | High | Uncertain frontend PUT could finish after rollback. Collect all in-flight results, prioritize uncertainty, stop queued writes and quarantine the release without rollback writes. | Uncertain PUT, mixed parallel outcomes, queued upload and missing acknowledgment regressions |
| STG-QA-01 | Medium | A rename out of application paths could look documentation-only. Classify both current and previous PR filenames. | `test_rename_out_of_application_still_requires_deployment_checks` |

All confirmed findings above are resolved in reviewed source. Automatic apply privileges now permit only the existing CloudFront function update/publish and exact application state writes, beyond scoped backend locking. Expanding this envelope requires a new reviewed controller/baseline proposal.

## Executed offline checks

| Check | Result |
| --- | --- |
| `python3 -m unittest discover -s infra/cicd/tests -v` | PASS: 61 mocked tests, including host AWS/Docker doubles |
| actionlint v1.7.12, three changed workflows | PASS; ShellCheck integration NOT RUN because ShellCheck is unavailable |
| `bash -n` host helper and shell double | PASS |
| Terraform 1.17.2 fmt, staging/bootstrap | PASS |
| Terraform validate and mock tests, staging | PASS: valid, 7 tests |
| Terraform validate and mock tests, bootstrap | PASS: valid, 5 tests |
| `git diff --check` | PASS |
| Selected credential-signature scan, changed text files | PASS: 40 files, zero matches; a limited signature check, not a full secret scanner |
| Full dependency/image vulnerability scan | NOT RUN locally: no dependency changes or built release image; immutable-artifact Trivy gate is configured but requires the canary run |
| Frontend/backend/Go/batch suites | NOT RUN locally: their source/dependencies were not modified; existing CI gates remain required |

Terraform checks ran in isolated copies containing only reviewed HCL/lock/function/tests and cached AWS provider 6.73.0, with a clean environment and no credentials, state or tfvars. The sandbox provider handshake failed during QA’s direct validation attempt; the main agent’s isolated runs used permission for the provider’s local Unix socket and passed. No AWS/backend calls were made by these checks.

## NOT VERIFIED / activation blockers

No remote writes or live AWS reads were performed for this implementation. The remote `staging` branch, controller tag creation/update/deletion protections, environment restrictions, customized emitted OIDC claims and deployed IAM trust require separate approval and verification. So do bootstrap apply, runtime boundary/helper installation, state migration, frozen baseline, retained secret-version labels and a healthy recoverable initial release.

Live Free-plan/credits/gross spend, DNS/Atlas/Google readiness, actual SSM/IAM/public probes and end-to-end canary/rollback rehearsal remain unverified. Keep automation disabled until the [operator runbook](../migration/aws-staging-cicd.md) prerequisites and exact external approvals are complete. Render production workflows were not changed. No commit, push, remote branch creation, state migration or deployment was executed.
