# AWS deployment approval

Approval mode is **LOCAL MANUAL APPROVAL ONLY**. Each cloud-changing operation requires separate explicit human approval. The Main Orchestrator MUST collect and verify approval. Agents MUST NOT self-approve, fabricate approval, or delegate around this requirement.

## Exception: activated owner-merged staging CI/CD

Enforcement runs from the separately reviewed, protected immutable `aws-staging-controller-v1` reusable-controller tag and recorded commit. OIDC trust must bind that controller identity through the verified customized subject. Candidate HCL/providers or safety-controller changes require a separately approved controller upgrade; the initial automatic Terraform source envelope permits only the bounded CloudFront routing-function file.

The owner-approved staging CI/CD design permits one bounded alternative after its bootstrap and activation have been separately approved. `.github/workflows/deploy-staging.yml` may process a same-repository PR from `develop` merged into `staging` by the repository owner, deploy its exact merge commit after required CI, and perform application rollback within that release. The exact workflow repository ID is `1035462381` (`finbertmds/examtopics`); the target is account `450114866570`, region `ap-southeast-2`. The merge is the owner's release decision; an approving review by the PR author is not required or represented as an independent review.

The workflow's allowed operation set is:

- Scoped identity, Free-plan, credit, cost, state-lock and resource-metadata reads needed by the release.
- Terraform plan and apply of the same saved plan against the migrated staging state, only after baseline, security, cost and resource gates pass. No new/unpriced resources, deletion, replacement, runtime privilege escalation, bootstrap or production changes are included.
- Immutable staging ECR image publication, frontend asset/index publication, and the fixed, version-pinned staging SSM document with validated image digests and secret version identifiers.
- Restoration of the recorded compatible healthy application release after application health failure. No automatic database or Terraform rollback is authorized.

This exception does **not** activate the workflow by itself. Activation requires verified branch protection/environment restrictions, short-lived OIDC roles, secure migrated state with locking, fixed host deployment tooling, frozen baseline/configuration, a recoverable healthy release and approved costs. Bootstrap, baseline changes and state migration each need operation-specific approval. See [activation and operation instructions](../migration/aws-staging-cicd.md).

Direct pushes, fork/unmerged PRs, arbitrary refs, manual agent execution, alternate credentials, automatic Terraform retries after partial failure, failed-gate overrides, control-plane changes, infrastructure cleanup and production operations remain outside the exception. A merge cannot authorize code to edit the workflow's own IAM permissions, baseline or bootstrap state. A blocked automatic change must be reviewed separately; do not weaken the gate to make a release pass. All ordinary manual operations follow the workflow and report below.

## Operations requiring approval

- Terraform apply, destroy, and import, including remote state changes.
- AWS CLI, SDK, console, and indirect mutations, including resource creation, modification, and deletion.
- IAM and security policy changes, DNS and networking changes, and switching production traffic.
- Production database migrations and any changes to Render production or MongoDB Atlas. Each requires separate explicit approval. Keep staging separate and Render production running until migration acceptance.
- Account plan or billing changes and enabling potentially billable services. The [cost guardrails](aws-cost-guardrails.md) independently prohibit agent-initiated upgrades.

## Workflow

1. Prepare code and configuration locally.
2. Run offline tests and static validation. Check whether scripts, tests, Terraform backends, and hooks can make external changes before running them.
3. Obtain authorization before AWS planning access. Review the Terraform plan for the exact staging account, region, workspace, and state. Identify the saved plan by its SHA-256 digest. For other operations, identify the exact commands or request parameters in a versioned proposal.
4. Estimate the cost and verify initial plan status, credits, and current spend through authorized reads.
5. Present the precise changes using the report below.
6. Obtain explicit, operation-specific confirmation from the human in the local session.
7. Immediately before execution, recheck the plan and credit balance, verify the AWS identity and configured region, and compare the operation and plan digest to the approval. Follow the cost guardrails if verification fails.
8. Execute only the exact approved operation. Terraform apply MUST use the reviewed saved plan when applicable. `terraform apply -auto-approve` MUST NOT be used as a substitute for human approval.
9. Stop and request fresh approval if the plan, scope, target, material cost assumptions, or operation changes, including any rollback or retry that would mutate cloud resources. Prior, standing, or reusable approval is invalid.

## Approval report

```text
Operation and plan/proposal ID:
AWS account ID:
Region:
Environment:
AWS account plan, status, and expiration:
Current remaining credit (USD and checked at):
Current monthly spending (USD and reported at):
Estimated additional monthly cost (USD and assumptions):
Terraform resources to add / change / delete (counts and affected addresses):
Security implications:
Production implications:
Rollback strategy:
Explicit approval request:
```

For an AWS staging apply, ask for `APPROVE AWS STAGING APPLY <PLAN_ID> <ACCOUNT_ID>` after showing the complete report. Use equivalent wording for other operations. Confirmation applies once and binds the exact plan or proposal, account, region, environment, and operation stated in the report. An agent's QA approval or a software approval flag does not count as human confirmation.

## Enforcement gaps and controls

These repository instructions govern agent behavior. Technical enforcement requires controls outside Markdown. The repository review found no AWS deployment workflow, Terraform configuration, or approval wrapper. Live IAM, credentials, AWS Budgets, and GitHub protection settings require separate verification.

| Bypass path | Recommended technical control |
| --- | --- |
| Direct CLI or SDK calls, or Terraform outside an approval wrapper | Withhold standing deployment credentials. Restrict deployment-role assumption to an operation-specific manual approval process with short-lived credentials. |
| Overprivileged subagents or ambient credentials | Isolate agent runtimes from shared profiles, inherited credentials, and deployment secrets. Use separate narrowly scoped monitoring, planning, and deployment roles. |
| Reused approval flags or changed plans | Bind approval to the target and immutable plan digest, expire the approval after use, and verify it at execution. |
| Indirect changes via scripts, hooks, tests, or remote runners | Review execution paths and keep credentials out of local validation and ordinary CI jobs. Restrict write access at the service boundary. |
| IAM guardrail changes | Restrict IAM and guardrail administration to a separate human-controlled identity. Explicitly deny plan upgrades and operations that would trigger them for deployment identities. |
| Automatic CI deployments and unauthorized workflow edits | Protect deployment branches and workflow files with required human review. Keep deployment credentials behind a human-controlled gate and restrict who can invoke deploy jobs. |

The [frontend](../../.github/workflows/deploy.yml) and [backend](../../.github/workflows/deploy-backend.yml) Render workflows run automatically on matching master pushes and support manual dispatch, as explicitly requested by the repository owner. They use repository secrets without an environment approval gate. The [downloader](../../.github/workflows/docker.yml) publication remains manual on master and references package-release, whose reviewers and branch restrictions require separate verification. Actions use current major-version tags at the owner's request. Agents still require operation-specific authorization before pushing, merging, dispatching, deploying, publishing, or changing remote settings.
