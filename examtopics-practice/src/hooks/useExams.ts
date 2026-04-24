import { useState } from 'react';
import { examApi } from '../services/examApi';
import { Exam } from '../types';

export const useExams = (options?: { fetchMyExamsOnly?: boolean, token?: string | null }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExams = async () => {
    try {
      setError(null);
      const data = (options?.fetchMyExamsOnly && options?.token) 
        ? await examApi.getMyExams(options.token) 
        : await examApi.getExams();
      setExams(data);
      return data;
    } catch (error) {
      console.error('Error loading exams:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
    return [];
  };

  const findExamById = async (examId: string): Promise<Exam | undefined> => {
    if (exams.length === 0) {
      const data = await loadExams();
      if (data.length > 0) {
        return data.find(exam => exam.code === examId);
      }
    } else {
      return exams.find(exam => exam.code === examId);
    }
    return undefined;
  };

  const refreshExams = async () => {
    if (!navigator.onLine) {
      setError('Cannot refresh while offline');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = (options?.fetchMyExamsOnly && options?.token) 
        ? await examApi.getMyExams(options.token) 
        : await examApi.getExams();
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
    loadExams,
    findExamById,
    refreshExams
  };
};
