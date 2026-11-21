---
paths:
  - "examtopics-backend/scripts/**"
  - "batch/**"
  - "examtopics-img-downloader/**"
  - "skills/examtopics-retry-dl/**"
  - "examtopics-downloader/**"
---

# Data scripts and pipeline tools

## Database scripts (`examtopics-backend/scripts/`)
- These connect to whatever `MONGO_URI` is configured, which may be MongoDB Atlas. `migrate-samples.js` deletes and recreates matching exams. `backfill-question-ownership.js --apply` writes ownership data.
- Do not run them unless the user explicitly approves the exact command **and** confirms the target is a disposable local database. Changes to production or Atlas data also need the approval in `docs/policies/aws-deployment-approval.md`.
- Ownership manifests and exports must be written **outside** the repository with restrictive permissions (`docs/audit/sec-04-question-ownership.md`). Never commit them.

## Downloaders and batch tools
- These make network requests to third-party sites. Run them only when asked, and keep test runs offline (`go test -short ./...`; Python tests mock HTTP).
- Write image downloads only inside the configured output root. Keep the existing path-confinement and redirect checks.
- Python dependencies are pinned in each tool's `requirements.txt`. When you update one, re-run an advisory scan.
- Keep exam data filenames such as `aws_saa_c03.json` unchanged.
