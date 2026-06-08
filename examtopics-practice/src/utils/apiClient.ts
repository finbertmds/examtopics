import { networkService } from '../services/networkService';
import { AllProgressData, ApiResponse, CompletedExamIdsData, DailyTrackingData, HistoryData, ReportData, StatsData, UserData, UserProgress } from '../types';
import { getBackendUrl } from './backendUrl';

const backendUrl = getBackendUrl();

class ApiRequestError extends Error {
  status: number;
  responseBody: any;

  constructor(message: string, status: number, responseBody?: any) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = backendUrl;
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string,
    retryOnAuthError: boolean = true
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
        (headers as any)['Authorization'] = `Bearer ${token}`;
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

        throw new ApiRequestError(
          errorBody?.error || errorBody?.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorBody
        );
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

        if (
          retryOnAuthError &&
          token &&
          error instanceof ApiRequestError &&
          error.status === 403 &&
          error.responseBody?.error === 'Invalid or expired token'
        ) {
          const refreshedToken = await this.refreshToken(token);
          if (refreshedToken) {
            window.dispatchEvent(new CustomEvent('auth-token-refreshed', { detail: refreshedToken }));
            return this.fetchWithAuth<T>(endpoint, options, refreshedToken, false);
          }
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

  getGoogleAuthUrl(): string {
    return `${this.baseUrl}/auth/google`;
  }

  private async refreshToken(token: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data?.success && data?.token) {
        return data.token;
      }

      return null;
    } catch (_error) {
      return null;
    }
  }

  private extractResponseData(data: any): any {
    const { success, error, message, ...rest } = data;
    return rest;
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
