import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { ProgressData } from '../types';

export const useAllProgress = () => {
  const { isAuthenticated, token } = useAuth();
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load all progress using dataService (offline-first)
  useEffect(() => {
    const loadAllProgress = async () => {
      setIsLoading(true);
      try {
        const response = await dataService.loadAllProgress(token || undefined);
        
        if (response.success && response.data?.progress) {
          let progress = response.data.progress;
          
          // Convert date strings back to Date objects
          Object.values(progress).forEach((examProgress: any) => {
            if (examProgress.answers) {
              Object.values(examProgress.answers).forEach((answer: any) => {
                if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
              });
            }
          });
          setAllProgress(progress);
        }
      } catch (error) {
        console.error('Error loading all progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProgress();
  }, [isAuthenticated, token]);

  const getExamProgress = (examId: string): ProgressData | null => {
    return allProgress[examId] || null;
  };

  const getProgressStats = (examId: string) => {
    const progress = allProgress[examId];
    if (!progress) return null;

    const totalAnswers = Object.keys(progress.answers).length;
    const correctAnswers = Object.values(progress.answers).filter((answer: any) => answer.isCorrect).length;
    const markedForTraining = progress.markedForTraining.length;

    return {
      totalAnswers,
      correctAnswers,
      accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      markedForTraining,
      lastUpdated: progress.lastUpdated
    };
  };

  return {
    allProgress,
    isLoading,
    getExamProgress,
    getProgressStats
  };
};
