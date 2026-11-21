# Remediation roadmap

This is the prioritized task catalog for the open items in [findings-tracker.md](findings-tracker.md). How the work is executed, batch by batch, is in [implementation-plan.md](implementation-plan.md).

**Status: PLAN ONLY.** Nothing here is approved for implementation until the owner approves the relevant batch checkpoint.

## Prioritization

No Critical findings exist, so the order follows real exposure rather than severity labels alone:

1. **Close the deploy-without-tests path first (OPS-001).** Every later merge to `master` deploys Render production, so the gate protects all following batches.
2. **Remove data-loss and data-exposure paths next (SEC-021, SEC-018, SEC-019).** They are small, isolated and low-regression.
3. **Then authorization and correctness (SEC-020, ARCH-003, QA-001, input hardening).** These need a product decision and test coverage.
4. **Then staging readiness and architecture (ARCH-001, SEC-027, OPS-003, CSP, cleanup).** These depend on verified Render configuration.
5. **Then broad test coverage and refactoring (QA-002/003, ARCH-006).**

Large items are split into independently testable tasks. No rewrites are planned.

## Roles

| Role (AGENTS.md) | Implemented by | Notes |
|---|---|---|
| security_engineer | Main agent | No editing subagent exists; fixes stay with the main agent |
| security_auditor | `security-reviewer` | Read-only review of security-relevant diffs |
| qa_reviewer | `qa-reviewer` | Gates and regression review after each task group |
| aws_architect | `aws-architect` | Terraform and staging proposals as patches |
| architecture_reviewer | `architecture-reviewer` | Design review for refactors |

## Approval codes

| Code | Approval needed |
|---|---|
| A0 | Owner approval of the batch checkpoint. Covers local code, test and doc changes only |
| A1 | A separate approval for CI/CD workflow changes, because deploy workflows affect Render production |
| A2 | A separate approval for any read or change on Render, MongoDB Atlas or production DNS |
| A3 | AWS planning access and staging apply, under [`aws-deployment-approval.md`](../policies/aws-deployment-approval.md) |
| A4 | Owner decision (product, history rewrite or policy text) |

Commits, pushes and merges always need the owner's explicit request. A merge to `master` deploys production.

---

## Task catalog

### Batch 1: Safety foundation

| Task | Findings | Scope / files | Proposed solution | Implementer / reviewers |
|---|---|---|---|---|
| T1.0 | QA-007 | Workstation only | `nvm install && nvm use` (Node 26.12.1); `npm ci` in `examtopics-backend/` and `examtopics-practice/`; install Go 1.27.4 and Terraform ≥ 1.14 | Owner, or the main agent with permission / — |
| T1.1 | OPS-001 | `.github/workflows/ci.yml` (new) | On `pull_request` and `push` to `master`: jobs `backend` (setup-node with `node-version-file: .nvmrc`, `npm ci`, `npm test`), `frontend` (`npm ci`, `npm run build`, `npm test`), `go` (Go 1.27.4, `go build ./...`, `go test -short -timeout 2m ./...`), `python` (install `batch/` and `examtopics-img-downloader/` requirements, `python -m unittest discover -s batch/tests`), `terraform` (≥ 1.14: `fmt -check -recursive`, `init -backend=false -input=false`, `validate`, `test`). `permissions: contents: read`, no secrets | Main / qa-reviewer, security-reviewer |
| T1.2 | OPS-001 | `.github/workflows/deploy.yml`, `deploy-backend.yml` | Run deploys only after T1.1 succeeds, using `workflow_run` with `conclusion == 'success'` or same-workflow `needs:`. Keep the existing secret handling and `permissions: {}` | Main / security-reviewer, qa-reviewer |
| T1.3 | SEC-018, SEC-019 | `examtopics-backend/.gitignore`; index removal of `examtopics-backend/verified-question-ownership.json`, `examtopics-backend/examtopics.tar.gz.gpg` | The owner keeps secure copies outside the repo. Then `git rm --cached` both files and add `verified-question-ownership*.json` and `*.gpg` to the ignore rules | Main / security-reviewer |
| T1.4 | SEC-021 | `examtopics-backend/scripts/lib/targetGuard.js` (new); `scripts/migrate-samples.js`, `migrate-progress.js`, `migrate-exam-visibility.js`, `backfill-question-ownership.js`, `export-question-ownership.js`; `test/migrate-*.test.js`; `examtopics-backend/README.md` | A shared guard, called before connecting: explicit `MONGO_URI`; redacted target print; dry run unless `--apply`; a remote or `+srv` target requires a matching `--target=<host>/<db>`; refused in production unless `ALLOW_REMOTE_MIGRATION=1`. Remove the silent localhost default | Main / qa-reviewer, security-reviewer |

