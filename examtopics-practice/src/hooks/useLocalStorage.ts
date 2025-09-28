import { useEffect, useState } from 'react';
import { UserProgress } from '../types';
import { migrateProgressData } from '../utils/migration';

const STORAGE_KEY = 'exam-progress';

export const useLocalStorage = (examId?: string) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      const examProgress = examId ? allProgress[examId] : null;
      
      if (examProgress) {
        // Migrate old format to new format if needed
        const migratedProgress = migrateProgressData(examProgress, examId || '', 1);
        
        // Convert date strings back to Date objects
        Object.values(migratedProgress.answers).forEach((answer: any) => {
          if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
        });
        return migratedProgress;
      }
    }
    
    return {
      examId: examId || '',
      answers: {},
      markedForTraining: [],
      currentTopic: 1,
      currentQuestion: 1,
      isRandomized: false
    };
  });

  // Save progress to localStorage
  useEffect(() => {
    if (!examId) return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    
    allProgress[examId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  }, [progress, examId]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...updates,
      examId: examId || prev.examId
    }));
  };

  const saveAnswer = (topicNumber: number, questionNumber: number, selectedAnswers: string[], isCorrect: boolean) => {
    const key = `${topicNumber}-${questionNumber}`;
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      answers: {
        ...prev.answers,
        [key]: {
          topicNumber,
          questionNumber,
          selectedAnswers,
          isCorrect,
          answeredAt: new Date()
        }
      }
    }));
  };

  const toggleTrainingMark = (topicNumber: number, questionNumber: number) => {
    const key = `${topicNumber}-${questionNumber}`;
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      markedForTraining: prev.markedForTraining.includes(key)
        ? prev.markedForTraining.filter(q => q !== key)
        : [...prev.markedForTraining, key]
    }));
  };

  const resetProgress = () => {
    const newProgress: UserProgress = {
      examId: examId || '',
      answers: {},
      markedForTraining: [],
      currentTopic: 1,
      currentQuestion: 1,
      isRandomized: false
    };
    setProgress(newProgress);
  };

  const getAllProgress = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const clearAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      examId: examId || '',
      answers: {},
      markedForTraining: [],
      currentTopic: 1,
      currentQuestion: 1,
      isRandomized: false
    });
  };

  return {
    progress,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    resetProgress,
    getAllProgress,
    clearAllProgress
  };
};
