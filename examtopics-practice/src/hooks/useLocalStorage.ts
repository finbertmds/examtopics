import { useEffect, useState } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'exam-progress';

export const useLocalStorage = (examId?: string) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      const examProgress = examId ? allProgress[examId] : null;
      
      if (examProgress) {
        // Convert date strings back to Date objects
        Object.values(examProgress.answers).forEach((answer: any) => {
          if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
        });
        return examProgress;
      }
    }
    
    return {
      examId: examId || '',
      answers: {},
      markedForTraining: [],
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

  const saveAnswer = (questionNumber: number, selectedAnswers: string[], isCorrect: boolean) => {
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      answers: {
        ...prev.answers,
        [questionNumber]: {
          questionNumber,
          selectedAnswers,
          isCorrect,
          answeredAt: new Date()
        }
      }
    }));
  };

  const toggleTrainingMark = (questionNumber: number) => {
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      markedForTraining: prev.markedForTraining.includes(questionNumber)
        ? prev.markedForTraining.filter(q => q !== questionNumber)
        : [...prev.markedForTraining, questionNumber]
    }));
  };

  const resetProgress = () => {
    const newProgress: UserProgress = {
      examId: examId || '',
      answers: {},
      markedForTraining: [],
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
