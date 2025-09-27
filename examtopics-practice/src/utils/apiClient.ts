import { AllProgressData, ApiResponse, HistoryData, ReportData, StatsData, UserData, UserProgress } from '../types';
import { getBackendUrl } from './backendUrl';

const backendUrl = getBackendUrl();

// API Client class for centralized API management
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = backendUrl;
  }

  // Generic fetch method with error handling
  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Dynamically extract data from response
      const responseData = this.extractResponseData(data);
      
      return {
        success: data.success,
        data: responseData,
        message: data.message,
      };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Progress API methods
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
    token?: string
  ): Promise<ApiResponse> {
    return this.fetchWithAuth('/progress/training-mark', {
      method: 'POST',
      body: JSON.stringify({
        examId,
        topicNumber,
        questionNumber,
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

  // Report API methods
  async submitReport(reportData: ReportData, token?: string): Promise<ApiResponse> {
    return this.fetchWithAuth('/report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }, token);
  }

  // History API methods
  async getHistory(examId?: string, token?: string): Promise<ApiResponse<HistoryData>> {
    const endpoint = examId ? `/progress/history/${examId}` : '/progress/history';
    return this.fetchWithAuth<HistoryData>(endpoint, {
      method: 'GET',
    }, token);
  }

  // Auth API methods
  async getCurrentUser(token?: string): Promise<ApiResponse<UserData>> {
    return this.fetchWithAuth<UserData>('/auth/me', {
      method: 'GET',
    }, token);
  }

  getGoogleAuthUrl(): string {
    return `${this.baseUrl}/auth/google`;
  }

  // Dynamic response data extraction
  private extractResponseData(data: any): any {
    const { success, error, message, ...rest } = data;
    return rest;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for static methods
export { ApiClient };
