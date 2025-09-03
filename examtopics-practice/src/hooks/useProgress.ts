import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProgress } from '../types';
import { getBackendUrl } from '../utils/backendUrl';
import { migrateProgressData } from '../utils/migration';

const STORAGE_KEY = 'exam-progress';
const backendUrl = getBackendUrl();

export const useProgress = (examId?: string) => {
  const { isAuthenticated, token } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      const examProgress = examId ? allProgress[examId] : null;
      
      if (examProgress) {
        // Migrate old format to new format if needed
        const migratedProgress = migrateProgressData(examProgress);
        
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

  const [isLoading, setIsLoading] = useState(false);

  // Load progress from backend if authenticated
  useEffect(() => {
    const loadProgress = async () => {
      if (isAuthenticated && token && examId) {
        setIsLoading(true);
        try {
          const response = await fetch(`${backendUrl}/progress/load/${examId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.progress) {
              // Migrate old format to new format if needed
              const migratedProgress = migrateProgressData(data.progress);
              
              // Convert date strings back to Date objects
              Object.values(migratedProgress.answers).forEach((answer: any) => {
                if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
              });
              setProgress(migratedProgress);
            }
          }
        } catch (error) {
          console.error('Error loading progress from backend:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProgress();
  }, [isAuthenticated, token, examId]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...updates,
      examId: examId || prev.examId
    }));
  };

  const saveAnswer = async (topicNumber: number, questionNumber: number, selectedAnswers: string[], isCorrect: boolean) => {
    const key = `${topicNumber}-${questionNumber}`;
    
    // Update local state immediately
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

    // Save to backend if authenticated, otherwise to localStorage
    if (isAuthenticated && token && examId) {
      try {
        await fetch(`${backendUrl}/progress/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            examId,
            topicNumber,
            questionNumber,
            selectedAnswers,
            isCorrect
          })
        });
        console.log('Answer saved to backend');
      } catch (error) {
        console.error('Error saving answer to backend:', error);
        // Fallback to localStorage
        saveAnswerToLocalStorage(topicNumber, questionNumber, selectedAnswers, isCorrect);
      }
    } else {
      // Save to localStorage if not authenticated
      saveAnswerToLocalStorage(topicNumber, questionNumber, selectedAnswers, isCorrect);
    }
  };

  const saveAnswerToLocalStorage = (topicNumber: number, questionNumber: number, selectedAnswers: string[], isCorrect: boolean) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    
    if (!allProgress[examId || '']) {
      allProgress[examId || ''] = {
        examId: examId || '',
        answers: {},
        markedForTraining: [],
        currentTopic: 1,
        currentQuestion: 1,
        isRandomized: false
      };
    }
    
    const key = `${topicNumber}-${questionNumber}`;
    allProgress[examId || ''].answers[key] = {
      topicNumber,
      questionNumber,
      selectedAnswers,
      isCorrect,
      answeredAt: new Date()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  };

  const toggleTrainingMark = async (topicNumber: number, questionNumber: number) => {
    const key = `${topicNumber}-${questionNumber}`;
    
    // Update local state immediately
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      markedForTraining: prev.markedForTraining.includes(key)
        ? prev.markedForTraining.filter(q => q !== key)
        : [...prev.markedForTraining, key]
    }));

    // Save to backend if authenticated, otherwise to localStorage
    if (isAuthenticated && token && examId) {
      try {
        await fetch(`${backendUrl}/progress/training-mark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            examId,
            topicNumber,
            questionNumber
          })
        });
        console.log('Training mark toggled in backend');
      } catch (error) {
        console.error('Error toggling training mark in backend:', error);
        // Fallback to localStorage
        saveTrainingMarkToLocalStorage(topicNumber, questionNumber);
      }
    } else {
      // Save to localStorage if not authenticated
      saveTrainingMarkToLocalStorage(topicNumber, questionNumber);
    }
  };

  const saveTrainingMarkToLocalStorage = (topicNumber: number, questionNumber: number) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    
    if (!allProgress[examId || '']) {
      allProgress[examId || ''] = {
        examId: examId || '',
        answers: {},
        markedForTraining: [],
        currentTopic: 1,
        currentQuestion: 1,
        isRandomized: false
      };
    }
    
    const key = `${topicNumber}-${questionNumber}`;
    const currentMarkedForTraining = allProgress[examId || ''].markedForTraining || [];
    
    if (currentMarkedForTraining.includes(key)) {
      allProgress[examId || ''].markedForTraining = currentMarkedForTraining.filter((q: string) => q !== key);
    } else {
      allProgress[examId || ''].markedForTraining = [...currentMarkedForTraining, key];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
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
    isLoading,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    resetProgress,
    getAllProgress,
    clearAllProgress
  };
};
