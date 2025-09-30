import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cacheStorage } from '../services/cacheStorage';
import { User } from '../types';
import { apiClient } from '../utils/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get cached user info
  const getCachedUser = (): User | null => {
    try {
      const cachedUser = localStorage.getItem('cached_user');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (error) {
      console.error('Error reading cached user:', error);
      return null;
    }
  };

  // Cache user info
  const cacheUser = (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem('cached_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cached_user');
      }
    } catch (error) {
      console.error('Error caching user:', error);
    }
  };

  // Check if user has changed
  const hasUserChanged = useCallback((newUser: User | null): boolean => {
    const cachedUser = getCachedUser();
    if (!cachedUser && !newUser) return false;
    if (!cachedUser || !newUser) return true;
    return cachedUser.id !== newUser.id;
  }, []);

  // Synchronize offline data to server
  const syncOfflineData = useCallback(async (token: string) => {
    try {
      console.log('Starting intelligent data synchronization...');

      // Get all cached progress data
      const localAllProgress = await cacheStorage.getAllProgress();
      if (!localAllProgress?.progress) {
        console.log('No local progress data to sync');
        return;
      }

      let totalSynced = 0;
      let totalSkipped = 0;

      // Process each exam's progress
      for (const [examId, localProgressData] of Object.entries(localAllProgress.progress)) {
        try {
          console.log(`Processing exam ${examId}...`);

          // Step 1: Fetch latest data from server
          const serverResponse = await apiClient.loadProgress(examId, token);
          if (!serverResponse.success || !serverResponse.data?.progress?.[examId]) {
            console.log(`No server data for exam ${examId}, uploading all local data`);
            // No server data, upload all local answers
            await uploadAllLocalAnswers(examId, localProgressData, token);
            totalSynced += Object.keys(localProgressData.answers || {}).length;
            continue;
          }

          const serverProgressData = serverResponse.data.progress[examId];
          const serverAnswers = serverProgressData.answers || {};
          const localAnswers = localProgressData.answers || {};

          // Step 2: Find answers that exist locally but not on server
          const answersToUpload: Array<{
            topicNumber: number;
            questionNumber: number;
            selectedAnswers: string[];
            isCorrect: boolean;
          }> = [];

          for (const [answerKey, localAnswer] of Object.entries(localAnswers)) {
            if (!serverAnswers[answerKey]) {
              // This answer doesn't exist on server, needs to be uploaded
              answersToUpload.push({
                topicNumber: localAnswer.topicNumber,
                questionNumber: localAnswer.questionNumber,
                selectedAnswers: localAnswer.selectedAnswers,
                isCorrect: localAnswer.isCorrect
              });
            }
          }

          // Step 3: Upload missing answers
          if (answersToUpload.length > 0) {
            console.log(`Uploading ${answersToUpload.length} missing answers for exam ${examId}`);
            for (const answer of answersToUpload) {
              try {
                const response = await apiClient.saveAnswer(
                  examId,
                  answer.topicNumber,
                  answer.questionNumber,
                  answer.selectedAnswers,
                  answer.isCorrect,
                  token
                );
                if (response.success) {
                  totalSynced++;
                } else {
                  console.warn(`Failed to upload answer ${answer.topicNumber}-${answer.questionNumber}:`, response.error);
                }
              } catch (error) {
                console.warn(`Failed to upload answer ${answer.topicNumber}-${answer.questionNumber}:`, error);
              }
            }
          } else {
            console.log(`All answers for exam ${examId} already exist on server`);
            totalSkipped += Object.keys(localAnswers).length;
          }

          // Step 4: Sync training marks
          await syncTrainingMarks(examId, localProgressData, serverProgressData, token);

          // Step 5: Update local cache with latest server data
          await cacheStorage.setProgress(examId, serverResponse.data);

        } catch (error) {
          console.error(`Error processing exam ${examId}:`, error);
        }
      }

      // Sync queued reports
      await syncQueuedReports(token);

      // If we uploaded any data, fetch the latest data from server to ensure cache is up-to-date
      if (totalSynced > 0) {
        console.log(`Synced ${totalSynced} items, fetching latest data from server...`);
        await refreshLatestDataFromServer(token, localAllProgress);

        // Refresh the page to display the latest data
        console.log('Refreshing page to display latest data...');
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Small delay to ensure sync completion
      }

      console.log(`Synchronization completed: ${totalSynced} answers uploaded, ${totalSkipped} answers already up-to-date`);
    } catch (error) {
      console.error('Error synchronizing offline data:', error);
    }
  }, []);

  // Helper function to upload all local answers (when no server data exists)
  const uploadAllLocalAnswers = async (examId: string, localProgressData: any, token: string) => {
    const localAnswers = localProgressData.answers || {};
    for (const [answerKey, localAnswer] of Object.entries(localAnswers)) {
      try {
        const answer = localAnswer as any;
        await apiClient.saveAnswer(
          examId,
          answer.topicNumber,
          answer.questionNumber,
          answer.selectedAnswers,
          answer.isCorrect,
          token
        );
      } catch (error) {
        console.warn(`Failed to upload answer ${answerKey}:`, error);
      }
    }
  };

  // Helper function to sync training marks
  const syncTrainingMarks = async (examId: string, localProgressData: any, serverProgressData: any, token: string) => {
    const localTrainingMarks = localProgressData.markedForTraining || [];
    const serverTrainingMarks = serverProgressData.markedForTraining || [];

    // Find training marks that exist locally but not on server
    const marksToUpload = localTrainingMarks.filter((mark: string) => !serverTrainingMarks.includes(mark));

    for (const mark of marksToUpload) {
      try {
        const [topicNumber, questionNumber] = mark.split('-').map(Number);
        await apiClient.markForTraining(examId, topicNumber, questionNumber, token);
        console.log(`Synced training mark ${mark} for exam ${examId}`);
      } catch (error) {
        console.warn(`Failed to sync training mark ${mark}:`, error);
      }
    }
  };

  // Helper function to sync queued reports
  const syncQueuedReports = async (token: string) => {
    const queuedReports = await cacheStorage.getQueuedReports();
    if (queuedReports.length > 0) {
      console.log(`Syncing ${queuedReports.length} queued reports`);
      for (const report of queuedReports) {
        try {
          await apiClient.submitReport(report, token);
          console.log('Synced queued report');
        } catch (error) {
          console.warn('Failed to sync queued report:', error);
        }
      }
      await cacheStorage.clearQueuedReports();
    }
  };

  // Helper function to refresh latest data from server after sync
  const refreshLatestDataFromServer = async (token: string, localAllProgress: any) => {
    try {
      console.log('Refreshing latest data from server...');

      // Get all exam IDs that we have local data for
      const examIds = Object.keys(localAllProgress.progress || {});

      // Fetch latest data for each exam
      for (const examId of examIds) {
        try {
          console.log(`Fetching latest data for exam ${examId}...`);
          const serverResponse = await apiClient.loadProgress(examId, token);

          if (serverResponse.success && serverResponse.data?.progress?.[examId]) {
            // Update local cache with the latest server data
            await cacheStorage.setProgress(examId, serverResponse.data);
            console.log(`Updated cache with latest data for exam ${examId}`);
          } else {
            console.warn(`No server data found for exam ${examId} after sync`);
          }
        } catch (error) {
          console.warn(`Failed to refresh data for exam ${examId}:`, error);
        }
      }

      // Also refresh the overall progress data
      try {
        const allProgressResponse = await apiClient.loadAllProgress(token);
        if (allProgressResponse.success && allProgressResponse.data) {
          await cacheStorage.setAllProgress(allProgressResponse.data);
          console.log('Updated overall progress cache with latest data');
        }
      } catch (error) {
        console.warn('Failed to refresh overall progress data:', error);
      }

      console.log('Latest data refresh completed');
    } catch (error) {
      console.error('Error refreshing latest data from server:', error);
    }
  };

  // Load user info when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await apiClient.getCurrentUser(token);

          if (response.success && response.data?.user) {
            const newUser = response.data.user;
            const userChanged = hasUserChanged(newUser);

            setUser(newUser);
            cacheUser(newUser);

            if (userChanged) {
              console.log('User has changed, clearing offline data');
              // User changed, clear all offline data
              try {
                localStorage.removeItem('exam-progress');
                await cacheStorage.clearAll();
                console.log('Cleared offline data due to user change');
              } catch (error) {
                console.error('Error clearing offline data:', error);
              }
            } else {
              console.log('Same user, synchronizing offline data');
              // Same user, synchronize offline data
              await syncOfflineData(token);
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('auth_token');
            setTokenState(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('auth_token');
          setTokenState(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token, hasUserChanged, syncOfflineData]);

  const login = async () => {
    // Data management will be handled after successful login
    // based on whether the user has changed or not
    console.log('Initiating login process...');

    // Redirect to Google OAuth
    window.location.href = apiClient.getGoogleAuthUrl();
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setTokenState(null);
    setUser(null);
    cacheUser(null); // Clear cached user info

    // Clear all offline data and cache
    try {
      // Clear localStorage
      localStorage.removeItem('exam-progress');

      // Clear cache storage service
      await cacheStorage.clearAll();

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('Clearing cache on logout:', cacheName);
            return caches.delete(cacheName);
          })
        );
        console.log('All caches cleared on logout');
      }

      // Clear session storage
      sessionStorage.clear();

      console.log('All offline data cleared on logout');
    } catch (error) {
      console.error('Error clearing offline data on logout:', error);
    }

    window.location.reload();
  };

  const setToken = (newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setTokenState(newToken);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
