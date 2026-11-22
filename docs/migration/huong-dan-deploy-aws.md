# Hướng dẫn triển khai ExamTopics lên AWS

Tài liệu tiếng Việt để triển khai staging lần đầu, cập nhật phiên bản, kiểm tra lỗi, rollback và chuẩn bị production. Mô hình là frontend React trên S3 private + CloudFront, API Express và Caddy trên EC2, MongoDB Atlas và Google ở bên ngoài AWS. Staging đã được người vận hành xác nhận hoạt động; mỗi lần triển khai vẫn phải kiểm tra lại target, quyền, credits và phiên bản release.

Tài liệu chỉ dùng tên biến và domain minh họa `example.com`. Không lưu account ID, địa chỉ IP, resource ID, ARN, digest, secret version, credential hoặc đường dẫn máy cá nhân thật. Các giá trị vận hành được lấy từ môi trường đã duyệt và lưu riêng. Không copy thông tin production vào tài liệu chia sẻ.

Mỗi lần build/publish tạo **hai tag cho mỗi thành phần**, cùng trỏ tới một image digest; không build hai image khác nhau chỉ để có hai tag:

| Thành phần | Tag lưu phiên bản để backup/rollback | Tag để EC2 chọn release mới nhất lúc deploy |
| --- | --- | --- |
| API | `api-${RELEASE}` | `api-latest` |
| Proxy Caddy | `proxy-${RELEASE}` | `proxy-latest` |

API và proxy dùng chung repository `${REPO}`, nên không dùng chung một tag `latest` hoặc `${RELEASE}` cho cả hai: tag sau sẽ ghi đè tag trước. Release tags phải immutable; chỉ hai latest tags được phép di chuyển. EC2 pull latest khi operator deploy, đối chiếu với release đã duyệt rồi chạy bằng digest cố định. Container đang chạy **không tự cập nhật** khi latest đổi; cần pull và tạo lại container như mục 13.

### Điều kiện trước khi dùng latest

Terraform hiện cấu hình ECR `IMMUTABLE`, nên lần push latest tiếp theo sẽ bị từ chối. Trước khi dùng luồng dưới, cần đề xuất riêng, review và phê duyệt thay đổi Terraform/ECR sang **`IMMUTABLE_WITH_EXCLUSION`**, với đúng hai exclusion filters loại `WILDCARD`, giá trị chính xác `api-latest` và `proxy-latest`. Không dùng wildcard rộng như `api-*`, `proxy-*` hoặc bật `MUTABLE` toàn repository. Không xóa tag latest để vượt immutability. Xem [AWS ECR tag mutability](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html).

Đây là hướng dẫn **release thủ công** sau khi điều kiện trên được duyệt và áp dụng. Tài liệu không thay đổi Terraform/ECR hiện tại và không cho phép bỏ qua lỗi push. Nếu dùng workflow tự động theo [deployment policy](../policies/aws-deployment-approval.md), giữ immutable publication và digest được kiểm soát bởi controller; thay đổi baseline/HCL/controller cần controller upgrade được duyệt riêng trước khi áp dụng luồng latest vào automation.

## 1. Chọn đúng quy trình

| Nhu cầu | Thực hiện |
| --- | --- |
| Dựng staging mới hoàn toàn | Mục 2–12 theo thứ tự |
| Chỉ cập nhật source trên staging đang chạy | Nạp lại biến local ở mục 2, kiểm tra mục 3, lấy lại outputs ở mục 5; build/publish mục 7–8; nạp biến EC2 và pull ở mục 9 rồi làm mục 10–13. Không lặp lại bootstrap host/DNS/Atlas |
| Chỉ đổi cấu hình backend | Nạp đúng target/profiles và outputs như trên, tạo secret version mới; dùng lại image digest của release healthy, dùng khối pull digest trực tiếp ở mục 9, làm mục 10 và thay API theo mục 13. Bỏ build/publish images và frontend |
| Chỉ đổi Terraform | Plan → review → phê duyệt → apply đúng saved plan; không tự publish app |
| Chuyển production sang AWS | Đọc mục 15 trước; đây là dự án riêng, chưa có production Terraform root sẵn |

Không paste toàn bộ tài liệu vào terminal. Chạy từng khối, đọc kết quả rồi mới tiếp tục. Các khối tạo/sửa tài nguyên, publish, thay container, DNS và rollback là thao tác thay đổi môi trường, cần phê duyệt đúng phạm vi theo [deployment policy](../policies/aws-deployment-approval.md). Tài liệu này không phải sự phê duyệt hay một script tự động chạy.

## 2. Hiểu nơi chạy và quyền truy cập

| Nơi chạy | Công việc |
| --- | --- |
| Máy local, ví dụ Mac | Terraform, build source, test, push ECR, upload S3 |
| Cloudflare Console | DNS validation ACM; CNAME frontend và A record API |
| Atlas và Google Cloud Console | Database/user/allowlist staging; OAuth client; Sheets fixture |
| AWS Console | Review tài nguyên, lưu secret value, xem image digest/version ID, vào Session Manager |
| EC2 qua Session Manager | Cài Docker, pull image, lấy secret vào env-file, chạy API/Caddy, kiểm tra nội bộ |

Tách các profile monitoring, planning, provisioning, publication và quản trị SSM. Monitoring có `freetier:GetAccountPlanState`, `ce:GetCostAndUsage`; planning không có quyền deployment. Publisher chỉ được push vào ECR và ghi vào S3 của môi trường được duyệt; thêm các quyền metadata cần dùng như `ecr:DescribeImages`, `s3:GetObjectVersion`/listing khi review hoặc rollback. Quyền xem secret versions thuộc operator được cấp quyền cho secret đó. EC2 dùng instance role, không chép AWS access key hay profile từ Mac lên host.

Các khối local dùng **Bash**. Mở một terminal dành cho deployment:

```bash
bash
umask 077
set +x
set -o pipefail
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_SECURITY_TOKEN
unset AWS_PROFILE AWS_DEFAULT_PROFILE AWS_ROLE_ARN AWS_WEB_IDENTITY_TOKEN_FILE
```

Nhập các giá trị thật bằng prompt; không gõ dấu `<...>` hay dấu `\<...>`:

```bash
read -r -p 'Đường dẫn checkout chứa Terraform đã review: ' PROJECT_ROOT
read -r -p 'Đường dẫn Terraform root staging: ' TF_ROOT
read -r -p 'Đường dẫn file input riêng của operator: ' TFVARS_FILE
read -r -p 'AWS account ID được duyệt: ' ACCOUNT_ID
read -r -p 'Profile monitoring: ' MONITOR_PROFILE
read -r -p 'Profile read-only planning: ' PLAN_PROFILE
read -r -p 'Profile provisioning được cấp quyền riêng: ' DEPLOY_PROFILE
read -r -p 'Profile publication ECR/S3: ' PUBLISH_PROFILE
REGION='ap-southeast-2'
ACM_REGION='us-east-1'
cd "${PROJECT_ROOT}"
```

`TF_ROOT` phải chứa code đã review, không phải checkout cũ còn region khác. Có thể dùng input riêng từ checkout khác bằng `-var-file`, nhưng sau apply phải tiếp tục dùng **cùng Terraform root và state**. Nếu chuyển sang terminal khác hoặc vào EC2, các biến ở terminal cũ không tự chuyển theo; nhập lại các metadata cần thiết.

