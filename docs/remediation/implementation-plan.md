# Implementation plan

This plan says how the tasks in [remediation-roadmap.md](remediation-roadmap.md) are carried out, batch by batch. Finding details are in [findings-tracker.md](findings-tracker.md).

**Status: PLAN ONLY.** No batch has been approved for implementation.

## Rules for every batch

- Follow `CLAUDE.md`, `AGENTS.md`, `.claude/rules/` and the AWS policies in `docs/policies/`.
- Work locally only, on a feature branch cut from the current base. Never commit, push, merge or dispatch workflows without the owner asking. **A merge to `master` deploys Render production.**
- Do not deploy, run Terraform plan/apply/destroy, make AWS calls, access production databases or Render, or add paid services. Anything outside local work needs the approval code given in the roadmap (A1–A4).
- One task is one focused change with its own regression tests. Keep existing behaviour and API, data and filename compatibility unless the task explicitly changes it.
- Never print or commit secrets. Environment variables are referenced by name only.

## Standard execution loop (per task)

1. The main agent confirms the task's prerequisites and approvals are met.
2. The main agent implements the change and its tests (the `security_engineer` role).
3. Read-only reviewers run **in parallel** on the same diff range, each given the file list so no reviewer re-scans the whole repository:
   - `qa-reviewer` always: correctness, tests and offline gates.
   - `security-reviewer` when the diff touches auth, authorization, input handling, workflows, Docker, dependencies or infra.
   - `architecture-reviewer` for refactors and new modules or contracts.
   - `aws-architect` drafts infra patches before step 2; the main agent applies them.
4. The main agent consolidates the findings, fixes REQUEST_CHANGES items, and re-runs only the reviewers affected.
5. The main agent reports a gate results table (PASSED / FAILED / NOT RUN with reason) and the diff summary.

The batch checkpoint then follows (below).

## Batch checkpoint (end of every batch)

The main agent presents:
- the tasks completed and the diff summary
- the gate results
- reviewer verdicts
- the findings closed, with tracker updates
- residual risks
- the exact approvals the next step needs

The owner then decides: commit, revise, or stop. Updating the tracker status is part of the batch.

---

## Batch 1: Safety foundation

**Scope:** T1.0, T1.1, T1.2, T1.3, T1.4 (OPS-001, SEC-018, SEC-019, SEC-021, QA-007).

**Expected changes:**
- Workstation toolchain: no repository change.
- `.github/workflows/ci.yml` (new).
- `deploy.yml` and `deploy-backend.yml`: dependency on CI.
- `examtopics-backend/.gitignore`, plus untracking the two files.
- `examtopics-backend/scripts/lib/targetGuard.js` (new) and five scripts.
- Migration script tests.
- `examtopics-backend/README.md` (new flags).

**Order:**
1. T1.0 baseline: record the current gate results.
2. T1.4 and T1.3 run in parallel (no shared files).
3. T1.1.
4. T1.2, last, because it is the production-affecting workflow edit.

**Acceptance criteria:**
- All offline gates pass locally, or each failure is documented as present before the batch with its output.
- The CI workflow uses no secrets and runs every component's tests.
- Deploys cannot run after a failed CI run. Valid only if Render auto-deploy is confirmed off; otherwise this is documented as residual risk.
- The two sensitive files are untracked and ignored.
- No database script can connect to a remote or mismatched target without explicit flags.

**Required tests:** spawn tests for each migration script (missing URI, remote without flag, mismatched target, production refusal, matching local target, password redaction); the CI workflow first run; backend and frontend suites unchanged.

**Independent review:** qa-reviewer (all tasks) and security-reviewer (T1.1–T1.4) in parallel.

**Rollback:** revert each task's commit. Deleting `ci.yml` restores today's state. Untracked files remain on disk.

**Approval checkpoint:**
- Approval A0 to start.
- Approval A1 for T1.1 and T1.2.
- Approval A4 on history rewrite and archive handling.
- Approval A2 if Render auto-deploy must change.

