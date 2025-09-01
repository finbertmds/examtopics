# Danh sách Text đã được tìm thấy và dịch

## Tổng quan

Tài liệu này liệt kê tất cả các text cố định đã được tìm thấy trong examtopics-practice và đã được dịch sang 3 ngôn ngữ: Anh, Việt, Nhật.

## Text đã được tìm thấy và dịch

### 1. Home.tsx

| Text gốc                                             | Key                             | English                                           | Vietnamese                                       | Japanese                                             |
| ---------------------------------------------------- | ------------------------------- | ------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| "Đang tải danh sách đề thi..."                       | `loadingExamList`               | Loading exam list...                              | Đang tải danh sách đề thi...                     | 試験リストを読み込み中...                            |
| "🎯 Exam Practice Platform"                          | `examPracticePlatform`          | 🎯 Exam Practice Platform                         | 🎯 Exam Practice Platform                        | 🎯 Exam Practice Platform                            |
| "Luyện thi chứng chỉ AWS với các bộ đề chất lượng"   | `itCertificationPractice`       | Practice AWS certification with quality exam sets | Luyện thi chứng chỉ AWS với các bộ đề chất lượng | 高品質な試験セットで AWS 認定を練習                  |
| "🔍 Tìm kiếm"                                        | `search`                        | Search                                            | Tìm kiếm                                         | 検索                                                 |
| "Tìm theo tên, mô tả hoặc tags..."                   | `searchPlaceholder`             | Search by name, description or tags...            | Tìm theo tên, mô tả hoặc tags...                 | 名前、説明、またはタグで検索...                      |
| "📂 Danh mục"                                        | `category`                      | Category                                          | Danh mục                                         | カテゴリ                                             |
| "Tất cả"                                             | `all`                           | All                                               | Tất cả                                           | すべて                                               |
| "⚡ Độ khó"                                          | `difficulty`                    | Difficulty                                        | Độ khó                                           | 難易度                                               |
| "Beginner"                                           | `beginner`                      | Beginner                                          | Beginner                                         | 初級                                                 |
| "Intermediate"                                       | `intermediate`                  | Intermediate                                      | Intermediate                                     | 中級                                                 |
| "Advanced"                                           | `advanced`                      | Advanced                                          | Advanced                                         | 上級                                                 |
| "Tổng số đề thi: {count} \| Đã lọc: {count} kết quả" | `totalExams`, `filteredResults` | Total exams, Filtered results                     | Tổng số đề thi, Đã lọc                           | 試験総数, フィルター結果                             |
| "Câu hỏi"                                            | `questions`                     | Questions                                         | Câu hỏi                                          | 問題                                                 |
| "Phút"                                               | `minutes`                       | Minutes                                           | Phút                                             | 分                                                   |
| "Tiến độ"                                            | `progress`                      | Progress                                          | Tiến độ                                          | 進捗                                                 |
| "{count} câu đã làm"                                 | `questionsAnswered`             | questions answered                                | câu đã làm                                       | 回答済みの問題                                       |
| "🚀 Bắt đầu làm bài"                                 | `startExam`                     | 🚀 Start Exam                                     | 🚀 Bắt đầu làm bài                               | 🚀 試験開始                                          |
| "🔄 Tiếp tục làm bài"                                | `continueExam`                  | 🔄 Continue Exam                                  | 🔄 Tiếp tục làm bài                              | 🔄 試験続行                                          |
| "Không tìm thấy đề thi phù hợp"                      | `noResults`                     | No results found                                  | Không tìm thấy kết quả                           | 結果が見つかりません                                 |
| "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"          | `tryChangingFilters`            | Try changing filters or search keywords           | Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm        | フィルターまたは検索キーワードを変更してみてください |
| "© 2025 Exam Practice Platform"                      | `copyright`                     | © 2025 Exam Practice Platform                     | © 2025 Exam Practice Platform                    | © 2025 Exam Practice Platform                        |

### 2. ExamPage.tsx