| Task | Acceptance criteria | Required tests | Rollback | Prerequisites | Approval |
|---|---|---|---|---|---|
| T1.0 | `node -v` shows 26.12.1; `go version` 1.27.4; `terraform version` ≥ 1.14; dependencies installed | Baseline run of all gates with results recorded | n/a | — | A0 (installs are side effects) |
| T1.1 | Workflow runs on a PR, every job is green on the current tree, no secrets referenced | Workflow lint (`actionlint` if available); a first PR run | Delete the workflow file | T1.0 baseline known | A0 + A1 |
| T1.2 | A failing test blocks the deploy job; a green run deploys as before | A deliberately failing test on a throwaway branch (no merge); inspect the workflow graph | Revert the workflow commit | T1.1 green; **A4/A2: is Render auto-deploy on push enabled?** If yes, the gate needs it disabled (A2) | A1 (+ A2 if Render changes) |
| T1.3 | Both files untracked and matched by `git check-ignore`; Docker context unchanged | `git ls-files`; backend `npm test` | `git revert` | Owner confirms secure copies and archive contents/key; **A4: rewrite history or not** | A0 (+ A4) |
| T1.4 | Every DB script refuses mismatched or remote targets before connecting; dry run is the default for writes; no password printed | Per-script spawn tests (pattern of `test/migrate-samples-config.test.js`): missing URI, remote without flag, mismatched flag, production refusal, matching local target | `git revert` | — | A0 |

### Batch 2: Authorization and correctness

| Task | Findings | Scope / files | Proposed solution | Implementer / reviewers |
|---|---|---|---|---|
| T2.1 | QA-001 | `examtopics-backend/test/exam-ownership-transfer.test.js` (new) | Tests for owner transfer, non-owner 403, unknown target, and old owner denied after transfer | Main / qa-reviewer |
| T2.2 | ARCH-003 | `examtopics-backend/controllers/examController.js`; `examtopics-practice/src/services/examApi.ts`; `src/components/AdminPage.tsx` (error handling only) | Use 400/409 with `error` for all validation and duplicate paths; `examApi` throws on `!ok`/`!success`; AdminPage shows the error | Main / qa-reviewer, architecture-reviewer |
| T2.3 | SEC-020 | `examtopics-backend/services/examService.js`, `controllers/examController.js`, `controllers/authController.js` (session response `isAdmin`), `env.example`; `examtopics-practice/src/components/AdminPage.tsx`, `src/contexts/AuthContext.tsx`, `src/types/index.ts` | Option A: `ADMIN_EMAILS` allowlist; `isPublished: true` accepted only from admins on create and update; optional non-admin import cap; publish toggle hidden for non-admins | Main / security-reviewer, qa-reviewer |
| T2.4 | SEC-024, SEC-025, SEC-026 | `services/examService.js`, `controllers/examController.js`, `controllers/progressController.js`; `examtopics-practice/src/components/QuestionItem.tsx` | http(s)-only `link`; clamp history `limit` to 1..100; string and pattern check on `code` | Main / security-reviewer |
| T2.5 | QA-004, QA-005 | `examtopics-practice/src/locales/translations/{en,ja,vi}.json`; `src/locales/locales.test.ts` (new) | Add the missing keys; add a parity test and a used-key check | Main / qa-reviewer |
| T2.6 | SEC-022, QA-006 | `examtopics-backend/index.js`, `routes/reportRoutes.js`, `test/request-controls.test.js`, `env.example` | Optional `TRUST_PROXY` (integer hop count, default off; never `true`); limiter keyed on `req.ip`; limiter factory or reset for tests | Main / security-reviewer, qa-reviewer |

