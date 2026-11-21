# Architecture

Based on repository evidence as of 2026-11-21 (branch `chore/claude-project-onboarding`, base `ee98f68`). Live deployment state is **not verified** here.

## Components

| Component | Stack | Entry point |
|---|---|---|
| `examtopics-practice/` | React 19, TypeScript 7 (strict), Vite 8, Tailwind 4, react-router 7, Vitest | `src/index.tsx`, `src/App.tsx`; build output `build/` |
| `examtopics-backend/` | Node 26.12.1, Express 5, Mongoose 9, Passport Google OAuth 2.0, jsonwebtoken, helmet, googleapis | `index.js` (port `PORT`, default 3001) |
| `examtopics-downloader/` | Go 1.27.4 CLI | `cmd/main.go` |
| `batch/`, `examtopics-img-downloader/`, `skills/examtopics-retry-dl/` | Python 3 tools | per-script |
| `infra/terraform/staging/` | Terraform ≥ 1.14, AWS provider ~> 6 | `terraform.tf`, `providers.tf` |

External dependencies:
- MongoDB (Atlas in production; local Compose, standalone)
- Google OAuth
- Google Sheets (for user reports)
- Render (production hosting)
- Docker Hub (backend image)
- GHCR (downloader image)

## Current production topology (from workflows and code defaults)

```text
Browser ──► Render static site (examtopics-practice)   https://examtopics.onrender.com
   │
   └─────► Render web service (examtopics-backend)     https://examtopics-backend-latest.onrender.com
                 ├─► MongoDB Atlas
                 ├─► Google OAuth
                 └─► Google Sheets (reports)
```

The hosts above are hardcoded defaults in `examtopics-backend/index.js:26`, `services/authService.js:22`, `utils/frontendUrl.js` and `examtopics-practice/src/utils/backendUrl.ts`. Environment variables override them.

The planned AWS staging topology (S3 + CloudFront frontend, a single EC2 t3.micro API) is described in `docs/migration/aws-staging-runbook.md`. It has **not** been deployed by any repository automation.

## Backend structure

`index.js` sets up the middleware in this order:
1. Request ID (`X-Request-Id`)
2. `helmet()`
3. CORS (fixed origin list)
4. `passport.initialize()`
5. Routers
6. 404 handler
7. `middleware/errorHandler.js`

| Mount | Router | Auth |
|---|---|---|
| `/auth` | `routes/authRoutes.js` | OAuth, plus session endpoints guarded by `Origin` + `X-ExamTopics-Session` |
| `/api` | `routes/examRoutes.js` | Reads: optional (`getUserFromToken`). Writes: `authenticateToken` + owner check |
| `/progress` | `routes/progressRoutes.js` | `authenticateToken` on all routes |
| `/report` | `routes/reportRoutes.js` | Optional identity; in-memory rate limit (5/min per peer, 30/min per process) |
| `/health` | `routes/healthRoutes.js` | Public. `/` is liveness; `/readiness` runs cached probes with a 2 s timeout |

Layers: `routes/` (auth, body limits) → `controllers/` (validation, HTTP mapping) → `services/` (logic, queries, transactions) → `models/`.

Models: `User`, `Exam`, `Question`, `Progress`, `History`, `AuthSession`, `OAuthLoginCode`.

## Authentication flow

1. The frontend generates a verifier and challenge, then navigates to `GET /auth/google?challenge=…`.
2. Passport stores a signed, time-bound state cookie that carries the challenge (`utils/oauthStateStore.js`, 10 min).
3. Google calls back to `/auth/google/callback`. The state is verified, and the user is found or created (`models/User.js`).
4. The callback stores a hashed single-use code (TTL 60 s), bound to the challenge, and redirects to `<frontend>/auth/callback#code=…` (`controllers/authController.js:49-58`).
5. The frontend calls `POST /auth/exchange` with `{code, verifier}`. The backend sets an HttpOnly session cookie (`__Host-` prefixed, partitioned, `SameSite=None` in production) and returns an access token.
6. The access token is HS256, lasts at most 10 minutes, and carries `sid` and `userId`. It is held in memory only (`src/contexts/AuthContext.tsx`).
7. Every protected request re-checks the server-side `AuthSession` (`services/authService.js:75-92`).
8. `POST /auth/session` restores a session from the cookie. `POST /auth/activity` extends the idle deadline (24 h idle, 30 d absolute; `config/auth.js`). `POST /auth/logout` revokes the session.

## Exam and question data

- Exams are owned by `createdBy`. They are visible when published (or created before `isPublished` existed) or when owned by the requester (`services/examService.js:20-30`).
- Questions reference the parent exam's **ObjectId** (SEC-04). Older rows keyed by exam code are excluded until they are backfilled (`docs/audit/sec-04-question-ownership.md`).
- Question edits, exam creation with questions and exam deletion run in MongoDB transactions, so a replica set is required (`docs/audit/sec-07-exam-mutations.md`).
- Question lists are paginated, with at most 100 per page.

## Data pipeline

```text
ExamTopics site ─► Go downloader / Python retry ─► batch/*.json, *.md
                                                  │  convert, fix links, download images
                                                  ▼
                          /admin import (POST /api/exams)  or  npm run migrate:samples
                                                  ▼
                                               MongoDB ─► REST API ─► React app
```

Static images are served from `examtopics-practice/public/img/`. `public/exams/` holds sample and migration source data. Copying files there does not publish them.

## Observability

- Every response carries an `X-Request-Id` header.
- Failures are logged as JSON `{event, requestId}` with no raw errors (`utils/requestFailure.js`).
- There are no access logs, metrics or tracing in the application.
- The Docker `HEALTHCHECK` hits `/health`. Terraform staging defines one CloudWatch status alarm (`infra/terraform/staging/monitoring.tf`).