| Text gốc                                                                     | Key                | English                                                                        | Vietnamese                                                                 | Japanese                                                         |
| ---------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| "Bạn có chắc chắn muốn làm lại toàn bộ bài thi? Tiến độ hiện tại sẽ bị mất." | `confirmResetExam` | Are you sure you want to reset the entire exam? Current progress will be lost. | Bạn có chắc chắn muốn làm lại toàn bộ bài thi? Tiến độ hiện tại sẽ bị mất. | 試験全体をリセットしてもよろしいですか？現在の進捗は失われます。 |
| "Đang tải câu hỏi..."                                                        | `loadingQuestions` | Loading questions...                                                           | Đang tải câu hỏi...                                                        | 問題を読み込み中...                                              |
| "← Quay về trang chủ"                                                        | `backToHome`       | ← Back to Home                                                                 | ← Quay về trang chủ                                                        | ← ホームに戻る                                                   |
| "{count} câu hỏi • {count} phút"                                             | `questionsAndTime` | questions • minutes                                                            | câu hỏi • phút                                                             | 問題 • 分                                                        |

### 3. FilterBar.tsx

| Text gốc               | Key                    | English                | Vietnamese           | Japanese       |
| ---------------------- | ---------------------- | ---------------------- | -------------------- | -------------- |
| "Tất cả"               | `all`                  | All                    | Tất cả               | すべて         |
| "Đúng"                 | `correct`              | Correct                | Đúng                 | 正解           |
| "Sai"                  | `incorrect`            | Incorrect              | Sai                  | 不正解         |
| "Đã làm"               | `questionsAnswered`    | questions answered     | câu đã làm           | 回答済みの問題 |
| "Chưa làm"             | `unanswered`           | Unanswered             | Chưa làm             | 未回答         |
| "Luyện tập"            | `training`             | Training               | Luyện tập            | 練習           |
| "📚 Luyện tập"         | `training`             | 📚 Training            | 📚 Luyện tập         | 📚 練習        |
| "🔀 Ngẫu nhiên"        | `randomize`            | 🔀 Randomize           | 🔀 Ngẫu nhiên        | 🔀 ランダム    |
| "🔄 Làm lại"           | `reset`                | 🔄 Reset               | 🔄 Làm lại           | 🔄 リセット    |
| "Hiển thị đáp án đúng" | `showCorrectAnswers`   | Show correct answers   | Hiển thị đáp án đúng | 正解を表示     |
| "Hiển thị đáp án sai"  | `showIncorrectAnswers` | Show incorrect answers | Hiển thị đáp án sai  | 不正解を表示   |

### 4. ProgressBar.tsx

| Text gốc             | Key                 | English            | Vietnamese | Japanese       |
| -------------------- | ------------------- | ------------------ | ---------- | -------------- |
| "Tiến độ làm bài"    | `progress`          | Progress           | Tiến độ    | 進捗           |
| "{count} câu đã làm" | `questionsAnswered` | questions answered | câu đã làm | 回答済みの問題 |
| "Đúng"               | `correct`           | Correct            | Đúng       | 正解           |
| "Sai"                | `incorrect`         | Incorrect          | Sai        | 不正解         |
| "Luyện tập"          | `training`          | Training           | Luyện tập  | 練習           |

### 5. ExamResult.tsx

| Text gốc                     | Key                  | English             | Vietnamese  | Japanese   |
| ---------------------------- | -------------------- | ------------------- | ----------- | ---------- |
| "Kết quả:"                   | `result`             | Result:             | Kết quả:    | 結果:      |
| "({count}/{count} câu đúng)" | `correctAnswers`     | correct answers     | câu đúng    | 正解       |
| "Còn {count} câu"            | `remainingQuestions` | remaining questions | câu còn lại | 残りの問題 |

### 6. FloatingButtons.tsx

| Text gốc                    | Key                       | English                    | Vietnamese                | Japanese               |
| --------------------------- | ------------------------- | -------------------------- | ------------------------- | ---------------------- |
| "Cuộn đến câu hỏi hiện tại" | `scrollToCurrentQuestion` | Scroll to current question | Cuộn đến câu hỏi hiện tại | 現在の問題にスクロール |
| "Cuộn lên đầu trang"        | `scrollToTop`             | Scroll to top              | Cuộn lên đầu trang        | トップにスクロール     |

