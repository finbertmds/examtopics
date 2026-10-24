// examApi.ts
// Handles API calls to the new Express/MongoDB backend

import { Exam, Question } from '../types';
import { getBackendUrl } from '../utils/backendUrl';

const backendUrl = getBackendUrl();

const getBaseUrl = () => {
    return backendUrl + '/api'
};

const getAuthHeaders = (token?: string | null): HeadersInit => token
  ? { 'Authorization': `Bearer ${token}` }
  : {};

const getApiError = async (response: Response, fallback: string): Promise<Error> => {
  const data = await response.json().catch(() => ({}));
  return new Error(data.error || data.message || fallback);
};

export const examApi = {
  getExams: async (token?: string | null): Promise<Exam[]> => {
    const response = await fetch(`${getBaseUrl()}/exams`, {
      headers: getAuthHeaders(token),
    });
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

  getMetadata: async (token?: string | null): Promise<{ categories: string[], tags: string[] }> => {
    const response = await fetch(`${getBaseUrl()}/exams/metadata/info`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch metadata');
    const data = await response.json();
    return { categories: data.categories || [], tags: data.tags || [] };
  },

  getExam: async (code: string, token?: string | null): Promise<Exam> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw await getApiError(response, 'Failed to fetch exam');
    const data = await response.json();
    return { ...data.exam, code: data.exam.code || data.exam._id };
  },

  getQuestions: async (examCode: string, page = 1, limit = 0, token?: string | null): Promise<{ data: Question[], pagination: any }> => {
    const response = await fetch(`${getBaseUrl()}/questions/${examCode}?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw await getApiError(response, 'Failed to fetch questions');
    const data = await response.json();
    return {
      ...data,
      data: data.data.map((q: any) => ({
          ...q,
          topic_number: q.topic_number || 1
      }))
    };
  },

  downloadExam: async (examCode: string, token: string): Promise<Blob> => {
    const response = await fetch(`${getBaseUrl()}/exams/${examCode}/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || data.message || 'Failed to download exam');
    }
    return response.blob();
  },

  transferExamOwnership: async (examCode: string, email: string, token: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/exams/${encodeURIComponent(examCode)}/owner`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || data.message || 'Failed to transfer exam ownership');
    }
  },

  getQuestion: async (examCode: string, topicNumber: number, questionNumber: number, token?: string | null): Promise<Question> => {
    const response = await fetch(`${getBaseUrl()}/questions/${examCode}/${questionNumber}?topicNumber=${topicNumber}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw await getApiError(response, 'Failed to fetch question');
    const data = await response.json();
    return { ...data.question, topic_number: data.question.topic_number || 1 };
  },

  updateQuestion: async (examCode: string, topicNumber: number, questionNumber: number, updateData: any, token: string): Promise<Question> => {
    const response = await fetch(`${getBaseUrl()}/exams/${examCode}/questions/${questionNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...updateData, topic_number: topicNumber })
    });
    if (!response.ok) throw new Error('Failed to update question');
    const data = await response.json();
    return data.question;
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
