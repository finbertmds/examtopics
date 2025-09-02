import { UserProgress } from '../types';

// Migration utility to convert old progress format to new format
export const migrateProgressData = (oldProgress: any): UserProgress => {
  if (!oldProgress) return oldProgress;

  const newProgress: UserProgress = {
    examId: oldProgress.examId || '',
    answers: {},
    markedForTraining: [],
    currentTopic: oldProgress.currentTopic || 1,
    currentQuestion: oldProgress.currentQuestion || 1,
    isRandomized: oldProgress.isRandomized || false
  };

  // Migrate answers from old format (number keys) to new format (string keys)
  if (oldProgress.answers) {
    Object.entries(oldProgress.answers).forEach(([key, answer]: [string, any]) => {
      if (answer && typeof answer === 'object') {
        // If answer already has topicNumber, use it
        if (answer.topicNumber !== undefined) {
          const newKey = `${answer.topicNumber}-${answer.questionNumber}`;
          newProgress.answers[newKey] = {
            topicNumber: answer.topicNumber,
            questionNumber: answer.questionNumber,
            selectedAnswers: answer.selectedAnswers || [],
            isCorrect: answer.isCorrect || false,
            answeredAt: answer.answeredAt ? new Date(answer.answeredAt) : new Date()
          };
        } else {
          // Old format - we need to infer topicNumber from question data
          // For now, we'll use a default topicNumber of 1
          // This should be updated when we have access to the actual question data
          const questionNumber = parseInt(key);
          const newKey = `1-${questionNumber}`;
          newProgress.answers[newKey] = {
            topicNumber: 1, // Default topic number
            questionNumber: questionNumber,
            selectedAnswers: answer.selectedAnswers || [],
            isCorrect: answer.isCorrect || false,
            answeredAt: answer.answeredAt ? new Date(answer.answeredAt) : new Date()
          };
        }
      }
    });
  }

  // Migrate markedForTraining from number[] to string[]
  if (oldProgress.markedForTraining && Array.isArray(oldProgress.markedForTraining)) {
    newProgress.markedForTraining = oldProgress.markedForTraining.map((item: any) => {
      if (typeof item === 'string') {
        return item; // Already in new format
      } else if (typeof item === 'number') {
        return `1-${item}`; // Convert to new format with default topic number
      }
      return item;
    });
  }

  return newProgress;
};

// Migration utility for localStorage data
export const migrateLocalStorageData = () => {
  const STORAGE_KEY = 'exam-progress';
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      const allProgress = JSON.parse(stored);
      const migratedProgress: Record<string, UserProgress> = {};

      Object.entries(allProgress).forEach(([examId, progress]: [string, any]) => {
        migratedProgress[examId] = migrateProgressData(progress);
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedProgress));
      console.log('Progress data migrated successfully');
    } catch (error) {
      console.error('Error migrating progress data:', error);
    }
  }
};
