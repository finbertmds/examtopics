# Repository Guidelines

## AWS Migration — Mandatory Safety Rules

- The Main Orchestrator and every subagent MUST default to **LOCAL DEVELOPMENT ONLY**. Cloud mutation and production modification are denied by default.
- Agents MUST obtain separate, explicit human confirmation for each exact cloud-changing operation before creating, modifying, deleting, or deploying cloud resources, including all Terraform apply, destroy, and import operations and all AWS mutations. AWS access for planning also requires prior authorization. Agents MUST NOT self-approve, delegate around approval, independently consume AWS credits, or trigger billable services.
- Preserve the AWS Free plan. Agents MUST NOT upgrade it to Paid or trigger an automatic upgrade. The monthly AWS budget is $20 USD. Deployment MUST stop unless the active Free plan and at least $20 USD in remaining credits are verified. A different account plan requires a separately approved policy change.
- Keep staging separate from production. Render production, MongoDB Atlas, and production DNS MUST remain unchanged without separate explicit human approval. Keep Render production running until migration acceptance.
- Before relevant work, every agent MUST read the [AWS cost guardrails](docs/policies/aws-cost-guardrails.md) and [deployment approval policy](docs/policies/aws-deployment-approval.md). These root rules apply independently of those files. If either file is unavailable, stop cloud-related work until it can be read.

## Shared Local and Production Safety

- **Matching pushes or merges to `master` deploy Render production**, after the reusable CI workflow succeeds (`.github/workflows/deploy.yml`, `deploy-backend.yml`). Pushes, merges, workflow dispatches and publication need explicit, operation-specific human approval. Passing CI or a reviewer verdict does not authorize deployment.
- Never commit or push unless the user asks for it in this session.
- Never run `npm run migrate:*`, `examtopics-backend/scripts/*.js`, or `npm run test:oauth` unless the user approves the exact command and confirms a disposable local target. Production or Atlas operations require separate approval under the deployment policy.
- Never read or print `.env`, `.env.*`, `*.pem`, `client_secret_*`, `*.tfstate*` or `*.tfvars*`. Use `examtopics-backend/env.example` for variable names.
- Inspect scripts, hooks and tests before execution for network access, database writes or deployment effects. Ordinary validation stays offline.

## Project Structure & Module Organization

- `examtopics-practice/`: React/TypeScript frontend. `src/` contains components, hooks, contexts, services, and utilities. Static data and images live in `public/`; production output goes to `build/`.
- `examtopics-backend/`: Express/Mongoose API. Keep routes, controllers, services, models, and middleware in their respective directories; regression tests live in `test/`.
- `examtopics-downloader/`: Go CLI with entry point `cmd/main.go`, implementation in `internal/`, and tests in `tests/`.
- `batch/`: Data processing scripts and exam JSON, Markdown, and image collections. `examtopics-img-downloader/` and `skills/examtopics-retry-dl/` contain Python download utilities.
- `.github/workflows/`: Deployment and Docker automation.

## Build, Test, and Development Commands

Run commands from each project directory unless specified.

- At the root, `nvm install && nvm use` selects Node.js 26.12.1 from `.nvmrc`.
- In each Node project, run `npm ci` to install locked dependencies.
- Frontend: `npm start` serves on port 3000; `npm run build` checks TypeScript and builds production assets; `npm test` runs tests; `npm run test:watch` watches changes.
- Backend: `npm run dev` starts Node.js in watch mode. Use `npm start` to run the server and `npm test` to run regression tests.
- Go downloader: `go build ./cmd` builds the CLI; `go test -short ./...` runs offline tests (live crawler tests require a separate request).
- From the root, `python -m unittest discover -s batch/tests` runs Python regression tests. Install each Python tool's dependencies from its own `requirements.txt`.

## Coding Style & Naming Conventions

Follow surrounding code: two-space indentation in JavaScript/TypeScript, four spaces in Python, and `gofmt` for Go. Use PascalCase for React components and Mongoose models, camelCase for functions, and `use` prefixes for hooks. Preserve exam filenames such as `aws_saa_c03.json`. Frontend TypeScript uses strict checking. No dedicated ESLint or Prettier configuration is present.

## Testing Guidelines

Frontend tests use Vitest, jsdom, and Testing Library, with colocated `*.test.ts`/`*.test.tsx` files. Backend tests use `node:test` in `test/*.test.js`; Go uses `*_test.go`; Python uses `unittest` in `batch/tests/test_*.py`. Add regression coverage for behavior changes. No coverage threshold is configured. Verify MongoDB, OAuth, and Sheets integrations in staging when affected, subject to the mandatory safety rules above.

## Commit & Pull Request Guidelines

History uses short action summaries without enforced prefixes. Prefer specific messages such as `Fix Google OAuth failure redirect`. Keep changes focused. PRs should describe behavior changes, link relevant issues, list validation, and include screenshots for UI changes.

## Security & Configuration

Use `examtopics-backend/env.example` for local configuration. Keep credentials, tokens, database dumps, and `.env` values out of commits and logs. Frontend `REACT_APP_*` values are bundled into public assets; never place secrets there.

## Multi-Agent Development Guidelines

### Orchestration
- Use subagents for independent, bounded tasks.
- The main agent owns planning, integration and final review.
- Prefer parallel audits, tests and infrastructure planning.
- Do not allow concurrent edits to the same file.

### Agent Ownership
- security_auditor: read-only audit; audit reports.
- security_engineer: assigned backend fixes and tests.
- aws_architect: infra/ and migration documentation.
- qa_reviewer: read-only review and verification.
- Main agent: shared configuration and integration.

