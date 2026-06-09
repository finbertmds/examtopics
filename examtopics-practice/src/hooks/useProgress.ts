import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { DailyTrackingData, UserAnswer, UserProgress } from '../types';
import { migrateProgressData } from '../utils/migration';

const createEmptyProgress = (examId: string): UserProgress => ({
  examId,
  answers: {},
  markedForTraining: [],
  currentTopic: 1,
  currentQuestion: 1,
  isRandomized: false,
});

export const useProgress = (examId?: string) => {
  const { isAuthenticated, token } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(() => createEmptyProgress(examId || ''));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      if (!examId) return;

      setIsLoading(true);
      try {
        const response = await dataService.loadUserProgress(examId, token || undefined);

        if (response.success && response.data) {
          let currentTopic = 1;
          const examProgress = response.data.progress?.[examId];
          if (examProgress?.answers) {
            const topicNumbers = Object.values(examProgress.answers).map((answer: any) => answer.topicNumber);
            if (topicNumbers.length > 0) {
              currentTopic = Math.max(...topicNumbers);
            }
          }

          const migratedProgress = migrateProgressData(response.data, examId, currentTopic);

          if (migratedProgress.answers) {
            Object.values(migratedProgress.answers).forEach((answer: UserAnswer) => {
              if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
            });
          }
          setProgress(migratedProgress);
        } else {
          setProgress(createEmptyProgress(examId));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [isAuthenticated, token, examId]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress((prev) => ({
      ...prev,
      ...updates,
      examId: examId || prev.examId,
    }));
  };

  const saveAnswer = async (topicNumber: number, questionNumber: number, selectedAnswers: string[], isCorrect: boolean) => {
    const key = `${topicNumber}-${questionNumber}`;

    setProgress((prev) => ({
      ...prev,
      examId: examId || prev.examId,
      answers: {
        ...prev.answers,
        [key]: {
          topicNumber,
          questionNumber,
          selectedAnswers,
          isCorrect,
          answeredAt: new Date(),
        },
      },
    }));

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
        if (!response.success) {
          toast.error(response.error || `Failed to save answer for question ${questionNumber} in topic ${topicNumber}`);
        }
      } catch (error) {
        console.error(`Error saving answer for question ${questionNumber} in topic ${topicNumber}:`, error);
      }
    }
  };

  const toggleTrainingMark = async (topicNumber: number, questionNumber: number) => {
    const key = `${topicNumber}-${questionNumber}`;
    const prevMarkedForTraining = progress.markedForTraining.includes(key);

    if (examId) {
      try {
        const response = await dataService.markForTraining(
          examId,
          topicNumber,
          questionNumber,
          !prevMarkedForTraining,
          token || undefined
        );

        if (response.success) {
          toast.success(response.message || 'Training mark updated');
        } else {
          toast.error(response.error || `Failed to toggle training mark for question ${questionNumber} in topic ${topicNumber}`);
        }

        setProgress((prev) => ({
          ...prev,
          examId: examId || prev.examId,
          markedForTraining: prev.markedForTraining.includes(key)
            ? prev.markedForTraining.filter((q) => q !== key)
            : [...prev.markedForTraining, key],
        }));
      } catch (error) {
        console.error('Error toggling training mark:', error);
        toast.error('Error toggling training mark');
      }
    }
  };

  const submitExam = async (
    score: { totalQuestions: number; correctAnswers: number; accuracy: number },
    totalQuestions: number,
    answeredCount: number
  ) => {
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
        if (response.success) {
          toast.success(response.message || 'Exam submitted');
        } else {
          toast.error(response.error || `Failed to submit exam ${examId}`);
        }
      } catch (error) {
        console.error(`Error submitting exam ${examId}:`, error);
        toast.error(`Error submitting exam ${examId}`);
      }
    }

    resetProgress();
  };

  const resetProgress = () => {
    setProgress(createEmptyProgress(examId || ''));

    if (examId) {
      dataService.resetProgress(examId, token || undefined).catch((error) => {
        console.error('Error resetting progress:', error);
      });
    }
  };

  const getHistory = async (historyExamId?: string) => {
    try {
      const response = await dataService.getHistory(historyExamId, token || undefined);

      if (response.success && response.data?.history) {
        return response.data.history;
      }
    } catch (error) {
      console.error('Error getting history:', error);
    }

    return [];
  };

  const getCompletedExamIds = async (): Promise<string[]> => {
    try {
      const response = await dataService.getCompletedExamIds(token || undefined);

      if (response.success && response.data?.examIds) {
        return response.data.examIds;
      }
    } catch (error) {
      console.error('Error getting completed exam IDs:', error);
    }

    return [];
  };

  const getExamStats = async (statsExamId: string) => {
    try {
      const response = await dataService.getStats(statsExamId, token || undefined);

      if (response.success && response.data?.stats) {
        return response.data.stats;
      }
    } catch (error) {
      console.error('Error getting exam stats:', error);
    }

    return null;
  };

  const getDailyTracking = async (trackingExamId?: string): Promise<DailyTrackingData['dailyProgress'] | []> => {
    try {
      const response = await dataService.getDailyTracking(trackingExamId || 'all', token || undefined);

      if (response.success && response.data) {
        return response.data.dailyProgress;
      }
    } catch (error) {
      console.error('Error getting daily tracking:', error);
    }

    return [];
  };

  const clearAllProgress = () => {
    setProgress(createEmptyProgress(examId || ''));
  };

  return {
    progress,
    isLoading,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    submitExam,
    resetProgress,
    getHistory,
    getCompletedExamIds,
    getExamStats,
    getDailyTracking,
    clearAllProgress,
  };
};
