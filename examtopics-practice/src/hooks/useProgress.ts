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
              // Set last saved progress to avoid unnecessary saves
              setLastSavedProgress(JSON.stringify(migratedProgress));
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

  const [lastSavedProgress, setLastSavedProgress] = useState<string>('');

  // Save progress to backend if authenticated, otherwise to localStorage
  const saveProgress = async (newProgress: UserProgress) => {
    // Convert progress to string for comparison
    const progressString = JSON.stringify(newProgress);
    
    // Only save if progress has actually changed
    if (progressString === lastSavedProgress) {
      return;
    }

    if (isAuthenticated && token && examId) {
      try {
        await fetch(`${backendUrl}/progress/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            examId,
            progress: newProgress
          })
        });
        
        // Update last saved progress
        setLastSavedProgress(progressString);
        console.log('Progress saved to backend');
      } catch (error) {
        console.error('Error saving progress to backend:', error);
        // Fallback to localStorage
        saveToLocalStorage(newProgress);
      }
    } else {
      // Save to localStorage if not authenticated
      saveToLocalStorage(newProgress);
      setLastSavedProgress(progressString);
    }
  };

  const saveToLocalStorage = (newProgress: UserProgress) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    
    allProgress[examId || ''] = newProgress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  };

  // Save progress only when there are actual changes
  useEffect(() => {
    if (!examId) return;
    
    // Debounce save to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (isAuthenticated && token) {
        saveProgress(progress);
      } else {
        saveToLocalStorage(progress);
      }
    }, 1000); // Wait 1 second before saving

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, examId, isAuthenticated, token]);

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
    isLoading,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    resetProgress,
    getAllProgress,
    clearAllProgress
  };
};
