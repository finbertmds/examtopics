# ExamTopics Explainer

Skill giải thích câu hỏi luyện thi chứng chỉ bằng tiếng Việt, đóng gói dưới dạng plugin cho các môi trường hỗ trợ Agent Plugins.

Phân tích độc lập đáp án, giải thích mọi lựa chọn, phân biệt đáp án dự kiến của đề với kết luận kỹ thuật hiện tại và ưu tiên tài liệu chính thức khi cần xác minh.

## Cấu trúc

```text
plugins/examtopics/
├── plugin.json
├── README.md
├── LICENSE
└── skills/examtopics-explainer/
    ├── SKILL.md
    └── agents/openai.yaml
```

`SKILL.md` là bản nguồn của hướng dẫn. Chỉnh sửa tại đây khi cập nhật hành vi; `agents/openai.yaml` cung cấp tên hiển thị, mô tả ngắn và prompt gợi ý.

## Cài riêng skill vào Codex

Sau khi thư mục này được push lên GitHub, yêu cầu skill-installer:

```text
$skill-installer cài skill từ repo https://github.com/FinbertMDS/examtopics tại đường dẫn plugins/examtopics/skills/examtopics-explainer
```

Nếu skill chưa xuất hiện, khởi động lại Codex rồi thử trong chat mới.

## Cài plugin để thử trên desktop

Trong bản clone của repo, tạo hoặc cập nhật `.agents/plugins/marketplace.json` ở gốc repo. Nếu đã có marketplace, thêm entry vào `plugins` thay vì ghi đè cấu hình hiện có.

Ví dụ marketplace cho repo này:

```json
{
  "name": "finbertmds-examtopics",
  "interface": {
    "displayName": "FinbertMDS ExamTopics"
  },
  "plugins": [
    {
      "name": "examtopics",
      "source": {
        "source": "local",
        "path": "./plugins/examtopics"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

Đường dẫn `source.path` được tính từ gốc repo, không phải từ thư mục `.agents/plugins/`. Khởi động lại ứng dụng desktop có hỗ trợ, mở Plugins Directory, chọn nguồn marketplace và cài ExamTopics. Kiểm tra trong chat mới.

Plugin này không chứa MCP server và không yêu cầu API key riêng. Khả năng tìm kiếm web phụ thuộc công cụ mà môi trường chạy cung cấp.

## Dùng trên trình duyệt

Một thư mục local hoặc GitHub Release không tự làm plugin khả dụng trên ChatGPT web. Cần phân phối plugin qua cơ chế mà tài khoản/workspace hỗ trợ, chẳng hạn xuất bản vào workspace hoặc gửi xét duyệt vào public plugin directory. Sau khi plugin được cài và khả dụng trên web, dùng `@` để chọn skill.

Khả năng cài và chia sẻ phụ thuộc sản phẩm, tài khoản và chính sách quản trị. Xem tài liệu chính thức ở cuối trang để kiểm tra quy trình hiện hành.

## Cách dùng

Trong Codex, gọi `$examtopics-explainer` kèm câu hỏi, lựa chọn, code hoặc ảnh. Trên ChatGPT có hỗ trợ skill từ plugin, chọn bằng `@`.

Câu trả lời giữ đủ các mục:

1. Hiểu đề bài.
2. Tại sao đáp án đúng?
3. Tại sao các đáp án khác sai?
4. Kiến thức cần nhớ.
5. Mẹo nhớ khi thi.

Kèm phần đáp án ở đầu và kết luận ở cuối. Với câu đơn giản, nội dung từng mục được viết ngắn hơn.

## Câu hỏi mẫu

```text
$examtopics-explainer

What is the expected output of this Python code?

values = [10, 20]
print(type(values) is list)

A. None
B. True
C. 0
D. False
```

Kỳ vọng: chọn B, giải thích `type(values) is list`, đánh giá đủ A–D và giữ đầy đủ các mục 1–5.

## Đóng gói và phát hành

- Đảm bảo manifest và README phản ánh nội dung skill cuối cùng.
- Tăng `version` trong `plugin.json` theo SemVer khi phát hành phiên bản mới.
- Đóng gói riêng thư mục plugin, để `plugin.json` ở gốc archive hoặc trong một thư mục bao duy nhất; không kèm backend, frontend hoặc dữ liệu không liên quan.
- Có thể dùng tag riêng như `examtopics-plugin-v1.0.0` để phân biệt phiên bản plugin với phiên bản ứng dụng trong cùng repo.
- GitHub Release dùng để phân phối mã nguồn/gói tải xuống. Xuất bản vào public plugin directory là một bước riêng, cần quy trình xét duyệt.

## Giấy phép

Phần mã nguồn, hướng dẫn skill và tài liệu plugin do FinbertMDS cung cấp được phân phối theo [MIT License](LICENSE). Giấy phép này không cấp quyền đối với câu hỏi, hình ảnh hay tài liệu bên thứ ba do người dùng cung cấp. Plugin không bao gồm bộ đề thi và không phải sản phẩm chính thức của ExamTopics hoặc các nhà cung cấp chứng chỉ.

## Tài liệu chính thức

- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Package your plugin](https://developers.openai.com/plugins/build/plugins)
- [Submit and publish](https://developers.openai.com/plugins/deploy/submission)
