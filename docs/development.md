# Development

Commands come from `package.json`, `README.md`, `AGENTS.md` and CI. **Status** shows whether each command has been run in this repository's current workspace audit.

## Toolchain

| Tool | Required (source) | Workspace status (2026-11-21) |
|---|---|---|
| Node.js | 26.12.1 (`.nvmrc`, `engines: >=26.12.1 <27`) | v24.19.0 installed: **mismatch**. Run `nvm install && nvm use` at the repo root |
| npm | lockfile `package-lock.json` (a `yarn.lock` also exists; npm is the documented tool) | — |
| Go | 1.27.4 (`go.mod`, Dockerfile, `docker.yml`) | **not installed** |
| Python | 3.x; README advisory scan used 3.13 | 3.14.6 installed |
| Terraform | `>= 1.14.0, < 2.0.0` (`infra/terraform/staging/terraform.tf`) | 1.10.2 installed: **mismatch** |
| Docker | needed for local MongoDB | NOT VERIFIED |

## Setup

```bash
nvm install && nvm use            # repo root, Node 26.12.1
cd examtopics-backend && npm ci
cp env.example .env               # fill in local values; never commit .env
cd ../examtopics-practice && npm ci
```

### Local MongoDB

- `docker compose up -d mongodb` in `examtopics-backend/` starts a **standalone** MongoDB 7 on `127.0.0.1:27017`. It needs `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` in `.env`.
- Question edits, exam creation with questions and exam deletion need **transactions**. For those, use the disposable replica set in `docs/audit/sec-07-exam-mutations.md`.

### Environment variables (names only)

Defined in `examtopics-backend/env.example`. Not listed there:
- `GOOGLE_CALLBACK_URL` is used in production (`services/authService.js:22`) but is missing from `env.example`.
- `CORS_ORIGIN` is listed in `env.example` but no code reads it.

The frontend reads `REACT_APP_BACKEND_URL` and `REACT_APP_FRONTEND_URL`. Both are **public** once bundled.

## Commands

| Component | Command | Purpose | Status |
|---|---|---|---|
| Frontend | `npm start` | Vite dev server on port 3000 | Not run |
| Frontend | `npm run build` | `tsc --noEmit` + `vite build` → `build/` | Not run |
| Frontend | `npm test` / `npm run test:watch` | Vitest | Not run |
| Backend | `npm run dev` | `node --watch index.js` | Not run |
| Backend | `npm start` | `node index.js` (port 3001) | Not run |
| Backend | `npm test` | `node --test test` (mocked DB) | Not run |
| Go | `go build ./cmd` | Build CLI | Not run |
| Go | `go test -short ./...` | Offline tests; `-short` skips live crawler tests (as CI does) | Not run |
| Python | `python -m unittest discover -s batch/tests` | From repo root | Not run |
| Terraform | `terraform init -backend=false && terraform fmt -check && terraform validate && terraform test` | Offline; `terraform test` uses `mock_provider` | Not run (version mismatch) |

### Commands with external side effects (need explicit approval)

| Command | Effect |
|---|---|
| `npm run migrate:samples` | Imports `public/exams/*.json` into `MONGO_URI`; **deletes and recreates** matching exams |
| `npm run migrate:progress`, `npm run migrate:exam-visibility` | Rewrite stored progress / exam visibility in `MONGO_URI` |
| `node scripts/export-question-ownership.js`, `backfill-question-ownership.js [--apply]` | SEC-04 cutover; see `docs/audit/sec-04-question-ownership.md` |
| `npm run test:oauth` | Exercises the OAuth configuration (NOT VERIFIED whether it calls Google) |
| Go downloader, Python downloaders | Network requests to third-party sites |
| `node scripts/package-examtopics.mjs` | Builds plugin ZIPs into `dist/` (local only, no upload) |

## Conventions

- Two-space JS/TS, four-space Python, `gofmt`.
- PascalCase for React components and Mongoose models, camelCase for functions, a `use` prefix for hooks.
- Tests: Vitest `*.test.ts(x)` colocated in the frontend; `node:test` in `examtopics-backend/test/`; Go `*_test.go`; Python `batch/tests/test_*.py`.
- UI strings are added to `src/locales/translations/{en,ja,vi}.json`.
- There is no ESLint or Prettier configuration.
