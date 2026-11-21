# SEC-04 question ownership cutover

Questions created by the patched backend use the owning exam's BSON `ObjectId` in `Question.examId`. The public API still returns the exam code in `examId`. List, count, export, edit, replacement, and deletion are scoped to the parent record. The existing unique index on `examId`, `topic_number`, and `question_number` distinguishes legacy string codes from `ObjectId` values.

Rows that still store a string code stay in the database and outside API reads and writes. This includes rows for current exams until they are verified and backfilled or reimported. An exam's stored metadata can retain its original question count during this transition. Check the actual list count when verifying the cutover.

## Prepare the data

> **Target guard (SEC-021).** The exporter and the backfill check the database target before connecting. For a remote target (any non-loopback host, `mongodb+srv://`, or a `replicaSet`/`loadBalanced` URI without `directConnection=true`), append `--target=<hosts>/<database>` matching `MONGO_URI` to every command below. With `NODE_ENV=production`, remote targets are refused unless `ALLOW_REMOTE_MIGRATION=1` is also set. See [the backend README](../../examtopics-backend/README.md#database-target-guard-for-scripts).

1. Rehearse with synthetic fixtures or a sanitized snapshot in a disposable MongoDB database. Check the unique compound index on `questions` and the unique index on `exams.code`. Record counts and known-good queries before proceeding.
2. From the repository root, run the exporter after setting `MONGO_URI` in `examtopics-backend/.env` to the approved database with read-only credentials. The exporter reads this file directly. It joins legacy string `questions.examId` values to `exams.code` and writes a candidate manifest outside the repository with file permissions `0600`.

   ```sh
   cd examtopics-backend
   manifest_dir=$(mktemp -d /tmp/examtopics-ownership.XXXXXXXX)
   node scripts/export-question-ownership.js "$manifest_dir/verified-question-ownership.json"
   ```

   The exporter stops if any legacy question has a missing or ambiguous parent or an invalid ID. If it reports zero legacy questions, there is no manifest to backfill.

   If export is blocked, write a separate diagnostic report with the same read-only credentials:

   ```sh
   node scripts/export-question-ownership.js "$manifest_dir/ownership-diagnostics.json" --diagnose
   ```

   The report lists `totalLegacy`, `candidateQuestions`, `blockedQuestions`, and blocked groups by legacy `examCode`. Each group includes a question count and counts for `missingParent`, `ambiguousParent`, `invalidExamCode`, `invalidQuestionId`, or `invalidParentId`. Reasons can overlap for one question. `candidateQuestions` counts uniquely matched rows pending provenance review. Diagnostic mode writes a report, never a backfill manifest, and does not change the database. Output files use permissions `0600` and cannot overwrite an existing file.

   A missing parent means no current exam has that code. An ambiguous parent means multiple current exams match. Resolve ownership using trusted snapshots or imports; do not create parents or assign questions based only on a matching code. Keep unresolved questions quarantined, and rerun export after resolving the data under the applicable approval policy.
3. Review the candidates. For each legacy question, establish its original parent from trusted records such as a pre-reuse snapshot or a verified import. A matching code or an earlier creation time is insufficient to determine ownership. Leave ambiguous rows quarantined. For questions whose IDs cannot be verified, use a trusted question export to reimport the content under the correct parent.
4. Save the verified entries as `verified-question-ownership.json` outside the repository with restricted permissions. Use that file for the backfill dry-run below. The manifest is a nonempty JSON array with one entry per verified question. `examId` and `questionId` are the parent and question MongoDB IDs as 24-character hex strings. `examCode` is the current code of the verified parent.

```json
[
  {
    "examId": "000000000000000000000001",
    "examCode": "example-exam",
    "questionId": "000000000000000000000002"
  }
]
```

## Apply and verify

1. For staging and production, obtain the separate authorizations required by the [deployment policy](../policies/aws-deployment-approval.md). Schedule a maintenance window, stop all old backend processes and jobs, pause writes, and take a restorable snapshot of the target. Keep the backend unavailable until the verification below is complete. Old code reads and writes questions by string code.
2. Use explicit, read-only `MONGO_URI` credentials for the approved target and run the dry-run command from a reviewed backend checkout. It verifies the current parent code, the question's existing ownership, and destination collisions. Review `pending`, `alreadyLinked`, and `updated`. For dry-run, `updated` should be zero.

```sh
node scripts/backfill-question-ownership.js /secure/path/verified-question-ownership.json
```

3. After approval of the exact manifest and target database, use short-lived write credentials to run the apply command. The tool reads parents and questions and checks destination collisions in batches of up to 500. It validates the complete manifest before the first write, then uses ordered `bulkWrite` batches of up to 500 updates. Each update checks the exact question ID, expected legacy code, and the topic/question position read during validation. The command leaves collections and indexes as provisioned.

   A failed batch or a changed row stops subsequent batches. Earlier batches and some rows in the current batch may already be updated; the operation is not atomic. Keep writes paused, verify the target and applied rows, and obtain the applicable retry approval. Rerunning the same manifest recognizes already-linked rows and only updates the remaining legacy rows.

```sh
node scripts/backfill-question-ownership.js /secure/path/verified-question-ownership.json --apply
```

4. Rerun dry-run and confirm `pending` is zero and `alreadyLinked` matches the reviewed manifest. Start only the patched backend. Verify owner and public list, count, individual question and export reads, and question replacement and deletion on isolated fixtures. Verify unlinked rows remain unavailable even when an exam uses the same public code. Record deliberately quarantined or reimported rows separately.

## Recover from a failed cutover

Keep the service in maintenance mode if validation or apply fails. Verify the target, manifest, and any applied rows before retrying under the applicable approval. Prefer correcting the manifest with evidence and continuing the patched rollout. If snapshot recovery is required, obtain separate approval and restore the exam and question collections from the same snapshot together. Keep the restored data isolated from user-facing traffic until served by a version that enforces immutable ownership.
