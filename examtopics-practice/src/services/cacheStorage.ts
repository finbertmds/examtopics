import { AllProgressData, Exam, HistoryData, ReportData, StatsData, UserData, UserProgress } from '../types';

/**
 * Cache Storage Service - Manages localStorage and IndexedDB for offline data
 * Provides a unified interface for caching data with fallback mechanisms
 */
class CacheStorage {
  private dbName = 'ExamTopicsCache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private useIndexedDB = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Check if IndexedDB is available
      if ('indexedDB' in window) {
        this.db = await this.openDatabase();
        this.useIndexedDB = true;
        console.log('IndexedDB initialized for caching');
      } else {
        console.log('IndexedDB not available, using localStorage only');
      }
    } catch (error) {
      console.warn('Failed to initialize IndexedDB, falling back to localStorage:', error);
      this.useIndexedDB = false;
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'examId' });
        }
        if (!db.objectStoreNames.contains('allProgress')) {
          db.createObjectStore('allProgress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('exams')) {
          db.createObjectStore('exams', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('questions')) {
          db.createObjectStore('questions', { keyPath: 'examId' });
        }
        if (!db.objectStoreNames.contains('staticFiles')) {
          db.createObjectStore('staticFiles', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'examId' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'examId' });
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  // Generic storage methods
  async setItem(key: string, value: any, storeName: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      try {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const keyPath = storeName === 'allProgress' ? 'id' : 
                       storeName === 'staticFiles' ? 'key' : 'examId';
        await store.put({ [keyPath]: key, data: value, timestamp: Date.now() });
      } catch (error) {
        console.warn('IndexedDB write failed, falling back to localStorage:', error);
        localStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  async getItem(key: string, storeName: string): Promise<any> {
    if (this.useIndexedDB && this.db) {
      try {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        
        return new Promise((resolve, reject) => {
          request.onsuccess = () => {
            const result = request.result;
            resolve(result ? result.data : null);
          };
          request.onerror = () => {
            console.warn('IndexedDB read failed, falling back to localStorage:', request.error);
            const fallback = localStorage.getItem(key);
            resolve(fallback ? JSON.parse(fallback) : null);
          };
        });
      } catch (error) {
        console.warn('IndexedDB read failed, falling back to localStorage:', error);
        const fallback = localStorage.getItem(key);
        return fallback ? JSON.parse(fallback) : null;
      }
    } else {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  }

  private async removeItem(key: string, storeName: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      try {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.delete(key);
      } catch (error) {
        console.warn('IndexedDB delete failed, falling back to localStorage:', error);
        localStorage.removeItem(key);
      }
    } else {
      localStorage.removeItem(key);
    }
  }

  private async clearStore(storeName: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      try {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
      } catch (error) {
        console.warn('IndexedDB clear failed, falling back to localStorage:', error);
        // Clear localStorage keys that match the pattern
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(storeName) || key.includes('exam-progress') || key.includes('_history')) {
            localStorage.removeItem(key);
          }
        });
      }
    } else {
      // Clear localStorage keys that match the pattern
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(storeName) || key.includes('exam-progress') || key.includes('_history')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Progress-specific methods
  async setProgress(examId: string, data: AllProgressData): Promise<void> {
    await this.setItem(examId, data, 'progress');
  }

  async getProgress(examId: string): Promise<AllProgressData | null> {
    return await this.getItem(examId, 'progress');
  }

  async getUserProgress(examId: string): Promise<AllProgressData | null> {
    const allProgress = await this.getProgress(examId);
    if (allProgress?.progress?.[examId]) {
      return allProgress;
    }
    return null;
  }


  async setAllProgress(data: AllProgressData): Promise<void> {
    await this.setItem('all', data, 'allProgress');
  }

  async getAllProgress(): Promise<AllProgressData | null> {
    return await this.getItem('all', 'allProgress');
  }

  async updateAnswer(
    examId: string,
    topicNumber: number,
    questionNumber: number,
    selectedAnswers: string[],
    isCorrect: boolean
  ): Promise<void> {
    const key = `${topicNumber}-${questionNumber}`;
    const allProgress = await this.getAllProgress() || { progress: {} };
    
    if (!allProgress.progress[examId]) {
      allProgress.progress[examId] = {
        examId,
        answers: {},
        markedForTraining: [],
        currentQuestion: 1,
        isRandomized: false,
        lastUpdated: new Date().toISOString()
      };
    }
    
    allProgress.progress[examId].answers[key] = {
      topicNumber,
      questionNumber,
      selectedAnswers,
      isCorrect,
      answeredAt: new Date()
    };
    
    allProgress.progress[examId].lastUpdated = new Date().toISOString();
    
    await this.setAllProgress(allProgress);
    await this.setProgress(examId, { progress: { [examId]: allProgress.progress[examId] } });
  }

  async toggleTrainingMark(examId: string, topicNumber: number, questionNumber: number): Promise<void> {
    const key = `${topicNumber}-${questionNumber}`;
    const allProgress = await this.getAllProgress() || { progress: {} };
    
    if (!allProgress.progress[examId]) {
      allProgress.progress[examId] = {
        examId,
        answers: {},
        markedForTraining: [],
        currentQuestion: 1,
        isRandomized: false,
        lastUpdated: new Date().toISOString()
      };
    }
    
    const currentMarkedForTraining = allProgress.progress[examId].markedForTraining || [];
    
    if (currentMarkedForTraining.includes(key)) {
      allProgress.progress[examId].markedForTraining = currentMarkedForTraining.filter((q: string) => q !== key);
    } else {
      allProgress.progress[examId].markedForTraining = [...currentMarkedForTraining, key];
    }
    
    allProgress.progress[examId].lastUpdated = new Date().toISOString();
    
    await this.setAllProgress(allProgress);
    await this.setProgress(examId, { progress: { [examId]: allProgress.progress[examId] } });
  }

  async submitProgress(
    examId: string,
    progress: UserProgress,
    score: { totalQuestions: number; correctAnswers: number; accuracy: number },
    totalQuestions: number,
    answeredCount: number
  ): Promise<void> {
    // Save to history
    const history = await this.getHistory(examId) || { history: [] };
    const historyEntry = {
      _id: `local_${Date.now()}`,
      examId,
      progress: progress.answers || {},
      markedForTraining: progress.markedForTraining || [],
      score,
      answeredCount,
      submittedAt: new Date().toISOString()
    };
    
    history.history.push(historyEntry);
    await this.setHistory(examId, history);
    
    // Reset progress
    await this.resetProgress(examId);
  }

  async resetProgress(examId: string): Promise<void> {
    const allProgress = await this.getAllProgress() || { progress: {} };
    delete allProgress.progress[examId];
    await this.setAllProgress(allProgress);
    await this.removeItem(examId, 'progress');
  }

  // Stats methods
  async setStats(examId: string, data: StatsData): Promise<void> {
    await this.setItem(examId, data, 'stats');
  }

  async getStats(examId: string): Promise<StatsData | null> {
    return await this.getItem(examId, 'stats');
  }

  // History methods
  async setHistory(examId: string | undefined, data: HistoryData): Promise<void> {
    const key = examId || 'all';
    await this.setItem(key, data, 'history');
  }

  async getHistory(examId?: string): Promise<HistoryData | null> {
    const key = examId || 'all';
    return await this.getItem(key, 'history');
  }

  // User methods
  async setCurrentUser(data: UserData): Promise<void> {
    await this.setItem('current', data, 'user');
  }

  async getCurrentUser(): Promise<UserData | null> {
    return await this.getItem('current', 'user');
  }

  // Report methods
  async queueReport(reportData: ReportData): Promise<void> {
    const reports = await this.getItem('queued', 'reports') || [];
    reports.push({ ...reportData, timestamp: Date.now() });
    await this.setItem('queued', reports, 'reports');
  }

  async getQueuedReports(): Promise<ReportData[]> {
    return await this.getItem('queued', 'reports') || [];
  }

  async clearQueuedReports(): Promise<void> {
    await this.setItem('queued', [], 'reports');
  }

  // Utility methods
  async clearAll(): Promise<void> {
    try {
      if (this.useIndexedDB && this.db) {
        const storeNames = ['progress', 'allProgress', 'exams', 'questions', 'staticFiles', 'stats', 'history', 'user', 'reports'];
        for (const storeName of storeNames) {
          await this.clearStore(storeName);
        }
      } else {
        // Clear all localStorage items related to the app
        Object.keys(localStorage).forEach(key => {
          if (key.includes('exam-progress') || key.includes('_history') || key.startsWith('examtopics')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      if (this.useIndexedDB && this.db) {
        // Estimate IndexedDB size (rough approximation)
        const storeNames = ['progress', 'allProgress', 'exams', 'questions', 'staticFiles', 'stats', 'history', 'user', 'reports'];
        const sizePromises = storeNames.map(storeName => 
          new Promise<number>((resolve) => {
            const transaction = this.db!.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => {
              const data = request.result;
              resolve(JSON.stringify(data).length);
            };
            request.onerror = () => resolve(0);
          })
        );
        
        const sizes = await Promise.all(sizePromises);
        return sizes.reduce((total, size) => total + size, 0);
      } else {
        // Calculate localStorage size
        let totalSize = 0;
        Object.keys(localStorage).forEach(key => {
          if (key.includes('exam-progress') || key.includes('_history') || key.includes('exams') || key.includes('questions') || key.includes('staticFiles') || key.startsWith('examtopics')) {
            totalSize += localStorage.getItem(key)?.length || 0;
          }
        });
        return totalSize;
      }
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  isIndexedDBAvailable(): boolean {
    return this.useIndexedDB;
  }

  async getExams(): Promise<Exam[]> {
    return await this.getItem('exams', 'exams');
  }

  async setExams(data: Exam[]): Promise<void> {
    await this.setItem('exams', data, 'exams');
  }
}

// Export singleton instance
export const cacheStorage = new CacheStorage();
export { CacheStorage };
