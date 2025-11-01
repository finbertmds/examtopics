import { cacheStorage } from '../services/cacheStorage';
import { networkService } from '../services/networkService';
import { AllProgressData, ApiResponse, Exam, HistoryData, Question, ReportData, StatsData, UserData, UserProgress } from '../types';
import { getBackendUrl } from './backendUrl';

const backendUrl = getBackendUrl();

// API Client class for centralized API management
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = backendUrl;
  }

  // Generic fetch method for static files with caching (no auth required)
  private async fetchStatic<T>(url: string, cacheKey: string, options: RequestInit = {}): Promise<T> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getItem(cacheKey, 'staticFiles');
      if (cachedData) {
        console.log(`Loaded ${cacheKey} from cache`);
        return cachedData as T;
      }

      // Check network status
      if (!networkService.isNetworkOnline()) {
        throw new Error('Network is offline and no cached data available');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the data
      await cacheStorage.setItem(cacheKey, data, 'staticFiles');
      console.log(`Cached ${cacheKey}`);
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  // Generic fetch method with error handling and network awareness
  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      // Check network status
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

      // Add timeout for requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
      
      // Handle specific error types
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

  // Static files API methods
  async getExams(): Promise<Exam[]> {
    return this.fetchStatic<Exam[]>('/exams/exams.json', 'exams');
  }

  async getQuestions(examFile: string): Promise<Question[]> {
    return this.fetchStatic<Question[]>(`/${examFile}`, `questions_${examFile}`);
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

  async getCompletedExamIds(token?: string): Promise<ApiResponse<{ examIds: string[] }>> {
    return this.fetchWithAuth<{ examIds: string[] }>('/progress/completed-exam-ids', {
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
