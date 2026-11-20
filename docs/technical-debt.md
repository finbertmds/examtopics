# Technical debt

Prioritized backlog from the 2026-11-21 repository review. Security items are tracked in `docs/security-audit.md`; they appear here only where they are also maintenance debt.

| Priority | Item | Evidence | Suggested action |
|---|---|---|---|
| P1 | No CI test workflow; deploys are ungated (AUD-H1) | `.github/workflows/` (3 files, none runs Node tests) | Add a PR/push workflow: `npm ci`, frontend build + test, backend test, Go `-short` tests, Python unittest, Terraform fmt/validate/test |
| P1 | Local toolchain drift blocks quality gates | Node 24.19 vs required 26.12.1; Terraform 1.10.2 vs ≥ 1.14; Go absent | Align the workstation; consider documenting install steps in `docs/development.md` |
| P2 | Repository artifacts that do not belong in git (AUD-M1, AUD-M2) | `examtopics-backend/verified-question-ownership.json`, `examtopics-backend/examtopics.tar.gz.gpg` | Move out of git, add ignore rules |
| P2 | Destructive scripts lack target guards (AUD-M5) | `examtopics-backend/scripts/` | Require an explicit `--target`/confirmation and refuse non-local URIs unless confirmed |
| P2 | Unversioned backend images (AUD-M4) | `deploy-backend.yml:37` | Tag by commit SHA |
| P3 | Two lockfiles per Node project | `package-lock.json` + `yarn.lock` in backend and frontend | Keep npm (used by docs, Dockerfile); remove `yarn.lock` after confirming no one uses Yarn |
| P3 | Hardcoded Render URLs | `examtopics-backend/index.js:26`, `services/authService.js:22`, `utils/frontendUrl.js`, `examtopics-practice/src/utils/backendUrl.ts` | Drive from env only, with explicit startup validation, before AWS staging |
| P3 | `env.example` drift | `CORS_ORIGIN` unused; `GOOGLE_CALLBACK_URL` missing | Align |
| P3 | Unused dependency | `express-session` in `examtopics-backend/package.json` | Remove |
| P3 | Large components | `src/components/AdminPage.tsx` (1,321 lines), `ExamPage.tsx` (703) | Extract hooks/sub-components when next touched, with tests |
| P3 | No lint/format tooling | No ESLint/Prettier config | Optional: add minimal config without mass reformatting |
| P4 | Observability is minimal | `utils/requestFailure.js` logs event + request ID only; no access logs/metrics | Add structured access logging with redaction when moving to staging |
| P4 | Large tracked data | ~60 MB under `examtopics-practice/public/`, ~1,185 tracked files | Consider Git LFS or external storage for images |
| P4 | Stale documentation | `AGENTS.md` lists `examtopics-retry-dl/` at root (actual: `skills/examtopics-retry-dl/`); `docs/policies/aws-deployment-approval.md` says no Terraform config exists | Update with owner approval (AGENTS.md and policies are owner-controlled) |
| P4 | Several overlapping frontend READMEs | `examtopics-practice/*_README.md`, `*_SUMMARY.md` | Consolidate into `docs/` or archive |
