# Hỗ trợ Đa ngôn ngữ cho Exams.json

## Tổng quan

File `exams.json` đã được cập nhật để hỗ trợ đa ngôn ngữ cho các trường `name` và `description`. Điều này cho phép hiển thị tên và mô tả đề thi theo ngôn ngữ được chọn.

## Cấu trúc mới

### Trước khi cập nhật
```json
{
  "id": "aws-sap-c02",
  "name": "AWS Certified Solutions Architect - Professional SAP-C02",
  "description": "Bộ đề thi chứng chỉ AWS Solutions Architect Professional",
  // ... other fields
}
```

### Sau khi cập nhật
```json
{
  "id": "aws-sap-c02",
  "name": {
    "en": "AWS Certified Solutions Architect - Professional",
    "vi": "AWS Certified Solutions Architect - Professional",
    "ja": "AWS Certified Solutions Architect - Professional"
  },
  "description": {
    "en": "Validate advanced AWS architecture and solution design skills",
    "vi": "Chứng thực kỹ năng thiết kế kiến trúc và giải pháp AWS tiên tiến",
    "ja": "高度なAWSアーキテクチャとソリューション設計スキルを検証"
  },
  // ... other fields
}
```

## Cập nhật Type Definitions

Interface `Exam` trong `src/types/index.ts` đã được cập nhật:

```typescript
export interface Exam {
  id: string;
  name: string | {
    en: string;
    vi: string;
    ja: string;
  };
  description: string | {
    en: string;
    vi: string;
    ja: string;
  };
  // ... other fields
}
```

## Utility Functions

Đã tạo utility functions trong `src/utils/examUtils.ts`:

```typescript
import { Language } from '../locales';

export const getLocalizedText = (
  text: string | { en: string; vi: string; ja: string },
  language: Language
): string => {
  if (typeof text === 'string') {
    return text;
  }
  
  return text[language] || text.en || '';
};

export const getExamName = (exam: { name: string | { en: string; vi: string; ja: string } }, language: Language): string => {
  return getLocalizedText(exam.name, language);
};

export const getExamDescription = (exam: { description: string | { en: string; vi: string; ja: string } }, language: Language): string => {
  return getLocalizedText(exam.description, language);
};
```

## Cách sử dụng trong Components

### 1. Import utility functions
```tsx
import { getExamName, getExamDescription } from '../utils/examUtils';
```

### 2. Lấy language từ context
```tsx
const { language } = useLanguage();
```

### 3. Sử dụng trong JSX
```tsx
<h3>{getExamName(exam, language)}</h3>
<p>{getExamDescription(exam, language)}</p>
<div>{exam?.questionCount} {t('questions')} • {exam?.estimatedTime} {t('minutes')}</div>
```

## Components đã được cập nhật

### Home.tsx
- ✅ Cập nhật logic search để sử dụng localized text
- ✅ Hiển thị exam name và description theo ngôn ngữ
- ✅ Import utility functions

### ExamPage.tsx
- ✅ Hiển thị exam name và description theo ngôn ngữ
- ✅ Import utility functions

## Backward Compatibility

Hệ thống vẫn hỗ trợ cấu trúc cũ (string) để đảm bảo backward compatibility:

```typescript
// Vẫn hoạt động với cấu trúc cũ
{
  "name": "Old format name",
  "description": "Old format description"
}

// Và cấu trúc mới
{
  "name": {
    "en": "English name",
    "vi": "Vietnamese name",
    "ja": "Japanese name"
  }
}
```

## Cách thêm exam mới

### 1. Thêm exam với cấu trúc mới
```json
{
  "id": "new-exam-id",
  "name": {
    "en": "English Exam Name",
    "vi": "Tên đề thi tiếng Việt",
    "ja": "日本語の試験名"
  },
  "description": {
    "en": "English description",
    "vi": "Mô tả tiếng Việt",
    "ja": "日本語の説明"
  },
  "questionCount": 100,
  "file": "exams/new_exam.json",
  "category": "AWS",
  "difficulty": "Intermediate",
  "estimatedTime": "120",
  "tags": ["AWS", "Cloud", "New"]
}
```

### 2. Đảm bảo tất cả ngôn ngữ đều có bản dịch
- **en**: Bản dịch tiếng Anh
- **vi**: Bản dịch tiếng Việt
- **ja**: Bản dịch tiếng Nhật

### 3. Fallback logic
- Nếu ngôn ngữ hiện tại không có bản dịch → sử dụng tiếng Anh
- Nếu tiếng Anh cũng không có → sử dụng string rỗng

## Lưu ý quan trọng

### 1. Tên chứng chỉ
- Tên chứng chỉ AWS được chuẩn hóa theo trang chính thức của AWS
- Loại bỏ mã exam (như SAP-C02, ANS-C00) khỏi tên hiển thị
- Mô tả được dịch sang các ngôn ngữ khác với nội dung chính thức

### 2. Consistency
- Đảm bảo tất cả exam đều có cấu trúc giống nhau
- Kiểm tra spelling và grammar cho mỗi ngôn ngữ

### 3. Performance
- Utility functions được tối ưu để xử lý nhanh
- Không ảnh hưởng đến performance của ứng dụng

## Testing

### 1. Test với tất cả ngôn ngữ
- Chuyển đổi giữa 3 ngôn ngữ
- Kiểm tra hiển thị đúng text
- Kiểm tra search functionality

### 2. Test backward compatibility
- Đảm bảo exam cũ vẫn hoạt động
- Kiểm tra fallback logic

### 3. Test edge cases
- Exam không có bản dịch cho ngôn ngữ nào
- Exam có cấu trúc hỗn hợp (cũ + mới)

## Kết quả

✅ **Tất cả 22 exams** đã được cập nhật với cấu trúc đa ngôn ngữ
✅ **Tên chứng chỉ** đã được chuẩn hóa theo trang chính thức AWS
✅ **Mô tả chính thức** từ trang AWS Certification cho 3 ngôn ngữ
✅ **Type definitions** đã được cập nhật
✅ **Utility functions** đã được tạo
✅ **Components** đã được cập nhật
✅ **Backward compatibility** được đảm bảo
✅ **Search functionality** hoạt động với localized text

Ứng dụng giờ đây hiển thị tên và mô tả đề thi chính thức theo đúng ngôn ngữ được chọn! 🌍
