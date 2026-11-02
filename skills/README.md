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
$skill-installer cài skill từ repo https://github.com/finbertmds/examtopics từ nhánh master tại đường dẫn skills/examtopics-explainer
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

## Đồng bộ và đóng gói plugin

Chạy từ gốc repo (cần Node.js và lệnh `zip`):

```bash
node scripts/package-examtopics.mjs
```

Chỉ chỉnh sửa skill tại `skills/examtopics-explainer/`; metadata và phiên bản ở `skills/plugin.json`, giấy phép ở `skills/LICENSE`. Mỗi lần chạy, script kiểm tra nguồn, tạo lại `plugins/examtopics/` và xuất `dist/examtopics-plugin.zip`. File đã xóa ở nguồn cũng được loại khỏi gói mới. Thư mục plugin là đầu ra tự sinh, mọi chỉnh sửa trực tiếp tại đó sẽ bị thay thế.

ZIP chứa một thư mục `examtopics/`, với `plugin.json`, `LICENSE` và `skills/examtopics-explainer/`. Skill điền đáp án và script tải lại câu hỏi không nằm trong plugin này. Các đầu ra được bỏ qua bởi Git; chạy lại lệnh để tái tạo. Gói ZIP cũ ở gốc repo không được cập nhật bởi script.

Lệnh này chỉ tạo gói local; không tự cài hoặc xuất bản plugin vào ChatGPT.

Để tạo gói public draft riêng với metadata và icon sáng/tối:

```bash
node scripts/package-examtopics.mjs --public
```

| Chế độ | Nguồn metadata | Thư mục plugin tự sinh | ZIP đầu ra |
| --- | --- | --- | --- |
| Thường | `skills/plugin.json` | `plugins/examtopics/` | `dist/examtopics-plugin.zip` |
| Public | `skills/public-release/plugin.json` | `plugins/examtopics-public/` | `dist/examtopics-public-draft.zip` |

Cả hai chế độ lấy cùng nguồn `skills/examtopics-explainer/`. Với gói public, sửa listing và icon tại [`public-release/`](public-release/README.md), rồi chạy lại lệnh. Dùng ZIP đầu ra để cập nhật qua Plugin Creator hoặc chuẩn bị submission trên Portal; đóng gói không tự cập nhật plugin đã cài hay phát hành công khai.

## Giấy phép

Hướng dẫn và mã nguồn trong thư mục này được phân phối theo [MIT License](LICENSE). Giấy phép không cấp quyền đối với câu hỏi, hình ảnh hoặc tài liệu bên thứ ba. Các skill không bao gồm bộ đề thi và không phải sản phẩm chính thức của ExamTopics hoặc các nhà cung cấp chứng chỉ.
