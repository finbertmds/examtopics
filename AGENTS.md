# Repository Guidelines

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

Frontend tests use Vitest, jsdom, and Testing Library, with colocated `*.test.ts`/`*.test.tsx` files. Backend tests use `node:test` in `test/*.test.js`; Go uses `*_test.go`; Python uses `unittest` in `batch/tests/test_*.py`. Add regression coverage for behavior changes. No coverage threshold is configured. Verify MongoDB, OAuth, and Sheets integrations in staging when affected.

## Commit & Pull Request Guidelines

History uses short action summaries without enforced prefixes. Prefer specific messages such as `Fix Google OAuth failure redirect`. Keep changes focused. PRs should describe behavior changes, link relevant issues, list validation, and include screenshots for UI changes.

## Security & Configuration

Use `examtopics-backend/env.example` for local configuration. Keep credentials, tokens, database dumps, and `.env` values out of commits and logs. Frontend `REACT_APP_*` values are bundled into public assets; never place secrets there.
