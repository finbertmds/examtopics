# Public listing draft — ExamTopics Explainer

Nguồn metadata public ở `plugin.json`; nguồn skill vẫn là `../examtopics-explainer/`. Gói này tách khỏi plugin riêng tư đã tạo, không thay đổi plugin trên tài khoản.

## Thông tin đã chuẩn bị

| Mục | Giá trị |
| --- | --- |
| Tên hiển thị | ExamTopics Explainer |
| ID gói | examtopics |
| Phiên bản | 1.0.0 |
| Nhà phát hành dự kiến | FinbertMDS — cá nhân, do chủ sở hữu xác nhận; chưa xác minh trên Portal |
| Danh mục | Education & Research |
| Subtitle | Exam answers in Vietnamese |
| Ngôn ngữ trả lời | Tiếng Việt |
| Listing | Tiếng Anh, kèm bản dịch vi-VN |
| Phạm vi | Tất cả quốc gia khả dụng (`countries: []`) |
| Thu phí | Không; không mua hàng hoặc xử lý thanh toán |
| Dữ liệu | Chủ sở hữu xác nhận không thu thập dữ liệu ngoài ChatGPT |
| Website | https://github.com/finbertmds/examtopics |
| Hỗ trợ | https://github.com/finbertmds/examtopics/issues |

Website và trang Issues đã truy cập công khai và đối chiếu đúng repository ngày 2026-11-02. Người gửi issue cần tuân theo cơ chế đăng nhập của GitHub. Không đăng nội dung riêng tư vào issue công khai.

Manifest có mô tả khả năng và giới hạn, ba prompt khởi đầu, ba prompt để review, release notes và icon sáng/tối. Prompt review mới là bản nháp, chưa được chạy kiểm thử trong ChatGPT. Skill chỉ hướng dẫn mô hình; không kèm MCP server, kết nối tài khoản hay bộ đề thi.

## Tạo gói

Từ gốc repository:

```bash
node scripts/package-examtopics.mjs --public
```

Đầu ra: `plugins/examtopics-public/` và `dist/examtopics-public-draft.zip`. Các thư mục này tự sinh và bị Git bỏ qua. Sửa metadata/icon ở đây rồi chạy lại; không sửa đầu ra. Lệnh không upload, không submit và không publish.

## Phần còn thiếu trước khi bàn giao public

- Xác minh danh tính nhà phát hành trên Portal. Tên hiển thị thực tế phải khớp danh tính được OpenAI chấp thuận; việc ghi FinbertMDS trong JSON không hoàn tất xác minh.
- Đã ghi URL do chủ sở hữu cung cấp vào manifest: Privacy Policy https://www.privacypolicies.com/live/2bcef995-e789-45af-9cae-a641ca29b063 và Terms of Service https://www.privacypolicies.com/live/60c30e97-dd0b-4b4c-93f5-c574e4d63ac6.
- Kiểm tra metadata và icon trong Portal sau khi được yêu cầu upload; hoàn tất các tuyên bố chính sách bởi người có thẩm quyền. Chưa có scan hoặc phê duyệt của OpenAI.

Tài liệu Portal hiện nói các URL chính sách không bắt buộc cho mọi trường hợp skills-only, nhưng vẫn cần chuẩn bị và xác nhận chính sách áp dụng trước khi gọi gói này hoàn chỉnh để phát hành. Gói này được đánh dấu **draft**, không phải đã sẵn sàng submit.

## Dữ kiện để soạn privacy (chưa phải chính sách đã công bố)

- Plugin chỉ gồm hướng dẫn skill chạy trong ChatGPT, không chứa máy chủ nhận câu hỏi hoặc kho lưu dữ liệu do nhà phát hành vận hành.
- Chủ sở hữu xác nhận không thu thập dữ liệu ngoài ChatGPT qua plugin. Không diễn giải điều này thành cam kết về lưu trữ hoặc xử lý dữ liệu của OpenAI.
- GitHub Issues là kênh hỗ trợ riêng, công khai; cần xác định rõ xử lý dữ liệu người dùng tự gửi tại đó. Chưa có cam kết về thời hạn lưu trữ, xóa hoặc thời gian phản hồi.

## Tài liệu

- [Public submission](https://developers.openai.com/plugins/deploy/submission)
- [Plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
