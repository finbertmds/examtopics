import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://examtopics-backend-latest.onrender.com';

interface ExamProgress {
  examId: string;
  answers: Record<string, any>;
  markedForTraining: number[];
  currentQuestion: number;
  isRandomized: boolean;
  lastUpdated: string;
}

export const useAllProgress = () => {
  const { isAuthenticated, token } = useAuth();
  const [allProgress, setAllProgress] = useState<Record<string, ExamProgress>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load all progress from backend if authenticated
  useEffect(() => {
    const loadAllProgress = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        try {
          const response = await fetch(`${backendUrl}/progress/all`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.progress) {
              // Convert date strings back to Date objects
              Object.values(data.progress).forEach((examProgress: any) => {
                if (examProgress.answers) {
                  Object.values(examProgress.answers).forEach((answer: any) => {
                    if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
                  });
                }
              });
              setAllProgress(data.progress);
            }
          }
        } catch (error) {
          console.error('Error loading all progress from backend:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        } finally {
          setIsLoading(false);
        }
      } else {
        // Load from localStorage if not authenticated
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem('exam-progress');
      if (stored) {
        const localProgress = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.values(localProgress).forEach((examProgress: any) => {
          if (examProgress.answers) {
            Object.values(examProgress.answers).forEach((answer: any) => {
              if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
            });
          }
        });
        setAllProgress(localProgress);
      }
    };

    loadAllProgress();
  }, [isAuthenticated, token]);

  const getExamProgress = (examId: string): ExamProgress | null => {
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
