# CLAUDE.md

@AGENTS.md

`AGENTS.md` (imported above) is the canonical source for shared policy: AWS safety rules, project structure, commands, style, testing and multi-agent guidelines. This file adds only Claude-specific guidance. If the two ever disagree, follow the stricter rule and report the conflict.

## Claude-specific safety

- **Merging or pushing to `master` deploys production.** `.github/workflows/deploy.yml` and `deploy-backend.yml` deploy to Render on matching `master` pushes with no test gate. Treat any push, merge, PR merge or workflow dispatch as a production deployment that needs explicit human approval.
- Never commit or push unless the user asks for it in this session.
- Never run `npm run migrate:*`, `examtopics-backend/scripts/*.js`, or `npm run test:oauth` against any database or service other than a disposable local one. These scripts use whatever `MONGO_URI` / Google credentials are configured, and `migrate:samples` deletes and recreates exams.
- Never read or print `.env`, `*.pem`, `client_secret_*`, `*.tfstate` or `*.tfvars`. Use `examtopics-backend/env.example` for variable names.
- Before cloud-related work, read `docs/policies/aws-cost-guardrails.md` and `docs/policies/aws-deployment-approval.md`.
- `.claude/settings.json` denies the most dangerous commands. Do not treat the deny list as complete: the policies above still apply to any command it misses.

## Repository map

| Path | What it is |
|---|---|
| `examtopics-practice/` | React 19 + TypeScript 7 (strict) + Vite 8 + Tailwind 4 frontend; Vitest tests colocated |
| `examtopics-backend/` | Express 5 + Mongoose 9 API; `routes/ → controllers/ → services/ → models/`, `middleware/`, `utils/`, `config/`; tests in `test/` |
| `examtopics-downloader/` | Go 1.27.4 CLI (`cmd/main.go`, `internal/`, `tests/`) |
| `batch/` | Exam JSON/Markdown/images and Python processing scripts; tests in `batch/tests/` |
| `examtopics-img-downloader/` | Python bulk image downloader |
| `skills/` | Agent skills; the retry tool lives in `skills/examtopics-retry-dl/` (AGENTS.md lists it at the root, which is stale) |
| `infra/terraform/staging/` | AWS staging Terraform (local state, `mock_provider` tests) |
| `docs/` | Architecture, development, deployment, security, debt, audit and policy docs |
| `.codex/` | Codex agent definitions (not used by Claude) |

## Commands

Commands come from the manifests and CI. "Not run" means the command has not been executed in this workspace yet; see `docs/development.md` for toolchain status.

| Area | Command (run from the component directory) | Status |
|---|---|---|
| Node setup | `nvm use` (Node 26.12.1), then `npm ci` | Not run (local Node is 24.x) |
| Frontend | `npm start` (port 3000), `npm run build`, `npm test` | Not run |
| Backend | `npm run dev`, `npm start` (port 3001), `npm test` | Not run |
| Go | `go build ./cmd`, `go test -short ./...` (`-short` skips live crawler tests, as CI does) | Not run (Go not installed) |
| Python | `python -m unittest discover -s batch/tests` (repo root) | Not run |
| Terraform | `terraform init -backend=false`, `terraform fmt -check`, `terraform validate`, `terraform test` (mock provider) in `infra/terraform/staging/` | Not run (local Terraform 1.10 < required 1.14). `init` downloads providers: no cloud calls, but network access |

Local MongoDB: `docker compose up -d mongodb` in `examtopics-backend/` is **standalone**. Question edits, exam creation with questions and exam deletion need transactions, so use the disposable replica set in `docs/audit/sec-07-exam-mutations.md`.

## Architecture guardrails

- Keep the backend layering: routes do auth and body parsing, controllers validate input, services hold logic and queries, models define schemas.
- Every protected route uses `authenticateToken`. Optional identity uses `getUserFromToken`. Never trust identity from the request body.
- Auth model (do not weaken): Google OAuth with a signed state cookie, a single-use login code in the URL fragment, verifier exchange, an HttpOnly server-side session (24h idle / 30d absolute) and a 10-minute HS256 access token kept in memory. Production refuses missing or placeholder secrets (`utils/authSecrets.js`).
- Questions are linked to the exam's **ObjectId**, not its code. Owner checks and parent+child writes run in MongoDB transactions (`services/examService.js`).
- JSON body parsers are set per route with explicit limits. Do not add a global `express.json()`.
- Return unexpected failures through `sendInternalError` (`utils/requestFailure.js`). Never send or log raw exceptions, tokens or user data.
- Frontend: render question content as React elements, never as raw HTML. Allow only http(s) image URLs. Anything in `REACT_APP_*` is public.

## Testing

- Every behaviour change or security fix needs a regression test in the component's test location (see AGENTS.md).
- Backend tests mock the database. Integration with MongoDB, OAuth and Sheets must be verified on staging, only under the approval policy.
- Report test results as they actually happened. Never claim a command passed unless you ran it.

## Scoped rules, agents, skills

- `.claude/rules/`: `aws-cost-safety.md`, `backend-security.md`, `frontend.md`, `data-scripts.md` (each loads for its paths).
- `.claude/agents/`: `security-reviewer` (read-only) and `qa-reviewer` (read-only + local tests).
- `.claude/skills/release-readiness/`: quality gates and a deployment-impact checklist before merging to `master`.

## Reference documents

- `docs/architecture.md` – components, data flows, auth model
- `docs/development.md` – setup, toolchain, commands
- `docs/deployment.md` – Render workflows, AWS staging plan
- `docs/security-audit.md` – index of security findings and open verifications
- `docs/technical-debt.md` – prioritized debt backlog
- `docs/audit/` – detailed security report and SEC-04 / SEC-07 runbooks
- `docs/policies/` – AWS cost guardrails and deployment approval (mandatory)
- `docs/migration/` – AWS staging runbook and cost estimate