| Task | Acceptance criteria | Required tests | Rollback | Prerequisites | Approval |
|---|---|---|---|---|---|
| T2.1 | The tests fail when the owner check is removed | The new test file | Delete the test file | Batch 1 | A0 |
| T2.2 | No validation path returns 200 with `success:false`; the admin UI shows the failure | Backend status/shape tests per path; `examApi` rejection tests; AdminPage error test | `git revert` | T2.1 | A0 |
| T2.3 | A non-admin cannot publish; an admin can; private exams unchanged; no schema migration | `test/exam-visibility.test.js` additions; AuthContext/AdminPage tests for `isAdmin` | `git revert`; unset `ADMIN_EMAILS` behaviour documented | **A4: option, legacy `isPublished` default, import cap.** Setting `ADMIN_EMAILS` on Render needs A2 | A0 + A4 (+ A2) |
| T2.4 | Malicious link, oversized limit and object `code` are rejected or clamped; existing data accepted | Backend tests in `exam-question-ownership`, `progress-validation`, `exam-visibility`; QuestionItem render test | `git revert` | Check existing code formats in `public/exams/exams.json` | A0 |
| T2.5 | No missing keys; the parity test passes | The new locale test | `git revert` | — | A0 |
| T2.6 | Behaviour unchanged when `TRUST_PROXY` is unset; separate buckets with it set to 1; spoofed XFF cannot escape | Rewritten `request-controls` tests | `git revert` | Hop count per environment (Render NOT VERIFIED) | A0 (+ A2 to set it on Render) |

### Batch 3: Staging readiness and architecture

| Task | Findings | Scope / files | Proposed solution | Implementer / reviewers |
|---|---|---|---|---|
| T3.1 | ARCH-001, SEC-027 | `examtopics-backend/index.js`, `utils/frontendUrl.js`, `services/authService.js`, `env.example`, `OAUTH_SETUP.md`, `OAUTH_SUMMARY.md`, `scripts/test-oauth.js`; new startup-config test | Production requires `FRONTEND_URL` and `GOOGLE_CALLBACK_URL`; CORS origins come only from configuration; remove or implement `CORS_ORIGIN` | Main / security-reviewer, aws-architect |
| T3.2 | ARCH-001 | `examtopics-practice/vite.config.mts`, `src/utils/backendUrl.ts`, `index.html` | Production build fails without the `REACT_APP_*` URLs; canonical and OG URLs come from env | Main / qa-reviewer |
| T3.3 | OPS-003 | `.github/workflows/deploy-backend.yml` | Also push the `:${{ github.sha }}` tag | Main / security-reviewer |
| T3.4 | ARCH-008, ARCH-007 | `examtopics-backend/package.json`, `package-lock.json`; delete `examtopics-backend/yarn.lock`, `examtopics-practice/yarn.lock` | `npm uninstall express-session`; remove the yarn lockfiles | Main / qa-reviewer |
| T3.5 | ARCH-005, ARCH-009, ARCH-011 | `controllers/authController.js`, `services/authSessionService.js` (or new `loginCodeService.js`), `models/User.js`, `routes/healthRoutes.js`, new `services/healthService.js` | Move queries into services; remove dead refresh-token methods (keep the field); move probe logic | Main / architecture-reviewer, qa-reviewer |
| T3.6 | ARCH-002 | `examtopics-practice/src/utils/apiClient.ts`, `src/services/examApi.ts` | Add a generic `request<T>()`; migrate `examApi` one method at a time | Main / architecture-reviewer, qa-reviewer |
| T3.7 | SEC-023, INFRA-002, INFRA-003 | `infra/terraform/staging/frontend.tf`, `registry.tf`, `tests/staging.tftest.hcl` | Custom response headers policy with CSP (Report-Only first); `scan_on_push`; test assertions | aws-architect drafts the patch; main applies / security-reviewer, qa-reviewer |
| T3.8 | ARCH-010 | `docs/` consolidation; `examtopics-practice/*_README.md`; `docs/policies/aws-deployment-approval.md:47`; `AGENTS.md` retry-tool path | Consolidate docs; correct the stale statements | Main / — |

