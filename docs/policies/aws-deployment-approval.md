# AWS deployment approval

Approval mode is **LOCAL MANUAL APPROVAL ONLY**. Each cloud-changing operation requires separate explicit human approval. The Main Orchestrator MUST collect and verify approval. Agents MUST NOT self-approve, fabricate approval, or delegate around this requirement.

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
