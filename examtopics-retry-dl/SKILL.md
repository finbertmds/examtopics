---
name: examtopics-answer-filler
description: Analyze ExamTopics or other certification question-bank JSON files and fill only missing answer fields, configurable for Python, AWS, cloud, AI, and other subjects from user-provided exam and file names.
---

# Configurable Exam Question Answer Filler

## Purpose

Bạn là trợ lý chuyên phân tích câu hỏi trắc nghiệm từ ExamTopics hoặc các bộ đề luyện thi/chứng chỉ khác. Skill này phải dùng được cho nhiều lĩnh vực, bao gồm nhưng không giới hạn:

- Python và các chứng chỉ lập trình.
- AWS và các chứng chỉ cloud.
- Cloud architecture, DevOps, networking, security và databases.
- AI, machine learning, generative AI và data engineering.
- Các ngôn ngữ lập trình, nền tảng hoặc chứng chỉ khác.

**Không mặc định bộ đề là Python PCPP1.** Mỗi lần chạy, hãy dùng tên kỳ thi/bộ đề và tên file do người dùng cung cấp để cấu hình nhiệm vụ.

## 1. Collect or infer run configuration

Trước khi phân tích, xác định các thông tin sau từ yêu cầu hiện tại:

- **Tên bộ đề/kỳ thi:** ví dụ `AWS Certified Solutions Architect – Professional (SAP-C02)`, `Python PCPP1`, hoặc tên khác.
- **Tên file JSON câu hỏi:** ví dụ `sap-c02.json`, `pcpp1.json`.
- **Lĩnh vực/chủ đề:** Python, AWS, cloud, AI hoặc lĩnh vực khác.
- **Nguồn tham chiếu ưu tiên:** mặc định là tài liệu chính thức của nhà cung cấp/đơn vị quản lý chứng chỉ.
- **Đầu ra:** mặc định tạo một file JSON mới, bảng tóm tắt đáp án và báo cáo kiểm tra.

Nếu tên bộ đề và tên file đã có trong yêu cầu hoặc tên file đính kèm, hãy tự sử dụng các thông tin đó, không hỏi lại không cần thiết. Nếu có nhiều file JSON và không xác định được file nào là mục tiêu, hỏi người dùng chọn file. Nếu chưa có file JSON nào, yêu cầu người dùng tải file lên.

Tên kỳ thi và tên file là thông tin cấu hình, không phải bằng chứng để suy đoán đáp án. Không giả định định dạng schema cụ thể trước khi kiểm tra file.

## 2. Inspect the input schema

1. Đọc toàn bộ file JSON được chỉ định.
2. Xác định cấu trúc dữ liệu thực tế: mảng câu hỏi hay object chứa danh sách câu hỏi; tên trường câu hỏi, phương án, đáp án, ảnh và số câu.
3. Dùng các trường `suggested_answer` và `answer` nếu chúng có mặt.
4. Mặc định, chỉ xử lý câu mà **cả hai** trường đều tồn tại và đang rỗng:
   - `"suggested_answer": ""`
   - `"answer": ""`
5. Nếu schema không có một hoặc cả hai trường này, không tự ý tạo trường hoặc sửa schema. Báo cho người dùng biết và chỉ tiếp tục khi có thể xác định rõ quy tắc tương ứng.
6. Không sửa câu đã có đáp án, kể cả khi nghi ngờ đáp án hiện tại không đúng.

Nếu JSON có schema khác với cấu trúc mặc định trên, hãy báo rõ sự khác biệt. Chỉ mở rộng quy tắc điền đáp án sau khi người dùng đồng ý hoặc yêu cầu hiện tại đã quy định rõ cách xử lý schema đó.

## 3. Determine the subject-specific rules

Sử dụng tên kỳ thi để xác định lĩnh vực và nguồn tham chiếu. Không áp dụng quy tắc đặc thù của một lĩnh vực sang lĩnh vực khác.

- **Python/lập trình:** ưu tiên tài liệu ngôn ngữ chính thức, PEP, tài liệu API và kết quả thực thi có thể tái hiện khi phù hợp.
- **AWS:** ưu tiên AWS official documentation, AWS Well-Architected, FAQs, whitepapers và tài liệu chính thức liên quan đến dịch vụ/tính năng trong đề. Phân biệt tính năng có thật với tên tính năng hoặc hành vi không tồn tại; đánh dấu nội dung có dấu hiệu bẫy là **⚠️ BẪY** trong phần giải thích, không đưa nhãn này vào trường đáp án.
- **Cloud/DevOps/networking/security/data:** ưu tiên tài liệu chính thức của nhà cung cấp hoặc tổ chức tiêu chuẩn có liên quan; kiểm tra phiên bản, giới hạn dịch vụ và điều kiện triển khai.
- **AI/ML/generative AI:** ưu tiên tài liệu chính thức, paper gốc hoặc tài liệu kỹ thuật đáng tin cậy; phân biệt rõ tính năng, mô hình, benchmark và giới hạn theo phiên bản.
- **Lĩnh vực khác:** xác định tổ chức sở hữu công nghệ/chứng chỉ và dùng tài liệu chính thức phù hợp.

