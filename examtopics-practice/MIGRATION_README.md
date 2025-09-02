# Migration Guide: Question Identification System

## Overview

This migration updates the question identification system from using only `questionNumber` to using a combination of `topicNumber` and `questionNumber` to create unique question identifiers.

## Problem

Previously, the system used only `questionNumber` to identify questions. However, this was insufficient because:
- Multiple topics can have the same question numbers
- Different topics can contain questions with identical question numbers
- This could lead to data conflicts and incorrect question tracking

## Solution

The new system uses a composite key format: `"topicNumber-questionNumber"` to uniquely identify each question.

## Changes Made

### Frontend (examtopics-practice)

#### 1. Types (`src/types/index.ts`)
- Updated `UserAnswer` interface to include `topicNumber`
- Changed `UserProgress.answers` from `Record<number, UserAnswer>` to `Record<string, UserAnswer>`
- Changed `UserProgress.markedForTraining` from `number[]` to `string[]`
- Added `currentTopic` field to `UserProgress`

#### 2. Hooks
- **`useLocalStorage.ts`**: Updated `saveAnswer` and `toggleTrainingMark` to accept `topicNumber` parameter
- **`useProgress.ts`**: Updated `saveAnswer` and `toggleTrainingMark` to accept `topicNumber` parameter

#### 3. Components
- **`ExamPage.tsx`**: Updated `handleAnswer` to pass `topicNumber` to `saveAnswer`
- **`QuestionItem.tsx`**: Updated interface and calls to include `topicNumber`
- **`QuestionList.tsx`**: Updated to use new key format for filtering and data access
- **`FilterBar.tsx`**: Updated to handle string-based `markedForTraining`
- **`ExamResult.tsx`**: Updated to handle string-based answer keys

#### 4. Migration Utilities (`src/utils/migration.ts`)
- Created migration functions to convert old format to new format
- Automatic migration in hooks when loading existing data

### Backend (examtopics-backend)

#### 1. Models (`models/Progress.js`)
- Updated `answers` schema to include `topicNumber`
- Changed `markedForTraining` from `[Number]` to `[String]`
- Updated `addAnswer` and `toggleTrainingMark` methods

#### 2. Services (`progress.js`)
- Updated `addAnswer` and `toggleTrainingMark` methods to accept `topicNumber`

#### 3. API Endpoints (`index.js`)
- Updated `/progress/answer` endpoint to require `topicNumber`
- Updated `/progress/training-mark` endpoint to require `topicNumber`

#### 4. Migration Script (`scripts/migrate-progress.js`)
- Created script to migrate existing database data

## Migration Process

### Automatic Migration (Frontend)
The frontend automatically migrates existing localStorage data when:
- Loading progress data in `useLocalStorage` hook
- Loading progress data in `useProgress` hook

### Manual Migration (Backend)
To migrate existing database data:

```bash
cd examtopics-backend
node scripts/migrate-progress.js
```

## Data Format Changes

### Before
```javascript
{
  answers: {
    1: { questionNumber: 1, selectedAnswers: ['A'], isCorrect: true },
    2: { questionNumber: 2, selectedAnswers: ['B'], isCorrect: false }
  },
  markedForTraining: [1, 3]
}
```

### After
```javascript
{
  answers: {
    "1-1": { topicNumber: 1, questionNumber: 1, selectedAnswers: ['A'], isCorrect: true },
    "1-2": { topicNumber: 1, questionNumber: 2, selectedAnswers: ['B'], isCorrect: false }
  },
  markedForTraining: ["1-1", "1-3"]
}
```

## Breaking Changes

1. **API Changes**: Backend endpoints now require `topicNumber` parameter
2. **Data Structure**: Answer keys and training marks are now strings instead of numbers
3. **Function Signatures**: `saveAnswer` and `toggleTrainingMark` now require `topicNumber` parameter

## Backward Compatibility

- Frontend automatically migrates existing localStorage data
- Backend migration script handles existing database data
- Old data format is automatically converted to new format

## Testing

After migration, verify:
1. Existing progress data is preserved and accessible
2. New answers are saved with correct topic-question identifiers
3. Training marks work correctly with new format
4. Filtering and statistics display correctly

## Rollback Plan

If issues arise, the system can be rolled back by:
1. Reverting code changes
2. Running a reverse migration script (to be created if needed)
3. Restoring from database backup

## Notes

- Default `topicNumber` of 1 is used for migrated data where topic information is not available
- Future improvements should include proper topic detection from question data
- Consider adding validation to ensure topic numbers match actual question data
