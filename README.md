# ExamTopics

Repository gồm ứng dụng luyện thi chứng chỉ IT, API quản lý đề và tiến độ, các công cụ thu thập/xử lý dữ liệu, cùng các AI skill hỗ trợ giải thích và bổ sung đáp án.

## Các thành phần

| Thư mục | Vai trò | Công nghệ |
| --- | --- | --- |
| [`examtopics-practice/`](examtopics-practice/) | Giao diện luyện thi và quản lý đề | React 19, TypeScript 7, Vite 8, Tailwind CSS 4 |
| [`examtopics-backend/`](examtopics-backend/) | API đề thi, xác thực, tiến độ và báo cáo | Node.js, Express 5, Mongoose 9, MongoDB |
| [`examtopics-downloader/`](examtopics-downloader/) | CLI tải câu hỏi, xuất JSON/Markdown | Go |
| [`batch/`](batch/) | Kho dữ liệu và script chuyển đổi, sửa liên kết, tải ảnh | Python, Shell |
| [`examtopics-img-downloader/`](examtopics-img-downloader/) | Tải ảnh hàng loạt từ JSON vào kho batch | Python |
| [`skills/`](skills/README.md) | Skill giải thích, bổ sung đáp án và script tải lại câu hỏi | Agent skills, Python |
| [`.github/workflows/`](.github/workflows/) | Tự động build image và triển khai | GitHub Actions, Docker, Render |

## AI skills

Các skill nằm trong [`skills/`](skills/README.md): giải thích câu hỏi bằng tiếng Việt và điền đáp án còn thiếu trong JSON. Xem [hướng dẫn cài đặt và sử dụng](skills/README.md).

## Luồng dữ liệu

```text
ExamTopics → Go downloader / Python retry → JSON, Markdown trong batch/
                                              │
                                   Chuyển đổi, sửa link, tải ảnh
                                              │
                              Import JSON qua giao diện /admin
                                              │
React practice ← REST API (Express) ← MongoDB (đề, câu hỏi, user, tiến độ)
                         │
                    Google Sheets (báo cáo)
```

Ứng dụng hiện tải danh sách đề và câu hỏi qua `/api`, lưu trong MongoDB. `public/exams/` chứa dữ liệu mẫu/nguồn migration; chỉ copy JSON vào đó chưa đưa đề lên danh sách của ứng dụng. Ảnh tĩnh được phục vụ từ `examtopics-practice/public/img/`.

## Cài đặt và chạy ứng dụng

Yêu cầu:

- Node.js **26.12.1**, theo `.nvmrc` và `engines` của hai project Node.
- MongoDB và cấu hình Google OAuth để chạy luồng đăng nhập đầy đủ; Google Sheets để nhận báo cáo.
- Go **1.24.2 trở lên** nếu sử dụng downloader.
- Python 3; các script batch dùng cú pháp yêu cầu **Python 3.10 trở lên**.
- Docker nếu chạy container hoặc sử dụng cấu hình MongoDB trong backend.

Từ thư mục gốc:

```bash
nvm install
nvm use
```

### Backend

```bash
cd examtopics-backend
npm ci
cp env.example .env
# Điền cấu hình trong .env trước khi chạy
npm run dev
```

Backend mặc định chạy tại `http://localhost:3001`. Cấu hình theo [`env.example`](examtopics-backend/env.example):

| Biến | Mục đích |
| --- | --- |
| `MONGO_URI` | Kết nối MongoDB |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `JWT_SECRET`, `SESSION_SECRET` | Khóa ký token và session |
| `FRONTEND_URL` | URL frontend để chuyển hướng đăng nhập |
| `GOOGLE_SHEET_ID` | Google Sheet nhận báo cáo |
| `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Service account có quyền ghi vào Sheet |
| `PORT`, `NODE_ENV` | Cổng và môi trường chạy |

OAuth callback ở môi trường development là `http://localhost:3001/auth/google/callback`; đăng ký URL này trong Google OAuth client. Trong production, đặt thêm `GOOGLE_CALLBACK_URL` theo domain backend. CORS được xác định trong `index.js` theo môi trường và `FRONTEND_URL`; biến `CORS_ORIGIN` trong file mẫu hiện không được mã nguồn sử dụng.

### Frontend

Mở terminal khác từ thư mục gốc:

```bash
cd examtopics-practice
npm ci
npm start
```

