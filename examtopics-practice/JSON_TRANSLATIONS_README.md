# JSON Translations Structure

## Tổng quan

Hệ thống đa ngôn ngữ đã được cập nhật để sử dụng các file JSON riêng biệt cho từng ngôn ngữ thay vì định nghĩa tất cả trong một file TypeScript.

## Cấu trúc thư mục

```
src/locales/
├── index.ts                    # Main exports và logic
└── translations/
    ├── en.json                 # English translations
    ├── vi.json                 # Vietnamese translations
    └── ja.json                 # Japanese translations
```

## Cấu trúc file JSON

### en.json (English)
```json
{
  "loading": "Loading...",
  "all": "All",
  "search": "Search",
  "category": "Category",
  "difficulty": "Difficulty",
  "questions": "Questions",
  "minutes": "Minutes",
  "progress": "Progress",
  "start": "Start",
  "continue": "Continue",
  "back": "Back",
  "result": "Result",
  "correct": "Correct",
  "incorrect": "Incorrect",
  "unanswered": "Unanswered",
  "answered": "Answered",
  "training": "Training",
  "remove": "Remove",
  "add": "Add",
  "expand": "Expand",
  "collapse": "Collapse",
  "noResults": "No results found",
  "tryChangingFilters": "Try changing filters or search keywords",
  "scrollToTop": "Scroll to top",
  "scrollToCurrentQuestion": "Scroll to current question",
  "showCorrectAnswers": "Show correct answers",
  "showIncorrectAnswers": "Show incorrect answers",
  "selectMoreAnswers": "You need to select",
  "toViewResult": "more answers to view result",
  "noQuestionsMatchFilter": "No questions match the current filter",
  "noQuestionsMarkedForTraining": "No questions marked for training",
  "remainingQuestions": "remaining questions",
  "questionsAnswered": "questions answered",
  "confirmResetExam": "Are you sure you want to reset the entire exam? Current progress will be lost.",
  "confirmBackToHome": "Are you sure you want to go back to home? Current progress will be saved.",
  "currentProgressWillBeLost": "Current progress will be lost",
  "currentProgressWillBeSaved": "Current progress will be saved",
  "copyright": "© 2025 Exam Practice Platform",
  "randomize": "Randomize",
  "reset": "Reset",
  "viewExplanation": "View explanation",
  "examPracticePlatform": "🎯 Exam Practice Platform",
  "awsCertificationPractice": "Practice AWS certification with quality exam sets",
  "searchPlaceholder": "Search by name, description or tags...",
  "totalExams": "Total exams",
  "filteredResults": "Filtered results",
  "startExam": "🚀 Start Exam",
  "continueExam": "🔄 Continue Exam",
  "backToHome": "← Back to Home",
  "loadingQuestions": "Loading questions...",
  "loadingExamList": "Loading exam list...",
  "beginner": "Beginner",
  "intermediate": "Intermediate",
  "advanced": "Advanced",
  "trainingList": "📚 Training List",
  "markedForTraining": "marked for training",
  "removeFromTraining": "Remove from training",
  "addToTraining": "Add to training",
  "accuracy": "Accuracy",
  "correctAnswers": "correct answers",
  "question": "Question"
}
```

