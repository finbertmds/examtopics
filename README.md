## Node.js và dependencies

Cả backend và frontend dùng Node.js **26.12.1** (Current). Chạy `nvm install` rồi `nvm use` tại thư mục repo hoặc từng project để chọn đúng phiên bản.

Trong mỗi project, chạy `npm ci` để cài dependencies theo lockfile.
Frontend dùng Vite, TypeScript 7 và Tailwind CSS 4:

- `npm start`: dev server tại port 3000.
- `npm run build`: kiểm tra TypeScript và xuất production vào `build/`.
- `npm test`: chạy Vitest; `npm run test:watch` để theo dõi thay đổi.
- Biến môi trường `REACT_APP_BACKEND_URL` và `REACT_APP_FRONTEND_URL` tiếp tục được hỗ trợ khi build.

Backend dùng Express 5 và Mongoose 9. Các kiểm tra local dùng database giả lập; cần kiểm tra MongoDB, Google OAuth và Google Sheets trong môi trường staging trước khi triển khai.

# ExamTopics - Comprehensive Exam Practice Platform

Hệ thống toàn diện để tải xuống, quản lý và luyện thi các chứng chỉ AWS và các chứng chỉ IT khác từ ExamTopics. Repository này bao gồm 5 dự án chính hoạt động cùng nhau để tạo ra một nền tảng luyện thi hoàn chỉnh.

## 🏗️ Tổng quan kiến trúc

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Batch Script  │───▶│  Data Storage   │───▶│  Practice App   │
│   (Downloader)  │    │   (JSON/MD)     │    │   (React)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Image Downloader│    │   Backend API   │    │   User Progress │
│   (Python)      │    │   (Node.js)     │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📦 Các dự án chính

### 1. 🔄 Batch - Quản lý dữ liệu hàng loạt
**Vị trí**: `/batch/`  
**Mục đích**: Tự động hóa việc tải xuống và quản lý dữ liệu exam từ ExamTopics

#### Tính năng chính:
- **Script tải xuống hàng loạt**: Tự động tải xuống tất cả các bộ đề thi AWS
- **Quản lý dữ liệu**: Lưu trữ câu hỏi dưới dạng JSON và Markdown
- **Tích hợp Docker**: Sử dụng container để tải xuống dữ liệu
- **Cache management**: Quản lý cache để tối ưu tốc độ tải xuống

#### Cấu trúc dữ liệu:
```
batch/
├── download.sh              # Script chính để tải xuống
├── json/                    # Dữ liệu câu hỏi dạng JSON
│   ├── aws_saa_c03.json
│   ├── aws_dva_c02.json
│   └── ...
├── md/                      # Dữ liệu câu hỏi dạng Markdown
│   ├── aws_saa_c03.md
│   ├── aws_dva_c02.md
│   └── ...
├── img/                     # Hình ảnh từ các câu hỏi
│   ├── aws-certified-solutions-architect-associate-saa-c03/
│   └── ...
└── cached_pages_amazon.txt  # Cache để tối ưu tốc độ
```

#### Sử dụng:
```bash
cd batch
chmod +x download.sh
./download.sh
```

---

### 2. 🚀 examtopics-downloader - Công cụ tải xuống Go
**Vị trí**: `/examtopics-downloader/`  
**Công nghệ**: Go  
**Mục đích**: Công cụ mạnh mẽ để tải xuống câu hỏi từ ExamTopics

#### Tính năng chính:
- **Multi-provider support**: Hỗ trợ nhiều nhà cung cấp (AWS, Google, Cisco, Microsoft, v.v.)
- **Concurrent processing**: Xử lý đồng thời để tăng tốc độ
- **Multiple output formats**: Xuất ra JSON, Markdown
- **Caching system**: Hệ thống cache thông minh với GitHub integration
- **Rate limiting**: Tránh bị chặn bởi ExamTopics

#### Các provider được hỗ trợ:
| Provider | Mô tả | Số lượng exam |
|----------|-------|---------------|
| amazon | AWS Certifications | 25+ |
| google | Google Cloud | 20+ |
| cisco | Cisco Certifications | 15+ |
| microsoft | Microsoft Certifications | 20+ |
| comptia | CompTIA | 10+ |

