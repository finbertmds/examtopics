---
name: release-readiness
description: Check whether a branch is ready to merge into master for ExamTopics. Runs the offline quality gates for the changed components and walks the deployment-impact checklist, because merging to master automatically deploys Render production. Use before opening or merging a PR into master, or when asked "is this ready to ship/merge?".
---

# Release readiness (ExamTopics)

Merging into `master` deploys **production**:
- `examtopics-backend/**` changes → `deploy-backend.yml` builds, pushes `:latest` to Docker Hub and deploys Render.
- `examtopics-practice/**` changes → `deploy.yml` deploys Render.

Both deploy workflows require the reusable CI workflow to pass before deploying. This local checklist also checks deployment impact and human authorization; passing CI is not deployment approval.

This skill never merges, pushes, dispatches workflows or deploys. Those actions need explicit human approval (see `AGENTS.md` and `docs/policies/aws-deployment-approval.md`).

## 1. Scope the change
- `git diff --stat master...HEAD` and `git log --oneline master..HEAD`.
- List the touched components, and say whether each one triggers a production deploy workflow.

## 2. Run offline gates for the touched components
Toolchain must match: Node 26.12.1 (`nvm use`), Go 1.27.4, Terraform ≥ 1.14. If a toolchain doesn't match, record the gate as NOT RUN and give the reason.

| Component | Gates |
|---|---|
| Frontend | `npm run build`, `npm test` |
| Backend | `npm test` |
| Go downloader | `go build ./cmd`, `go test -short ./...` |
| Python tools | `python -m unittest discover -s batch/tests` (repo root) |
| Terraform | `terraform fmt -check`, `terraform validate`, `terraform test` |

Report actual results only, and include output excerpts for any failures.

## 3. Review
Resolve names through the role table in `AGENTS.md` (`qa_reviewer` / `security_auditor` in Codex). Use the `qa-reviewer` agent for correctness and tests. Use the `security-reviewer` agent if the change touches auth, authorization, input handling, workflows, Docker or infra.

## 4. Deployment-impact checklist
- [ ] Does the backend change need a data migration or backfill first (for example the SEC-04 ownership backfill)? If so, the migration must be done and verified **before** the merge, under separate approval.
- [ ] Does it need transaction support, new environment variables or new secrets on Render? List the variable **names**, never values.
- [ ] Do frontend and backend have to ship together (API contract changes)? Two workflows deploy independently, so plan the order.
- [ ] Is the change backward compatible with stored data and with clients still running the old bundle?
- [ ] Rollback: the backend image has `:latest` and a commit-SHA tag. Name the known-good SHA or Render previous deploy, and obtain separate approval for any rollback operation.
- [ ] Is anything the change commits safe to keep in git (no `.env`, dumps, manifests or keys)?
- [ ] Are there Critical/High findings open in `docs/security-audit.md` that this change affects?

## 5. Report
Give a verdict (READY / NOT READY), the gate results table, the checklist answers, open risks, and the exact human approval the merge needs.
