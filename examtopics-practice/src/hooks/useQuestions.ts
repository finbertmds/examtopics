import { useEffect, useState } from 'react';
import { Question } from '../types';
import { apiClient } from '../utils/apiClient';

export const useQuestions = (examId: string | undefined, examFile: string | undefined) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!examId || !examFile) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.getQuestions(examFile);
        setQuestions(data);
      } catch (error) {
        console.error('Error loading questions:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [examId, examFile]);

  const refreshQuestions = async () => {
    if (!examId || !examFile) {
      return;
    }

    if (!navigator.onLine) {
      setError('Cannot refresh while offline');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getQuestions(examFile);
      setQuestions(data);
    } catch (error) {
      console.error('Error refreshing questions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    loading,
    error,
    refreshQuestions,
    setQuestions
  };
};
