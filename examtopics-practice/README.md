# Exam Practice Platform

Ứng dụng luyện thi chứng chỉ AWS được xây dựng bằng React + TypeScript với hỗ trợ nhiều bộ đề thi.

## Tính năng chính

### 🏠 Trang chủ (Home)
- **Danh sách đề thi**: Hiển thị tất cả các bộ đề thi có sẵn
- **Tìm kiếm và lọc**: Tìm kiếm theo tên, mô tả, tags và lọc theo danh mục, độ khó
- **Tiến độ học tập**: Hiển thị tiến độ làm bài của từng đề thi
- **Giao diện responsive**: Tối ưu cho desktop và mobile

### 📚 Quản lý câu hỏi
- **Hiển thị câu hỏi**: Hỗ trợ cả câu hỏi single choice và multiple choice
- **Tự động kiểm tra**: Kiểm tra đáp án ngay khi người dùng chọn
- **Hiển thị đáp án**: Hiển thị cả đáp án gợi ý và đáp án phụ
- **Link giải thích**: Cung cấp link để xem giải thích chi tiết

### 💾 Lưu trữ tiến độ
- **LocalStorage**: Tự động lưu tiến độ vào trình duyệt cho từng đề thi
- **Tiếp tục làm bài**: Tự động scroll đến câu hỏi chưa làm tiếp theo
- **Thời gian làm bài**: Theo dõi thời gian làm bài

### 🎯 Tính năng luyện tập
- **Đánh dấu câu hỏi**: Thêm/bỏ câu hỏi vào danh sách luyện tập
- **Danh sách luyện tập**: Hiển thị riêng các câu hỏi đã đánh dấu
- **Làm lại câu hỏi**: Có thể làm lại các câu hỏi đã đánh dấu

### 🔍 Bộ lọc và tìm kiếm
- **Bộ lọc đa dạng**: Tất cả, đã làm, chưa làm, đúng, sai, luyện tập
- **Hiển thị đáp án**: Tùy chọn hiển thị đáp án đúng/sai
- **Thống kê**: Hiển thị số lượng câu hỏi theo từng loại

### 🎲 Tính năng bổ sung
- **Random câu hỏi**: Xáo trộn thứ tự câu hỏi
- **Làm lại toàn bộ**: Reset tiến độ và bắt đầu lại
- **Thanh tiến độ**: Hiển thị % hoàn thành và thống kê
- **Điều hướng**: React Router để chuyển đổi giữa các trang

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (version 14 trở lên)
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone https://github.com/FinbertMDS/examtopics.git
cd examtopics-practice

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production
```bash
npm run build
```

## Cấu trúc project

```
examtopics-practice/
├── public/
│   ├── exams/                    
│       ├── exams.json                    # Danh sách các bộ đề thi
│       ├── aws_sap_c02_questions.json    # Câu hỏi SAP-C02
│       ├── aws_saa_c03_questions.json    # Câu hỏi SAA-C03
│       ├── aws_dva_c02_questions.json    # Câu hỏi DVA-C02
│       └── aws_sysops_c02_questions.json # Câu hỏi SOA-C02
├── src/
│   ├── components/
│   │   ├── Home.tsx                      # Trang chủ
│   │   ├── ExamPage.tsx                  # Trang luyện đề
│   │   ├── ProgressBar.tsx               # Thanh tiến độ
│   │   ├── FilterBar.tsx                 # Bộ lọc câu hỏi
│   │   ├── QuestionItem.tsx              # Component câu hỏi
│   │   ├── QuestionList.tsx              # Danh sách câu hỏi
│   │   └── TrainingList.tsx              # Danh sách luyện tập
│   ├── hooks/    
│   │   └── useLocalStorage.ts            # Hook quản lý localStorage
│   ├── types/    
│   │   └── index.ts                      # TypeScript types
│   ├── App.tsx                           # Component chính với routing
│   └── index.tsx                         # Entry point
└── README.md                             # Hướng dẫn sử dụng
```

## Cấu trúc dữ liệu

### File `exams.json`
```json
[
  {
    "id": "aws-sap-c02",
    "name": "AWS Solutions Architect Professional (SAP-C02)",
    "description": "Bộ đề thi chứng chỉ AWS Solutions Architect Professional",
    "questionCount": 100,
    "file": "aws_sap_c02_questions.json",
    "category": "AWS",
    "difficulty": "Advanced",
    "estimatedTime": "180",
    "tags": ["AWS", "Cloud", "Architecture", "Professional"]
  }
]
```

### File câu hỏi (ví dụ: `aws_sap_c02_questions.json`)
```json
[
  {
    "question_text": "",
    "question_number": 1,
    "answers": {
      "A": "Đáp án A",
      "B": "Đáp án B",
      "C": "Đáp án C",
      "D": "Đáp án D"
    },
    "suggested_answer": "A",
    "answer": "A",
    "link": "https://example.com/explanation",
    "multiple_choice": false
  }
]
```

## Sử dụng

### 1. Trang chủ
- Xem danh sách tất cả các bộ đề thi
- Sử dụng bộ lọc để tìm đề thi phù hợp
- Xem tiến độ làm bài của từng đề thi
- Click vào đề thi để bắt đầu làm bài

### 2. Làm bài thi
- Chọn đáp án cho từng câu hỏi
- Hệ thống sẽ tự động kiểm tra và hiển thị kết quả
- Tiến độ được lưu tự động cho từng đề thi riêng biệt

### 3. Quản lý luyện tập
- Click vào icon 📚 để đánh dấu câu hỏi vào danh sách luyện tập
- Xem danh sách luyện tập ở sidebar bên trái
- Click vào câu hỏi trong danh sách để chuyển đến câu đó

### 4. Bộ lọc câu hỏi
- Sử dụng các nút lọc để xem câu hỏi theo loại
- Tùy chọn hiển thị đáp án đúng/sai
- Thống kê số lượng câu hỏi theo từng loại

### 5. Tính năng khác
- **Random**: Xáo trộn thứ tự câu hỏi
- **Làm lại**: Reset toàn bộ tiến độ
- **Tiến độ**: Theo dõi % hoàn thành và thời gian làm bài
- **Quay về**: Quay về trang chủ với xác nhận

## Thêm đề thi mới

1. **Tạo file JSON câu hỏi** trong thư mục `public/`
2. **Cập nhật `exams.json`** với thông tin đề thi mới
3. **Đảm bảo format** câu hỏi theo cấu trúc đã định nghĩa

## Công nghệ sử dụng

- **React 18**: Framework chính
- **TypeScript**: Type safety
- **React Router**: Điều hướng giữa các trang
- **Tailwind CSS**: Styling
- **LocalStorage**: Lưu trữ dữ liệu
- **Fetch API**: Load dữ liệu JSON

## Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.