Truy cập `http://localhost:3000`. Khi cần đổi địa chỉ dịch vụ, tạo `.env.local` trong `examtopics-practice/`:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000
```

Vite tiếp tục hỗ trợ tiền tố `REACT_APP_`; các giá trị được đưa vào bundle khi build. Khởi động lại dev server hoặc build lại sau khi thay đổi cấu hình.

## Ứng dụng luyện thi

Các trang chính:

| Đường dẫn | Chức năng |
| --- | --- |
| `/` | Danh sách đề, tìm kiếm và lọc |
| `/exam/:examId` | Làm bài, xem đáp án, lọc câu hỏi và luyện câu đã đánh dấu |
| `/admin` | Tạo/import JSON, chỉnh sửa, xuất, xóa và quản lý quyền sở hữu đề |
| `/auth/callback` | Nhận kết quả đăng nhập từ backend |

Ứng dụng hỗ trợ giao diện tiếng Việt, tiếng Anh, tiếng Nhật; chế độ sáng/tối; xáo trộn câu hỏi; thống kê, lịch sử làm bài và theo dõi tiến độ. Tiến độ người dùng đăng nhập được lưu qua API. Có chỉ báo trạng thái mạng; các thao tác tải dữ liệu và đồng bộ cần backend khả dụng.

Đề mới mặc định riêng tư. Chủ sở hữu có thể công khai đề, cập nhật câu hỏi hoặc chuyển quyền sở hữu. Danh sách đề hiển thị theo quyền truy cập; các thao tác quản lý yêu cầu đăng nhập và được backend kiểm tra quyền.

Mã frontend nằm trong `src/components/`, `src/hooks/`, `src/contexts/`, `src/services/`, `src/utils/` và `src/locales/`.

## API backend

Backend chia thành `routes/`, `controllers/`, `services/`, `models/`, `middleware/` và `config/`. Các model chính: `User`, `Exam`, `Question`, `Progress`, `History`.

| Nhóm | Endpoint chính |
| --- | --- |
| Trạng thái | `GET /health` |
| Đăng nhập | `GET /auth/google`, `GET /auth/google/callback`, `GET /auth/me`, `POST /auth/refresh` |
| Đọc đề | `GET /api/exams`, `GET /api/exams/:code`, `GET /api/exams/metadata/info` |
| Đọc câu hỏi | `GET /api/questions/:code`, `GET /api/questions/:code/:questionNumber` |
| Quản lý đề | `POST /api/exams`, `PUT /api/exams/:code`, `DELETE /api/exams/:code` |
| Quyền sở hữu và xuất đề | `GET /api/exams/me/created`, `PUT /api/exams/:code/owner`, `GET /api/exams/:code/export` |
| Sửa câu hỏi | `PUT /api/exams/:code/questions/:questionNumber` |
| Tiến độ | `POST /progress/save`, `GET /progress/load/:examId`, `GET /progress/all` |
| Làm bài | `POST /progress/answer`, `/progress/training-mark`, `/progress/submit`, `/progress/reset` |
| Lịch sử/thống kê | `GET /progress/history`, `/progress/history/:examId`, `/progress/stats/:examId`, `/progress/completed-exam-ids`, `/progress/daily-tracking` |
| Báo cáo | `POST /report` |

Các API yêu cầu xác thực sử dụng header `Authorization: Bearer <token>`. Quyền đọc đề riêng tư và quyền sửa/xóa được kiểm tra ở backend.

### Migration dữ liệu

Chạy trong `examtopics-backend/`, sau khi cấu hình đúng database:

| Lệnh | Mục đích |
| --- | --- |
| `npm run migrate:samples` | Đọc `public/exams/exams.json` và các JSON tương ứng để import dữ liệu mẫu; script có xóa/tạo lại các đề trùng |
| `npm run migrate:progress` | Chuyển tiến độ cũ sang định dạng có topic/question |
| `npm run migrate:exam-visibility` | Đặt công khai cho các đề cũ chưa có trường `isPublished`; có thể chạy lại |

Sao lưu dữ liệu trước khi chạy migration trên database đang sử dụng. Để thêm đề thông thường, dùng chức năng import JSON tại `/admin`.

## Công cụ tải và xử lý dữ liệu

### Go downloader

```bash
cd examtopics-downloader
go build -o examtopicsdl ./cmd
go run ./cmd -p amazon -s saa-c03 -o aws_saa_c03.md -json -save-links
```

Lệnh ví dụ tạo Markdown và JSON cùng tên gốc. `-p` chọn nhà cung cấp; `-s` lọc liên kết thảo luận theo mã đề hoặc từ khóa. Có thể dùng với Amazon, Google, Microsoft, Cisco, CompTIA và các provider khác của ExamTopics.

Các tùy chọn gồm `-exams`, `-c` (bình luận), `-save-links`, `-no-cache`, `-save-all-pages` và `-push-github`. Xem các cờ đang hỗ trợ bằng `go run ./cmd -h`; tham khảo thêm [README downloader](examtopics-downloader/README.md).

Build và chạy Docker từ thư mục downloader:

```bash
docker build -t examtopics-dl .
docker run --rm -v "$PWD/output:/output" examtopics-dl \
  -p amazon -s saa-c03 -o /output/aws_saa_c03.md -json
