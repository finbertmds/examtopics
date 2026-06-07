import { AllProgressData, ApiResponse, CompletedExamIdsData, DailyTrackingData, HistoryData, ReportData, StatsData, UserData, UserProgress } from '../types';
import { apiClient } from '../utils/apiClient';

class DataService {
  async loadUserProgress(examId: string, token?: string): Promise<ApiResponse<AllProgressData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }

    const response = await apiClient.loadProgress(examId, token);
    if (response.success && response.data?.progress?.[examId]) {
      return response;
    }

    return {
      success: false,
      error: response.error || 'No progress found',
      message: response.message || 'Failed to load user progress',
    };
  }

  async loadProgress(examId: string, token?: string): Promise<ApiResponse<AllProgressData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.loadProgress(examId, token);
  }

  async loadAllProgress(token?: string): Promise<ApiResponse<AllProgressData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.loadAllProgress(token);
  }

  async saveAnswer(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    selectedAnswers: string[],
    isCorrect: boolean,
    token?: string
  ): Promise<ApiResponse> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.saveAnswer(examId, topicNumber, questionNumber, selectedAnswers, isCorrect, token);
  }

  async markForTraining(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    isMarkedForTraining: boolean,
    token?: string
  ): Promise<ApiResponse> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.markForTraining(examId, topicNumber, questionNumber, isMarkedForTraining, token);
  }

  async submitProgress(
    examId: string,
    progress: UserProgress,
    score: { totalQuestions: number; correctAnswers: number; accuracy: number },
    totalQuestions: number,
    answeredCount: number,
    token?: string
  ): Promise<ApiResponse> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.submitProgress(examId, progress, score, totalQuestions, answeredCount, token);
  }

  async resetProgress(examId: string, token?: string): Promise<ApiResponse> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.resetProgress(examId, token);
  }

  async getStats(examId: string, token?: string): Promise<ApiResponse<StatsData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.getStats(examId, token);
  }

  async getHistory(examId?: string, token?: string): Promise<ApiResponse<HistoryData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.getHistory(examId, token);
  }

  async getCompletedExamIds(token?: string): Promise<ApiResponse<CompletedExamIdsData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.getCompletedExamIds(token);
  }

  async getDailyTracking(examId: string, token?: string): Promise<ApiResponse<DailyTrackingData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.getDailyTracking(examId, token);
  }

  async submitReport(reportData: ReportData, token?: string): Promise<ApiResponse> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.submitReport(reportData, token);
  }

  async getCurrentUser(token?: string): Promise<ApiResponse<UserData>> {
    if (!token) {
      return { success: false, error: 'Not authenticated', message: 'Authentication required' };
    }
    return apiClient.getCurrentUser(token);
  }

  getGoogleAuthUrl(): string {
    return apiClient.getGoogleAuthUrl();
  }
}

export const dataService = new DataService();
export { DataService };