### Security Rules
- Never expose credentials or secret values.
- Never commit .env or private keys.
- Do not weaken authentication or authorization.
- Every confirmed security fix requires regression tests.
- Confirmed Critical/High issues block deployment.

### Quality Gates
- npm ci
- Frontend: npm run build
- Frontend: npm test
- Backend: npm test
- Go: go test -short ./...
- Python: python -m unittest discover -s batch/tests
- Terraform: offline fmt and validate. Obtain authorization for AWS planning access and review the Terraform plan before applying it.
- Dependency and secret scanning

### Completion Criteria
- Audit findings documented with severity and evidence.
- Security fixes linked to findings and tests.
- Relevant tests pass, or failures are documented.
- Infrastructure plan reviewed.
- No unresolved Critical or High security findings.
- QA reviewer approves code quality.
- Human approval required before external changes.


## Architecture Guardrails (Both Assistants)

- Keep the backend layering: routes do auth and body parsing, controllers validate input, services hold logic and queries, models define schemas.
- Every protected route uses `authenticateToken`. Optional identity uses `getUserFromToken`. Never trust identity from the request body.
- Auth model (do not weaken): Google OAuth with a signed state cookie, a single-use login code in the URL fragment, verifier exchange, an HttpOnly server-side session (24h idle / 30d absolute) and a 10-minute HS256 access token kept in memory. Production refuses missing or placeholder secrets (`utils/authSecrets.js`).
- Questions are linked to the exam's **ObjectId**, not its code. Owner checks and parent+child writes run in MongoDB transactions (`services/examService.js`).
- JSON body parsers are set per route with explicit limits. Do not add a global `express.json()`.
- Return unexpected failures through `sendInternalError` (`utils/requestFailure.js`). Never send or log raw exceptions, tokens or user data.
- Frontend: render question content as React elements, never as raw HTML. Allow only http(s) image URLs. Anything in `REACT_APP_*` is public.


- Local `docker compose up -d mongodb` in `examtopics-backend/` is standalone. Transaction tests for exam/question mutations need the disposable replica set described in `docs/audit/sec-07-exam-mutations.md`.
- Every behavior change or security fix needs regression coverage. Report only checks actually executed; mark missing tools, dependencies or authorization as NOT RUN with a reason.
- Terraform checks in `infra/terraform/staging/`: `terraform fmt -check -recursive`, `terraform validate`, `terraform test` with `mock_provider`. Inspect configuration first. `terraform init -backend=false -input=false` downloads providers and requires network access, but must not use AWS credentials or a remote backend. Check the pinned versions in manifests and CI rather than treating a past toolchain status as current.

## Shared Scoped Rules

Before editing or reviewing a matching path, read the following rule files. They are shared repository instructions for **both Claude and Codex**; their location under `.claude/` does not limit their applicability. Codex must explicitly read them; Claude also loads them through its path rules.

| Scope | Required rule |
|---|---|
| `examtopics-backend/**` | `.claude/rules/backend-security.md` |
| `examtopics-practice/**` | `.claude/rules/frontend.md` |
| `examtopics-backend/scripts/**`, `batch/**`, `examtopics-img-downloader/**`, `skills/examtopics-retry-dl/**`, `examtopics-downloader/**` | `.claude/rules/data-scripts.md` |
| `infra/**`, `.github/workflows/**`, `docs/migration/**`, `docs/policies/**` | `.claude/rules/aws-cost-safety.md` and both AWS policies |

Rules are cumulative: backend scripts must follow both backend and data-script rules. If instructions disagree, follow the stricter safety rule and report the conflict.

## Shared Review Roles and Skills

Use independent, bounded reviewers on the finished diff, giving each the file list or diff range. Reviewers must read this file and the applicable scoped rules. Avoid duplicate whole-repository scans.

| Responsibility | Claude name | Codex name | Shared role instructions |
|---|---|---|---|
| Security review | `security-reviewer` | `security_auditor` | `.claude/agents/security-reviewer.md` |
| Correctness and offline gates | `qa-reviewer` | `qa_reviewer` | `.claude/agents/qa-reviewer.md` |
| AWS staging proposals | `aws-architect` | `aws_architect` | `.claude/agents/aws-architect.md` |
| Architecture and debt | `architecture-reviewer` | `architecture_reviewer` | `.claude/agents/architecture-reviewer.md` |

These four roles are read-only and return proposals or findings to the main agent. Their shared role instructions take precedence over a broader ownership label above. The Codex `security_engineer` is a separate implementation role for assigned backend fixes and tests. It must not take over a reviewer's role or edit another agent's files.

The release checklist lives at `.claude/skills/release-readiness/SKILL.md`. Codex discovers the same directory through `.agents/skills/release-readiness`; it is a symlink, so changes are reflected in both tools. Resolve reviewer names using the table above. If the runtime cannot delegate a role, perform its checklist explicitly and report the lack of an independent review.

When changing assistant guidance, put shared policy in this file or the shared rule/role/skill sources above. Keep `CLAUDE.md` and `.codex/agents/*.toml` as adapters. Check both consumers whenever a role is renamed or a path changes. See `docs/assistant-configuration.md` for verification and runtime limits.

## Reference Documents

- `docs/architecture.md`: components, data flows and auth model.
- `docs/development.md`: setup, toolchains and commands.
- `docs/deployment.md`: Render workflows and AWS staging.
- `docs/security-audit.md` and `docs/audit/`: findings and SEC-04 / SEC-07 runbooks.
- `docs/technical-debt.md`: prioritized debt backlog.
- `docs/policies/`: mandatory AWS cost and deployment policies.
- `docs/migration/`: staging runbook and cost estimates.

## Working Practices

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