| Task | Acceptance criteria | Required tests | Rollback | Prerequisites | Approval |
|---|---|---|---|---|---|
| T3.1 | Production startup fails clearly without the variables; only configured origins are allowed; the Render origin is not allowed on staging | New backend config/CORS tests (pattern of `auth-security.test.js` startup test) | `git revert` | **Render production sets `FRONTEND_URL` and `GOOGLE_CALLBACK_URL`** (verified by an authorized read) | A0 + A2 |
| T3.2 | A production build without the URLs fails; with them it matches today's output | A build check (CI) | `git revert` | **Render static site sets the `REACT_APP_*` URLs** | A0 + A2 |
| T3.3 | Both tags pushed; Render unchanged | First workflow run | `git revert` | T1.2 | A1 |
| T3.4 | `npm ci`, build and tests pass; no yarn usage | CI; backend smoke load | `git revert` | **Render build commands confirmed to use npm** | A0 + A2 (read) |
| T3.5 | No behaviour change | Existing auth and health tests unchanged and green | `git revert` | — | A0 |
| T3.6 | All admin API calls go through `apiClient`; same results | `examApi` tests per method; AdminPage smoke test | Revert per method | T2.2 | A0 |
| T3.7 | `terraform fmt/validate/test` pass offline; cost delta $0 | New `tftest` assertions | `git revert`; nothing deployed | T1.0 (Terraform ≥ 1.14) | A0. Any plan or apply is **A3** |
| T3.8 | No stale statements; links resolve | Link check | `git revert` | — | A0 + A4 (policy and AGENTS.md are owner-controlled) |

### Batch 4: Tests, performance and lower priority

| Task | Findings | Scope / files | Proposed solution | Implementer / reviewers |
|---|---|---|---|---|
| T4.1 | QA-002 | `examtopics-backend/test/progress-service.test.js` (new) | Write-path and `userId`-filter tests | Main / qa-reviewer |
| T4.2 | QA-003 | New tests beside `ExamPage.tsx`, `QuestionItem.tsx`, `AdminPage.tsx`, `src/hooks/useProgress.ts`, `useExams.ts`, `src/utils/apiClient.ts` | Characterization tests | Main / qa-reviewer |
| T4.3 | ARCH-006 | `AdminPage.tsx` → `src/utils/parseExamImportFile.ts`, `src/hooks/useAdminExamMutations.ts`, `useQuestionEditor.ts` | One extraction per change | Main / architecture-reviewer, qa-reviewer |
| T4.4 | ARCH-004 | `scripts/migrate-samples.js`; a migration plan doc | Stop writing `'admin'`; plan the ObjectId migration (no production run) | Main / architecture-reviewer |
| T4.5 | INFRA-001 | `infra/terraform/staging/frontend.tf` | Cache behaviours for `/exams/*` and `/img/*` with compression | aws-architect / security-reviewer |
| T4.6 | QA-006 (if not done in T2.6) | — | — | — |

| Task | Acceptance criteria | Required tests | Rollback | Prerequisites | Approval |
|---|---|---|---|---|---|
| T4.1 | The tests fail when `userId` is removed from any filter | The new test file | Delete | Batch 1 | A0 |
| T4.2 | The core flows are covered and run in CI | The new tests | Delete | T1.1 | A0 |
| T4.3 | No UI behaviour change; tests are green before and after each step | T4.2 tests | Revert per step | T4.2, T3.6 | A0 |
| T4.4 | No placeholder owner written; plan reviewed | Script test | `git revert` | T1.4, T2.3 | A0. Running any data migration needs A2 |
| T4.5 | Offline Terraform checks pass; invalidation documented | `tftest` assertion | `git revert` | T3.7 | A0. Plan or apply needs A3 |

---

## Dependency graph

```text
T1.0 ──► T1.1 ──► T1.2 ──► T3.3
  │                 └─(Render auto-deploy decision)
  ├────► T3.7 ──► T4.5
T1.3, T1.4 (independent)
T1.4 ──► T4.4
T2.1 ──► T2.2 ──► T3.6 ──► T4.3
T2.3 ──► T4.4          T4.2 ──► T4.3
T2.4, T2.5, T2.6 (independent)
T3.1, T3.2, T3.4 ──(Render configuration verified, A2)
```

## Open decisions (owner)

1. Is Render auto-deploy on push enabled? This decides whether T1.2 can gate deploys and whether Render needs changing.
2. Should git history be rewritten for SEC-018/SEC-019 (force-push)? Recommendation: no, unless the repository is public or the exam codes are sensitive.
3. What is in `examtopics.tar.gz.gpg`, and who holds the key?
4. SEC-020: which option (A recommended)? Should legacy exams without `isPublished` stay public? Should there be an import cap for non-admins?
5. Authorize a read of the Render production environment variable *names* and build commands (for T3.1, T3.2, T3.4).
6. A CSP for Render production (later; a separate production change).