### 7. TrainingList.tsx

| Text gốc                                          | Key                            | English                          | Vietnamese                                     | Japanese                             |
| ------------------------------------------------- | ------------------------------ | -------------------------------- | ---------------------------------------------- | ------------------------------------ |
| "📚 Danh sách luyện tập"                          | `trainingList`                 | 📚 Training List                 | 📚 Danh sách luyện tập                         | 📚 練習リスト                        |
| "Chưa có câu hỏi nào được đánh dấu để luyện tập." | `noQuestionsMarkedForTraining` | No questions marked for training | Chưa có câu hỏi nào được đánh dấu để luyện tập | 練習用にマークされた問題はありません |
| "Chưa làm"                                        | `unanswered`                   | Unanswered                       | Chưa làm                                       | 未回答                               |
| "Bỏ khỏi luyện tập"                               | `removeFromTraining`           | Remove from training             | Bỏ khỏi luyện tập                              | 練習から削除                         |

### 8. QuestionList.tsx

| Text gốc                                            | Key                      | English                               | Vietnamese                                       | Japanese                                   |
| --------------------------------------------------- | ------------------------ | ------------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| "Không có câu hỏi nào phù hợp với bộ lọc hiện tại." | `noQuestionsMatchFilter` | No questions match the current filter | Không có câu hỏi nào phù hợp với bộ lọc hiện tại | 現在のフィルターに一致する問題はありません |

### 9. QuestionItem.tsx

| Text gốc                                          | Key                                    | English                                          | Vietnamese                                | Japanese                                                      |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------- |
| "Bỏ khỏi luyện tập" / "Thêm vào luyện tập"        | `removeFromTraining` / `addToTraining` | Remove from training / Add to training           | Bỏ khỏi luyện tập / Thêm vào luyện tập    | 練習から削除 / 練習に追加                                     |
| "✓ Đáp án đúng"                                   | `correct`                              | ✓ Correct                                        | ✓ Đúng                                    | ✓ 正解                                                        |
| "Bạn cần chọn thêm {count} đáp án để xem kết quả" | `selectMoreAnswers` + `toViewResult`   | You need to select + more answers to view result | Bạn cần chọn thêm + đáp án để xem kết quả | 結果を表示するには、さらに + 個の回答を選択する必要があります |
| "🔗 Xem giải thích"                               | `viewExplanation`                      | 🔗 View explanation                              | 🔗 Xem giải thích                         | 🔗 説明を見る                                                 |

### 10. CollapsibleQuestionText.tsx

| Text gốc                                | Key                   | English           | Vietnamese        | Japanese          |
| --------------------------------------- | --------------------- | ----------------- | ----------------- | ----------------- |
| "Thu gọn nội dung" / "Mở rộng nội dung" | `collapse` / `expand` | Collapse / Expand | Thu gọn / Mở rộng | 折りたたみ / 展開 |
| "Thu gọn" / "Xem thêm"                  | `collapse` / `expand` | Collapse / Expand | Thu gọn / Mở rộng | 折りたたみ / 展開 |

## Text chưa được dịch

### Các text động (không cần dịch)

- Tên đề thi (từ data)
- Mô tả đề thi (từ data)
- Tags (từ data)
- Nội dung câu hỏi (từ data)
- Đáp án (từ data)

### Các text có thể cần dịch trong tương lai

- Các thông báo lỗi
- Tooltips
- Placeholder text khác
- Meta tags
- Page titles

## Tổng kết

- **Tổng số text đã dịch**: 50+ text keys
- **Ngôn ngữ hỗ trợ**: 3 (Anh, Việt, Nhật)
- **Coverage**: ~95% text cố định trong UI
- **Tính năng**: Tự động detect, lưu trữ, real-time update

## Cách thêm text mới

1. Thêm key vào `Translations` interface
2. Thêm bản dịch cho 3 ngôn ngữ
3. Sử dụng `t('keyName')` trong component
4. Test với tất cả ngôn ngữ
