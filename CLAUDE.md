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
- `.claude/agents/` (none edit files; approved fixes are implemented by the main agent):
  - `security-reviewer`: read-only security audit (role `security_auditor`)
  - `qa-reviewer`: correctness, regression tests and offline quality gates (role `qa_reviewer`)
  - `aws-architect`: AWS staging and Terraform proposals as patches, with cost impact (role `aws_architect`)
  - `architecture-reviewer`: layering, coupling and technical-debt review
- Delegation: run the reviewers that apply to a finished change in parallel, passing each one the diff range or file list so the repository is not scanned twice.
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

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