#### Sử dụng:
```bash
# Tải xuống AWS SAA-C03
go run ./cmd/main.go -p amazon -s saa-c03 -o aws_saa_c03.md -json

# Tải xuống Google DevOps
go run ./cmd/main.go -p google -s devops -save-links -o google_devops.md

# Sử dụng Docker
docker run -it ghcr.io/finbertmds/examtopics-downloader:latest \
  -p amazon -s saa-c03 -save-links -o output.md -json
```

#### Tính năng nâng cao:
- **GitHub caching**: Tự động push cache lên GitHub để chia sẻ
- **Local caching**: Lưu cache local để tăng tốc độ
- **Image extraction**: Trích xuất URL hình ảnh từ câu hỏi
- **Discussion links**: Lưu link thảo luận cho mỗi câu hỏi

---

### 3. 🖼️ examtopics-img-downloader - Tải xuống hình ảnh
**Vị trí**: `/examtopics-img-downloader/`  
**Công nghệ**: Python  
**Mục đích**: Tải xuống và quản lý hình ảnh từ các câu hỏi exam

#### Tính năng chính:
- **Automatic image detection**: Tự động phát hiện hình ảnh trong JSON
- **Batch downloading**: Tải xuống hàng loạt với retry logic
- **Organized storage**: Lưu trữ có tổ chức theo từng exam
- **Error handling**: Xử lý lỗi và logging chi tiết
- **Resume capability**: Có thể tiếp tục tải xuống nếu bị gián đoạn

#### Sử dụng:
```bash
cd examtopics-img-downloader
pip install -r requirements.txt
python download_images.py
```

#### Cấu trúc output:
```
examtopics-practice/public/img/
├── aws-certified-solutions-architect-associate-saa-c03/
│   ├── image1.png
│   ├── image2.png
│   └── ...
└── aws-certified-developer-associate-dva-c02/
    ├── image1.png
    └── ...
```

---

### 4. 🔧 examtopics-backend - API Backend
**Vị trí**: `/examtopics-backend/`  
**Công nghệ**: Node.js, Express, MongoDB  
**Mục đích**: Backend API để quản lý user, progress và báo cáo

#### Tính năng chính:
- **Google OAuth**: Xác thực người dùng qua Google
- **Progress tracking**: Theo dõi tiến độ làm bài của user
- **Google Sheets integration**: Lưu báo cáo vào Google Sheets
- **MongoDB storage**: Lưu trữ dữ liệu user và progress
- **JWT authentication**: Bảo mật API với JWT tokens

#### API Endpoints:
```bash
# Health check
GET /health

# Authentication
GET /auth/google
GET /auth/google/callback
GET /auth/me

# Progress management
POST /progress/save
GET /progress/load/:examId

# Reporting
POST /report
```

#### Cấu hình:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# MongoDB
MONGO_URI=mongodb+srv://...

# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_CLIENT_EMAIL=service_account@...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# JWT
JWT_SECRET=your_jwt_secret
```

#### Deploy:
```bash
# Development
npm run dev

# Production
npm start

