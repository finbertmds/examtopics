import { AllProgressData, ProgressData, UserProgress } from '../types';

export const resolveCurrentTopic = (progress?: Partial<ProgressData> | null): number => {
  const savedCurrentTopic = progress?.currentTopic;
  if (typeof savedCurrentTopic === 'number' && Number.isInteger(savedCurrentTopic) && savedCurrentTopic > 0) {
    return savedCurrentTopic;
  }

  const topicNumbers = Object.values(progress?.answers || {})
    .map((answer: any) => answer?.topicNumber)
    .filter((topicNumber: any): topicNumber is number =>
      typeof topicNumber === 'number' && Number.isInteger(topicNumber) && topicNumber > 0
    );

  return topicNumbers.length > 0 ? Math.max(...topicNumbers) : 1;
};

export const migrateProgressData = (oldProgress: AllProgressData, examId: string, currentTopic: number): UserProgress => {
  if (!oldProgress) return oldProgress;

  const progress = oldProgress.progress[examId];

  const newProgress: UserProgress = {
    examId: progress.examId || '',
    answers: {},
    markedForTraining: [],
    currentTopic: currentTopic,
    currentQuestion: progress.currentQuestion || 1,
    isRandomized: progress.isRandomized || false,
  };

  if (progress.answers) {
    Object.entries(progress.answers).forEach(([key, answer]: [string, any]) => {
      if (answer && typeof answer === 'object') {
        if (answer.topicNumber !== undefined) {
          const newKey = `${answer.topicNumber}-${answer.questionNumber}`;
          newProgress.answers[newKey] = {
            topicNumber: answer.topicNumber,
            questionNumber: answer.questionNumber,
            selectedAnswers: answer.selectedAnswers || [],
            isCorrect: answer.isCorrect || false,
            answeredAt: answer.answeredAt ? new Date(answer.answeredAt) : new Date(),
          };
        } else {
          const questionNumber = parseInt(key);
          const newKey = `1-${questionNumber}`;
          newProgress.answers[newKey] = {
            topicNumber: 1,
            questionNumber: questionNumber,
            selectedAnswers: answer.selectedAnswers || [],
            isCorrect: answer.isCorrect || false,
            answeredAt: answer.answeredAt ? new Date(answer.answeredAt) : new Date(),
          };
        }
      }
    });
  }

  if (progress.markedForTraining && Array.isArray(progress.markedForTraining)) {
    newProgress.markedForTraining = progress.markedForTraining.map((item: any) => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'number') {
        return `1-${item}`;
      }
      return item;
    });
  }

  return newProgress;
};
