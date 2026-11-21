# Security audit index

This page is the entry point for security status. Detailed findings SEC-01 … SEC-17 (reviewed 2026-11-15 against `b19dbc6`) and how each was handled are in [`docs/audit/security-report.md`](audit/security-report.md). Related runbooks: [SEC-04 ownership cutover](audit/sec-04-question-ownership.md) and [SEC-07 transactions](audit/sec-07-exam-mutations.md).

> **Current status:** the consolidated, re-validated inventory (2026-11-21, HEAD `3a573db`) is [`docs/remediation/findings-tracker.md`](remediation/findings-tracker.md). It gives every item a new ID (SEC-0xx, OPS-, ARCH-, QA-, INFRA-), and that tracker supersedes the status columns below. Remediation sequencing: [`remediation-roadmap.md`](remediation/remediation-roadmap.md), [`implementation-plan.md`](remediation/implementation-plan.md).

## Status of SEC findings (from the detailed report)

- **Patched locally:** SEC-01, 02, 03, 04, 05, 06, 07, 08, 09 (mitigated), 11, 12, 13, 14, 15, 16, 17.
- **Accepted residual risk:** SEC-10. Actions use mutable tags, and Render deploys on `master` push without an environment gate. The repository owner chose this.
- **Deployment and production verification:** NOT VERIFIED for every item. See "Open verifications".

## Additional findings (repository review 2026-11-21, base `ee98f68`)

No Critical issue was confirmed.

| ID | Severity | Finding | Evidence | Recommended action |
|---|---|---|---|---|
| AUD-H1 | High | No automated tests gate production deploys. No workflow runs tests on PRs, `deploy-backend.yml` builds and deploys without `npm test`, and `deploy.yml` deploys with no build or test. | `.github/workflows/deploy-backend.yml:3-49`, `.github/workflows/deploy.yml:3-27` | Add a test workflow with no secrets for PRs and pushes, and make deploy jobs depend on it (`needs:`). Workflow change needs approval. |
| AUD-H2 | ~~High (conditional)~~ **Closed** | The SEC-04 ownership code is on `master`, which auto-deploys. **Closed 2026-11-21:** the owner confirmed the backfill ran before Render deployed the code (not independently verified). Tracked as OPS-002. | `docs/audit/sec-04-question-ownership.md:3-5`; commit `529a92d` in `master` history | None. |
| AUD-M1 | Medium | The SEC-04 ownership manifest is committed: 9,944 entries of exam/question ObjectIds and exam codes, possibly including private exam codes. This goes against the runbook. | `examtopics-backend/verified-question-ownership.json` (commit `1a32cc9`); `docs/audit/sec-04-question-ownership.md:30` | Remove it from the repo and add it to `.gitignore`. Decide whether history needs cleaning. |
| AUD-M2 | Medium | An encrypted archive with unverified contents (possibly a database dump) is committed. | `examtopics-backend/examtopics.tar.gz.gpg` (commit `843e2d1`) | Confirm the contents and how the key is managed, then move it out of git. |
| AUD-M3 | Medium | Any authenticated Google user can create and publish exams visible to everyone. There is no admin or moderation role, and imports can be up to 25 MB. | `examtopics-backend/routes/examRoutes.js:9-26`; `services/examService.js:195-196` | Decide the publishing policy (admin role, review queue or quotas). |
| AUD-M4 | Medium | The backend image is tagged only `:latest`, so rollback and audit rely on Render history. | `.github/workflows/deploy-backend.yml:37` | Add a commit-SHA tag. |
| AUD-M5 | Medium | Migration scripts act on any configured `MONGO_URI` with no target guard. `migrate:samples` deletes and recreates exams. | `examtopics-backend/package.json` scripts; `README.md:159` | Add a confirmation guard on the target database. Claude settings deny `npm run migrate:*`. |
| AUD-L1 | Low | Config drift: `CORS_ORIGIN` is unused, `GOOGLE_CALLBACK_URL` is missing from `env.example`, and production URLs are hardcoded. | `examtopics-backend/env.example`; `index.js:26`; `services/authService.js:22` | Align `env.example` and make the URLs configurable before AWS staging. |
| AUD-L2 | Low | The report rate limit is keyed on the socket peer, so users behind the Render proxy share one limit (documented in the README). | `routes/reportRoutes.js:20`; `README.md:143` | Use a proxy-aware client key once the proxy topology is known. |
| AUD-L3 | Low | The repository configures no CSP or security headers for the frontend. | `examtopics-practice/public/_redirects` | Set a CSP at the host (Render / CloudFront response headers). |
| AUD-L4 | Low | Unused dependency `express-session`. | `examtopics-backend/package.json` | Remove it after a test run. |

## Open verifications (need authorization; none performed)

- Which commit Render production is serving, and whether the SEC-04 backfill was applied.
- Distinct production and staging `JWT_SECRET` / `SESSION_SECRET`, OAuth clients, Sheets service accounts and Atlas users.
- Atlas network allowlist, roles, TLS and backups; transaction support on the production cluster.
- GitHub branch protection, `package-release` environment reviewers, and who can dispatch workflows.
- Production frontend response headers.
- Contents of `examtopics.tar.gz.gpg`.
- Dependency and secret scanning: no scanning tooling is configured in the repo. The last manual scans are recorded in the detailed report.
