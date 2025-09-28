import { AllProgressData, ApiResponse, HistoryData, ReportData, StatsData, UserData, UserProgress } from '../types';
import { apiClient } from '../utils/apiClient';
import { cacheStorage } from './cacheStorage';

/**
 * Data Service - Centralized data management with offline-first approach
 * Handles online/offline data fetching, caching, and synchronization
 */
class DataService {
  private isOnline: boolean = navigator.onLine;
  private syncQueue: Array<() => Promise<void>> = [];

  // Initialize data service separately
  init() {
    // Listen for network status changes
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline() {
    this.isOnline = true;
    console.log('Network is online, starting sync...');
    this.processSyncQueue();
  }

  private handleOffline() {
    this.isOnline = false;
    console.log('Network is offline, using cached data');
  }

  private async processSyncQueue() {
    if (this.syncQueue.length === 0) return;
    
    console.log(`Processing ${this.syncQueue.length} queued operations...`);
    const operations = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        console.error('Error processing sync operation:', error);
        // Re-queue failed operations
        this.syncQueue.push(operation);
      }
    }
  }

  private addToSyncQueue(operation: () => Promise<void>) {
    this.syncQueue.push(operation);
  }

  // Progress API methods with offline-first support
  async loadUserProgress(examId: string, token?: string): Promise<ApiResponse<AllProgressData>> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getUserProgress(examId);
      
      if (this.isOnline && token) {
        try {
          // Fetch from API
          const response = await apiClient.loadProgress(examId, token);
          
          if (response.success && response.data?.progress?.[examId]) {
            // Update cache with fresh data
            await cacheStorage.setProgress(examId, response.data);
            return {
              success: true,
              data: response.data,
              message: 'Data loaded from API'
            };
          }
        } catch (error) {
          console.warn('Failed to fetch from API, using cached data:', error);
        }
      }
      
      // Return cached data or empty response
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: this.isOnline ? 'Data loaded from cache' : 'Offline mode - using cached data'
        };
      }
      
      return {
        success: false,
        error: 'No data available',
        message: 'No cached data found'
      };
    } catch (error) {
      console.error('Error loading user progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to load user progress'
      };
    }
  }

  async loadProgress(examId: string, token?: string): Promise<ApiResponse<AllProgressData>> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getProgress(examId);
      
      if (this.isOnline && token) {
        try {
          // Fetch from API
          const response = await apiClient.loadProgress(examId, token);
          
          if (response.success && response.data) {
            // Update cache with fresh data
            await cacheStorage.setProgress(examId, response.data);
            return response;
          }
        } catch (error) {
          console.warn('Failed to fetch from API, using cached data:', error);
        }
      }
      
      // Return cached data or empty response
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: this.isOnline ? 'Data loaded from cache' : 'Offline mode - using cached data'
        };
      }
      
      return {
        success: false,
        error: 'No data available',
        message: 'No cached data found'
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to load progress'
      };
    }
  }

  async loadAllProgress(token?: string): Promise<ApiResponse<AllProgressData>> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getAllProgress();
      
      if (this.isOnline && token) {
        try {
          // Fetch from API
          const response = await apiClient.loadAllProgress(token);
          
          if (response.success && response.data) {
            // Update cache with fresh data
            await cacheStorage.setAllProgress(response.data);
            return response;
          }
        } catch (error) {
          console.warn('Failed to fetch from API, using cached data:', error);
        }
      }
      
      // Return cached data or empty response
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: this.isOnline ? 'Data loaded from cache' : 'Offline mode - using cached data'
        };
      }
      
      return {
        success: false,
        error: 'No data available',
        message: 'No cached data found'
      };
    } catch (error) {
      console.error('Error loading all progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to load all progress'
      };
    }
  }

  async saveAnswer(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    selectedAnswers: string[],
    isCorrect: boolean,
    token?: string
  ): Promise<ApiResponse> {
    try {
      // Update local cache immediately
      await cacheStorage.updateAnswer(examId, topicNumber, questionNumber, selectedAnswers, isCorrect);
      
      if (this.isOnline && token) {
        try {
          // Save to backend
          const response = await apiClient.saveAnswer(examId, topicNumber, questionNumber, selectedAnswers, isCorrect, token);
          
          if (response.success) {
            return response;
          }
        } catch (error) {
          console.warn('Failed to save to backend, queuing for sync:', error);
        }
      }
      
      // Queue for sync if offline or failed
      if (token) {
        this.addToSyncQueue(async () => {
          await apiClient.saveAnswer(examId, topicNumber, questionNumber, selectedAnswers, isCorrect, token);
        });
      }
      
      return {
        success: true,
        message: this.isOnline ? 'Answer saved' : 'Answer saved locally, will sync when online'
      };
    } catch (error) {
      console.error('Error saving answer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to save answer'
      };
    }
  }

  async markForTraining(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    token?: string
  ): Promise<ApiResponse> {
    try {
      // Update local cache immediately
      await cacheStorage.toggleTrainingMark(examId, topicNumber, questionNumber);
      
      if (this.isOnline && token) {
        try {
          // Save to backend
          const response = await apiClient.markForTraining(examId, topicNumber, questionNumber, token);
          
          if (response.success) {
            return response;
          }
        } catch (error) {
          console.warn('Failed to save to backend, queuing for sync:', error);
        }
      }
      
      // Queue for sync if offline or failed
      if (token) {
        this.addToSyncQueue(async () => {
          await apiClient.markForTraining(examId, topicNumber, questionNumber, token);
        });
      }
      
      return {
        success: true,
        message: this.isOnline ? 'Training mark updated' : 'Training mark updated locally, will sync when online'
      };
    } catch (error) {
      console.error('Error marking for training:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to mark for training'
      };
    }
  }

  async submitProgress(
    examId: string,
    progress: UserProgress,
    score: { totalQuestions: number; correctAnswers: number; accuracy: number },
    totalQuestions: number,
    answeredCount: number,
    token?: string
  ): Promise<ApiResponse> {
    try {
      // Update local cache immediately
      await cacheStorage.submitProgress(examId, progress, score, totalQuestions, answeredCount);
      
      if (this.isOnline && token) {
        try {
          // Save to backend
          const response = await apiClient.submitProgress(examId, progress, score, totalQuestions, answeredCount, token);
          
          if (response.success) {
            return response;
          }
        } catch (error) {
          console.warn('Failed to save to backend, queuing for sync:', error);
        }
      }
      
      // Queue for sync if offline or failed
      if (token) {
        this.addToSyncQueue(async () => {
          await apiClient.submitProgress(examId, progress, score, totalQuestions, answeredCount, token);
        });
      }
      
      return {
        success: true,
        message: this.isOnline ? 'Progress submitted' : 'Progress submitted locally, will sync when online'
      };
    } catch (error) {
      console.error('Error submitting progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to submit progress'
      };
    }
  }

  async resetProgress(examId: string, token?: string): Promise<ApiResponse> {
    try {
      // Update local cache immediately
      await cacheStorage.resetProgress(examId);
      
      if (this.isOnline && token) {
        try {
          // Save to backend
          const response = await apiClient.resetProgress(examId, token);
          
          if (response.success) {
            return response;
          }
        } catch (error) {
          console.warn('Failed to save to backend, queuing for sync:', error);
        }
      }
      
      // Queue for sync if offline or failed
      if (token) {
        this.addToSyncQueue(async () => {
          await apiClient.resetProgress(examId, token);
        });
      }
      
      return {
        success: true,
        message: this.isOnline ? 'Progress reset' : 'Progress reset locally, will sync when online'
      };
    } catch (error) {
      console.error('Error resetting progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to reset progress'
      };
    }
  }

  async getStats(examId: string, token?: string): Promise<ApiResponse<StatsData>> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getStats(examId);
      
      if (this.isOnline && token) {
        try {
          // Fetch from API
          const response = await apiClient.getStats(examId, token);
          
          if (response.success && response.data) {
            // Update cache with fresh data
            await cacheStorage.setStats(examId, response.data);
            return response;
          }
        } catch (error) {
          console.warn('Failed to fetch from API, using cached data:', error);
        }
      }
      
      // Return cached data or empty response
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: this.isOnline ? 'Stats loaded from cache' : 'Offline mode - using cached stats'
        };
      }
      
      return {
        success: false,
        error: 'No stats available',
        message: 'No cached stats found'
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get stats'
      };
    }
  }

  async getHistory(examId?: string, token?: string): Promise<ApiResponse<HistoryData>> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getHistory(examId);
      
      if (this.isOnline && token) {
        try {
          // Fetch from API
          const response = await apiClient.getHistory(examId, token);
          
          if (response.success && response.data) {
            // Update cache with fresh data
            await cacheStorage.setHistory(examId, response.data);
            return response;
          }
        } catch (error) {
          console.warn('Failed to fetch from API, using cached data:', error);
        }
      }
      
      // Return cached data or empty response
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: this.isOnline ? 'History loaded from cache' : 'Offline mode - using cached history'
        };
      }
      
      return {
        success: false,
        error: 'No history available',
        message: 'No cached history found'
      };
    } catch (error) {
      console.error('Error getting history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get history'
      };
    }
  }

  async submitReport(reportData: ReportData, token?: string): Promise<ApiResponse> {
    try {
      if (this.isOnline && token) {
        try {
          // Save to backend
          const response = await apiClient.submitReport(reportData, token);
          
          if (response.success) {
            return response;
          }
        } catch (error) {
          console.warn('Failed to save to backend, queuing for sync:', error);
        }
      }
      
      // Queue for sync if offline or failed
      if (token) {
        this.addToSyncQueue(async () => {
          await apiClient.submitReport(reportData, token);
        });
      }
      
      return {
        success: true,
        message: this.isOnline ? 'Report submitted' : 'Report queued for sync when online'
      };
    } catch (error) {
      console.error('Error submitting report:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to submit report'
      };
    }
  }

  async getCurrentUser(token?: string): Promise<ApiResponse<UserData>> {
    try {
      // Try to get from cache first
      const cachedData = await cacheStorage.getCurrentUser();
      
      if (this.isOnline && token) {
        try {
          // Fetch from API
          const response = await apiClient.getCurrentUser(token);
          
          if (response.success && response.data) {
            // Update cache with fresh data
            await cacheStorage.setCurrentUser(response.data);
            return response;
          }
        } catch (error) {
          console.warn('Failed to fetch from API, using cached data:', error);
        }
      }
      
      // Return cached data or empty response
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: this.isOnline ? 'User data loaded from cache' : 'Offline mode - using cached user data'
        };
      }
      
      return {
        success: false,
        error: 'No user data available',
        message: 'No cached user data found'
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get current user'
      };
    }
  }

  getGoogleAuthUrl(): string {
    return apiClient.getGoogleAuthUrl();
  }

  // Utility methods
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  getSyncQueueLength(): number {
    return this.syncQueue.length;
  }

  async forceSync(): Promise<void> {
    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }

  async clearCache(): Promise<void> {
    await cacheStorage.clearAll();
  }
}

// Export singleton instance
export const dataService = new DataService();
export { DataService };
