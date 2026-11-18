# SEC-07 exam mutation transactions

Question edits and replacements write to the owning exam document inside the same transaction as the question changes. This conditional write checks the parent `ObjectId` and current owner and takes the same lock as ownership transfer. Transaction retries retain the originally selected parent identity. Exam creation with questions and exam deletion also commit the parent and question writes together. [MongoDB transaction and lock behavior](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/)

Bulk question uploads retain the first entry at each topic and question position after numeric casting. The stored question count reflects the rows inserted. A database error aborts the enclosing transaction.

## Local verification

Use a transaction-capable MongoDB replica set or sharded cluster. A standalone MongoDB instance can serve reads and exam metadata-only writes. Question changes, creation with questions, and deletion require transactions and fail on a standalone instance. [MongoDB transaction availability](https://www.mongodb.com/docs/manual/data-modeling/enforce-consistency/transactions/)

The repository's existing Docker Compose database is standalone. For disposable testing from the repository root, start a fresh MongoDB 7 replica set on a random loopback port using a locally cached image.

```bash
fixture_container=$(docker run --detach --rm --pull never \
  --publish '127.0.0.1::27017' mongo:7 mongod --replSet examtopics-dev --bind_ip_all)
```

After `docker exec "$fixture_container" mongosh --quiet --eval 'db.adminCommand({ping:1})'` succeeds, initialize and obtain the published address.

```bash
docker exec "$fixture_container" mongosh --quiet --eval \
  'rs.initiate({_id:"examtopics-dev",members:[{_id:0,host:"127.0.0.1:27017"}]})'
fixture_address=$(docker port "$fixture_container" 27017/tcp)
```

Use `MONGO_URI="mongodb://${fixture_address}/examtopics_dev?directConnection=true&replicaSet=examtopics-dev"` when exercising the application locally. Use synthetic data and keep the published port on loopback. Remove the fixture container with `docker rm -f "$fixture_container"` when done. Run offline regression tests with `npm --prefix examtopics-backend test`.

## Rollout

Confirm the intended database supports transactions before deploying. Verify transfer followed by an old-owner edit denial, single-question editing as the new owner, and all-or-nothing create, replacement, and delete on staging fixtures. Include an upload representative of the largest expected exam. Keep pre-fix API processes and direct-write maintenance jobs out of the rollout window so application writers follow the same ownership rule. Staging topology changes and deployment follow the [deployment approval policy](../policies/aws-deployment-approval.md).