Theo `AGENTS.md`, agent không được mở/print `.env`, `*.tfvars`, `*.tfstate`, private key hoặc credential files. Những lệnh Terraform trong tài liệu là thao tác operator tự thực hiện sau phê duyệt; không yêu cầu gửi các file đó cho agent.

## 3. Kiểm tra account Free plan và chi phí

Với mỗi profile, xác minh `sts get-caller-identity` trả đúng account. Ví dụ với monitoring:

```bash
aws sts get-caller-identity \
  --profile "${MONITOR_PROFILE}" --region "${REGION}" --no-cli-pager

aws freetier get-account-plan-state \
  --profile "${MONITOR_PROFILE}" --region us-east-1 --no-cli-pager
```

Chỉ tiếp tục khi đúng account, `FREE`, `ACTIVE`, chưa hết hạn, credits còn ít nhất USD 20. Không nâng Paid, không bật tính năng gây tự động nâng plan. Quyền bị từ chối phải được review; không fallback sang profile full access.

Lấy khoảng thời gian hiện tại theo UTC cho billing, rồi đọc chi phí trước credits/refunds:

```bash
COST_START="$(date -u +%Y-%m-01)"
COST_END="$(python3 -c 'from datetime import datetime,timedelta,timezone; print((datetime.now(timezone.utc)+timedelta(days=1)).date().isoformat())')"
date -u '+Checked at: %Y-%m-%d %H:%M:%S UTC'
aws ce get-cost-and-usage \
  --profile "${MONITOR_PROFILE}" --region us-east-1 \
  --time-period "Start=${COST_START},End=${COST_END}" \
  --granularity MONTHLY --metrics UnblendedCost \
  --filter '{"Not":{"Dimensions":{"Key":"RECORD_TYPE","Values":["Credit","Refund"]}}}' \
  --no-cli-pager
```

Xem `ResultsByTime[].Total.UnblendedCost.Amount`, currency và cờ `Estimated`. `End` là ngày không bao gồm; dữ liệu có thể trễ hơn 24 giờ. Ghi lại thời điểm đọc, gross spend, credits và ngày hết hạn. Cost Explorer primary billing view có phí USD 0.01/request; không gọi lặp để polling. Nếu service không khả dụng, dùng Billing Console thay vì nâng plan chỉ để mở tính năng.

Đối chiếu [dự toán staging](aws-staging-costs.md) và [cost guardrails](../policies/aws-cost-guardrails.md). Dự toán không phải chi phí thực tế hay đảm bảo zero cost. Monthly budget USD 20 áp dụng cả chi phí đã có và phần sắp thêm. Budget email không phải hard cap; nếu đồng thời giữ staging và thêm production, phải tính tổng trước khi duyệt.

## 4. Input, ACM và Terraform cho staging mới

Operator chuẩn bị các input theo schema trong `infra/terraform/staging/variables.tf`: account, suffix như `staging.example.com`, AMI Amazon Linux 2023 x86_64 tại Sydney, ACM certificate ARN, email Budget nếu có duyệt tạo Budget.

ACM frontend phải ở **us-east-1**, covers `app.<suffix>`, public certificate, export disabled, DNS validation và trạng thái `ISSUED`. Thêm đúng CNAME AWS cấp vào Cloudflare, DNS only; giữ record để gia hạn. API dùng TLS do Caddy cấp riêng. AMI phải đúng region, Amazon-owned, standard AL2023 x86_64, Free Tier eligible, và có SSM Agent đáp ứng runbook. Đừng nhầm tên role hợp lệ với việc đã xác minh toàn bộ effective IAM policy.

Khởi tạo và kiểm tra local, không dùng deployment credentials:

```bash
terraform version
terraform -chdir="${TF_ROOT}" init -backend=false -input=false -lockfile=readonly
terraform -chdir="${TF_ROOT}" fmt -check -recursive
terraform -chdir="${TF_ROOT}" validate
terraform -chdir="${TF_ROOT}" test -filter=tests/staging.tftest.hcl
```

Xem version constraints/CI hiện tại, không dựa vào thông tin toolchain cũ. Mock tests không tạo AWS resources. Lỗi provider handshake kèm `listen unix ... bind: operation not permitted` là giới hạn local sandbox; kiểm tra diagnostic rồi chạy offline trong môi trường cho phép local socket, không đổi provider version để đoán lỗi.

Sau khi quyền planning và target/state được duyệt, operator tạo saved plan:

```bash
aws sts get-caller-identity \
  --profile "${PLAN_PROFILE}" --region "${REGION}" --no-cli-pager

AWS_PROFILE="${PLAN_PROFILE}" terraform -chdir="${TF_ROOT}" plan \
  -input=false -var-file="${TFVARS_FILE}" -out=release.tfplan

terraform -chdir="${TF_ROOT}" show -no-color release.tfplan
shasum -a 256 "${TF_ROOT}/release.tfplan"
```

`staging.tfvars` không tự nạp như `terraform.tfvars`/`*.auto.tfvars`; dùng `-var-file` rõ ràng. Review `+` tạo, `~` sửa, `-` xóa, `-/+` thay thế; staging mới không nên có xóa/thay thế bất ngờ. Đối chiếu network, EC2 nhỏ, standard CPU credits, EBS mã hóa, S3 private/OAC, IAM và dịch vụ tính phí. Không suy ra chi phí từ số resources. Không xóa state để khắc phục lỗi tên trùng.

Điền báo cáo theo deployment policy: target/account/region/environment, plan digest, add/change/delete và addresses, plan/credits/spend timestamps, dự toán, security/production impact, rollback. Chỉ sau phê duyệt exact saved plan, kiểm tra lại identity, Free plan/credits và digest rồi apply:

```bash
aws sts get-caller-identity \
  --profile "${DEPLOY_PROFILE}" --region "${REGION}" --no-cli-pager
shasum -a 256 "${TF_ROOT}/release.tfplan"
AWS_PROFILE="${DEPLOY_PROFILE}" terraform -chdir="${TF_ROOT}" apply release.tfplan
```

**Apply saved plan không hỏi lại `yes`.** Không thêm `-auto-approve`; không chạy khối này trước khi duyệt. Apply lỗi giữa chừng có thể đã tạo một phần resources: giữ state, dừng, review lỗi và plan tiếp theo; không tự động retry/apply/destroy. State/plan có thể chứa thông tin nhạy cảm: giữ trên storage hạn chế quyền, mã hóa và backup riêng trước/sau apply. Không commit, không gửi vào chat và không xóa worktree còn giữ state.

## 5. Lấy outputs và cấu hình DNS cùng dịch vụ ngoài AWS

Sau apply thành công, trong **terminal local**:

```bash
REPO="$(terraform -chdir="${TF_ROOT}" output -raw release_repository_url)"
REGISTRY="${REPO%%/*}"
REPOSITORY_NAME="${REPO#*/}"
FRONTEND_BUCKET="$(terraform -chdir="${TF_ROOT}" output -raw frontend_bucket)"
FRONTEND_URL="$(terraform -chdir="${TF_ROOT}" output -raw frontend_url)"
API_URL="$(terraform -chdir="${TF_ROOT}" output -raw api_url)"
INSTANCE_ID="$(terraform -chdir="${TF_ROOT}" output -raw api_instance_id)"
API_IPV4="$(terraform -chdir="${TF_ROOT}" output -raw api_public_ipv4)"
CF_DOMAIN="$(terraform -chdir="${TF_ROOT}" output -raw frontend_distribution_domain)"
CF_ID="$(terraform -chdir="${TF_ROOT}" output -raw frontend_distribution_id)"
SECRET_ARN="$(terraform -chdir="${TF_ROOT}" output -raw api_environment_secret_arn)"
```

