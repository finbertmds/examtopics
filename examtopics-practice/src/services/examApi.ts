// examApi.ts
// Handles API calls to the new Express/MongoDB backend

import { Exam, Question } from '../types';
import { getBackendUrl } from '../utils/backendUrl';

const backendUrl = getBackendUrl();

const getBaseUrl = () => {
    return backendUrl + '/api'
};

export const examApi = {
  getExams: async (): Promise<Exam[]> => {
    const response = await fetch(`${getBaseUrl()}/exams`);
    if (!response.ok) throw new Error('Failed to fetch exams');
    const data = await response.json();
    return (data.exams || []).map((exam: any) => ({
      ...exam,
    }));
  },

  getMyExams: async (token: string): Promise<Exam[]> => {
    const response = await fetch(`${getBaseUrl()}/exams/me/created`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch my exams');
    const data = await response.json();
    return (data.exams || []).map((exam: any) => ({
      ...exam,
    }));
  },

  getMetadata: async (): Promise<{ categories: string[], tags: string[] }> => {
    const response = await fetch(`${getBaseUrl()}/exams/metadata/info`);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    const data = await response.json();
    return { categories: data.categories || [], tags: data.tags || [] };
  },

  getExam: async (code: string): Promise<Exam> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`);
    if (!response.ok) throw new Error('Failed to fetch exam');
    const data = await response.json();
    return { ...data.exam, code: data.exam.code || data.exam._id };
  },

  getQuestions: async (examCode: string, page = 1, limit = 0): Promise<{ data: Question[], pagination: any }> => {
    const response = await fetch(`${getBaseUrl()}/questions/${examCode}?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    const data = await response.json();
    return {
      ...data,
      data: data.data.map((q: any) => ({
          ...q,
          topic_number: q.topic_number || 1
      }))
    };
  },

  createExam: async (examData: any, token: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(examData)
    });
    if (!response.ok) throw new Error('Failed to create exam');
    const data = await response.json();
    return data;
  },

  updateExam: async (code: string, examData: any, token: string): Promise<Exam> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(examData)
    });
    if (!response.ok) throw new Error('Failed to update exam');
    const data = await response.json();
    return data.exam;
  },

  deleteExam: async (code: string, token: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete exam');
  }
};
