# Findings tracker

This tracker is the single consolidated inventory of security, CI/CD, architecture, QA and infrastructure findings.

- **Validated:** 2026-11-21 against HEAD `3a573db` (branch `chore/claude-project-onboarding`).
- **Method:** read-only review by the security, QA, architecture and AWS reviewer roles (`.claude/agents/`). The main agent spot-checked new claims. No commands with side effects were run, and nothing touched production, Render, MongoDB Atlas or AWS.
- **Sources:**
  - [`docs/audit/security-report.md`](../audit/security-report.md) (SEC-01…SEC-17, baseline `b19dbc6`)
  - [`docs/security-audit.md`](../security-audit.md) (AUD-*)
  - [`docs/technical-debt.md`](../technical-debt.md)
  - this validation round (marked "new")

The original evidence and references stay in the source documents. This tracker adds current locations.

Plan and sequencing: [remediation-roadmap.md](remediation-roadmap.md) · [implementation-plan.md](implementation-plan.md).

## Legend

- **Status:**
  - Open
  - Closed: fixed and verified in code, or confirmed by the owner
  - Accepted: an accepted residual risk
  - False positive
- **Confidence:**
  - High: confirmed in current code
  - Medium: partly inferred
  - Low: needs live verification
- **Complexity:** S (≤ ½ day), M (1–2 days), L (> 2 days).
- **Regression risk:** Low / Medium / High.

## Summary

