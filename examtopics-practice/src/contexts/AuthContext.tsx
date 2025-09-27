import React, { createContext, useContext, useEffect, useState } from 'react';
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

  const login = () => {
    localStorage.removeItem('exam-progress');
    // Redirect to Google OAuth
    window.location.href = apiClient.getGoogleAuthUrl();
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setTokenState(null);
    setUser(null);

    localStorage.removeItem('exam-progress');
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