### vi.json (Vietnamese)
```json
{
  "loading": "Đang tải...",
  "all": "Tất cả",
  "search": "Tìm kiếm",
  "category": "Danh mục",
  "difficulty": "Độ khó",
  "questions": "Câu hỏi",
  "minutes": "Phút",
  "progress": "Tiến độ",
  "start": "Bắt đầu",
  "continue": "Tiếp tục",
  "back": "Quay lại",
  "result": "Kết quả",
  "correct": "Đúng",
  "incorrect": "Sai",
  "unanswered": "Chưa làm",
  "answered": "Đã làm",
  "training": "Luyện tập",
  "remove": "Xóa",
  "add": "Thêm",
  "expand": "Mở rộng",
  "collapse": "Thu gọn",
  "noResults": "Không tìm thấy kết quả",
  "tryChangingFilters": "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm",
  "scrollToTop": "Cuộn lên đầu trang",
  "scrollToCurrentQuestion": "Cuộn đến câu hỏi hiện tại",
  "showCorrectAnswers": "Hiển thị đáp án đúng",
  "showIncorrectAnswers": "Hiển thị đáp án sai",
  "selectMoreAnswers": "Bạn cần chọn thêm",
  "toViewResult": "đáp án để xem kết quả",
  "noQuestionsMatchFilter": "Không có câu hỏi nào phù hợp với bộ lọc hiện tại",
  "noQuestionsMarkedForTraining": "Chưa có câu hỏi nào được đánh dấu để luyện tập",
  "remainingQuestions": "câu còn lại",
  "questionsAnswered": "câu đã làm",
  "confirmResetExam": "Bạn có chắc chắn muốn làm lại toàn bộ bài thi? Tiến độ hiện tại sẽ bị mất.",
  "confirmBackToHome": "Bạn có chắc chắn muốn quay về trang chủ? Tiến độ hiện tại sẽ được lưu.",
  "currentProgressWillBeLost": "Tiến độ hiện tại sẽ bị mất",
  "currentProgressWillBeSaved": "Tiến độ hiện tại sẽ được lưu",
  "copyright": "© 2025 Exam Practice Platform",
  "randomize": "Ngẫu nhiên",
  "reset": "Làm lại",
  "viewExplanation": "Xem giải thích",
  "examPracticePlatform": "🎯 Exam Practice Platform",
  "awsCertificationPractice": "Luyện thi chứng chỉ AWS với các bộ đề chất lượng",
  "searchPlaceholder": "Tìm theo tên, mô tả hoặc tags...",
  "totalExams": "Tổng số đề thi",
  "filteredResults": "Đã lọc",
  "startExam": "🚀 Bắt đầu làm bài",
  "continueExam": "🔄 Tiếp tục làm bài",
  "backToHome": "← Quay về trang chủ",
  "loadingQuestions": "Đang tải câu hỏi...",
  "loadingExamList": "Đang tải danh sách đề thi...",
  "beginner": "Beginner",
  "intermediate": "Intermediate",
  "advanced": "Advanced",
  "trainingList": "📚 Danh sách luyện tập",
  "markedForTraining": "được đánh dấu để luyện tập",
  "removeFromTraining": "Bỏ khỏi luyện tập",
  "addToTraining": "Thêm vào luyện tập",
  "accuracy": "Kết quả",
  "correctAnswers": "câu đúng",
  "question": "Câu"
}
```

### ja.json (Japanese)
```json
{
  "loading": "読み込み中...",
  "all": "すべて",
  "search": "検索",
  "category": "カテゴリ",
  "difficulty": "難易度",
  "questions": "問題",
  "minutes": "分",
  "progress": "進捗",
  "start": "開始",
  "continue": "続行",
  "back": "戻る",
  "result": "結果",
  "correct": "正解",
  "incorrect": "不正解",
  "unanswered": "未回答",
  "answered": "回答済み",
  "training": "練習",
  "remove": "削除",
  "add": "追加",
  "expand": "展開",
  "collapse": "折りたたみ",
  "noResults": "結果が見つかりません",
  "tryChangingFilters": "フィルターまたは検索キーワードを変更してみてください",
  "scrollToTop": "トップにスクロール",
  "scrollToCurrentQuestion": "現在の問題にスクロール",
  "showCorrectAnswers": "正解を表示",
  "showIncorrectAnswers": "不正解を表示",
  "selectMoreAnswers": "結果を表示するには、さらに",
  "toViewResult": "個の回答を選択する必要があります",
  "noQuestionsMatchFilter": "現在のフィルターに一致する問題はありません",
  "noQuestionsMarkedForTraining": "練習用にマークされた問題はありません",
  "remainingQuestions": "残りの問題",
  "questionsAnswered": "問題回答済み",
  "confirmResetExam": "試験全体をリセットしてもよろしいですか？現在の進捗は失われます。",
  "confirmBackToHome": "ホームに戻ってもよろしいですか？現在の進捗は保存されます。",
  "currentProgressWillBeLost": "現在の進捗は失われます",
  "currentProgressWillBeSaved": "現在の進捗は保存されます",
  "copyright": "© 2025 Exam Practice Platform",
  "randomize": "ランダム",
  "reset": "リセット",
  "viewExplanation": "説明を見る",
  "examPracticePlatform": "🎯 Exam Practice Platform",
  "awsCertificationPractice": "高品質な試験セットでAWS認定を練習",
  "searchPlaceholder": "名前、説明、またはタグで検索...",
  "totalExams": "試験総数",
  "filteredResults": "フィルター結果",
  "startExam": "🚀 試験開始",
  "continueExam": "🔄 試験続行",
  "backToHome": "← ホームに戻る",
  "loadingQuestions": "問題を読み込み中...",
  "loadingExamList": "試験リストを読み込み中...",
  "beginner": "初級",
  "intermediate": "中級",
  "advanced": "上級",
  "trainingList": "📚 練習リスト",
  "markedForTraining": "練習用にマーク済み",
  "removeFromTraining": "練習から削除",
  "addToTraining": "練習に追加",
  "accuracy": "結果",
  "correctAnswers": "正解",
  "question": "問題"
}
```

