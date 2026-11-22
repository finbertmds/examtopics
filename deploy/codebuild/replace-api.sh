#!/usr/bin/env bash
set -euo pipefail
# Runs as root via SSM on an already bootstrapped staging host.
exec 9>/var/lock/examtopics-deploy.lock
flock -n 9
test -s /etc/examtopics/api.env
docker network inspect examtopics-staging >/dev/null
docker inspect --format '{{.State.Running}}' examtopics-proxy | grep -qx true
docker inspect --format '{{.State.Running}}' examtopics-api | grep -qx true
registry="${API_IMAGE%%/*}"
aws ecr get-login-password --region "$AWS_REGION" |
  docker login --username AWS --password-stdin "$registry"
trap 'docker logout "$registry" >/dev/null 2>&1 || true' EXIT
docker pull "$API_IMAGE"
docker image inspect "$API_IMAGE" >/dev/null
# Keep the previous digest on host for an explicitly approved rollback.
docker inspect --format '{{.Config.Image}}' examtopics-api > /etc/examtopics/previous-api-image
docker stop examtopics-api >/dev/null
docker rm examtopics-api >/dev/null
docker run -d --name examtopics-api --network examtopics-staging \
  --pull=never --restart unless-stopped --no-healthcheck --log-driver local \
  --cap-drop ALL --security-opt no-new-privileges:true \
  --env-file /etc/examtopics/api.env "$API_IMAGE" >/dev/null
for attempt in $(seq 1 30); do
  if docker exec examtopics-api node -e '
    fetch("http://127.0.0.1:3001/health/readiness", {signal: AbortSignal.timeout(3000)})
      .then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1));'
  then
    echo 'API ready'
    exit 0
  fi
  sleep 3
done
echo 'API readiness failed; stop release and review rollback' >&2
exit 1