```

### Batch

`batch/json/`, `batch/md/`, `batch/img/` chứa dữ liệu theo định dạng tương ứng. Các lệnh sau chạy từ gốc repo, sau khi cài dependencies trong môi trường Python của bạn:

```bash
python -m pip install -r batch/requirements.txt

# Chuyển JSON định dạng PCAP downloader sang schema luyện thi
python batch/convert_json.py input.json output_converted.json

# Tải ảnh của một file hoặc cả thư mục JSON
python batch/download_exam_images.py output_converted.json

# Sửa liên kết thảo luận, xuất ra file khác
python batch/fix_examtopics_links.py batch/json/aws_saa_c03.json -o /tmp/aws_saa_c03.fixed.json

# Xem các lệnh sửa link hàng loạt mà chưa thực thi
python batch/run_fix_examtopics_links.py --dry-run
```

`download_exam_images.py` tải ảnh vào `public/img/<tên-đề>/` và **ghi lại JSON đầu vào** để thay URL bằng đường dẫn `/img/...`. `fix_examtopics_links.py` mặc định sửa trực tiếp file đầu vào nếu không có `-o`; hỗ trợ cache, report, resume và chế độ offline.

`batch/download.sh` là tập lệnh tham khảo với tên container, image và mã đề cố định; cần điều chỉnh trước khi sử dụng.

### Tải ảnh hàng loạt vào batch

```bash
cd examtopics-img-downloader
python -m pip install -r requirements.txt
python download_images.py
```

Script đọc `../batch/json/*.json`, trích URL trong `question_images` và `answer_images`, lưu vào `../batch/img/` theo đường dẫn nguồn, bỏ qua file đã tồn tại và ghi log `image_download.log`. `list_image_domains.py` hỗ trợ kiểm kê domain ảnh. Công cụ này có đầu ra khác với `batch/download_exam_images.py`.

### Tải lại câu hỏi lỗi

```bash
cd skills/examtopics-retry-dl
python -m pip install -r requirements.txt
python retry_failed_questions.py --input failed_urls.txt --output retried_questions.json
```

Đầu vào có thể là file URL/log lỗi hoặc URL truyền trực tiếp. Có các cờ `--retries`, `--timeout`, `--delay`; kết quả JSON cần được kiểm tra và ghép vào bộ đề tương ứng trước khi import.

## Build và kiểm thử

Chạy từng nhóm lệnh trong thư mục tương ứng:

| Thành phần | Lệnh |
| --- | --- |
| Frontend | `npm run build`, `npm test`, `npm run test:watch` |
| Backend | `npm test` |
| Go downloader | `go build ./cmd`, `go test ./...` |
| Python (từ gốc repo) | `python -m unittest discover -s batch/tests` |

Frontend dùng Vitest, jsdom và Testing Library; backend dùng `node:test`; Go dùng `*_test.go`; Python dùng `unittest`. Các kiểm thử backend hiện dùng database giả lập; cần xác minh MongoDB, Google OAuth và Google Sheets trên staging khi thay đổi các tích hợp này.

## Triển khai

- **Frontend:** chạy `npm ci` rồi `npm run build` trong `examtopics-practice/`; publish thư mục `build/`. Hosting cần rewrite các route SPA về `index.html`.
- **Backend:** chạy `npm ci` rồi `npm start`, hoặc build từ `examtopics-backend/Dockerfile`; cấu hình biến môi trường và kết nối MongoDB/Google tương ứng.
- **Docker Compose:** cấu hình local tại [`examtopics-backend/docker-compose.yml`](examtopics-backend/docker-compose.yml).

Các workflow hiện chạy khi push vào `master` với đường dẫn liên quan hoặc được kích hoạt thủ công:

| Workflow | Hoạt động |
| --- | --- |
| `deploy.yml` | Gọi API Render để deploy frontend |
| `deploy-backend.yml` | Build/push image backend lên Docker Hub rồi gọi Render deploy |
| `docker.yml` | Build/test Go và push image downloader `ghcr.io/<repository_owner>/examtopics:latest` |

Secrets phục vụ triển khai gồm `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `RENDER_BACKEND_SERVICE_ID`, `DOCKERHUB_USERNAME` và `DOCKERHUB_TOKEN`; workflow GHCR dùng `GITHUB_TOKEN`.

## Đóng góp và bảo mật

Giữ thay đổi tập trung theo từng thành phần, bổ sung regression test khi thay đổi hành vi. Pull request nên mô tả kết quả, cách kiểm tra và kèm ảnh nếu thay đổi giao diện.

Không commit credentials, token, database dump hoặc giá trị `.env`. Các biến frontend `REACT_APP_*` là dữ liệu công khai trong bundle, không dùng để lưu secret.

Mã nguồn được phân phối theo [MIT License](LICENSE). Câu hỏi, hình ảnh và tài liệu bên thứ ba có quyền sử dụng riêng; giấy phép mã nguồn không cấp quyền đối với các nội dung đó.