| ID | Source | Category | Severity | Confidence | Status | Title |
|---|---|---|---|---|---|---|
| SEC-001…SEC-017 | SEC-01…SEC-17 | Security | High–Low | High | Closed (SEC-010 Accepted) | Previous audit findings; see [Closed findings](#closed-and-accepted-findings) |
| OPS-001 | AUD-H1 | CI/CD | **High** | High | Open | No automated tests gate production deploys |
| OPS-002 | AUD-H2 | Data | High | Owner-confirmed | Closed | SEC-04 ownership backfill vs auto-deploy |
| OPS-003 | AUD-M4 | CI/CD | Medium | High | Open | Backend image tagged only `:latest` |
| SEC-018 | AUD-M1 | Data exposure | Medium | High | Open | Ownership manifest tracked in git |
| SEC-019 | AUD-M2 | Data exposure | Medium | Medium | Open | Encrypted archive tracked in git |
| SEC-020 | AUD-M3 | Authorization | Medium | High | Open | Any authenticated user can publish exams |
| SEC-021 | AUD-M5 | Data safety | Medium | High | Open | Database scripts have no target guard |
| SEC-022 | AUD-L2 | Availability | Low | High | Open | Report limiter not proxy-aware, with a single global bucket |
| SEC-023 | AUD-L3 | Hardening | Low | High | Open | No Content-Security-Policy |
| SEC-024 | new | Input validation | Low | High | Open | `question.link` scheme not validated |
| SEC-025 | new | Resource use | Low | High | Open | Unbounded `limit` on history endpoints |
| SEC-026 | new | Input validation | Low | High | Open | `code` body field not type-checked on create |
| SEC-027 | new | Configuration | Low | High | Open | Production CORS list always includes the Render origin |
| ARCH-001 | AUD-L1 / debt | Configuration | Low | High | Open | Hardcoded Render URLs and `env.example` drift |
| ARCH-002 | new | Duplication | Low | High | Open | `examApi.ts` duplicates the HTTP client |
| ARCH-003 | new | Correctness | Medium | High | Open | Errors returned as HTTP 200 `success:false`; frontend swallows them |
| ARCH-004 | new | Data model | Low | High | Open | `Exam.createdBy` stored as String; `'admin'` placeholder |
| ARCH-005 | new | Layering | Low | High | Open | `authController` queries models directly |
| ARCH-006 | debt | Maintainability | Low | High | Open | Oversized `AdminPage.tsx` / `ExamPage.tsx` |
| ARCH-007 | debt | Build | Low | High | Open | Duplicate npm/yarn lockfiles |
| ARCH-008 | AUD-L4 / debt | Dependency | Low | High | Open | Unused `express-session` dependency |
| ARCH-009 | new | Dead code | Low | High | Open | Unused `User.refreshTokens` methods |
| ARCH-010 | debt | Documentation | Low | High | Open | Overlapping docs and a stale policy statement |
| ARCH-011 | new | Layering | Low | High | Open | Health probe cache logic lives in the route file |
| QA-001 | new | Test gap | Medium | High | Open | No tests for exam ownership transfer |
| QA-002 | new | Test gap | Medium | High | Open | Progress write paths and user scoping untested |
| QA-003 | new | Test gap | Medium | High | Open | Core frontend flows untested |
| QA-004 | new | Bug | Low | High | Open | Missing translation keys shown raw to users |
| QA-005 | new | Test gap | Low | High | Open | No locale key-parity test |
| QA-006 | new | Test fragility | Low | High | Open | Limiter test relies on shared module state |
| QA-007 | AUD-M6 | Tooling | Medium | High | Open | Local toolchain mismatch blocks quality gates |
| INFRA-001 | new | Cost/performance | Low | High | Open | CloudFront caching disabled for static exam data |
| INFRA-002 | new | Supply chain | Low | High | Open | ECR image scanning on push not enabled |
| INFRA-003 | new | Test gap | Low | High | Open | Terraform tests miss key assertions |
| FP-001 | new | Dead code | — | High | False positive | Suspected unused frontend utilities are in use |

Duplicates and related groups:
- ARCH-001 and SEC-027 share one fix: env-driven origins.
- SEC-021 contains the missing migration-script tests.
- SEC-023 and INFRA-003 overlap on the CloudFront policy and its assertion.
- AUD-L4 is the same issue as debt item "unused dependency" (ARCH-008).

---

## Open findings

### OPS-001: No automated tests gate production deploys
- **Category / Severity / Confidence:** CI/CD / High / High
- **Affected:** `.github/workflows/deploy-backend.yml:3-49`, `.github/workflows/deploy.yml:3-27`. Both backend and frontend are affected.
- **Root cause:** The deploy workflows trigger on `master` pushes and have no test job. No PR or push test workflow exists.
- **Impact:** A failing or regressing change merged to `master` goes straight to Render production.
- **Likelihood:** High. Every merge touching an application directory deploys.
- **Remediation:**
  1. Add a test workflow with no secrets (backend, frontend, Go, Python, Terraform offline).
  2. Then make deploys depend on it (`needs:` or `workflow_run` with success).
- **Dependencies:** Whether Render auto-deploy-on-push is enabled is NOT VERIFIED. If it is, the GitHub gate cannot block deploys.
- **Complexity / Regression risk:** S / Low for adding the test workflow; Medium for gating the deploys.
- **Verification:**
  - A PR with a failing test shows a red check.
  - A deliberately failing test on a branch never reaches a deploy step.
  - The test jobs receive no secrets.

### OPS-002: SEC-04 ownership backfill vs auto-deploy (Closed)
- **Status:** Closed on 2026-11-21. The repository owner confirmed the backfill ran before Render deployed the ownership code. This was not independently verified.

### OPS-003: Backend image tagged only `:latest`
- **Category / Severity / Confidence:** CI/CD / Medium / High
- **Affected:** `.github/workflows/deploy-backend.yml:37`
- **Root cause:** A single mutable tag.
- **Impact:** No immutable record of what was deployed. Rollback depends on Render's history.
- **Likelihood:** Only matters during incident or rollback.
- **Remediation:** Also push `:${{ github.sha }}`. Keep `:latest` so Render keeps working. For ECR staging, use `api-<full sha>`, because `registry.tf:3` makes tags immutable and lifecycle rules match the `api-` prefix.
- **Dependencies:** OPS-001 (workflow edits are batched).
- **Complexity / Regression risk:** S / Low
- **Verification:** The next run shows both tags in Docker Hub, and the Render deploy succeeds unchanged.

### SEC-018: Ownership manifest tracked in git
- **Category / Severity / Confidence:** Data exposure / Medium / High
- **Affected:** `examtopics-backend/verified-question-ownership.json` (tracked, commit `1a32cc9`; 9,944 entries of exam/question ObjectIds and exam codes). Excluded from the image by `.dockerignore`.
- **Root cause:** The runbook output was committed, against `docs/audit/sec-04-question-ownership.md:30`, and no ignore rule covers it.
- **Impact:** Internal database identifiers and possibly private exam codes are visible to anyone with repository read access.
- **Likelihood:** Depends on who can read the repository (NOT VERIFIED whether it is public).
- **Remediation:** Archive a copy securely outside the repository, `git rm --cached`, and add `verified-question-ownership*.json` to `examtopics-backend/.gitignore`. Whether to rewrite history is a separate decision.
- **Dependencies:** Owner decision on rewriting history.
- **Complexity / Regression risk:** S / Low. No code reads it; the backfill takes the path as an argument.
- **Verification:**
  - `git ls-files` no longer lists the file.
  - `git check-ignore` matches it.
  - Backend tests pass.

### SEC-019: Encrypted archive tracked in git
- **Category / Severity / Confidence:** Data exposure / Medium / Medium (contents unknown)
- **Affected:** `examtopics-backend/examtopics.tar.gz.gpg` (tracked, commit `843e2d1`). The `*.tar.gz` rule (`examtopics-backend/.gitignore:67`) does not match `.gpg`. Excluded from the image.
- **Root cause:** No ignore rule for encrypted archives, and a likely database dump was committed.
- **Impact:** Exposure depends on the encryption key staying secret. The contents and how the key is held are NOT VERIFIED.
- **Likelihood:** Low while the key stays private.
- **Remediation:** Owner confirms the contents and key handling. Then `git rm --cached` and add `*.gpg` (or a specific pattern) to `.gitignore`. Same history decision as SEC-018.
- **Dependencies:** Owner input.
- **Complexity / Regression risk:** S / Low
- **Verification:** Same as SEC-018.

### SEC-020: Any authenticated user can publish exams
- **Category / Severity / Confidence:** Authorization / Medium / High
- **Affected:**
  - `examtopics-backend/routes/examRoutes.js:22-23`
  - `services/examService.js:196` (`isPublished` taken from the client)
  - `services/examService.js:21-32` (published exams, and legacy exams without the field, are readable by all)
  - `models/User.js` (no role)
- **Root cause:** No publish authorization model. The code comment at `examRoutes.js:9-10` acknowledges this.
- **Impact:** Any Google account can publish spam or phishing links to all visitors and use imports of up to 25 MB.
- **Likelihood:** Medium. Requires only a Google login.
- **Remediation:**
  - Recommended (option A): an `ADMIN_EMAILS` env allowlist. Only allowlisted users may set `isPublished: true` on create and update. Others can still create private exams.
  - Optional: a lower import cap for non-admins.
  - The frontend hides the publish toggle when the session lacks `isAdmin`.
- **Dependencies:** Product decision (option A/B/C), the default for legacy exams without `isPublished`, and the import cap.
- **Complexity / Regression risk:** M / Medium. Existing authors lose the ability to self-publish.
- **Verification:**
  - In `test/exam-visibility.test.js`, a non-admin publish on create or update is stored as unpublished (or returns 403).
  - An admin publish succeeds.
  - Private visibility is unchanged.

### SEC-021: Database scripts have no target guard
- **Category / Severity / Confidence:** Data safety / Medium / High
- **Affected:**
  - `examtopics-backend/scripts/migrate-samples.js:14-47`: deletes and recreates exams.
  - `scripts/migrate-progress.js:9`: silently falls back to localhost.
  - `scripts/migrate-exam-visibility.js:6-10`.
  - `scripts/backfill-question-ownership.js:142-145`: has a dry-run default but no target check.
  - `scripts/export-question-ownership.js`.
- **Root cause:** The scripts trust whatever `MONGO_URI` is configured.
- **Impact:** An operator or agent error can overwrite or delete MongoDB Atlas data.
- **Likelihood:** Low to medium. Requires running a script with a production `.env`.
- **Remediation:** Add a shared `scripts/lib/targetGuard.js`, called before connecting:
  1. Require an explicit `MONGO_URI`.
  2. Print the target with credentials redacted.
  3. Write scripts default to a dry run unless `--apply` is passed.
  4. A non-loopback or `mongodb+srv` target requires `--target=<host>/<db>` matching the URI.
  5. Refuse when `NODE_ENV=production` unless `ALLOW_REMOTE_MIGRATION=1`.
  6. Exit non-zero on any mismatch.
- **Dependencies:** None. Document the new flags in `examtopics-backend/README.md`.
- **Complexity / Regression risk:** S / Low. Operators must add flags.
- **Verification:**
  - Using the `test/migrate-samples-config.test.js` spawn pattern for each script: a mismatched or missing target makes zero connection attempts and exits 1.
  - A matching target connects once.
  - The output never prints the password.

### SEC-022: Report limiter not proxy-aware, with a single global bucket
- **Category / Severity / Confidence:** Availability / Low / High
- **Affected:** `examtopics-backend/routes/reportRoutes.js:8,20,22`. `trust proxy` is not set anywhere.
- **Root cause:** The limiter keys on `req.socket.remoteAddress`, and `PROCESS_LIMIT` (30/min) is shared by all clients.
- **Impact:**
  - Behind Render or Caddy, all users share one 5/min bucket.
  - One client can use up the 30/min global cap.
  - This is already documented at `README.md:143`.
- **Likelihood:** High on staging (Caddy on the Docker bridge); NOT VERIFIED on Render.
- **Remediation:**
  - `app.set('trust proxy', Number(process.env.TRUST_PROXY))` only when set: `1` on staging, unset by default and on Render until the hop count is verified. Never use `true`.
  - Key the limiter on `req.ip`.
  - Optionally raise or split the global cap.
- **Dependencies:** Proxy hop count per environment.
- **Complexity / Regression risk:** S / Medium. A wrong hop count allows spoofed IPs.
- **Verification:**
  - In `test/request-controls.test.js`, the existing test `:95-96` is rewritten.
  - With trust 1, different client IPs get separate buckets.
  - A spoofed leftmost `X-Forwarded-For` entry does not escape the limit.
  - With trust unset, forwarded headers are ignored.

### SEC-023: No Content-Security-Policy
- **Category / Severity / Confidence:** Hardening / Low / High
- **Affected:**
  - `examtopics-practice/index.html` and `public/_redirects` (Render production).
  - `infra/terraform/staging/frontend.tf:94,109` (managed `SecurityHeadersPolicy`, no CSP).
- **Root cause:** No CSP is defined at either host.
- **Impact:** Any future XSS would have more impact, because the access token is in memory.
- **Likelihood:** Low; there is no current XSS (SEC-001 is fixed).
- **Remediation:** Staging gets a custom `aws_cloudfront_response_headers_policy` with this CSP:
  - `default-src 'self'`
  - `script-src 'self'`
  - `style-src 'self' 'unsafe-inline'`
  - `img-src 'self' data: https:` (admin-authored images can be any https URL)
  - `connect-src 'self' https://<api host>`
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`

  Start as Report-Only. Setting a CSP on Render production is a separate change.
- **Dependencies:** INFRA-003 (test assertion); staging deployment approval.
- **Complexity / Regression risk:** M / Medium. Possible blocked resources.
- **Verification:**
  - `terraform test` asserts the CSP.
  - The staging browser console shows no violations for login, exam, images and admin pages before switching from Report-Only.

### SEC-024: `question.link` scheme not validated
- **Category / Severity / Confidence:** Input validation / Low / High
- **Affected:** `examtopics-backend/services/examService.js:336-338`; `examtopics-practice/src/components/QuestionItem.tsx:330-338`
- **Root cause:** The link is stored and rendered as `href` without checking the scheme.
- **Impact:** Defense-in-depth only; React 19 blocks `javascript:` URLs.
- **Likelihood:** Low.
- **Remediation:** Accept only `http:`/`https:` on update and import, and check again before rendering.
- **Dependencies:** None.
- **Complexity / Regression risk:** S / Low
- **Verification:** A backend test rejects or blanks a `javascript:` link, and a frontend test confirms it is not rendered as a link.

### SEC-025: Unbounded `limit` on history endpoints
- **Category / Severity / Confidence:** Resource use / Low / High
- **Affected:** `examtopics-backend/controllers/progressController.js:206-209,222-225`
- **Root cause:** `parseInt(limit)` has no clamp.
- **Impact:** A user can trigger heavy queries on their own data.
- **Likelihood:** Low.
- **Remediation:** Clamp to 1..100 and reject non-integers.
- **Dependencies:** Confirm the frontend uses ≤ 100.
- **Complexity / Regression risk:** S / Low
- **Verification:** In `test/progress-validation.test.js`, `limit=1e9` is clamped and `limit=abc` is rejected or defaulted.

### SEC-026: `code` body field not type-checked on create
- **Category / Severity / Confidence:** Input validation / Low / High
- **Affected:** `examtopics-backend/controllers/examController.js:41-47,154`; `services/examService.js:180-183`
- **Root cause:** A non-string `code` reaches `Exam.findOne({ code })`.
- **Impact:** A false "duplicate" response or a cast error; nothing is disclosed.
- **Likelihood:** Low.
- **Remediation:** Require `typeof code === 'string'` and a bounded safe pattern.
- **Dependencies:** Check the existing code formats in data before choosing the pattern.
- **Complexity / Regression risk:** S / Low to medium (an existing unusual code could be rejected).
- **Verification:** `code: {"$ne": null}` returns 400, and existing code formats from `public/exams/exams.json` are accepted.

### SEC-027: Production CORS list always includes the Render origin
- **Category / Severity / Confidence:** Configuration / Low / High
- **Affected:** `examtopics-backend/index.js:25-27`
- **Root cause:** A hardcoded origin is added whenever `NODE_ENV=production`, which includes AWS staging.
- **Impact:** The staging API would accept credentialed requests from the Render production frontend. CHIPS partitioning limits cookie reuse, but the environments are not cleanly separated.
- **Likelihood:** Only once staging runs.
- **Remediation:** Build the origin list from `FRONTEND_URL` (plus localhost outside production) only. Either implement or remove `CORS_ORIGIN`.
- **Dependencies:** ARCH-001. Render production must set `FRONTEND_URL` (NOT VERIFIED).
- **Complexity / Regression risk:** S / Medium
- **Verification:** A test shows that with `NODE_ENV=production` and a staging `FRONTEND_URL`, the Render origin is rejected and the configured origin is allowed.

### ARCH-001: Hardcoded Render URLs and `env.example` drift
- **Category / Severity / Confidence:** Configuration / Low (blocks staging) / High
- **Affected:**
  - Backend: `examtopics-backend/utils/frontendUrl.js:2-4`, `services/authService.js:22`, `scripts/test-oauth.js:20-22`, `env.example:35` (`CORS_ORIGIN` unused; `GOOGLE_CALLBACK_URL` missing).
  - Backend docs: `OAUTH_SETUP.md:60,85,128`, `OAUTH_SUMMARY.md:47,183`.
  - Frontend: `examtopics-practice/src/utils/backendUrl.ts:11,28`; `index.html:8,43-71,95` (a third hostname).
- **Root cause:** Production defaults are compiled in instead of required configuration.
- **Impact:** AWS staging would call Render production, and the OAuth callback would point at the wrong host.
- **Likelihood:** Certain for staging; none today on Render.
- **Remediation:**
  - In production, require `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` with a startup check (same pattern as `utils/authSecrets.js`).
  - Fail the production frontend build when the `REACT_APP_*` URLs are empty.
  - Template the canonical and OG URLs.
  - Align `env.example` and the OAuth docs.
- **Dependencies:** Render production must already set `REACT_APP_BACKEND_URL`, `REACT_APP_FRONTEND_URL`, `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` (NOT VERIFIED; needs authorized read).
- **Complexity / Regression risk:** S / **High**. A missing variable breaks login in production.
- **Verification:**
  - Production startup without `FRONTEND_URL` fails fast (test).
  - A production build without `REACT_APP_BACKEND_URL` fails.
  - The configured URLs are used.

### ARCH-002: `examApi.ts` duplicates the HTTP client
- **Category / Severity / Confidence:** Duplication / Low / High
- **Affected:** `examtopics-practice/src/services/examApi.ts:8-182`, which has its own base URL, auth headers and 12 raw `fetch` calls, bypassing `src/utils/apiClient.ts` and `networkService`.
- **Root cause:** It grew separately.
- **Impact:** Auth renewal, offline handling and error mapping behave inconsistently in admin flows.
- **Likelihood:** Already present.
- **Remediation:** Add a generic `apiClient.request<T>()` and move one method at a time.
- **Dependencies:** ARCH-003 (error contract) first.
- **Complexity / Regression risk:** M / Medium
- **Verification:** `examApi` unit tests with stubbed fetch for success, 401 renewal and error mapping; AdminPage smoke test.

### ARCH-003: Errors returned as HTTP 200 `success:false`; frontend swallows them
- **Category / Severity / Confidence:** Correctness / Medium / High
- **Affected:** `examtopics-backend/controllers/examController.js:147,156,164,181` (200 plus `message`) vs `:151,173` (400 plus `error`); `examtopics-practice/src/services/examApi.ts:176-178` (returns `data.exam`, which is undefined, without error).
- **Root cause:** Inconsistent error contract.
- **Impact:** A failed import or update can look successful in the admin UI. Monitoring cannot see the failures.
- **Likelihood:** Whenever validation fails or a code is a duplicate.
- **Remediation:** Return 400 or 409 with `error` consistently. Make `examApi` throw on `!res.ok || !success`. Review AdminPage's success checks.
- **Dependencies:** AdminPage behaviour review.
- **Complexity / Regression risk:** S / Medium
- **Verification:**
  - Backend contract tests assert status codes and the `error` field for each validation path.
  - Frontend tests assert that `examApi` rejects and AdminPage shows the error.

### ARCH-004: `Exam.createdBy` stored as String; `'admin'` placeholder
- **Category / Severity / Confidence:** Data model / Low / High
- **Affected:** `examtopics-backend/models/Exam.js:44-46`; `services/examService.js:127,150,216` (string comparisons); `scripts/migrate-samples.js:62` (`'admin'`).
- **Root cause:** Legacy schema.
- **Impact:** Weak referential integrity. Sample exams are owned by no real user.
- **Likelihood:** Already present.
- **Remediation:** Stop writing `'admin'` and write a migration plan to ObjectId. Do not migrate production data without separate approval.
- **Dependencies:** SEC-021 (guarded scripts) and SEC-020 (admin model).
- **Complexity / Regression risk:** M / Medium
- **Verification:** Owner checks pass for both string and ObjectId values during the transition, and a migration dry run against fixtures.

### ARCH-005: `authController` queries models directly
- **Category / Severity / Confidence:** Layering / Low / High
- **Affected:** `examtopics-backend/controllers/authController.js:4-5,38,51,66,71` (`User`, `OAuthLoginCode`).
- **Root cause:** Exam and progress go through services; auth does not.
- **Impact:** Inconsistent layering and harder testing.
- **Likelihood:** —
- **Remediation:** Move the queries into `authSessionService` or a new `loginCodeService`.
- **Dependencies:** None.
- **Complexity / Regression risk:** S / Low (`test/auth-security.test.js` covers it).
- **Verification:** All auth tests pass unchanged.

### ARCH-006: Oversized `AdminPage.tsx` / `ExamPage.tsx`
- **Category / Severity / Confidence:** Maintainability / Low / High
- **Affected:** `examtopics-practice/src/components/AdminPage.tsx` (1,321 lines; handles metadata, form, file parsing `:156,411`, question edit `:289,325`, CRUD `:439-496`, transfer `:520`); `ExamPage.tsx` (703 lines).
- **Root cause:** Features accumulated in one component.
- **Impact:** High change cost; no tests (QA-003).
- **Likelihood:** —
- **Remediation:** Extract `parseExamImportFile`, `useAdminExamMutations` and `useQuestionEditor` one at a time, after tests exist.
- **Dependencies:** QA-003, ARCH-002, ARCH-003.
- **Complexity / Regression risk:** M / Medium
- **Verification:** Characterization tests pass before and after each extraction.

### ARCH-007: Duplicate npm/yarn lockfiles
- **Category / Severity / Confidence:** Build / Low / High
- **Affected:** `yarn.lock` and `package-lock.json` in `examtopics-backend/` and `examtopics-practice/`.
- **Root cause:** Both tools have been used. The Dockerfile and docs use npm.
- **Impact:** Unclear which dependency set is resolved. Render may auto-detect yarn.
- **Likelihood:** Depends on the Render build command (NOT VERIFIED).
- **Remediation:** Delete both `yarn.lock` files after confirming the Render build commands use npm.
- **Dependencies:** Authorized read of Render build settings.
- **Complexity / Regression risk:** S / Medium until Render is confirmed, then Low.
- **Verification:** CI `npm ci`, build and test pass, and the next Render build log shows npm.

### ARCH-008: Unused `express-session` dependency
- **Category / Severity / Confidence:** Dependency / Low / High
- **Affected:** `examtopics-backend/package.json:27`. There is no `require`/import anywhere.
- **Root cause:** Left over from before the session redesign.
- **Impact:** Unneeded attack surface and install weight.
- **Likelihood:** —
- **Remediation:** `npm uninstall express-session` to update `package-lock.json`.
- **Dependencies:** QA-007 (correct Node for `npm`).
- **Complexity / Regression risk:** S / Low
- **Verification:** `npm ci && npm test` and a `node -e "require('./index')"` smoke load.

### ARCH-009: Unused `User.refreshTokens` methods
- **Category / Severity / Confidence:** Dead code / Low / High
- **Affected:** `examtopics-backend/models/User.js:30-40,100-113`
- **Root cause:** Refresh tokens were replaced by server-side sessions (SEC-003).
- **Impact:** Confusing code that suggests a dead auth path is live.
- **Likelihood:** —
- **Remediation:** Remove the methods and keep the schema field so stored data stays compatible.
- **Dependencies:** None.
- **Complexity / Regression risk:** S / Low
- **Verification:** grep shows no references, and backend tests pass.

### ARCH-010: Overlapping docs and a stale policy statement
- **Category / Severity / Confidence:** Documentation / Low / High
- **Affected:**
  - Eight overlapping READMEs and summaries in `examtopics-practice/`.
  - `examtopics-backend/OAUTH_SETUP.md` and `OAUTH_SUMMARY.md`.
  - `docs/policies/aws-deployment-approval.md:47`, which says no Terraform configuration exists.
  - `AGENTS.md` lists `examtopics-retry-dl/` at the root.
- **Root cause:** Docs were not updated alongside changes.
- **Impact:** Misleading guidance for people and agents.
- **Likelihood:** —
- **Remediation:** Consolidate into `docs/`. Update the policy wording and the AGENTS.md path; both are owner-controlled.
- **Dependencies:** Owner approval for the policy and AGENTS.md edits.
- **Complexity / Regression risk:** S / None
- **Verification:** Link check, and no stale statements remain.

### ARCH-011: Health probe cache logic lives in the route file
- **Category / Severity / Confidence:** Layering / Low / High
- **Affected:** `examtopics-backend/routes/healthRoutes.js:9-40`
- **Remediation:** Move it to `services/healthService.js` when the file is next touched.
- **Complexity / Regression risk:** S / Low.
- **Verification:** `test/health-routes.test.js` passes.

### QA-001: No tests for exam ownership transfer
- **Category / Severity / Confidence:** Test gap / Medium / High
- **Affected:** `PUT /api/exams/:code/owner` (`examtopics-backend/routes/examRoutes.js:24`, `services/examService.js:125-145`). Nothing in `test/` references `transferExamOwnership`.
- **Root cause:** Added without tests.
- **Impact:** A regression in an authorization-sensitive write would go unnoticed.
- **Likelihood:** Medium on future changes.
- **Remediation:** Add tests:
  - The owner can transfer.
  - A non-owner gets 403.
  - An unknown target user is rejected.
  - After transfer, the old owner cannot edit (SEC-007).
- **Dependencies:** None.
- **Complexity / Regression risk:** S / None (tests only).
- **Verification:** The new tests fail when the owner check is removed and pass otherwise.

### QA-002: Progress write paths and user scoping untested
- **Category / Severity / Confidence:** Test gap / Medium / High
- **Affected:** `examtopics-backend/routes/progressRoutes.js`. Save, answer, submit, reset, history, completed-exam-ids and daily-tracking have no happy-path tests. Query `userId` filters are not asserted.
- **Remediation:** Add service-level tests that check the filter includes `userId` and the stored shape is correct.
- **Complexity / Regression risk:** M / None.
- **Verification:** The tests fail if `userId` is dropped from a filter.

### QA-003: Core frontend flows untested
- **Category / Severity / Confidence:** Test gap / Medium / High
- **Affected:** `ExamPage.tsx`, `QuestionItem.tsx`, `AdminPage.tsx`, `src/hooks/useProgress.ts`, `useExams.ts`, `src/utils/apiClient.ts`. None has direct tests.
- **Remediation:** Add Vitest and Testing Library tests:
  - Answer selection and correctness display.
  - Submit.
  - Progress persistence.
  - `apiClient` 401 and error mapping.
  - AdminPage import, edit and delete.
- **Dependencies:** Needed before ARCH-006.
- **Complexity / Regression risk:** L / None.
- **Verification:** The tests run in CI (OPS-001).

### QA-004: Missing translation keys shown raw to users
- **Category / Severity / Confidence:** Bug / Low / High (verified)
- **Affected:** `examtopics-practice/src/components/ExamPage.tsx:394` (`errorLoadingQuestions`) and `AdminPage.tsx:810` (`untitled`). Neither key exists in `src/locales/translations/{en,ja,vi}.json`. The fallback at `src/locales/index.ts:19` shows the key itself.
- **Remediation:** Add both keys to all three locales.
- **Complexity / Regression risk:** S / None.
- **Verification:** The QA-005 test passes, and the UI shows translated text.

### QA-005: No locale key-parity test
- **Category / Severity / Confidence:** Test gap / Low / High
- **Affected:** `examtopics-practice/src/locales/translations/*.json`. Each has 234 keys with identical sets today, but nothing enforces it.
- **Remediation:** Add a Vitest test that compares the flattened key sets and checks every `t('…')` literal against `en.json`.
- **Complexity / Regression risk:** S / None.
- **Verification:** The test fails on the current tree until QA-004 is fixed.

### QA-006: Limiter test relies on shared module state
- **Category / Severity / Confidence:** Test fragility / Low / High
- **Affected:** `examtopics-backend/test/request-controls.test.js:87-104`, which uses the module-level state in `routes/reportRoutes.js`.
- **Remediation:** Export a test-only reset or a limiter factory. Do this together with SEC-022.
- **Complexity / Regression risk:** S / Low.
- **Verification:** The tests pass in any order.

### QA-007: Local toolchain mismatch blocks quality gates
- **Category / Severity / Confidence:** Tooling / Medium / High
- **Affected:** Workstation: Node v24.19.0 vs required 26.12.1; Terraform 1.10.2 vs ≥ 1.14; Go not installed; `node_modules` absent.
- **Impact:** None of the quality gates can be run or verified locally.
- **Remediation:**
  1. `nvm install && nvm use`.
  2. `npm ci` in both Node projects.
  3. Install Go 1.27.4 and Terraform ≥ 1.14.
- **Dependencies:** Installs are side effects, so the owner performs or approves them.
- **Complexity / Regression risk:** S / None.
- **Verification:** All gates in `docs/development.md` run, and the results are recorded.

### INFRA-001: CloudFront caching disabled for static exam data
- **Category / Severity / Confidence:** Cost/performance / Low / High
- **Affected:** `infra/terraform/staging/frontend.tf:93` (`CachingDisabled`, no `compress`). About 60 MB of `/exams/*` and `/img/*` is served uncached and uncompressed.
- **Remediation:** Add an `ordered_cache_behavior` for `/exams/*` and `/img/*` with `CachingOptimized` and `compress = true`, plus invalidation on publish.
- **Dependencies:** A design decision on publish semantics; staging apply approval.
- **Complexity / Regression risk:** S / Medium (stale content).
- **Verification:** `terraform test` assertion; staging cache-hit headers.

### INFRA-002: ECR image scanning on push not enabled
- **Category / Severity / Confidence:** Supply chain / Low / High
- **Affected:** `infra/terraform/staging/registry.tf:1-8`
- **Remediation:** Add `image_scanning_configuration { scan_on_push = true }` (basic scanning, $0).
- **Complexity / Regression risk:** S / Low.
- **Verification:** A `terraform test` assertion.

### INFRA-003: Terraform tests miss key assertions
- **Category / Severity / Confidence:** Test gap / Low / High
- **Affected:** `infra/terraform/staging/tests/staging.tftest.hcl`. There are no assertions for the response headers policy, `IMMUTABLE` ECR tags, or scanning.
- **Remediation:** Add assertions together with SEC-023 and INFRA-002.
- **Complexity / Regression risk:** S / None.
- **Verification:** `terraform test` passes with mock provider.

### FP-001: Suspected unused frontend utilities (False positive)
- `src/utils/migration.ts` is used by `useProgress.ts:6`.
- `legacyCacheCleanup.ts` and `autoFix.ts` are used by `src/index.tsx:6-7`.
- `src/services/networkService.ts` is used by `apiClient.ts:1` and `OfflineIndicator.tsx:3`.
- No action. `autoFix` and `legacyCacheCleanup` can be retired later as one-off shims.

---

## Closed and accepted findings

Validated on 2026-11-21 against current code. The original evidence is in [`docs/audit/security-report.md`](../audit/security-report.md).

| ID | Original | Status | Current evidence | Not verified |
|---|---|---|---|---|
| SEC-001 | SEC-01 stored XSS | Closed | `examtopics-practice/src/components/QuestionContent.tsx:5-39`; no `dangerouslySetInnerHTML` in `src/` | — |
| SEC-002 | SEC-02 JWT fallback key | Closed | `examtopics-backend/utils/authSecrets.js:17-26`; `services/authService.js:12-13` | Distinct secrets per environment |
| SEC-003 | SEC-03 unbounded renewal | Closed | `routes/authRoutes.js:34-38`; `services/authService.js:48-80`; `config/auth.js`; `services/authSessionService.js:37-52` | — |
| SEC-004 | SEC-04 question ownership | Closed | `models/Question.js:4-10`; `services/examService.js:154,227,254,269,302,368`; backfill confirmed by owner (OPS-002) | — |
| SEC-005 | SEC-05 OAuth state | Closed | `utils/oauthStateStore.js:6-42`; `services/authService.js:35` | Live staging login |
| SEC-006 | SEC-06 token in URL/storage | Closed | `controllers/authController.js:49-77`; `examtopics-practice/src/utils/loginExchange.ts:17-19` | CHIPS on target browsers |
| SEC-007 | SEC-07 transfer race | Closed | `services/examService.js:97-104,222-256,364-372` | Production transaction support |
| SEC-008 | SEC-08 request controls | Closed | `routes/reportRoutes.js:13-32`; `controllers/reportController.js:8-34`; `routes/examRoutes.js:5,22-23`; `routes/healthRoutes.js:9-63` | — |
| SEC-009 | SEC-09 Docker context | Closed | `examtopics-backend/.dockerignore:2-12` | Image build |
| SEC-010 | SEC-10 mutable actions / ungated deploys | **Accepted** | `deploy-backend.yml:11,22-33`; `deploy.yml:11` | Branch and environment protections |
| SEC-011 | SEC-11 Go `x/net` | Closed | `examtopics-downloader/go.mod:3,18`; `Dockerfile:2` | — |
| SEC-012 | SEC-12 Compose exposure | Closed | `examtopics-backend/docker-compose.yml:7-11`; `scripts/migrate-samples.js:14-18` | — |
| SEC-013 | SEC-13 path traversal | Closed | `examtopics-img-downloader/download_images.py:121-185` | — |
| SEC-014 | SEC-14 progress input | Closed | `controllers/progressController.js:4-36`; `services/progressService.js` | — |
| SEC-015 | SEC-15 Python Requests | Closed | `requests==2.34.2` in the three `requirements.txt` files | — |
| SEC-016 | SEC-16 raw errors | Closed (runtime) | `utils/requestFailure.js:1-9`; `middleware/errorHandler.js` | Scripts still log raw errors (covered by SEC-021 work) |
| SEC-017 | SEC-17 minimatch | Closed | `examtopics-backend/package.json:8`; lockfile | — |