Đây là metadata; không lưu outputs thật vào tài liệu chia sẻ. Ghi chúng vào release record riêng. Outputs không chứng minh app đã chạy.

| Nơi cấu hình | Thiết lập |
| --- | --- |
| Cloudflare | CNAME hostname frontend tới `CF_DOMAIN`; A hostname API tới `API_IPV4`. DNS only, TTL Auto, không có API AAAA cũ. Không sửa apex/production/email records |
| Atlas staging | Project/cluster và database riêng hỗ trợ transactions; user giới hạn database staging; allowlist `API_IPV4/32`; TLS SRV connection string, URL-encode password nếu cần |
| Google OAuth | Web application client staging, redirect URI chính xác `API_URL/auth/google/callback`; frontend origin `FRONTEND_URL`; test users nếu consent đang Testing |
| Google Sheets | Bật Sheets API, fixture spreadsheet, service account staging; share fixture đúng quyền cho service account |

Mỗi thay đổi ngoài AWS cũng có phạm vi phê duyệt riêng. Giữ CNAME xác thực ACM để gia hạn. Nếu có CAA, review ảnh hưởng tới cả ACM và CA của Caddy trước khi sửa. Kiểm tra DNS bằng `dig +short` cho hostname thật; lúc này frontend/API chưa có source vẫn có thể trả lỗi.

## 6. Lưu backend configuration vào Secrets Manager

Mở đúng secret từ `SECRET_ARN` ở region mục tiêu. Terraform chỉ tạo secret metadata, **chưa tạo nội dung**. Operator lưu SecretString dạng **plaintext Docker env-file**, mỗi dòng `KEY=value`, không phải JSON. Ví dụ định dạng dưới là minh họa, không paste nguyên các giá trị trong ngoặc nhọn:

```ini
PORT=3001
NODE_ENV=production
TRUST_PROXY=1
FRONTEND_URL=https://app.staging.example.com
GOOGLE_CALLBACK_URL=https://api.staging.example.com/auth/google/callback
MONGO_URI={URI_DATABASE_RIENG}
JWT_SECRET={SECRET_NGAU_NHIEN_THU_NHAT}
SESSION_SECRET={SECRET_NGAU_NHIEN_THU_HAI}
GOOGLE_CLIENT_ID={OAUTH_CLIENT_ID}
GOOGLE_CLIENT_SECRET={OAUTH_CLIENT_SECRET}
GOOGLE_SHEET_ID={SPREADSHEET_ID}
GOOGLE_CLIENT_EMAIL={SERVICE_ACCOUNT_EMAIL}
GOOGLE_PRIVATE_KEY={PRIVATE_KEY_VOI_NEWLINE_DANG_BACKSLASH_N}
```

`TRUST_PROXY=1` phù hợp luồng trực tiếp Caddy → Express hiện tại; nếu đổi proxy topology phải review lại hop count. Dùng đúng URLs của môi trường, dù `NODE_ENV=production` cho cả staging và production. Không dùng secret/DB/client production trên staging. Không thêm các biến `MONGO_INITDB_*` của local Compose vào runtime cloud nếu không có nhu cầu riêng.

Sinh hai secret **trên máy của operator**, mỗi lệnh một giá trị khác nhau:

```bash
openssl rand -base64 32
openssl rand -base64 32
```

Hex từ `openssl rand -hex 32` cũng dùng được. Giữ nguyên ký tự Base64 `+`, `/`, `=`; không có `#` đầu dòng và không bao giá trị bằng nháy trong Docker env-file. Private key phải là một dòng chứa `\n`, không phải PEM nhiều dòng. Không gửi secrets vào chat/log/Git; secret từng lộ phải được thay, và đổi JWT/session secret có thể làm phiên đăng nhập mất hiệu lực. Production từ chối auth secret thiếu hoặc placeholder.

Sau khi lưu, vào **Versions**, chọn version đúng có label `AWSCURRENT`, copy **Version ID**. Đây không phải Secret ARN và không phải secret value. Lưu ID vào release record. Nếu chưa có version, nội dung chưa được lưu. Sheets chưa cấu hình không chặn mọi tính năng, nhưng chức năng report chưa sẵn sàng và phải kiểm tra riêng.

## 7. Build một release sạch trên máy local

Cần Docker đang chạy, Node đúng manifest, source commit đã review và các offline gates phù hợp đã đạt. Kiểm tra script/test trước khi chạy; không chạy migrations hoặc `test:oauth` vào DB thật. Không build trên EC2 nhỏ để tránh tranh tài nguyên với app.

Trong **cùng terminal local** đang có outputs:

```bash
cd "${PROJECT_ROOT}"
read -r -p 'SHA commit ứng dụng đã review: ' REVIEWED_COMMIT
REVIEWED_COMMIT="$(git rev-parse --verify "${REVIEWED_COMMIT}^{commit}")"
read -r -p 'Thư mục riêng để lưu artifacts và release record: ' RELEASE_STORE
mkdir -p "${RELEASE_STORE}"
RELEASE="${REVIEWED_COMMIT}-$(date -u +%Y%m%dT%H%M%SZ)"
RELEASE_DIR="$(mktemp -d "${RELEASE_STORE}/release.XXXXXX")"
git archive "${REVIEWED_COMMIT}" examtopics-backend examtopics-practice |
  tar -x -C "${RELEASE_DIR}"
```

Archive chỉ lấy source tracked của commit, không lấy các thay đổi chưa commit. Review để không có secrets trong commit; source frontend chỉ được chứa dữ liệu public phù hợp. Nhớ giữ release artifacts/record bên ngoài vùng bị dọn tự động, theo chính sách storage riêng.

```bash
(
  set -euo pipefail
  cd "${RELEASE_DIR}/examtopics-backend"
  npm ci
  npm test
  cd "${RELEASE_DIR}/examtopics-practice"
  npm ci
  npm test
  REACT_APP_BACKEND_URL="${API_URL}" \
  REACT_APP_FRONTEND_URL="${FRONTEND_URL}" npm run build
  rg --quiet --fixed-strings "${API_URL}" build/assets
)
docker build --platform linux/amd64 \
  -t "${REPO}:api-${RELEASE}" \
  -t "${REPO}:api-latest" "${RELEASE_DIR}/examtopics-backend"
```

Tạo manifest hashes cho frontend artifact, lưu cùng release directory riêng:

```bash
python3 - "${RELEASE_DIR}/examtopics-practice/build" "${RELEASE_DIR}/frontend-manifest.json" <<'PY'
from pathlib import Path
import hashlib
import json
import sys
build = Path(sys.argv[1])
manifest = {
    str(path.relative_to(build)): hashlib.sha256(path.read_bytes()).hexdigest()
    for path in sorted(build.rglob('*')) if path.is_file()
}
Path(sys.argv[2]).write_text(json.dumps(manifest, indent=2) + '\n')
print('Đã lưu frontend manifest, không publish file này vào bucket.')
PY
```

Đặt **cả hai** frontend URLs lúc build để tránh fallback tới backend/frontend production cũ. `REACT_APP_*` là public, tuyệt đối không có secrets. Output frontend là `build/`, không phải `dist/`. EC2 x86_64 cần image `linux/amd64`, kể cả khi máy build là Apple Silicon. Review base image digest, scan release image và xử lý các findings blocking trước deploy.

