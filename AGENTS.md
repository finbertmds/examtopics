# Repository Guidelines

## AWS Migration — Mandatory Safety Rules

- The Main Orchestrator and every subagent MUST default to **LOCAL DEVELOPMENT ONLY**. Cloud mutation and production modification are denied by default.
- Agents MUST obtain separate, explicit human confirmation for each exact cloud-changing operation before creating, modifying, deleting, or deploying cloud resources, including all Terraform apply, destroy, and import operations and all AWS mutations. AWS access for planning also requires prior authorization. Agents MUST NOT self-approve, delegate around approval, independently consume AWS credits, or trigger billable services.
- Preserve the AWS Free plan. Agents MUST NOT upgrade it to Paid or trigger an automatic upgrade. The monthly AWS budget is $20 USD. Deployment MUST stop unless the active Free plan and at least $20 USD in remaining credits are verified. A different account plan requires a separately approved policy change.
- Keep staging separate from production. Render production, MongoDB Atlas, and production DNS MUST remain unchanged without separate explicit human approval. Keep Render production running until migration acceptance.
- Before relevant work, every agent MUST read the [AWS cost guardrails](docs/policies/aws-cost-guardrails.md) and [deployment approval policy](docs/policies/aws-deployment-approval.md). These root rules apply independently of those files. If either file is unavailable, stop cloud-related work until it can be read.

## Project Structure & Module Organization

- `examtopics-practice/`: React/TypeScript frontend. `src/` contains components, hooks, contexts, services, and utilities. Static data and images live in `public/`; production output goes to `build/`.
- `examtopics-backend/`: Express/Mongoose API. Keep routes, controllers, services, models, and middleware in their respective directories; regression tests live in `test/`.
- `examtopics-downloader/`: Go CLI with entry point `cmd/main.go`, implementation in `internal/`, and tests in `tests/`.
- `batch/`: Data processing scripts and exam JSON, Markdown, and image collections. `examtopics-img-downloader/` and `examtopics-retry-dl/` contain Python download utilities.
- `.github/workflows/`: Deployment and Docker automation.

## Build, Test, and Development Commands

Run commands from each project directory unless specified.

- At the root, `nvm install && nvm use` selects Node.js 26.12.1 from `.nvmrc`.
- In each Node project, run `npm ci` to install locked dependencies.
- Frontend: `npm start` serves on port 3000; `npm run build` checks TypeScript and builds production assets; `npm test` runs tests; `npm run test:watch` watches changes.
- Backend: `npm run dev` starts with nodemon; `npm start` runs the server; `npm test` runs regression tests.
- Go downloader: `go build ./cmd` builds the CLI; `go test ./...` runs tests.
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
- Go: go test ./...
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