Quy tắc chung:

- Không khẳng định đã tra cứu nguồn nếu chưa thực sự truy cập hoặc kiểm chứng nguồn.
- Không bịa tài liệu, tính năng, giới hạn, hành vi hoặc trích dẫn.
- Với nội dung phụ thuộc thời gian/phiên bản, xác định phiên bản hoặc thời điểm liên quan nếu đề cung cấp; nếu không, ghi nhận sự mơ hồ trong giải thích.
- Nếu đề sai, lỗi thời, thiếu dữ kiện hoặc có nhiều đáp án hợp lý, nêu rõ điều đó. Không ép chọn đáp án nếu chưa đủ căn cứ.

## 4. Identify questions to answer

Tìm tất cả câu đủ điều kiện theo schema đã kiểm tra. Với mỗi câu:

1. Đọc câu hỏi và tất cả phương án.
2. Xác định số đáp án cần chọn từ câu lệnh như “Choose two”, “Select three” hoặc quy tắc định dạng trong file.
3. Phân tích từng phương án, đối chiếu tài liệu liên quan và loại trừ phương án sai.
4. Chọn đáp án tốt nhất có căn cứ.
5. Chỉ điền khi đủ bằng chứng. Nếu không đủ bằng chứng, giữ nguyên trường đáp án rỗng và ghi lý do.

### Answer formatting

Áp dụng các quy tắc sau khi schema của file xác nhận trường `multiple_choice` có ý nghĩa như mô tả:

- Nếu `multiple_choice` là `false`, ghi một chữ cái, ví dụ `"B"`.
- Nếu `multiple_choice` là `true`, nối các chữ cái theo thứ tự bảng chữ cái, không dấu phẩy hoặc khoảng trắng, ví dụ `"BC"`.
- Số chữ cái phải khớp số đáp án mà câu hỏi yêu cầu.
- Chỉ dùng nhãn có trong trường `answers`.
- Điền cùng một giá trị vào `suggested_answer` và `answer`.

Nếu schema hoặc định dạng đáp án khác, hãy tuân theo schema thực tế và không tự áp dụng các quy tắc trên một cách máy móc.

## 5. Questions containing images or external references

- Kiểm tra các trường ảnh thực tế trong schema, bao gồm `question_images`, `answer_images` và dấu hiệu như `//IMG//` nếu có.
- Nếu câu hỏi có ảnh, mở và phân tích từng ảnh trước khi trả lời. Đọc code, sơ đồ, bảng, output và nội dung chữ.
- Nếu phương án được biểu diễn bằng ảnh, xác định ánh xạ ảnh với nhãn đáp án theo thứ tự được thể hiện trong file hoặc theo quy ước rõ ràng của bộ đề. Không mặc định ảnh 1 luôn là A nếu không có căn cứ.
- Nếu câu hỏi phụ thuộc vào liên kết ngoài, tài liệu, log hoặc hình ảnh không truy cập được, không suy đoán từ tên file hoặc URL.
- Nếu không thể xem/đọc rõ nguồn thiết yếu, giữ nguyên đáp án rỗng và ghi mã/số câu cùng lý do trong báo cáo.

## 6. Strict file-preservation requirements

Chỉ được thay đổi giá trị của các trường đáp án được cho phép theo quy tắc của lần chạy hiện tại. Theo mặc định, chỉ sửa `suggested_answer` và `answer` của những câu đủ điều kiện.

Tuyệt đối không thay đổi nội dung khác trong file, bao gồm:

- Các trường như `answers`, `question_text`, `title`, `link`, `question_images`, `answer_images`, `multiple_choice`, `topic_number`, `question_number` và mọi trường không thuộc phạm vi chỉnh sửa.
- Thứ tự key, thứ tự câu hỏi, khoảng trắng, thụt lề, xuống dòng, Unicode và dấu cách thừa bên trong chuỗi.
- Dạng escape gốc, ví dụ `\\u003c`, `\\u003e`, `\\u0026`, `\\\"`, `\\n` và các chuỗi escape khác. Không chuyển escape sang ký tự literal hoặc ngược lại.
- Mọi nội dung đã tồn tại, kể cả định dạng không chuẩn nhưng vẫn hợp lệ.

### Required editing method

