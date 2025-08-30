# ExamTopics Backend API

Backend API cho ExamTopics với tích hợp Google Sheets để lưu trữ báo cáo.

## Tính năng

- **POST /report**: Nhận báo cáo và lưu vào Google Sheets
- **GET /health**: Kiểm tra trạng thái service
- Tích hợp Google Sheets API
- Xử lý lỗi và validation
- CORS support
- Security headers với Helmet

## Cài đặt

### 1. Clone repository
```bash
git clone <your-repo-url>
cd examtopics-backend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Google Sheets

#### Tạo Google Service Account:
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google Sheets API
4. Tạo Service Account
5. Download JSON key file
6. Chia sẻ Google Sheet với email của Service Account

#### Tạo Google Sheet:
Tạo sheet với các cột: `timestamp`, `questionId`, `examId`, `reason`, `comment`, `user`

### 4. Cấu hình Environment Variables

Copy file `env.example` thành `.env`:
```bash
cp env.example .env
```

Cập nhật các giá trị trong `.env`:
```env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Chạy ứng dụng

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### POST /report

Gửi báo cáo mới.

**Request Body:**
```json
{
  "questionId": "string",
  "examId": "string", 
  "reason": "string",
  "comment": "string",
  "user": "string | null"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /health

Kiểm tra trạng thái service.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "googleSheets": "connected"
  }
}
```

## Deploy lên Render.com

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Tạo Web Service trên Render

1. Đăng nhập vào [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Cấu hình:
   - **Name**: examtopics-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Port**: 3000

### 3. Cấu hình Environment Variables

Trong Render Dashboard, thêm các environment variables:
- `GOOGLE_SHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `PORT` (Render sẽ tự động set)
- `CORS_ORIGIN` (optional)

### 4. Deploy

Render sẽ tự động build và deploy service. URL sẽ có dạng:
`https://your-service-name.onrender.com`

## Testing

### Test với curl:

```bash
# Health check
curl https://your-service.onrender.com/health

# Submit report
curl -X POST https://your-service.onrender.com/report \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "test-123",
    "examId": "aws-saa-c02",
    "reason": "Incorrect answer",
    "comment": "This question has wrong answer",
    "user": "testuser"
  }'
```

## Cấu trúc Project

```
examtopics-backend/
├── index.js          # Express server và routes
├── sheets.js         # Google Sheets helper
├── package.json      # Dependencies
├── env.example       # Environment variables template
├── Dockerfile        # Docker configuration
└── README.md         # Documentation
```

## Troubleshooting

### Google Sheets API Errors:
- Kiểm tra Service Account credentials
- Đảm bảo Google Sheets API đã được enable
- Kiểm tra quyền truy cập vào Google Sheet

### Render Deployment Issues:
- Kiểm tra build logs trong Render Dashboard
- Đảm bảo port 3000 được expose
- Kiểm tra environment variables

## License

MIT