## 8. Chọn Caddy thật và publish ECR

`<VERSION>`/`<DIGEST>` là ký hiệu giải thích, không phải image reference hợp lệ. Chọn một tag phiên bản thật từ [Docker Official Images Caddy](https://github.com/docker-library/official-images/blob/master/library/caddy), review phiên bản đó và nhập tên đầy đủ, ví dụ định dạng `caddy:X.Y.Z-alpine` với số phiên bản thật:

```bash
read -r -p 'Tag Caddy chính thức đã chọn và review: ' CADDY_TAG
docker pull --platform linux/amd64 "${CADDY_TAG}"
docker image inspect "${CADDY_TAG}" --format '{{.Os}}/{{.Architecture}}'
CADDY_SOURCE="$(docker image inspect "${CADDY_TAG}" --format '{{index .RepoDigests 0}}')"
printf '%s\n' "${CADDY_SOURCE}"
docker tag "${CADDY_SOURCE}" "${REPO}:proxy-${RELEASE}"
docker tag "${REPO}:proxy-${RELEASE}" "${REPO}:proxy-latest"
```

Kiến trúc mong đợi `linux/amd64`, digest bắt đầu bằng tên repository và `@sha256:`. Pull không có nghĩa đã qua security review; hoàn tất review/scan theo quy trình release.

Chỉ sau phê duyệt publication, điều kiện ECR latest ở đầu tài liệu đã được áp dụng và kiểm tra publisher identity. Publish cả hai release tags trước, rồi mới cập nhật hai latest tags:

```bash
(
  set -euo pipefail
  aws sts get-caller-identity \
    --profile "${PUBLISH_PROFILE}" --region "${REGION}" --no-cli-pager
  aws ecr get-login-password --profile "${PUBLISH_PROFILE}" --region "${REGION}" |
    docker login --username AWS --password-stdin "${REGISTRY}"
  trap 'docker logout "${REGISTRY}" >/dev/null 2>&1 || true' EXIT
  docker push "${REPO}:api-${RELEASE}"
  docker push "${REPO}:proxy-${RELEASE}"
  docker push "${REPO}:api-latest"
  docker push "${REPO}:proxy-latest"
)
```

Không dùng `get-authorization-token` rồi in token. Login có thời hạn; logout ngay sau push hoặc sau khi xử lý một push lỗi. Với môi trường yêu cầu Docker config tạm, giữ đúng Docker Desktop context/socket và thiết lập cleanup trước login. Không publish nếu scan có Critical/High chưa giải quyết.

Hai lần cập nhật latest không phải giao dịch atomic. Chỉ publish/deploy một release tại một thời điểm. Nếu một push thất bại, dừng và giữ release record; không deploy cặp latest chưa hoàn tất hoặc tự retry thay đổi cloud ngoài phê duyệt. Việc lưu release tags trước bảo toàn tham chiếu tới phiên bản mới dù cập nhật latest bị gián đoạn; nó chưa chứng minh release healthy.

Lấy **digest trong ECR**, không dùng digest Docker Hub cho EC2 URI. Profile đọc metadata cần `ecr:DescribeImages` trên repository này:

```bash
API_DIGEST="$(aws ecr describe-images \
  --profile "${PUBLISH_PROFILE}" --region "${REGION}" \
  --registry-id "${ACCOUNT_ID}" --repository-name "${REPOSITORY_NAME}" \
  --image-ids "imageTag=api-${RELEASE}" \
  --query 'imageDetails[0].imageDigest' --output text --no-cli-pager)"
PROXY_DIGEST="$(aws ecr describe-images \
  --profile "${PUBLISH_PROFILE}" --region "${REGION}" \
  --registry-id "${ACCOUNT_ID}" --repository-name "${REPOSITORY_NAME}" \
  --image-ids "imageTag=proxy-${RELEASE}" \
  --query 'imageDetails[0].imageDigest' --output text --no-cli-pager)"
API_IMAGE="${REPO}@${API_DIGEST}"
PROXY_IMAGE="${REPO}@${PROXY_DIGEST}"
printf '%s\n' "${API_IMAGE}" "${PROXY_IMAGE}"
```

Chỉ tiếp tục nếu mỗi digest là `sha256:` + 64 ký tự hex, không rỗng/`None`/placeholder. Release tags `api-${RELEASE}`/`proxy-${RELEASE}` giữ immutable: nếu push trùng release tag, dùng lại digest đã review hoặc tạo release ID mới có review tương ứng. `api-latest`/`proxy-latest` là hai alias mutable duy nhất; không tắt immutability của release tags. Lưu API/proxy digests, commit và release ID trong record riêng để đối chiếu lúc EC2 pull latest. Với proxy không đổi, nhiều release tags có thể cùng trỏ tới một digest.

Release tags phục vụ backup image/rollback, không thay thế backup dữ liệu, secret version hoặc frontend artifacts. Giữ các tagged release đang chạy và rollback; kiểm soát dung lượng/chi phí theo cost guardrails, không tự cleanup backup images.

## 9. Chuẩn bị EC2 lần đầu qua Session Manager

Ở AWS Console chọn đúng region → EC2 → instance từ output → Connect → Session Manager. Nếu không online, kiểm tra SSM Agent, instance role, DNS/route/EIP và outbound HTTPS; không mở inbound SSH hay tăng quyền để đi vòng. Chỉ quản trị host sau phê duyệt.

Trên **EC2**, dùng root shell:

```bash
sudo -i
bash
umask 077
set +x
set -o pipefail
dnf install -y docker
systemctl enable --now docker
aws --version
docker --version
```

Cài bản vá AL2023 đã duyệt; nếu chưa có AWS CLI, dùng cách cài chính thức cho AL2023 x86_64 trước khi tiếp tục. Không chép local AWS credentials lên EC2. Instance role được dùng bởi AWS CLI trên host, không truyền role credentials vào containers; không đổi IMDS hop limit chỉ để containers lấy credentials.

Nhập lại metadata trong **terminal EC2**, vì biến từ Mac không tồn tại ở đây:

```bash
read -r -p 'AWS account ID được duyệt: ' ACCOUNT_ID
read -r -p 'API hostname, không có https://: ' API_HOST
read -r -p 'ECR repository URI, không có tag hoặc digest: ' REPO
read -r -p 'ECR URI API theo digest của release đã duyệt ở mục 8: ' API_IMAGE
read -r -p 'ECR URI proxy theo digest của release đã duyệt ở mục 8: ' PROXY_IMAGE
read -r -p 'Secret ARN đúng môi trường: ' SECRET_ARN
read -r -p 'Secret Version ID đã chọn: ' SECRET_VERSION_ID
REGION='ap-southeast-2'
REGISTRY="${REPO%%/*}"
API_LATEST="${REPO}:api-latest"
PROXY_LATEST="${REPO}:proxy-latest"
```

Đối chiếu account/region/repository trong `REPO`, cả hai image URIs và secret ARN với release đã duyệt. `API_IMAGE`/`PROXY_IMAGE` phải là các URI `${REPO}@sha256:...` từ release record, không phải latest tags. `API_HOST` chỉ là hostname ASCII, không chứa slash, dấu nháy, khoảng trắng hoặc newline. Metadata không phải secrets, nhưng cũng không đưa vào tài liệu public. Không nhập secret payload ở prompt.

```bash
(
  set -euo pipefail
  aws sts get-caller-identity --region "${REGION}" --no-cli-pager
  aws ecr get-login-password --region "${REGION}" |
    docker login --username AWS --password-stdin "${REGISTRY}"
  trap 'docker logout "${REGISTRY}" >/dev/null 2>&1 || true' EXIT
  docker pull "${API_LATEST}"
  docker pull "${PROXY_LATEST}"
  PULLED_API_IMAGE="$(docker image inspect "${API_LATEST}" --format '{{index .RepoDigests 0}}')"
  PULLED_PROXY_IMAGE="$(docker image inspect "${PROXY_LATEST}" --format '{{index .RepoDigests 0}}')"
  if [[ "${PULLED_API_IMAGE}" != "${API_IMAGE}" || "${PULLED_PROXY_IMAGE}" != "${PROXY_IMAGE}" ]]; then
    echo 'Latest không khớp cặp digest của release đã duyệt; dừng, không thay containers.'
    exit 1
  fi
)
```

Kiểm tra identity là instance role đúng account. Khối trên luôn pull latest, không dùng cache cũ để chọn bản mới, và kiểm tra cả hai digest trước khi dừng app. Sau khi khối thành công, các lệnh run ở mục 11 tiếp tục dùng `API_IMAGE`/`PROXY_IMAGE` cố định với `--pull=never`; latest đổi trong lúc deploy không làm container chạy nhầm release. Pull không tạo container. Không chạy `docker inspect` toàn bộ container hoặc `env` để chẩn đoán vì có thể lộ cấu hình nhạy cảm.

**Chỉ đổi cấu hình hoặc rollback:** giữ `API_IMAGE`/`PROXY_IMAGE` theo digest của release healthy đã ghi và được duyệt; bỏ qua toàn bộ khối pull latest ở trên, dùng khối dưới thay thế. Latest có thể vẫn trỏ tới một release khác sau rollback; không thay images chỉ vì cần đổi secret.

```bash
(
  set -euo pipefail
  aws sts get-caller-identity --region "${REGION}" --no-cli-pager
  aws ecr get-login-password --region "${REGION}" |
    docker login --username AWS --password-stdin "${REGISTRY}"
  trap 'docker logout "${REGISTRY}" >/dev/null 2>&1 || true' EXIT
  docker pull "${API_IMAGE}"
  docker pull "${PROXY_IMAGE}"
)
```

```bash
docker network inspect examtopics-staging >/dev/null 2>&1 ||
  docker network create examtopics-staging
docker volume create examtopics-caddy-data
docker volume create examtopics-caddy-config
install -d -m 0700 /etc/examtopics
```

Chỉ tạo Caddyfile dưới đây cho lần dựng host mới; khi cập nhật host đang chạy, review file hiện có trước, không ghi đè tùy tiện. Các tên network/container/volume trong staging phải được dùng nhất quán; production dùng bộ tên riêng đã thiết kế ở mục 15.

```bash
cat > /etc/examtopics/Caddyfile <<CADDY
${API_HOST} {
    header Strict-Transport-Security "max-age=31536000"
    @internalHealth path /health /health/*
    respond @internalHealth 404
    reverse_proxy examtopics-api:3001
}
CADDY
chmod 600 /etc/examtopics/Caddyfile
```

Giữ access logs của proxy tắt vì OAuth callbacks có URL parameters nhạy cảm. Volumes `/data` và `/config` phải persistent để giữ chứng chỉ. DNS API trỏ đúng EIP, port 80/443 reachable, Caddy khởi động thì API TLS mới được cấp; không copy ACM certificate frontend sang Caddy.

## 10. Tạo api.env từ đúng secret version

Trên EC2, cần có secret version đã lưu ở mục 6. File này không tự xuất hiện khi Terraform apply hoặc docker pull. Dùng khối atomic write để AWS lỗi không tạo file cấu hình rỗng:

```bash
(
  set -euo pipefail
  umask 077
  : "${SECRET_ARN:?Chưa nhập Secret ARN}" "${SECRET_VERSION_ID:?Chưa nhập Version ID}"
  install -d -m 0700 /etc/examtopics
  ENV_TMP="$(mktemp /etc/examtopics/api.env.XXXXXX)"
  trap 'rm -f "${ENV_TMP}"' EXIT
  aws secretsmanager get-secret-value --region "${REGION}" \
    --secret-id "${SECRET_ARN}" --version-id "${SECRET_VERSION_ID}" \
    --query SecretString --output text --no-cli-pager > "${ENV_TMP}"
  for ENV_NAME in MONGO_URI JWT_SECRET SESSION_SECRET GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET FRONTEND_URL GOOGLE_CALLBACK_URL; do
    grep -q "^${ENV_NAME}=." "${ENV_TMP}" || {
      echo "Thiếu ${ENV_NAME} hoặc secret chưa đúng dạng env-file"
      exit 1
    }
  done
  mv -f "${ENV_TMP}" /etc/examtopics/api.env
  chmod 600 /etc/examtopics/api.env
)
ls -l /etc/examtopics/api.env /etc/examtopics/Caddyfile
```

Không `cat`, `printenv`, `set -x`, `docker inspect` toàn bộ hoặc gửi file này vào chat. Nếu `AccessDenied`, dừng và review quyền cho đúng secret; không fallback credentials rộng. Nếu thiếu file, xử lý bước này trước khi `docker run`. Các kiểm tra trên chỉ xác nhận một số key không rỗng, không thay thế việc review đầy đủ URI, URLs và secrets thật.

## 11. Tạo và chạy containers lần đầu

Trước tiên `docker ps -a`. Khối dưới dành cho trường hợp **chưa có** containers mang đúng tên; nếu đã có hoặc đang cập nhật release, dùng mục 13. Không xóa container đang chạy để “thử lại”.

```bash
(
  set -euo pipefail
  : "${API_IMAGE:?Chưa nhập API_IMAGE}" "${PROXY_IMAGE:?Chưa nhập PROXY_IMAGE}"
  test -s /etc/examtopics/api.env
  test -s /etc/examtopics/Caddyfile
  docker image inspect "${API_IMAGE}" >/dev/null
  docker image inspect "${PROXY_IMAGE}" >/dev/null
  docker network inspect examtopics-staging >/dev/null
  docker run -d --name examtopics-api --network examtopics-staging \
    --pull=never --restart unless-stopped --no-healthcheck --log-driver local \
    --cap-drop ALL --security-opt no-new-privileges:true \
    --env-file /etc/examtopics/api.env "${API_IMAGE}"
)
docker ps -a --filter name=examtopics-api
```

API phải `Up`, không `Restarting`/`Exited`. Kiểm tra readiness trước khi tiếp tục:

```bash
docker exec examtopics-api node -e '
fetch("http://127.0.0.1:3001/health/readiness").then(async r => {
  const body = await r.json();
  console.log(r.status, body.services);
  process.exitCode = r.ok ? 0 : 1;
}).catch(() => { console.error("readiness request failed"); process.exitCode = 1; });'
```

MongoDB phải connected; Sheets phải kiểm tra riêng nếu dùng report. HTTP 200 ở đây không chứng minh Sheets đã connected. Nếu API chưa healthy, dừng, đọc lỗi nội bộ đã lọc dữ liệu nhạy cảm và sửa đúng nguyên nhân; không retry mù hoặc publish frontend mới.

Sau khi API sẵn sàng, chạy proxy:

```bash
docker run -d --name examtopics-proxy --network examtopics-staging \
  --pull=never --restart unless-stopped --log-driver local \
  --cap-drop ALL --cap-add NET_BIND_SERVICE --security-opt no-new-privileges:true \
  -p 80:80 -p 443:443 \
  -v /etc/examtopics/Caddyfile:/etc/caddy/Caddyfile:ro \
  -v examtopics-caddy-data:/data -v examtopics-caddy-config:/config \
  "${PROXY_IMAGE}"
docker ps
```

Cần thấy cả API và proxy `Up`. Không public port 3001. Không chạy app/API trên host network để chữa lỗi kết nối giữa containers.

## 12. Publish frontend và nghiệm thu

Quay lại **terminal local** đã build source, không chạy từ EC2. Trước khi ghi S3: ghi lại release cũ, file manifest/build artifact và Version ID của `index.html` cũ trong S3 Versioning, trừ lần đầu bucket trống. Giữ index cũ tương ứng assets cũ; không upload đè assets không có hash nếu vẫn đang cache. Sau khi publication được duyệt:

```bash
(
  set -euo pipefail
  : "${PUBLISH_PROFILE:?}" "${FRONTEND_BUCKET:?}" "${RELEASE_DIR:?}"
  BUILD_DIR="${RELEASE_DIR}/examtopics-practice/build"
  test -s "${BUILD_DIR}/index.html"
  aws s3 sync "${BUILD_DIR}/" "s3://${FRONTEND_BUCKET}/" --exclude index.html \
    --profile "${PUBLISH_PROFILE}" --region "${REGION}"
  aws s3 cp "${BUILD_DIR}/index.html" "s3://${FRONTEND_BUCKET}/index.html" \
    --content-type 'text/html; charset=utf-8' --cache-control no-cache \
    --profile "${PUBLISH_PROFILE}" --region "${REGION}"
)
```

Không thêm `--delete`. Default behavior không cache, `/assets/*` cache optimized; assets trong nhánh cache phải content-hashed. Không cần bật S3 public hay S3 website endpoint. Chỉ invalidation nếu thật sự cần cho key đã cache bị tái sử dụng, và phải có phê duyệt riêng.

Checklist nghiệm thu trước khi đánh dấu release thành công:

- [ ] Cả hai containers Up; internal readiness MongoDB connected và Sheets connected nếu report thuộc scope.
- [ ] Frontend HTTPS hợp lệ, JS/CSS/JSON/images đúng MIME, refresh deep link được, missing asset không bị biến thành HTML giả.
- [ ] Browser Network chỉ gọi API đúng môi trường; không còn fallback tới backend production cũ.
- [ ] Google login, callback, reload, session, logout; tài khoản thường bị từ chối ở admin routes.
- [ ] Exam reads, progress/report writes và user isolation được kiểm tra bằng dữ liệu staging; MongoDB transactions hoạt động.
- [ ] S3 private không truy cập anonymous; không mở SSH hoặc Express 3001 ra internet; không có secrets trong frontend bundle.
- [ ] Lưu release record: commit, thời điểm, target, API/proxy ECR digests, secret Version ID, frontend build manifest và index Version ID, kiểm tra đã chạy, phê duyệt và rollback release.

`https://<API_HOST>/health` và `/health/readiness` **trả 404 bên ngoài là chủ ý của Caddy**. Không bỏ chặn để làm test chuyển xanh. Trên máy local có thể dùng `curl -I "${API_URL}/health"`: 404 phù hợp cấu hình; 502 là proxy không nối được API; lỗi DNS/TLS/timeout cần điều tra riêng. 404 không thay thế kiểm tra API chức năng và internal readiness.

## 13. Cập nhật release trên môi trường đang chạy

Không chạy Terraform lại nếu chỉ đổi source và hạ tầng không đổi. Không dựng lại Atlas/OAuth/DNS cho mỗi release. Khi bắt đầu từ terminal mới: làm mục 2, mục 3 và phần lấy outputs mục 5 trước; trên EC2 nạp lại metadata và pull images ở mục 9 nhưng không chạy lại install/network/Caddyfile bootstrap. Nếu chỉ đổi secret, bỏ qua build/publish mới và dùng lại API/proxy digests đã review trong release record.

1. Xác minh target, Free plan/credits, chi phí; chạy quality gates và build từ commit đã review như mục 7. Tạo release ID mới và giữ artifact frontend.
2. Review/scan, publish cả `api-${RELEASE}`/`proxy-${RELEASE}` và `api-latest`/`proxy-latest` theo mục 8. Với proxy không đổi, dùng lại digest Caddy đã review để tạo proxy release tag mới và cập nhật proxy latest, không cần build lại Caddy. Với secret không đổi, dùng lại version đã ghi; nếu đổi, tạo version mới và ghi rollback version.
3. Khi cập nhật source, trên EC2 làm khối pull latest và đối chiếu **cả hai** digest ở mục 9 **trước khi dừng app**. Khi chỉ đổi cấu hình, bỏ build/publish ở bước 1–2 và dùng khối pull digest trực tiếp ở mục 9 với images của release healthy; không yêu cầu chúng khớp latest. Ghi lại old API/proxy digest và secret Version ID từ release record; không dump container env. Xác nhận rollback artifacts còn tồn tại và tương thích dữ liệu. Push latest không tự restart containers.
4. Chuẩn bị env-file mới từ version đã chọn theo mục 10. Đổi file trên host không làm môi trường container đang chạy thay đổi; cần tạo lại container API. Giữ quyền 600, không log payload.
5. Sau phê duyệt exact container replacement và cửa sổ bảo trì, thay API. Single-host này có gián đoạn ngắn khi thay container; không coi là zero downtime:

```bash
# Trên EC2; chỉ khi đã pre-pull, kiểm tra input và duyệt thay API.
docker stop examtopics-api
docker rm examtopics-api
```

6. Tạo lại API bằng **khối API ở mục 11**, dùng `API_IMAGE` mới và env-file đã chuẩn bị. Kiểm tra Up và readiness. Nếu thất bại, dừng quy trình và chuyển sang rollback đã được duyệt riêng; không publish frontend.
7. Nếu cần đổi proxy image/config, pull và review config trước, duyệt riêng rồi stop/rm chỉ `examtopics-proxy`, tạo lại bằng khối proxy mục 11. Giữ nguyên Caddy volumes và không xóa `/etc/examtopics`. Không cần restart proxy chỉ vì API đổi nếu proxy/config không thay đổi; kiểm tra API qua HTTPS sau replacement.
8. Với source release, sau backend sẵn sàng và tương thích cả frontend cũ/mới, publish frontend theo mục 12; index cuối cùng. Khi chỉ đổi cấu hình backend, giữ nguyên frontend đã chạy, không build/upload frontend. Chạy checklist rồi lưu record release mới và theo dõi sau deploy.

Nếu thay schema hoặc ownership data, cần kế hoạch migration, fixture/backup và tương thích riêng. Không chạy `npm run migrate:*`, backend scripts hoặc OAuth test live chỉ vì đang deploy. Không gộp data migration vào một lệnh cập nhật container.

### 13.1. Tự động deploy `develop` bằng CodeBuild webhook

Luồng hiện tại là **GitHub push develop → CodeBuild → S3/ECR → SSM cập nhật EC2**. Không cần IAM OIDC provider, AWS access keys trong GitHub hoặc self-hosted runner. Xem [hướng dẫn cấu hình CodeBuild, GitHub App, IAM và recovery](codebuild-develop.md) trước khi bật webhook.

Buildspec ở [`deploy/codebuild/buildspec.yml`](../../deploy/codebuild/buildspec.yml). Controller chọn frontend/backend theo toàn bộ path từng đổi từ release thành công gần nhất, kể cả path đã revert. `.nvmrc` và `deploy/codebuild/**` build cả hai; `infra/**` không tự apply, batch/downloader chỉ kích hoạt khi output trong frontend/backend đổi. Cả hai đổi thì backend phải readiness thành công trước khi publish frontend.

Project dùng GitHub App qua CodeConnections và IAM service role; monitoring và publication dùng hai assumed roles riêng. Build/test chạy trước publication; chỉ PUSH cho `refs/heads/develop` được chấp nhận. Khóa conditional S3 giữ publication tuần tự; build lỗi giữa publication giữ khóa để người vận hành kiểm tra trước khi cho lần tiếp theo chạy. Không đặt project concurrency limit bằng 1 vì có thể làm mất webhook khi build đang chạy.

Đây là cấu hình local cho automation owner yêu cầu. Tạo/sửa CodeBuild, connection, roles, bucket, log group/KMS, bật webhook và push source cần phê duyệt thao tác riêng. Giữ Free plan; nếu account chặn service/role/connection cần thiết thì dừng, không nâng Paid hoặc bật advanced features để vượt lỗi. Render/master, Atlas và DNS production giữ nguyên.

## 14. Lỗi đã gặp và cách xử lý

| Triệu chứng | Nguyên nhân thường gặp | Cách kiểm tra và xử lý |
| --- | --- | --- |
| Docker tag thành đường dẫn máy local, thiếu dấu `:`, xuất hiện chữ `pi-` | zsh hiểu `$REPO:api` như modifier `:a` | Dùng `"${REPO}:api-${RELEASE}"`, `"${REPO}:proxy-${RELEASE}"`; tốt nhất dùng Bash cho toàn bộ walkthrough |
| `invalid reference format`, biến còn `<VERSION>` hoặc `\<DIGEST>` | Đã chạy nguyên placeholder | Nhập tag thật, pull rồi lấy digest bằng image inspect; không chỉ sửa dấu nháy. `printf '%s\n' "${CADDY_SOURCE}"` để xem metadata |
| Biến rỗng khi vào EC2 hoặc mở terminal mới | Biến shell chỉ tồn tại trong session đã đặt | Nhập lại metadata theo mục 9; không chép file credentials hay secret payload từ Mac sang shell |
| Push bị từ chối auth | Login hết hạn, sai registry/profile/quyền | Review identity và repository; login ECR qua password-stdin đúng region, dừng nếu AccessDenied |
| ECR báo release tag đã tồn tại | `api-${RELEASE}`/`proxy-${RELEASE}` immutable | Dùng digest cũ đã review hoặc release mới được duyệt; không disable immutability |
| ECR không cho cập nhật latest | Chưa áp dụng đúng hai mutability exclusions | Dừng; review/phê duyệt thay đổi Terraform/ECR như điều kiện đầu tài liệu, không xóa latest để vượt lỗi |
| EC2 kéo latest nhưng digest không khớp release | Publish bị gián đoạn, sai repository hoặc một release khác đã cập nhật alias | Không dừng app; đối chiếu release record và cặp API/proxy mới được duyệt, không tự chọn digest lạ |
| Latest đã đổi nhưng container vẫn chạy code cũ | Docker không tự pull/recreate container | Thực hiện pre-pull, kiểm tra digest và thay container theo mục 13; chỉ restart container cũ không cập nhật image |
| `No such file .../api.env` | Chưa lấy secret value xuống EC2 | Lưu plaintext secret version, lấy đúng version theo mục 10; không tạo file rỗng để vượt lỗi |
| Có file nhưng app thiếu biến | Secret lưu JSON, nháy giữ nguyên, key bị comment hoặc sai tên | Review định dạng KEY=value, không `#`, không nháy; không in nội dung để debug |
| `No such container: examtopics-api`, `docker ps` trống | Chỉ pull image, chưa docker run hoặc dùng tên sai | `docker ps -a`, `docker image ls --digests`, kiểm tra files/network; nếu chưa có container thì tạo theo mục 11 |
| Container Exited/Restarting | Startup lỗi, secrets/OAuth/MongoDB sai hoặc kiến trúc không khớp | Xem status và log nội bộ đã lọc; kiểm tra từng dependency, amd64, URI/allowlist. Không retry mù |
| API gọi nội bộ OK, public health 404 | Caddy chặn health theo thiết kế | Giữ rule; test internal readiness và chức năng API thật |
| Public 502 | Proxy chưa nối được API | Kiểm tra API Up, cùng Docker network, tên upstream và port 3001; không mở port ra public |
| TLS chưa cấp được hoặc timeout | DNS/proxy Cloudflare/AAAA/CAA/ports hoặc Caddy chưa chạy | DNS only; A tới EIP; không AAAA stale; kiểm tra 80/443, CAA và persistent Caddy data |
| Login chạy về domain cũ hoặc lỗi redirect/CORS | Frontend build hoặc backend URLs/OAuth callback sai môi trường | Build lại frontend với cả hai URLs; đúng FRONTEND_URL và exact callback URI, giữ auth/CORS protections |
| Readiness 200 nhưng report lỗi | MongoDB OK nhưng Sheets chưa connected | Xem `body.services`, kiểm tra Sheets API, service account và share fixture; không coi 200 là tất cả dependencies OK |
| Terraform provider không khởi động trong sandbox | Unix socket local bị chặn | Xem diagnostic; chạy offline ở môi trường cho phép socket, không AWS credentials và không đổi version tùy tiện |

Khi gửi lỗi để hỗ trợ, chỉ gửi metadata/status/thông báo đã loại bí mật. Không gửi env-file, state, tfvars, token, raw OAuth URLs hoặc toàn bộ `docker inspect`.

## 15. Chuẩn bị production sau khi staging đã nghiệm thu

**Production chưa được cấu hình sẵn trong Terraform hiện tại.** Root staging cố định tên resources, tag `Environment=staging`, secret path, runtime names và validation suffix bắt đầu bằng `staging`. Không đổi vài input hoặc dùng Terraform workspace khác để coi đó là production; có nguy cơ target sai, tên global trùng và thay resources đang chạy.

### 15.1 Hoàn tất trước khi lập production plan

- Chốt kiến trúc và yêu cầu availability. Single EC2 của staging không có load balancing/failover tự động; production phải chấp nhận rõ giới hạn này hoặc duyệt kiến trúc khác cùng dự toán.
- Thiết kế Terraform root production riêng hoặc refactor được review để environment hóa đầy đủ: account, region, state, domain validation, resource names, IAM, S3/ECR/secret paths, tags, outputs và tests. State/account/resource namespaces tách khỏi staging; không tự tạo Organizations/Control Tower vì có thể nâng Free plan.
- Dự toán tổng chi phí staging và production trong giai đoạn chạy song song, cả public IPv4/storage/transfer/logs/backups. Nếu vượt budget hoặc không đáp ứng Free plan/credits, dừng; thay đổi policy/plan account cần phê duyệt riêng, không tự nâng Paid.
- Tách production DB/user/network allowlist/secrets/OAuth/Sheets. Khi chuyển dữ liệu thật, có backup được kiểm thử phục hồi, data/schema compatibility và ownership cutover runbook. Mọi thay đổi production Atlas cần phê duyệt riêng.
- Review production IAM, short-lived provisioning/publisher/SSM permissions, secret handling và vận hành. Không lấy profile planning để apply hoặc gắn full access để sửa lỗi.
- Chốt release và rollback artifacts, thời gian bảo trì, người quyết định, ngưỡng lỗi/latency/OAuth/data integrity và thời gian quan sát. Giữ Render hoạt động tới khi migration được nghiệm thu.
- Trước PR/merge master, dùng release-readiness và review độc lập QA/security. Matching master pushes/merges có thể deploy Render production; không push/merge/dispatch chỉ để “chuẩn bị AWS” nếu chưa được duyệt.

### 15.2 Trình tự triển khai production đã được phê duyệt

1. Chạy offline gates của code/IaC production. Xác minh account/region/state, Free plan/credits/spend qua các quyền được duyệt. Chọn AMI production đúng regional requirements; cấp/validate production ACM ở us-east-1 theo phê duyệt riêng và chờ ISSUED **trước khi lập plan**, vì kiến trúc hiện dùng certificate ARN có sẵn làm input. DNS validation này không phải DNS cutover traffic. Sau đó lập saved plan mới và approval report production.
2. Apply **production saved plan** sau phê duyệt exact operation. Đây chưa phải thao tác chuyển traffic. Không dùng lệnh ở mục 4 để apply root staging cho production.
3. Chuẩn bị backend TLS, DB/secrets/OAuth, host và images theo các thao tác được duyệt; dùng production ACM đã cấp ở bước 1 cho CloudFront. Có thể promote backend image đã qua staging bằng digest và mirror đúng production ECR; không rebuild tùy tiện. Ghi actual digest ở repository đích.
4. **Build frontend lại cho production**, vì API/frontend URLs nằm trong bundle. Không upload nguyên staging build sang production. Kiểm thử bằng hostname kiểm chứng đã được duyệt trước cutover, hoặc phương án routing thử được chốt riêng.
5. Review HTTPS, readiness, Google login, sessions, dữ liệu, writes, permissions, reports và load/latency theo tiêu chí đã chốt. Không để hai đường ghi dữ liệu thật hoạt động thiếu kiểm soát trong thời gian chuyển đổi.
6. Phê duyệt riêng DNS cutover: ghi giá trị/TTL cũ, hạ TTL trước theo kế hoạch, chuyển đúng records, theo dõi traffic và kiểm tra từ browser thực. Giữ Render, cấu hình cũ và khả năng rollback còn dùng được; không thay toàn bộ nameservers nếu chỉ cần đổi records.
7. Nếu tiêu chí fail, dừng writes khi cần và dùng rollback được phê duyệt; kiểm tra/reconcile writes trước khi quay lại hệ thống cũ. Chỉ sau nghiệm thu mới đề xuất riêng việc retire Render/tài nguyên cũ và dọn DNS/allowlist/credentials.

Không có lệnh production apply sẵn trong tài liệu vì production root và saved plan phải được thiết kế/review trước. Các thao tác source deployment có thể dùng lại mô hình build/push/pull/run/publish ở trên sau khi thay toàn bộ target bằng production metadata và runtime names đã duyệt.

## 16. Rollback và record cho lần sau

**Rollback ứng dụng:** xác định previous API/proxy ECR digests, secret Version ID, frontend artifact/manifest và index S3 Version ID. Kiểm tra chúng còn tồn tại, scan/review phù hợp và tương thích schema/data hiện tại. Sau phê duyệt rollback riêng: pull images cũ trước, lấy secret version cũ vào env-file, thay đúng containers như mục 13, health check, bảo đảm old assets còn có rồi khôi phục index cũ **cuối cùng**. Không rollback secret bằng cách đổi AWSCURRENT mù; pin Version ID theo release. Không xóa Caddy volumes. Xác minh OAuth, writes và user isolation sau rollback.

Khi rollback, lấy digest từ `api-${RELEASE_CU}`/`proxy-${RELEASE_CU}` hoặc release record, rồi dùng **khối pull digest trực tiếp ở mục 9** cho `API_IMAGE`/`PROXY_IMAGE`. **Bỏ qua khối pull latest** vì latest đang chỉ tới release mới. Không cập nhật lại latest để rollback nếu thao tác retag đó chưa nằm trong phê duyệt riêng.

**Rollback hạ tầng:** dùng prior reviewed code + current state để tạo plan mới, review/hash và phê duyệt mới. Không dùng saved plan đã apply hay `terraform destroy` làm rollback mặc định. Xóa bucket versions, ECR images, secret, EIP hay các DNS records là các thao tác có scope/phê duyệt riêng.

**Rollback production traffic:** dùng DNS target/TTL cũ và Render còn chạy theo kế hoạch cutover. Kiểm tra dữ liệu ghi trong thời gian chạy AWS; không chỉ đổi DNS rồi coi dữ liệu tự đồng bộ.

Release record riêng tối thiểu cần có:

| Nội dung | Giá trị phải lưu ngoài tài liệu public |
| --- | --- |
| Target | Environment, account, region, hostname, Terraform root/state location, instance và outputs |
| Bản phát hành | Reviewed commit, release ID, API/proxy ECR digests và nguồn image |
| Cấu hình | Secret ARN và Version ID; không có secret value |
| Frontend | Build artifacts, file hashes/manifest, API/frontend origins đã compile và index S3 Version ID |
| Phê duyệt | Exact scope, saved-plan digest nếu có, người duyệt và timestamps |
| Kiểm tra | Gates đã chạy, browser/API/dependency checks, gaps còn lại và thời gian quan sát |
| Rollback | Previous release đủ artifacts, tương thích dữ liệu, DNS cũ nếu cutover |

Theo dõi sau deploy: EC2 status, CPU credits, memory/đĩa theo công cụ được duyệt, log rotation, TLS renewal, Free plan expiration/credits và chi phí gross. Alarm EC2 hiện không có email action và không phải HTTP monitor; Budget chỉ tạo nếu có email input, không chặn chi tiêu. Dừng EC2 không xóa EBS/EIP/storage charges. Trước cleanup local, bảo toàn Terraform state và release artifacts trên nơi lưu trữ riêng được quản lý; không xóa worktree đang giữ state duy nhất.

## Tham chiếu

- [Kiến trúc và Console review](aws-staging-architecture.md), [runbook kỹ thuật hiện có](aws-staging-runbook.md), [cost estimate](aws-staging-costs.md).
- [AWS deployment approval](../policies/aws-deployment-approval.md), [cost guardrails](../policies/aws-cost-guardrails.md), [SEC-04 ownership cutover](../audit/sec-04-question-ownership.md), [SEC-07 transactions](../audit/sec-07-exam-mutations.md).
- [Terraform plan](https://developer.hashicorp.com/terraform/cli/commands/plan), [Terraform apply và saved-plan approval](https://developer.hashicorp.com/terraform/cli/commands/apply).
- [ECR authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html), [ECR image metadata](https://docs.aws.amazon.com/cli/latest/reference/ecr/describe-images.html), [Secrets Manager version metadata](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/list-secret-version-ids.html).
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https), [Google OAuth web server](https://developers.google.com/identity/protocols/oauth2/web-server), [Cost Explorer API pricing](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/pricing/).