## Cách sử dụng

### 1. Import và sử dụng trong component
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('examPracticePlatform')}</h1>
      <p>{t('loading')}</p>
    </div>
  );
};
```

### 2. Thêm translation key mới

#### Bước 1: Thêm key vào tất cả file JSON
```json
// en.json
{
  "newKey": "New English text"
}

// vi.json
{
  "newKey": "Văn bản tiếng Việt mới"
}

// ja.json
{
  "newKey": "新しい日本語テキスト"
}
```

#### Bước 2: Sử dụng trong component
```tsx
const { t } = useLanguage();
return <div>{t('newKey')}</div>;
```

## Lợi ích của cấu trúc mới

### 1. Tách biệt dữ liệu
- Mỗi ngôn ngữ có file riêng biệt
- Dễ dàng quản lý và bảo trì
- Có thể chỉnh sửa từng ngôn ngữ độc lập

### 2. Dễ mở rộng
- Thêm ngôn ngữ mới chỉ cần tạo file JSON mới
- Không cần sửa code TypeScript
- Có thể load động từ API

### 3. Performance
- Chỉ load ngôn ngữ cần thiết
- Bundle size nhỏ hơn
- Lazy loading có thể được implement

### 4. Tooling support
- JSON files có syntax highlighting tốt hơn
- Có thể sử dụng JSON validation tools
- Dễ dàng tích hợp với translation management systems

## Cấu trúc file index.ts

```typescript
// Import translations from JSON files
import enTranslations from './translations/en.json';
import viTranslations from './translations/vi.json';
import jaTranslations from './translations/ja.json';

export type Language = 'en' | 'vi' | 'ja';

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Language, Translations> = {
  en: enTranslations as Translations,
  vi: viTranslations as Translations,
  ja: jaTranslations as Translations,
};

export const getTranslation = (language: Language, key: string): string => {
  return translations[language][key] || key;
};
```

## Migration từ cấu trúc cũ

### Trước khi migration
```typescript
// Cấu trúc cũ - tất cả trong một file
export const translations = {
  en: {
    loading: 'Loading...',
    // ... nhiều keys
  },
  vi: {
    loading: 'Đang tải...',
    // ... nhiều keys
  }
};
```

### Sau khi migration
```typescript
// Cấu trúc mới - tách thành file JSON
import enTranslations from './translations/en.json';
import viTranslations from './translations/vi.json';

export const translations = {
  en: enTranslations,
  vi: viTranslations,
};
```

## Best Practices

### 1. Naming conventions
- Sử dụng camelCase cho key names
- Mô tả rõ ràng chức năng của key
- Nhóm các key liên quan

### 2. Organization
- Sắp xếp keys theo thứ tự alphabet
- Comment để phân nhóm (nếu cần)
- Đảm bảo tất cả file JSON có cùng keys

### 3. Validation
- Kiểm tra tất cả file có cùng keys
- Validate JSON syntax
- Test với tất cả ngôn ngữ

### 4. Maintenance
- Cập nhật tất cả file khi thêm key mới
- Backup trước khi thay đổi lớn
- Document changes

## Kết quả

✅ **Tách biệt dữ liệu**: Mỗi ngôn ngữ có file riêng
✅ **Dễ mở rộng**: Thêm ngôn ngữ mới dễ dàng
✅ **Performance tốt**: Load chỉ ngôn ngữ cần thiết
✅ **Maintainability**: Dễ bảo trì và cập nhật
✅ **Tooling support**: JSON validation và syntax highlighting
✅ **Backward compatibility**: API không thay đổi

Hệ thống đa ngôn ngữ giờ đây có cấu trúc rõ ràng và dễ mở rộng! 🌍
