import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { UserAnswer, UserProgress } from '../types';
import { migrateProgressData } from '../utils/migration';

const STORAGE_KEY = 'exam-progress';

export const useProgress = (examId?: string) => {
  const { isAuthenticated, token } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      const examProgress = examId ? allProgress[examId] : null;
      let currentTopic = 1;
      
      if (examProgress) {
        // Find the maximum topicNumber from all answers
        const topicNumbers = Object.values(examProgress.answers || {}).map((answer: any) => answer.topicNumber);
        if (topicNumbers.length > 0) {
          currentTopic = Math.max(...topicNumbers);
        }
        // Migrate old format to new format if needed
        const migratedProgress = migrateProgressData(examProgress, examId || '', currentTopic);
        
        // Convert date strings back to Date objects
        Object.values(migratedProgress.answers).forEach((answer: UserAnswer) => {
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

  // Load progress using dataService (offline-first)
  useEffect(() => {
    const loadProgress = async () => {
      if (examId) {
        setIsLoading(true);
        try {
          const response = await dataService.loadUserProgress(examId, token || undefined);

          if (response.success && response.data) {
            // Find the maximum topicNumber from all answers
            let currentTopic = 1;
            const examProgress = response.data.progress?.[examId];
            if (examProgress?.answers) {
              const topicNumbers = Object.values(examProgress.answers).map((answer: any) => answer.topicNumber);
              if (topicNumbers.length > 0) {
                currentTopic = Math.max(...topicNumbers);
              }
            }
            
            // Migrate old format to new format if needed
            const migratedProgress = migrateProgressData(response.data, examId || '', currentTopic);
              
            // Convert date strings back to Date objects
            if (migratedProgress.answers) {
              Object.values(migratedProgress.answers).forEach((answer: UserAnswer) => {
                if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
              });
            }
            setProgress(migratedProgress);
          }
        } catch (error) {
          console.error('Error loading progress:', error);
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

    // Use dataService for offline-first saving
    if (examId) {
      try {
        const response = await dataService.saveAnswer(
          examId,
          topicNumber,
          questionNumber,
          selectedAnswers,
          isCorrect,
          token || undefined
        );
        console.log('Answer saved:', response.message);
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }
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

    // Use dataService for offline-first saving
    if (examId) {
      try {
        const response = await dataService.markForTraining(
          examId,
          topicNumber,
          questionNumber,
          token || undefined
        );
        console.log('Training mark toggled:', response.message);
      } catch (error) {
        console.error('Error toggling training mark:', error);
      }
    }
  };


  const submitExam = async (score: { totalQuestions: number; correctAnswers: number; accuracy: number }, totalQuestions: number, answeredCount: number) => {
    if (examId) {
      try {
        const response = await dataService.submitProgress(
          examId,
          progress,
          score,
          totalQuestions,
          answeredCount,
          token || undefined
        );
        console.log('Exam submitted:', response.message);
      } catch (error) {
        console.error('Error submitting exam:', error);
      }
    }

    // Reset progress after submission
    resetProgress();
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

    // Use dataService for offline-first reset
    if (examId) {
      dataService.resetProgress(examId, token || undefined).catch(error => {
        console.error('Error resetting progress:', error);
      });
    }
  };

  const getAllProgress = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const getHistory = async (examId?: string) => {
    try {
      const response = await dataService.getHistory(examId, token || undefined);
      
      if (response.success && response.data?.history) {
        return response.data.history;
      }
    } catch (error) {
      console.error('Error getting history:', error);
    }
    
    return [];
  };

  const getExamStats = async (examId: string) => {
    try {
      const response = await dataService.getStats(examId, token || undefined);
      
      if (response.success && response.data?.stats) {
        return response.data.stats;
      }
    } catch (error) {
      console.error('Error getting exam stats:', error);
    }
    
    return null;
  };

  const clearAllProgress = () => {
    dataService.clearCache();
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
    submitExam,
    resetProgress,
    getAllProgress,
    getHistory,
    getExamStats,
    clearAllProgress
  };
};
