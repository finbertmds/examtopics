# ExamTopics Skills

Các skill hỗ trợ phân tích câu hỏi luyện thi chứng chỉ và xử lý đáp án. Mỗi thư mục chứa một file `SKILL.md` mô tả cách agent thực hiện nhiệm vụ.

## Các skill

| Thư mục | Tên skill | Chức năng |
| --- | --- | --- |
| [examtopics-explainer/](examtopics-explainer/SKILL.md) | `examtopics-explainer` | Giải thích câu hỏi bằng tiếng Việt, phân tích từng lựa chọn, tổng hợp kiến thức và mẹo làm bài |
| [examtopics-retry-dl/](examtopics-retry-dl/SKILL.md) | `examtopics-answer-filler` | Phân tích JSON và điền đáp án còn thiếu, xuất file mới cùng báo cáo kiểm tra |

Tên gọi skill lấy từ trường `name` trong `SKILL.md`. Thư mục `examtopics-retry-dl/` hiện chứa skill tên `examtopics-answer-filler` và các script Python tải lại câu hỏi; đây là hai chức năng riêng.

## Cài đặt

### Bằng CLI

Cần Node.js và npm. Chạy lệnh tương ứng với skill muốn cài:

```bash
npx skills add https://github.com/finbertmds/examtopics --skill examtopics-explainer
npx skills add https://github.com/finbertmds/examtopics --skill examtopics-answer-filler
```

Làm theo hướng dẫn của CLI để chọn agent và phạm vi cài đặt. Mở phiên chat mới sau khi cài.

### Bằng skill-installer trong Codex

```text
$skill-installer cài skill từ repo https://github.com/finbertmds/examtopics tại đường dẫn skills/examtopics-explainer
```

Để cài skill điền đáp án, thay đường dẫn bằng `skills/examtopics-retry-dl`.

## Cách dùng

### Giải thích câu hỏi

Gọi skill kèm câu hỏi, toàn bộ lựa chọn, code hoặc ảnh:

```text
$examtopics-explainer
Giải thích câu hỏi sau bằng tiếng Việt: [câu hỏi và các lựa chọn]
```

Câu trả lời gồm đáp án, năm mục phân tích (hiểu đề, lý do chọn, đánh giá mọi lựa chọn, kiến thức cần nhớ, mẹo thi) và kết luận. Skill phân tích độc lập, phân biệt đáp án dự kiến của đề với kết luận kỹ thuật hiện tại và ưu tiên nguồn chính thức khi cần xác minh. Khả năng tra cứu phụ thuộc công cụ của môi trường chạy.

### Điền đáp án còn thiếu

```text
$examtopics-answer-filler
Bộ đề: AWS Certified Solutions Architect Professional SAP-C02.
File JSON: sap-c02.json. Hãy phân tích và điền đáp án còn thiếu.
```

Cung cấp file JSON cùng tên bộ đề. Skill mặc định chỉ xử lý câu có cả `suggested_answer` và `answer` rỗng, giữ nguyên dữ liệu ngoài phạm vi, xuất file mới và báo cáo kiểm tra. Xem [quy tắc đầy đủ](examtopics-retry-dl/SKILL.md).

## Script tải lại câu hỏi

Chạy từ gốc repository:

```bash
cd skills/examtopics-retry-dl
python -m pip install -r requirements.txt
python retry_failed_questions.py --input failed_urls.txt --output retried_questions.json
```

Script nhận file URL/log lỗi hoặc URL trực tiếp. Kiểm tra kết quả JSON trước khi ghép vào bộ đề và import. `batch.sh` chứa các lệnh ví dụ cần điều chỉnh theo dữ liệu của bạn.

## Cấu trúc

```text
skills/
├── README.md
├── LICENSE
├── plugin.json
├── examtopics-explainer/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── examtopics-retry-dl/
    ├── SKILL.md
    ├── requirements.txt
    ├── retry_failed_questions.py
    └── batch.sh
```

Các lệnh cài ở trên sử dụng trực tiếp thư mục skill. File `plugin.json` và gói ZIP v1.0.0 từ cấu trúc plugin cũ cần được rà soát, đóng gói lại trước khi phát hành plugin theo cấu trúc mới; chúng không thay thế việc cài từng skill.

## Giấy phép

Hướng dẫn và mã nguồn trong thư mục này được phân phối theo [MIT License](LICENSE). Giấy phép không cấp quyền đối với câu hỏi, hình ảnh hoặc tài liệu bên thứ ba. Các skill không bao gồm bộ đề thi và không phải sản phẩm chính thức của ExamTopics hoặc các nhà cung cấp chứng chỉ.
