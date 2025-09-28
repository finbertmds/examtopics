import { useEffect, useState } from 'react';
import { Exam } from '../types';
import { apiClient } from '../utils/apiClient';

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setError(null);
        const data = await apiClient.getExams();
        setExams(data);
      } catch (error) {
        console.error('Error loading exams:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  const findExamById = (examId: string): Exam | undefined => {
    return exams.find(exam => exam.id === examId);
  };

  const refreshExams = async () => {
    if (!navigator.onLine) {
      setError('Cannot refresh while offline');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getExams();
      setExams(data);
    } catch (error) {
      console.error('Error refreshing exams:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    exams,
    loading,
    error,
    findExamById,
    refreshExams
  };
};
