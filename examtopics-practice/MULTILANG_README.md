# Hệ thống Đa ngôn ngữ - Exam Practice Platform

## Tổng quan

Hệ thống đa ngôn ngữ đã được tích hợp vào Exam Practice Platform, hỗ trợ 3 ngôn ngữ:
- 🇺🇸 **English (en)**
- 🇻🇳 **Tiếng Việt (vi)** 
- 🇯🇵 **日本語 (ja)**

## Cấu trúc hệ thống

### 1. File cấu hình ngôn ngữ
```
src/locales/index.ts
```
- Định nghĩa interface `Translations` chứa tất cả các key text
- Chứa object `translations` với bản dịch cho 3 ngôn ngữ
- Function `getTranslation()` để lấy text theo ngôn ngữ

### 2. Context quản lý ngôn ngữ
```
src/contexts/LanguageContext.tsx
```
- `LanguageProvider`: Provider component
- `useLanguage()`: Hook để sử dụng trong components
- Tự động detect ngôn ngữ từ browser
- Lưu ngôn ngữ vào localStorage

### 3. Component chuyển đổi ngôn ngữ
```
src/components/LanguageToggle.tsx
```
- Dropdown để chọn ngôn ngữ
- Hiển thị flag và tên ngôn ngữ
- Tự động cập nhật UI khi đổi ngôn ngữ

## Cách sử dụng

### 1. Trong component
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

### 2. Thêm text mới
1. Thêm key vào interface `Translations` trong `src/locales/index.ts`
2. Thêm bản dịch cho 3 ngôn ngữ trong object `translations`
3. Sử dụng `t('keyName')` trong component

### 3. Thêm ngôn ngữ mới
1. Thêm code ngôn ngữ vào type `Language`
2. Thêm object bản dịch vào `translations`
3. Thêm vào `availableLanguages` trong `LanguageContext`

## Danh sách text đã được dịch

### Common
- `loading`, `all`, `search`, `category`, `difficulty`
- `questions`, `minutes`, `progress`, `start`, `continue`
- `back`, `result`, `correct`, `incorrect`, `unanswered`
- `training`, `remove`, `add`, `expand`, `collapse`
- `noResults`, `tryChangingFilters`, `scrollToTop`
- `showCorrectAnswers`, `showIncorrectAnswers`
- `selectMoreAnswers`, `toViewResult`
- `noQuestionsMatchFilter`, `noQuestionsMarkedForTraining`
- `remainingQuestions`, `questionsAnswered`
- `confirmResetExam`, `confirmBackToHome`
- `randomize`, `reset`, `viewExplanation`

### Home Page
- `examPracticePlatform`, `awsCertificationPractice`
- `searchPlaceholder`, `totalExams`, `filteredResults`
- `startExam`, `continueExam`

### Exam Page
- `backToHome`, `questionsAndTime`
- `loadingQuestions`, `loadingExamList`

### Difficulty Levels
- `beginner`, `intermediate`, `advanced`

### Training
- `trainingList`, `markedForTraining`
- `removeFromTraining`, `addToTraining`

### Results
- `accuracy`, `correctAnswers`

## Tính năng

### 1. Tự động detect ngôn ngữ
- Kiểm tra localStorage trước
- Fallback về ngôn ngữ browser
- Default: English

### 2. Lưu trữ ngôn ngữ
- Tự động lưu vào localStorage
- Khôi phục ngôn ngữ khi reload trang

### 3. Cập nhật real-time
- UI tự động cập nhật khi đổi ngôn ngữ
- Không cần reload trang

### 4. Accessibility
- Cập nhật `lang` attribute của HTML
- Hỗ trợ screen reader

## Cách thêm text mới

### Bước 1: Thêm key vào interface
```tsx
export interface Translations {
  // ... existing keys
  newTextKey: string;
}
```

### Bước 2: Thêm bản dịch
```tsx
export const translations: Record<Language, Translations> = {
  en: {
    // ... existing translations
    newTextKey: 'English text',
  },
  vi: {
    // ... existing translations
    newTextKey: 'Text tiếng Việt',
  },
  ja: {
    // ... existing translations
    newTextKey: '日本語テキスト',
  },
};
```

### Bước 3: Sử dụng trong component
```tsx
const { t } = useLanguage();
return <div>{t('newTextKey')}</div>;
```

## Lưu ý

1. **Consistency**: Đảm bảo tất cả text đều sử dụng `t()` function
2. **Keys**: Sử dụng camelCase cho key names
3. **Context**: Đặt tên key có ý nghĩa và dễ hiểu
4. **Testing**: Test với tất cả ngôn ngữ trước khi deploy

## Troubleshooting

### Lỗi TypeScript
- Kiểm tra key đã được thêm vào interface `Translations`
- Đảm bảo tất cả ngôn ngữ đều có bản dịch cho key đó

### Text không hiển thị
- Kiểm tra `LanguageProvider` đã wrap component
- Kiểm tra key có đúng không
- Kiểm tra bản dịch có tồn tại không

### Ngôn ngữ không lưu
- Kiểm tra localStorage có hoạt động không
- Kiểm tra `setLanguage` function