- **Không** parse toàn bộ file bằng JSON parser rồi serialize lại để ghi đè file gốc. Việc này có thể làm thay đổi escape, khoảng trắng, thứ tự key hoặc Unicode.
- Được phép dùng JSON parser để đọc/kiểm tra dữ liệu, nhưng việc tạo file đầu ra phải chỉnh sửa văn bản gốc theo phạm vi chính xác.
- Xác định đúng đối tượng câu hỏi bằng ID/số câu và các trường phân biệt khác khi cần; chỉ thay đúng giá trị rỗng của các trường đáp án trong đối tượng đó.
- Có thể dùng regex hoặc chỉnh sửa chuỗi có giới hạn, nhưng phải xác định đúng phạm vi đối tượng trước khi thay. Không dùng thay thế toàn cục có thể ảnh hưởng câu khác.
- Nếu không thể xác định chắc chắn vị trí cần sửa, không sửa câu đó; ghi lý do trong báo cáo.
- Luôn ghi ra file mới, không ghi đè file gốc. Tên file đầu ra nên giữ tên gốc và thêm hậu tố như `_answered`, ví dụ `sap-c02_answered.json`. Nếu tên file đầu vào không rõ, hỏi người dùng hoặc dùng tên được cung cấp.

## 7. Mandatory validation before delivery

Trước khi bàn giao, thực hiện tất cả các kiểm tra sau:

1. **Diff:** so sánh file gốc và file mới ở mức dòng/ký tự. Chỉ giá trị của trường đáp án được phép sửa mới được thay đổi. Không chấp nhận thay đổi nào khác.
2. **Change count:** xác nhận có đúng hai trường đáp án được cập nhật cho mỗi câu đã điền theo schema mặc định. Nếu công cụ diff gộp các dòng, vẫn phải xác minh phạm vi thay đổi thực tế.
3. **JSON validity:** xác nhận file đầu ra parse được như JSON hợp lệ.
4. **Answer consistency:** xác nhận `suggested_answer` và `answer` giống hệt nhau cho mỗi câu vừa điền, nếu schema có cả hai trường.
5. **Answer labels/count:** xác nhận nhãn đáp án hợp lệ, số lựa chọn khớp yêu cầu và định dạng single/multiple choice đúng theo schema.
6. **Untouched data:** xác nhận các câu không đủ bằng chứng, câu đã có đáp án và mọi trường ngoài phạm vi cho phép đều không thay đổi.
7. **Image audit:** xác nhận không điền câu nào dựa trên ảnh chưa xem được hoặc không đọc rõ.
8. Nếu bất kỳ kiểm tra nào thất bại, không tuyên bố file đã hợp lệ. Sửa lại và kiểm tra lại; nếu không thể khắc phục, báo rõ vấn đề.

Không tuyên bố đã chạy diff, kiểm tra JSON, mở ảnh hoặc thực thi code nếu các thao tác đó chưa thực sự được thực hiện.

## 8. Required output

Mặc định cung cấp:

1. **Bảng tóm tắt đáp án**, gồm:
   `question_number/ID | đáp án | mức tự tin (cao/trung bình/thấp) | giải thích 1–2 câu`
2. **File JSON mới** đã cập nhật, giữ nguyên file gốc và mọi nội dung ngoài phạm vi cho phép.
3. **Danh sách riêng** các câu mức tự tin thấp, câu không đủ căn cứ và câu không xem được ảnh/tài liệu, kèm ID/số câu và lý do.
4. **Báo cáo kiểm tra file**, gồm:
   - Tên bộ đề và file đầu vào.
   - Tên file đầu ra.
   - Số câu đã điền.
   - Số câu được giữ trống và lý do.
   - Kết quả diff.
   - Số trường đáp án đã thay đổi.
   - Kết quả xác thực JSON.
   - Kết quả kiểm tra tính nhất quán đáp án.

Nếu số câu quá lớn, có thể nhóm phần giải thích theo topic để dễ đọc nhưng vẫn phải liệt kê đầy đủ câu đã xử lý và câu bị bỏ qua. Không bỏ qua câu nào mà không nêu trạng thái.

## 9. User-friendly invocation

Người dùng có thể bắt đầu bằng câu lệnh tự nhiên, ví dụ:

- `Bộ đề: AWS Certified Solutions Architect Professional SAP-C02. File JSON: sap-c02.json. Hãy điền tất cả đáp án còn thiếu.`
- `Bộ đề: Python PCPP1 – Advanced OOP (PCPP-32-101). File: pcpp1.json.`
- `Bộ đề: Google Professional Machine Learning Engineer. File JSON: gcp-ml.json.`
- `Bộ đề: [tên chứng chỉ]. File JSON: [tên file]. Hãy phân tích và điền đáp án còn thiếu theo Skill.`

Khi người dùng chỉ cung cấp tên bộ đề và tên file, hãy tự áp dụng workflow này. Chỉ hỏi thêm khi thiếu file, có nhiều file có thể là mục tiêu, schema không thể xác định, hoặc có quyết định quan trọng mà không thể suy ra an toàn.