## Batch 2: Authorization and correctness

**Scope:** T2.1–T2.6 (QA-001, ARCH-003, SEC-020, SEC-024, SEC-025, SEC-026, QA-004, QA-005, SEC-022, QA-006).

**Expected changes:**
- Backend: `services/examService.js`, `controllers/examController.js`, `controllers/progressController.js`, `controllers/authController.js`, `routes/reportRoutes.js`, `index.js`, `env.example`; new and updated tests in `test/`.
- Frontend: `src/services/examApi.ts`, `src/components/AdminPage.tsx`, `QuestionItem.tsx`, `src/contexts/AuthContext.tsx`, `src/types/index.ts`, locale files, a new locale test.

**Order:**
1. T2.1 (tests first; protects T2.2 and T2.3).
2. T2.2.
3. T2.3.
4. T2.4, T2.5 and T2.6 in any order. Do not run T2.4 in parallel with T2.2 or T2.3, because they share `examController.js` and `examService.js`.

**Acceptance criteria:**
- Only allowlisted admins can publish.
- No error is returned as 200.
- Inputs are validated as specified.
- No missing translation keys.
- Limiter behaviour is unchanged when `TRUST_PROXY` is unset.
- All suites are green, and existing exam, progress and auth tests are unchanged except for intentional assertion updates (listed in the report).

**Required tests:** as listed for T2.1–T2.6 in the roadmap.

**Independent review:**
- security-reviewer: T2.3, T2.4, T2.6.
- qa-reviewer: all tasks.
- architecture-reviewer: T2.2 (contract).

**Rollback:** revert per task. If T2.3 is reverted, self-publishing comes back; no data migration is involved.

**Approval checkpoint:**
- Approval A0 to start.
- Approval A4 for the SEC-020 decisions (option, legacy default, import cap) **before T2.3**.
- Approval A2 before setting `ADMIN_EMAILS` or `TRUST_PROXY` on Render.
- The rollout order for T2.3 must be stated: set `ADMIN_EMAILS` on Render before merging, or admins lose publishing.

## Batch 3: Staging readiness and architecture

**Scope:** T3.1–T3.8 (ARCH-001, SEC-027, OPS-003, ARCH-007, ARCH-008, ARCH-005, ARCH-009, ARCH-011, ARCH-002, SEC-023, INFRA-002, INFRA-003, ARCH-010).

**Expected changes:**
- Backend config and CORS.
- Frontend build config and `index.html`.
- `deploy-backend.yml` tag.
- `package.json` and `package-lock.json`; two `yarn.lock` deletions.
- Auth/health layering and `User` model cleanup.
- `apiClient.ts` and `examApi.ts`.
- `infra/terraform/staging/{frontend,registry}.tf` and the tests.
- Documentation consolidation; corrections to the policy and AGENTS.md wording.

**Order:**
1. Authorized read of the Render variable names and build commands (A2).
2. T3.1 and T3.2 together. Do not merge until Render is confirmed to have the variables.
3. T3.3.
4. T3.4.
5. T3.5.
6. T3.6.
7. T3.7, drafted by aws-architect in parallel with steps 2–6, since it shares no files.
8. T3.8.

**Acceptance criteria:**
- Production fails fast on missing URL configuration.
- Staging cannot accept the Render origin.
- The backend image has an immutable SHA tag.
- One lockfile per project.
- No behaviour change from the layering moves.
- Admin API calls go through `apiClient`.
- Terraform passes `fmt`, `validate` and `test` offline, with a $0 cost delta.
- No stale doc statements remain.

**Required tests:** startup config and CORS tests; a production build check; existing auth and health suites; `examApi` per-method tests; new `tftest` assertions.

**Independent review:**
- security-reviewer: T3.1, T3.3, T3.7.
- architecture-reviewer: T3.5, T3.6.
- qa-reviewer: all tasks.
- aws-architect: re-reviews T3.1 for staging fit.

