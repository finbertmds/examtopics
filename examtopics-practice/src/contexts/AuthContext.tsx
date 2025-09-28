import React, { createContext, useContext, useEffect, useState } from 'react';
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

  // Load user info when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await apiClient.getCurrentUser(token);

          if (response.success && response.data?.user) {
            setUser(response.data.user);
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
  }, [token]);

  const login = async () => {
    // Clear all offline data before login
    try {
      localStorage.removeItem('exam-progress');
      await cacheStorage.clearAll();
      console.log('Cleared offline data before login');
    } catch (error) {
      console.error('Error clearing offline data before login:', error);
    }

    // Redirect to Google OAuth
    window.location.href = apiClient.getGoogleAuthUrl();
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setTokenState(null);
    setUser(null);

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
