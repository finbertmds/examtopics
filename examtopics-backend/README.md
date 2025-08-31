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

### 3. Cấu hình Google Services

#### Tạo Google Service Account:
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google Sheets API
4. Tạo Service Account
5. Download JSON key file
6. Chia sẻ Google Sheet với email của Service Account

#### Tạo Google Sheet:
Tạo sheet với các cột: `timestamp`, `questionId`, `examId`, `reason`, `comment`, `user`

#### Tạo Google OAuth Credentials:
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://your-backend-domain.com/auth/google/callback` (production)
7. Copy Client ID và Client Secret

### 4. Cấu hình MongoDB Atlas

#### Tạo MongoDB Atlas Cluster:
1. Vào [MongoDB Atlas](https://cloud.mongodb.com/)
2. Tạo account mới hoặc đăng nhập
3. Tạo cluster mới (Free tier M0)
4. Tạo database user với username và password
5. Whitelist IP address (0.0.0.0/0 cho development)
6. Copy connection string

#### Cấu hình Database:
- Database name: `examtopics`
- Collections sẽ được tạo tự động: `users`, `progresses`

### 5. Cấu hình Environment Variables

Copy file `env.example` thành `.env`:
```bash
cp env.example .env
```

Cập nhật các giá trị trong `.env`:
```env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-change-in-production
SESSION_SECRET=your-session-secret-key

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/examtopics?retryWrites=true&w=majority

PORT=3001
FRONTEND_URL=http://localhost:3000
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
    "googleSheets": "connected",
    "mongodb": "connected"
  },
  "stats": {
    "totalUsers": 5,
    "totalExams": 12,
    "storageSize": 5
  }
}
```

### GET /auth/me

Lấy thông tin user hiện tại (cần JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123456789",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /progress/save

Lưu progress cho user (cần JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "examId": "aws-saa-c02",
  "progress": {
    "examId": "aws-saa-c02",
    "answers": {...},
    "markedForTraining": [1, 5, 10],
    "currentQuestion": 15,
    "isRandomized": false
  }
}
```

### GET /progress/load/:examId

Lấy progress cho user (cần JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "examId": "aws-saa-c02",
    "answers": {...},
    "markedForTraining": [1, 5, 10],
    "currentQuestion": 15,
    "isRandomized": false,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
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
├── auth.js           # Authentication middleware
├── sheets.js         # Google Sheets helper
├── progress.js       # Progress service
├── config/
│   └── database.js   # MongoDB connection
├── models/
│   ├── User.js       # User model
│   └── Progress.js   # Progress model
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