# Docker
docker build -t examtopics-backend .
docker run -p 3001:3001 examtopics-backend
```

---

### 5. 🎯 examtopics-practice - Ứng dụng luyện thi
**Vị trí**: `/examtopics-practice/`  
**Công nghệ**: React, TypeScript, Tailwind CSS  
**Mục đích**: Giao diện web để luyện thi tương tác

#### Tính năng chính:
- **Multi-exam support**: Hỗ trợ nhiều bộ đề thi AWS
- **Interactive practice**: Luyện thi tương tác với feedback ngay lập tức
- **Progress tracking**: Theo dõi tiến độ và thống kê chi tiết
- **Training mode**: Chế độ luyện tập với câu hỏi đã đánh dấu
- **Responsive design**: Tối ưu cho desktop và mobile
- **Offline support**: Hoạt động offline với localStorage

#### Các bộ đề thi hiện có:
- AWS Solutions Architect Associate (SAA-C03)
- AWS Solutions Architect Professional (SAP-C02)
- AWS Developer Associate (DVA-C02)
- AWS SysOps Administrator Associate (SOA-C02)
- AWS DevOps Engineer Professional (DOP-C02)
- AWS Machine Learning Engineer Associate (MLA-C01)
- Và nhiều bộ đề khác...

#### Tính năng nâng cao:
- **Smart filtering**: Lọc câu hỏi theo trạng thái (đã làm, chưa làm, đúng, sai)
- **Random mode**: Xáo trộn câu hỏi để luyện tập
- **Bookmark system**: Đánh dấu câu hỏi khó để luyện tập
- **Statistics**: Thống kê chi tiết về hiệu suất làm bài
- **Time tracking**: Theo dõi thời gian làm bài

#### Sử dụng:
```bash
cd examtopics-practice
npm install
npm start
```

#### Cấu trúc component:
```
src/
├── components/
│   ├── Home.tsx              # Trang chủ
│   ├── ExamPage.tsx          # Trang luyện thi
│   ├── QuestionItem.tsx      # Component câu hỏi
│   ├── ProgressBar.tsx       # Thanh tiến độ
│   └── FilterBar.tsx         # Bộ lọc
├── hooks/
│   └── useLocalStorage.ts    # Hook quản lý localStorage
└── types/
    └── index.ts              # TypeScript types
```

---

## 🔄 Quy trình làm việc

### 1. Thu thập dữ liệu
```bash
# Sử dụng downloader để tải xuống câu hỏi mới
cd examtopics-downloader
go run ./cmd/main.go -p amazon -s saa-c03 -json -save-links

# Tải xuống hình ảnh
cd ../examtopics-img-downloader
python download_images.py
```

### 2. Cập nhật dữ liệu
```bash
# Copy dữ liệu vào practice app
cp examtopics-downloader/output.json examtopics-practice/public/exams/
cp -r examtopics-img-downloader/images/* examtopics-practice/public/img/
```

### 3. Deploy hệ thống
```bash
# Deploy backend
cd examtopics-backend
docker build -t examtopics-backend .
docker run -d -p 3001:3001 examtopics-backend

# Deploy frontend
cd examtopics-practice
npm run build
# Deploy build/ folder to hosting service
```

---

## 🛠️ Cài đặt và chạy

### Yêu cầu hệ thống:
- **Go 1.24+** (cho downloader)
- **Node.js 14+** (cho backend và frontend)
- **Python 3.8+** (cho image downloader)
- **Docker** (tùy chọn, cho containerization)
- **MongoDB** (cho backend)
- **Google Cloud Account** (cho OAuth và Sheets)

### Cài đặt nhanh:
```bash
# Clone repository
git clone https://github.com/finbertmds/examtopics.git
cd examtopics

# Cài đặt backend
cd examtopics-backend
npm install
cp env.example .env
# Cấu hình .env file
npm run dev

# Cài đặt frontend
cd ../examtopics-practice
npm install
npm start

# Cài đặt image downloader
cd ../examtopics-img-downloader
pip install -r requirements.txt

# Build downloader
cd ../examtopics-downloader
go build -o examtopicsdl ./cmd/main.go
```

---

## 📊 Thống kê dự án

| Dự án | Ngôn ngữ | Kích thước | Tính năng chính |
|-------|----------|------------|-----------------|
| Batch | Shell | ~50MB | Quản lý dữ liệu hàng loạt |
| Downloader | Go | ~10MB | Tải xuống câu hỏi |
| Image Downloader | Python | ~5MB | Tải xuống hình ảnh |
| Backend | Node.js | ~100MB | API và authentication |
| Practice | React/TS | ~200MB | Giao diện luyện thi |

**Tổng cộng**: Hỗ trợ **25+ bộ đề thi AWS**, **1000+ câu hỏi**, **500+ hình ảnh**

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🔗 Liên kết hữu ích

- [ExamTopics Website](https://www.examtopics.com/)
- [AWS Certification](https://aws.amazon.com/certification/)
- [Google Cloud Certification](https://cloud.google.com/certification)
- [Docker Hub](https://hub.docker.com/r/finbertmds/examtopics-downloader)
