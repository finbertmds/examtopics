---
paths:
  - "examtopics-backend/**"
---

# Backend security and coding rules

Invariants confirmed in the current code. Do not weaken any of them, and add a regression test in `examtopics-backend/test/` whenever one is touched.

## Authentication and sessions
- `services/authService.js`: `authenticateToken` checks the HS256 token **and** an active `AuthSession`. Keep both checks, and keep the `algorithms: ['HS256']` pin.
- Access tokens last at most `ACCESS_TOKEN_SECONDS` (10 min). Sessions expire after `IDLE_MS` (24h idle) or `ABSOLUTE_MS` (30d) (`config/auth.js`).
- OAuth state uses a signed, time-bound HttpOnly cookie (`utils/oauthStateStore.js`). The callback returns a single-use 60-second code in the URL **fragment**, never a token in the query.
- `/auth/session|activity|logout|exchange` require the frontend `Origin` and the `X-ExamTopics-Session: 1` header (`routes/authRoutes.js`).
- `utils/authSecrets.js` makes production fail if a secret is missing or a placeholder. Never add source-code default secrets.

## Authorization and data
- Ownership checks compare `createdBy` with `req.user.userId` and run inside transactions for question writes, creates with questions and deletes (`services/examService.js`).
- Questions reference the parent exam by **ObjectId**. Never select questions by exam code alone.
- Progress and history queries always filter by the authenticated `userId`. Check that IDs are scalars and positions are positive safe integers before they reach a query or a dotted update path.

## Requests and errors
- Body parsers are per route with explicit limits (`inflate: false`). Do not add a global parser or raise a limit without a reason.
- Unexpected errors go through `sendInternalError` / `logFailure` (`utils/requestFailure.js`). Logs carry only an event name and request ID: no raw errors, tokens, emails or IDs.
- The CORS origin list is in `index.js`. Do not add wildcard origins or headers.

## Style
- CommonJS, two-space indentation, camelCase functions, PascalCase Mongoose models.
- Tests use `node:test` with a mocked database. Behaviour that needs transactions is checked against the disposable replica set in `docs/audit/sec-07-exam-mutations.md`.
