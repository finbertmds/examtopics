# Examtopics Image Downloader

Script này được tạo để tải xuống tất cả hình ảnh từ file JSON exam và lưu vào thư mục local.

## Tính năng

- Đọc file JSON `aws_sap_c02.json`
- Trích xuất tất cả URL hình ảnh từ `answer_images` và `question_images`
- Tải xuống hình ảnh từ `https://img.examtopics.com`
- Lưu vào thư mục `examtopics-practice/public/img/aws-certified-solutions-architect-professional-sap-c02`
- Hỗ trợ retry logic và error handling
- Logging chi tiết

## Cài đặt

1. Cài đặt Python dependencies:

```bash
pip install -r requirements.txt
```

## Sử dụng

Chạy script:

```bash
python download_aws_sap_c02_images.py
```

## Cấu trúc thư mục

```
examtopics-practice/
├── public/
│   ├── exams/
│   │   └── aws_sap_c02.json          # File JSON gốc
│   └── img/
│       └── aws-certified-solutions-architect-professional-sap-c02/  # Thư mục chứa hình ảnh
│           ├── image1.png
│           ├── image2.png
│           └── ...
```

## Tính năng bảo mật

- **Rate limiting**: Delay 0.5 giây giữa các request
- **Retry logic**: Tự động thử lại tối đa 3 lần nếu download thất bại
- **User-Agent**: Sử dụng User-Agent hợp lệ
- **Timeout**: Timeout 30 giây cho mỗi request
- **Content-type validation**: Kiểm tra response có phải là hình ảnh không

## Logging

Script sẽ tạo file log `image_download.log` với thông tin chi tiết:

- Progress của quá trình download
- Lỗi nếu có
- Summary cuối cùng

## Output

Sau khi chạy xong, script sẽ hiển thị:

- Tổng số hình ảnh tìm thấy
- Số hình ảnh download thành công
- Số hình ảnh download thất bại
- Danh sách URL thất bại (nếu có)

## Lưu ý

- Script sẽ bỏ qua các hình ảnh đã tồn tại
- Tự động tạo thư mục output nếu chưa có
- Hỗ trợ resume download (có thể chạy lại nếu bị gián đoạn)
