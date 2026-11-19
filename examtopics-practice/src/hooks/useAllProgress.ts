import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { ProgressData } from '../types';

export const useAllProgress = () => {
  const { isAuthenticated, token } = useAuth();
  const [allProgress, setAllProgress] = useState<Record<string, ProgressData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const request = useRef<{
    token: string;
    attempt: number;
    promise: ReturnType<typeof dataService.loadAllProgress>;
  } | null>(null);
  const [settledRequest, setSettledRequest] = useState<{ token: string; attempt: number } | null>(null);
  const isLoaded = !isAuthenticated || !token ||
    (settledRequest?.token === token && settledRequest.attempt === loadAttempt);

  // Load all progress from API
  useEffect(() => {
    let cancelled = false;
    setAllProgress({});
    setError(null);
    if (!isAuthenticated || !token) {
      request.current = null;
      setIsLoading(false);
      return;
    }

    const loadAllProgress = async () => {
      setIsLoading(true);
      try {
        if (request.current?.token !== token || request.current.attempt !== loadAttempt) {
          request.current = { token, attempt: loadAttempt, promise: dataService.loadAllProgress(token) };
        }
        const response = await request.current.promise;
        if (cancelled) return;
        if (!response.success || !response.data?.progress) {
          throw new Error(response.error || 'Failed to load progress');
        }
        
        if (response.success && response.data?.progress) {
          const progress = response.data.progress;
          
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
        if (!cancelled) setError(error instanceof Error ? error.message : 'Failed to load progress');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setSettledRequest({ token, attempt: loadAttempt });
        }
      }
    };

    loadAllProgress();
    return () => { cancelled = true; };
  }, [isAuthenticated, token, loadAttempt]);

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
    isLoaded,
    error,
    reload: () => setLoadAttempt(attempt => attempt + 1),
    getExamProgress,
    getProgressStats
  };
};
