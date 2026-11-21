import { networkService } from '../services/networkService';
import { AllProgressData, ApiResponse, AuthSession, CompletedExamIdsData, DailyTrackingData, HistoryData, ReportData, StatsData, UserData, UserProgress } from '../types';
import { getBackendUrl } from './backendUrl';
import { resolveSessionBearer } from './sessionAccess';

const backendUrl = getBackendUrl();

export interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

// Shared transport for callers that need the raw Response (ARCH-002): backend base
// URL, offline check and the current session bearer. Unlike ApiClient methods it
// throws instead of wrapping errors, and adds no timeout, so large exam imports
// and caller-provided AbortSignals keep working.
export async function apiRequest(endpoint: string, { token, headers, ...init }: ApiRequestOptions = {}): Promise<Response> {
  // The bearer must only ever reach the backend origin: accept root-relative paths only,
  // so `${backendUrl}${endpoint}` cannot be redirected to another host (e.g. '@evil.test').
  if (!endpoint.startsWith('/') || endpoint.startsWith('//')) throw new Error('Invalid API endpoint');
  if (!networkService.isNetworkOnline()) throw new Error('Network is offline');
  const requestHeaders = new Headers(headers);
  if (token) requestHeaders.set('Authorization', `Bearer ${await resolveSessionBearer(token)}`);
  return fetch(`${backendUrl}${endpoint}`, { ...init, headers: requestHeaders });
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = backendUrl;
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      if (!networkService.isNetworkOnline()) {
        throw new Error('Network is offline');
      }

      const url = `${this.baseUrl}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        (headers as any)['Authorization'] = `Bearer ${await resolveSessionBearer(token)}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: any = null;
        try {
          errorBody = await response.json();
        } catch (_error) {
          // Ignore JSON parse errors for non-JSON responses
        }

        throw new Error(errorBody?.error || errorBody?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseData = this.extractResponseData(data);

      return {
        success: data.success,
        data: responseData,
        message: data.message,
      };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            message: 'Request took too long to complete',
          };
        }

        if (error.message === 'Network is offline') {
          return {
            success: false,
            error: 'Network offline',
            message: 'No internet connection available',
          };
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async loadProgress(examId: string, token?: string): Promise<ApiResponse<AllProgressData>> {
    return this.fetchWithAuth<AllProgressData>(`/progress/load/${examId}`, {
      method: 'GET',
    }, token);
  }

  async loadAllProgress(token?: string): Promise<ApiResponse<AllProgressData>> {
    return this.fetchWithAuth<AllProgressData>('/progress/all', {
      method: 'GET',
    }, token);
  }

  async saveAnswer(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    selectedAnswers: string[],
    isCorrect: boolean,
    token?: string
  ): Promise<ApiResponse> {
    return this.fetchWithAuth('/progress/answer', {
      method: 'POST',
      body: JSON.stringify({
        examId,
        topicNumber,
        questionNumber,
        selectedAnswers,
        isCorrect,
      }),
    }, token);
  }

  async markForTraining(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    isMarkedForTraining: boolean,
    token?: string
  ): Promise<ApiResponse> {
    return this.fetchWithAuth('/progress/training-mark', {
      method: 'POST',
      body: JSON.stringify({
        examId,
        topicNumber,
        questionNumber,
        isMarkedForTraining,
      }),
    }, token);
  }

  async submitProgress(
    examId: string,
    progress: UserProgress,
    score: { totalQuestions: number; correctAnswers: number; accuracy: number },
    totalQuestions: number,
    answeredCount: number,
    token?: string
  ): Promise<ApiResponse> {
    return this.fetchWithAuth('/progress/submit', {
      method: 'POST',
      body: JSON.stringify({
        examId,
        progress,
        score,
        totalQuestions,
        answeredCount,
      }),
    }, token);
  }

  async resetProgress(examId: string, token?: string): Promise<ApiResponse> {
    return this.fetchWithAuth('/progress/reset', {
      method: 'POST',
      body: JSON.stringify({ examId }),
    }, token);
  }

  async getStats(examId: string, token?: string): Promise<ApiResponse<StatsData>> {
    return this.fetchWithAuth<StatsData>(`/progress/stats/${examId}`, {
      method: 'GET',
    }, token);
  }

  async submitReport(reportData: ReportData, token?: string): Promise<ApiResponse> {
    return this.fetchWithAuth('/report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }, token);
  }

  async getHistory(examId?: string, token?: string): Promise<ApiResponse<HistoryData>> {
    const endpoint = examId ? `/progress/history/${examId}` : '/progress/history';
    return this.fetchWithAuth<HistoryData>(endpoint, {
      method: 'GET',
    }, token);
  }

  async getCompletedExamIds(token?: string): Promise<ApiResponse<CompletedExamIdsData>> {
    return this.fetchWithAuth<CompletedExamIdsData>('/progress/completed-exam-ids', {
      method: 'GET',
    }, token);
  }

  async getDailyTracking(examId: string, token?: string): Promise<ApiResponse<DailyTrackingData>> {
    return this.fetchWithAuth<DailyTrackingData>('/progress/daily-tracking?examId=' + examId, {
      method: 'GET',
    }, token);
  }

  async getCurrentUser(token?: string): Promise<ApiResponse<UserData>> {
    return this.fetchWithAuth<UserData>('/auth/me', {
      method: 'GET',
    }, token);
  }

  getGoogleAuthUrl(challenge: string): string {
    return `${this.baseUrl}/auth/google?${new URLSearchParams({ challenge })}`;
  }

  private async requestSession<T>(action: string, { bearer, body }: { bearer?: string; body?: object } = {}) {
    const headers = new Headers({ 'X-ExamTopics-Session': '1' });
    if (bearer) headers.set('Authorization', `Bearer ${bearer}`);
    if (body) headers.set('Content-Type', 'application/json');
    try {
      const response = await fetch(`${this.baseUrl}/auth/${action}`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers,
        body: body && JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) return { status: response.status };
      return { status: response.status, data: await response.json() as T & { success: boolean } };
    } catch {
      return { status: 0 };
    }
  }

  private async requestAuthSession(action: string, options?: { bearer?: string; body?: object }) {
    const { status, data } = await this.requestSession<AuthSession>(action, options);
    if (!data?.success || typeof data.token !== 'string' || typeof data.user?.id !== 'string' ||
        !Number.isSafeInteger(data.idleExpiresAt) || !Number.isSafeInteger(data.absoluteExpiresAt)) {
      return { status };
    }
    return { status, data };
  }

  exchangeLoginCode(code: string, verifier: string) {
    return this.requestAuthSession('exchange', { body: { code, verifier } });
  }

  restoreSession() {
    return this.requestAuthSession('session');
  }

  recordActivity(bearer: string) {
    return this.requestAuthSession('activity', { bearer });
  }

  logoutSession(bearer?: string) {
    return this.requestSession<object>('logout', { bearer });
  }

  private extractResponseData(data: any): any {
    const { success, error, message, ...rest } = data;
    return rest;
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
