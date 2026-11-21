// examApi.ts
// Handles API calls to the new Express/MongoDB backend

import { Exam, Question } from '../types';
import { apiRequest } from '../utils/apiClient';

// Every exam call goes through the shared transport in apiClient (ARCH-002).
const request = (path: string, token?: string | null, init: RequestInit = {}) =>
  apiRequest(`/api${path}`, { ...init, token });

const jsonRequest = (path: string, method: string, body: unknown, token: string) =>
  request(path, token, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const getApiError = async (response: Response, fallback: string): Promise<Error> => {
  const data = await response.json().catch(() => ({}));
  return new Error(data.error || data.message || fallback);
};

// Mutations fail on a non-2xx status or an explicit success:false body (ARCH-003).
const readMutationResult = async (response: Response, fallback: string): Promise<any> => {
  if (!response.ok) throw await getApiError(response, fallback);
  const data = await response.json().catch(() => null);
  if (!data || data.success === false) throw new Error(data?.error || data?.message || fallback);
  return data;
};

const QUESTIONS_PER_PAGE = 100;
const MAX_QUESTION_PAGE = 1000;

async function getQuestionPage(examCode: string, page: number, token?: string | null, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: String(page), limit: String(QUESTIONS_PER_PAGE) });
  const response = await request(`/questions/${encodeURIComponent(examCode)}?${params}`, token, { signal });
  if (!response.ok) throw await getApiError(response, 'Failed to fetch questions');
  const result: { data: Question[]; pagination: { page: number; totalPages: number; revision: string } } =
    await response.json();
  const { pagination } = result;
  if (pagination?.page !== page || !Number.isInteger(pagination.totalPages) ||
      pagination.totalPages < 0 || pagination.totalPages > MAX_QUESTION_PAGE ||
      typeof pagination.revision !== 'string' || !Array.isArray(result.data) ||
      result.data.length > QUESTIONS_PER_PAGE) {
    throw new Error('Invalid question pagination');
  }
  return result;
}

export const examApi = {
  getExams: async (token?: string | null): Promise<Exam[]> => {
    const response = await request('/exams', token);
    if (!response.ok) throw new Error('Failed to fetch exams');
    const data = await response.json();
    return (data.exams || []).map((exam: any) => ({
      ...exam,
    }));
  },

  getMyExams: async (token: string): Promise<Exam[]> => {
    const response = await request('/exams/me/created', token);
    if (!response.ok) throw new Error('Failed to fetch my exams');
    const data = await response.json();
    return (data.exams || []).map((exam: any) => ({
      ...exam,
    }));
  },

  getMetadata: async (token?: string | null): Promise<{ categories: string[], tags: string[] }> => {
    const response = await request('/exams/metadata/info', token);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    const data = await response.json();
    return { categories: data.categories || [], tags: data.tags || [] };
  },

  getExam: async (code: string, token?: string | null): Promise<Exam> => {
    const response = await request(`/exams/${code}`, token);
    if (!response.ok) throw await getApiError(response, 'Failed to fetch exam');
    const data = await response.json();
    return { ...data.exam, code: data.exam.code || data.exam._id };
  },

  getAllQuestions: async (examCode: string, token?: string | null, signal?: AbortSignal): Promise<Question[]> => {
    const first = await getQuestionPage(examCode, 1, token, signal);
    const questions = [...first.data];
    const { totalPages, revision } = first.pagination;
    for (let page = 2; page <= totalPages; page++) {
      const next = await getQuestionPage(examCode, page, token, signal);
      if (next.pagination.revision !== revision || next.pagination.totalPages !== totalPages) {
        throw new Error('Exam changed during question loading. Reload the exam.');
      }
      questions.push(...next.data);
    }
    return questions.map(question => ({ ...question, topic_number: question.topic_number || 1 }));
  },

  downloadExam: async (examCode: string, token: string): Promise<Blob> => {
    const response = await request(`/exams/${examCode}/export`, token);
    if (!response.ok) throw await getApiError(response, 'Failed to download exam');
    return response.blob();
  },

  transferExamOwnership: async (examCode: string, email: string, token: string): Promise<void> => {
    const response = await jsonRequest(`/exams/${encodeURIComponent(examCode)}/owner`, 'PUT', { email }, token);
    if (!response.ok) throw await getApiError(response, 'Failed to transfer exam ownership');
  },

  getQuestion: async (examCode: string, topicNumber: number, questionNumber: number, token?: string | null): Promise<Question> => {
    const response = await request(`/questions/${examCode}/${questionNumber}?topicNumber=${topicNumber}`, token);
    if (!response.ok) throw await getApiError(response, 'Failed to fetch question');
    const data = await response.json();
    return { ...data.question, topic_number: data.question.topic_number || 1 };
  },

  updateQuestion: async (examCode: string, topicNumber: number, questionNumber: number, updateData: any, token: string): Promise<Question> => {
    const response = await jsonRequest(`/exams/${examCode}/questions/${questionNumber}`, 'PUT',
      { ...updateData, topic_number: topicNumber }, token);
    const data = await readMutationResult(response, 'Failed to update question');
    return data.question;
  },

  createExam: async (examData: any, token: string): Promise<any> => {
    const response = await jsonRequest('/exams', 'POST', examData, token);
    return readMutationResult(response, 'Failed to create exam');
  },

  updateExam: async (code: string, examData: any, token: string): Promise<Exam> => {
    const response = await jsonRequest(`/exams/${code}`, 'PUT', examData, token);
    const data = await readMutationResult(response, 'Failed to update exam');
    return data.exam;
  },

  deleteExam: async (code: string, token: string): Promise<void> => {
    const response = await request(`/exams/${code}`, token, { method: 'DELETE' });
    await readMutationResult(response, 'Failed to delete exam');
  }
};
