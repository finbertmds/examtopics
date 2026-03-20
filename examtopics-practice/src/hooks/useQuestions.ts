import { useState } from 'react';
import { examApi } from '../services/examApi';
import { Question } from '../types';

export const useQuestions = (examId: string | undefined, examFile: string | undefined) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    if (!examId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await examApi.getQuestions(examId);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshQuestions = async () => {
    if (!examId) {
      return;
    }

    if (!navigator.onLine) {
      setError('Cannot refresh while offline');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await examApi.getQuestions(examId);
      setQuestions(response.data);
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
    loadQuestions,
    refreshQuestions,
    setQuestions
  };
};
