#!/usr/bin/env bash
set -eu
program=${0##*/}
printf '%s %s\n' "$program" "$*" >> "$FIXTURE_ROOT/commands"
if [[ $program == flock ]]; then
  exit 0
fi
if [[ $program == aws ]]; then
  if [[ $* == *get-login-password* ]]; then
    echo fixture-sensitive-value
    exit 0
  fi
  python3 - <<'PY'
import json
import os
version = os.environ["FIXTURE_VERSION"]
flag = os.environ.get("FIXTURE_FAIL")
env = """PORT=3001
NODE_ENV=production
FRONTEND_URL=https://app.staging.finbert.ngo
GOOGLE_CALLBACK_URL=https://api.staging.finbert.ngo/auth/google/callback
TRUST_PROXY=1
MONGO_URI=mongodb+srv://fixture.invalid/staging
GOOGLE_CLIENT_ID=staging-test-oauth-id
GOOGLE_CLIENT_SECRET=fixture-sensitive-value
JWT_SECRET=drawn-from-a-restricted-local-test-fixture
SESSION_SECRET=generated-for-use-in-disposable-fixtures
"""
if flag == "origin":
    env = env.replace("https://app.staging.finbert.ngo", "https://example.com")
print(json.dumps({"VersionId": "wrong" if flag == "version" else version, "SecretString": env}))
PY
  exit 0
fi
case "$1 $2" in
  "login --username") cat >/dev/null ;;
  "pull "*)
    if [[ ${FIXTURE_FAIL:-} == pull ]]; then
      echo fixture-sensitive-value >&2
      exit 1
    fi
    ;;
  "ps -aq")
    case "$*" in
      *examtopics-api*) echo a2a2 ;;
      *examtopics-proxy*) echo b3b3 ;;
    esac
    ;;
  "image inspect") echo "sha256:${3##*@sha256:}" ;;
  "container inspect") printf 'sha256:%s true\n' "${FIXTURE_PROXY##*@sha256:}" ;;
  "exec examtopics-api")
    if [[ ${FIXTURE_FAIL:-} == readiness ]]; then
      exit 1
    fi
    ;;
esac
exit 0
