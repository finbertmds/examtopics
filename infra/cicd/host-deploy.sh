#!/bin/bash
# Installed at /usr/local/sbin/examtopics-deploy by the staging operator.
set +x

deploy() (
  set -euo pipefail
  umask 077

  local directory=$1
  shift
  step="invalid arguments" work=""
  trap 'status=$?; [[ -z $work ]] || rm -rf -- "$work"; if (( status )); then printf "Staging host: %s\n" "$step" >&2; fi' EXIT

  [[ $# == 8 && $1 == --release && $3 == --api-image && $5 == --proxy-image && $7 == --secret-version ]]
  local release=$2 api_image=$4 proxy_image=$6 version=$8
  [[ $release =~ ^[0-9a-f]{40}$ && $version =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]

  step="invalid host configuration"
  local settings
  settings=$(python3 - "$directory" <<'PY' 2>/dev/null
import json
import os
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
paths = [root, root / "deploy-config.json", root / "Caddyfile"]
for path in paths:
    if path.is_symlink() or path.stat().st_uid != os.geteuid() or path.stat().st_mode & 0o022:
        raise SystemExit(1)
if not root.is_dir() or root.stat().st_mode & 0o077 or any(not p.is_file() for p in paths[1:]):
    raise SystemExit(1)
config = json.loads(paths[1].read_text())
if config["account_id"] != "450114866570" or config["region"] != "ap-southeast-2":
    raise SystemExit(1)
prefix = "450114866570.dkr.ecr.ap-southeast-2.amazonaws.com"
if config["repository_url"] != prefix + "/examtopics-staging":
    raise SystemExit(1)
if not re.fullmatch(
    r"arn:aws:secretsmanager:ap-southeast-2:450114866570:secret:/examtopics/staging/api-environment-[A-Za-z0-9]{6}",
    config["secret_arn"],
):
    raise SystemExit(1)
if not re.fullmatch(r"api\.staging(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?){2,}", config["api_host"]):
    raise SystemExit(1)
print(prefix, config["repository_url"], config["secret_arn"], config["api_host"])
PY
  )
  local registry repository secret_arn api_host
  read -r registry repository secret_arn api_host <<<"$settings"
  local image digest
  for image in "$api_image" "$proxy_image"; do
    digest=${image#"$repository"@sha256:}
    [[ $image == "$repository"@sha256:"$digest" && $digest =~ ^[0-9a-f]{64}$ ]]
  done

  step="another host deployment is active"
  exec 9>"$directory/deploy.lock"
  flock -w 10 9 >/dev/null 2>&1

  step="host prerequisites missing"
  work=$(mktemp -d "$directory/.deploy.XXXXXX")
  export DOCKER_CONFIG="$work"
  docker network inspect examtopics-staging >/dev/null 2>&1
  docker volume inspect examtopics-caddy-data examtopics-caddy-config >/dev/null 2>&1

  step="image login failed"
  timeout 40 aws ecr get-login-password --region ap-southeast-2 --no-cli-pager 2>/dev/null |
    timeout 40 docker login --username AWS --password-stdin "$registry" >/dev/null 2>&1
  step="image pull failed"
  timeout 150 docker pull "$api_image" >/dev/null 2>&1
  timeout 150 docker pull "$proxy_image" >/dev/null 2>&1
  docker logout "$registry" >/dev/null 2>&1

  step="secret validation failed"
  local sheets
  sheets=$(
    timeout 40 aws secretsmanager get-secret-value --region ap-southeast-2 --no-cli-pager \
      --secret-id "$secret_arn" --version-id "$version" --output json 2>/dev/null |
      python3 -c '
import json
from pathlib import Path
import re
import sys

response = json.load(sys.stdin)
filename, version, host = sys.argv[1:]
if response["VersionId"] != version:
    raise SystemExit(1)
payload = response["SecretString"]
if "\x00" in payload or "\r" in payload:
    raise SystemExit(1)
settings = {}
for line in payload.split("\n"):
    if not line.strip() or line.lstrip().startswith("#"):
        continue
    key, separator, value = line.partition("=")
    if not separator or not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", key) or key in settings:
        raise SystemExit(1)
    settings[key] = value
expected = {
    "NODE_ENV": "production",
    "PORT": "3001",
    "TRUST_PROXY": "1",
    "FRONTEND_URL": "https://app." + host.removeprefix("api."),
    "GOOGLE_CALLBACK_URL": "https://" + host + "/auth/google/callback",
}
required = {"MONGO_URI", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "JWT_SECRET", "SESSION_SECRET"}
sheets_keys = {"GOOGLE_SHEET_ID", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"}
sheets_configured = {key for key in sheets_keys if settings.get(key, "").strip()}
if (
    any(settings.get(key) != value for key, value in expected.items())
    or any(not settings.get(key, "").strip() for key in required)
    or not settings["MONGO_URI"].startswith("mongodb+srv://")
    or (sheets_configured and sheets_configured != sheets_keys)
):
    raise SystemExit(1)
Path(filename).write_text(payload.rstrip("\n") + "\n")
print("required" if sheets_configured else "optional")
' "$work/api.env" "$version" "$api_host" 2>/dev/null
  )

  step="container inspection failed"
  local api_container proxy_container running_proxy wanted_proxy
  api_container=$(docker ps -aq --filter 'name=^/examtopics-api$' 2>/dev/null)
  proxy_container=$(docker ps -aq --filter 'name=^/examtopics-proxy$' 2>/dev/null)
  wanted_proxy=$(docker image inspect "$proxy_image" --format '{{.Id}}' 2>/dev/null)
  running_proxy=""
  if [[ -n $proxy_container ]]; then
    running_proxy=$(docker container inspect examtopics-proxy --format '{{.Image}} {{.State.Running}}' 2>/dev/null)
  fi

  local -a container_flags=(
    --network examtopics-staging --pull=never --restart unless-stopped
    --log-driver local --cap-drop ALL --security-opt no-new-privileges:true
  )

  step="API replacement failed"
  mv -f -- "$work/api.env" "$directory/api.env"
  if [[ -n $api_container ]]; then
    docker rm -f examtopics-api >/dev/null 2>&1
  fi
  docker run -d --name examtopics-api "${container_flags[@]}" --no-healthcheck \
    --env-file "$directory/api.env" "$api_image" >/dev/null 2>&1

  step="API readiness failed"
  local readiness='
const required = process.argv[1] === "required";
const deadline = Date.now() + 80000;
(async () => {
  do {
    try {
      const response = await fetch("http://127.0.0.1:3001/health/readiness", {
        signal: AbortSignal.timeout(4000), redirect: "error"
      });
      const { services } = await response.json();
      if (response.ok && services.mongodb === "connected" &&
          (!required || services.googleSheets === "connected")) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 5000));
  } while (Date.now() < deadline);
  process.exitCode = 1;
})().catch(() => { process.exitCode = 1; });
'
  timeout 90 docker exec examtopics-api node -e "$readiness" "$sheets" >/dev/null 2>&1

  step="proxy replacement failed"
  if [[ $running_proxy == "$wanted_proxy false" ]]; then
    docker start examtopics-proxy >/dev/null 2>&1
  elif [[ $running_proxy != "$wanted_proxy true" ]]; then
    if [[ -n $proxy_container ]]; then
      docker rm -f examtopics-proxy >/dev/null 2>&1
    fi
    docker run -d --name examtopics-proxy "${container_flags[@]}" --cap-add NET_BIND_SERVICE \
      -p 80:80 -p 443:443 \
      -v "$directory/Caddyfile:/etc/caddy/Caddyfile:ro" \
      -v examtopics-caddy-data:/data -v examtopics-caddy-config:/config "$proxy_image" >/dev/null 2>&1
  fi

  step="host release record could not be saved"
  printf '{"release":"%s","api_image":"%s","proxy_image":"%s","secret_version_id":"%s"}\n' \
    "$release" "$api_image" "$proxy_image" "$version" >"$work/current-release.json"
  mv -f -- "$work/current-release.json" "$directory/current-release.json"
  printf 'Staging host: API readiness passed\n'
)

if [[ ${BASH_SOURCE[0]} == "$0" ]]; then
  if (( EUID != 0 )); then
    printf 'Staging host: root is required\n' >&2
    exit 1
  fi
  # Only the EC2 instance role and local Docker daemon are eligible.
  export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
  for name in ${!AWS_@} ${!DOCKER_@}; do
    unset "$name"
  done
  unset HTTP_PROXY HTTPS_PROXY ALL_PROXY http_proxy https_proxy all_proxy
  export AWS_CONFIG_FILE=/dev/null AWS_SHARED_CREDENTIALS_FILE=/dev/null AWS_MAX_ATTEMPTS=2
  deploy /etc/examtopics "$@"
fi
