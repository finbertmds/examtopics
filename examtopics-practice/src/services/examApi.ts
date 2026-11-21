// examApi.ts
// Handles API calls to the new Express/MongoDB backend

import { Exam, Question } from '../types';
import { getBackendUrl } from '../utils/backendUrl';
import { resolveSessionBearer } from '../utils/sessionAccess';

const backendUrl = getBackendUrl();

const getBaseUrl = () => {
    return backendUrl + '/api'
};

const getAuthHeaders = async (token?: string | null): Promise<HeadersInit> => token
  ? { 'Authorization': `Bearer ${await resolveSessionBearer(token)}` }
  : {};

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
  const response = await fetch(`${getBaseUrl()}/questions/${encodeURIComponent(examCode)}?${params}`, {
    headers: await getAuthHeaders(token),
    signal,
  });
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
    const response = await fetch(`${getBaseUrl()}/exams`, {
      headers: await getAuthHeaders(token),
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
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
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
      headers: await getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch metadata');
    const data = await response.json();
    return { categories: data.categories || [], tags: data.tags || [] };
  },

  getExam: async (code: string, token?: string | null): Promise<Exam> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`, {
      headers: await getAuthHeaders(token),
    });
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
    const response = await fetch(`${getBaseUrl()}/exams/${examCode}/export`, {
      headers: {
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
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
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
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
      headers: await getAuthHeaders(token),
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
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
      },
      body: JSON.stringify({ ...updateData, topic_number: topicNumber })
    });
    const data = await readMutationResult(response, 'Failed to update question');
    return data.question;
  },

  createExam: async (examData: any, token: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
      },
      body: JSON.stringify(examData)
    });
    return readMutationResult(response, 'Failed to create exam');
  },

  updateExam: async (code: string, examData: any, token: string): Promise<Exam> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
      },
      body: JSON.stringify(examData)
    });
    const data = await readMutationResult(response, 'Failed to update exam');
    return data.exam;
  },

  deleteExam: async (code: string, token: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/exams/${code}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await resolveSessionBearer(token)}`
      }
    });
    await readMutationResult(response, 'Failed to delete exam');
  }
};