**Rollback:** revert per task. Nothing is deployed to AWS in this batch.

**Approval checkpoint:**
- Approval A0 to start.
- Approval A2 (Render read before T3.1, T3.2 and T3.4).
- Approval A1 for T3.3.
- Approval A4 for the policy and AGENTS.md edits.
- Approval A3 for any Terraform plan or apply: a separate approval report, outside this plan.

## Batch 4: Tests, performance and lower priority

**Scope:** T4.1–T4.5 (QA-002, QA-003, ARCH-006, ARCH-004, INFRA-001).

**Expected changes:**
- New backend progress tests.
- New frontend tests.
- Extracted hooks and utils from `AdminPage.tsx`.
- `scripts/migrate-samples.js` owner value, and a migration plan document.
- `frontend.tf` cache behaviours.

**Order:**
1. T4.1 and T4.2 in parallel (different components).
2. T4.3, only after T4.2.
3. T4.4.
4. T4.5.

**Acceptance criteria:**
- Progress write paths and user scoping are covered.
- The core frontend flows are covered in CI.
- AdminPage is reduced with no UI change.
- No placeholder owner is written.
- The Terraform cache change passes offline checks.

**Required tests:** as listed in the roadmap.

**Independent review:**
- qa-reviewer: all tasks.
- architecture-reviewer: T4.3, T4.4.
- security-reviewer: T4.5.

**Rollback:** revert per task or extraction step.

**Approval checkpoint:**
- Approval A0 to start.
- Approval A2 before any data migration run.
- Approval A3 for any staging plan or apply.

---

## Files expected to change (all batches)

| Area | Files |
|---|---|
| CI/CD | `.github/workflows/ci.yml` (new), `.github/workflows/deploy.yml`, `.github/workflows/deploy-backend.yml` |
| Repo hygiene | `examtopics-backend/.gitignore`; untrack `examtopics-backend/verified-question-ownership.json`, `examtopics-backend/examtopics.tar.gz.gpg`; delete `examtopics-backend/yarn.lock`, `examtopics-practice/yarn.lock` |
| Backend | `index.js`, `env.example`, `package.json`, `package-lock.json`, `controllers/{exam,progress,auth}Controller.js`, `services/{exam,authSession,auth}Service.js`, `services/healthService.js` (new), `routes/{report,health}Routes.js`, `utils/frontendUrl.js`, `models/User.js`, `scripts/*.js`, `scripts/lib/targetGuard.js` (new), `README.md`, `OAUTH_SETUP.md`, `OAUTH_SUMMARY.md` |
| Backend tests | `test/exam-ownership-transfer.test.js` (new), `test/progress-service.test.js` (new), config/CORS test (new), `test/{exam-visibility,exam-question-ownership,progress-validation,request-controls,migrate-samples-config}.test.js` |
| Frontend | `vite.config.mts`, `index.html`, `src/utils/{apiClient,backendUrl}.ts`, `src/services/examApi.ts`, `src/components/{AdminPage,QuestionItem,ExamPage}.tsx`, `src/contexts/AuthContext.tsx`, `src/types/index.ts`, `src/locales/translations/{en,ja,vi}.json`, new hooks and utils, new tests |
| Infrastructure | `infra/terraform/staging/{frontend,registry}.tf`, `infra/terraform/staging/tests/staging.tftest.hcl` |
| Documentation | `docs/remediation/*` (status updates), `docs/security-audit.md`, `docs/technical-debt.md`, `docs/policies/aws-deployment-approval.md` (owner-approved), `AGENTS.md` (owner-approved), `examtopics-practice/*_README.md` consolidation |

## Recommended first step

Start Batch 1 with **T1.0**, so the gates can be verified at all, then **T1.4** and **T1.3**. These are local, small and low-regression, and they remove the data-loss and exposure paths.

Before T1.1 and T1.2, the owner answers open decision 1 (Render auto-deploy) in the roadmap.
