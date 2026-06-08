import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

  const loadUser = useCallback(async () => {
    if (token) {
      try {
        const response = await apiClient.getCurrentUser(token);

        if (response.success && response.data?.user) {
          const newUser = response.data.user;
          setUser(newUser);
          cacheUser(newUser);
        } else {
          if (response.error !== 'Network offline') {
            localStorage.removeItem('auth_token');
            setTokenState(null);
            setUser(null);
          }
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
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        localStorage.setItem('auth_token', customEvent.detail);
        setTokenState(customEvent.detail);
      }
    };

    window.addEventListener('auth-token-refreshed', handleTokenRefresh as EventListener);
    return () => {
      window.removeEventListener('auth-token-refreshed', handleTokenRefresh as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleCurrentUserChanged = () => {
      loadUser();
    };

    window.addEventListener('current-user-changed', handleCurrentUserChanged);
    return () => {
      window.removeEventListener('current-user-changed', handleCurrentUserChanged);
    };
  }, [loadUser]);

  const login = () => {
    window.location.href = apiClient.getGoogleAuthUrl();
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setTokenState(null);
    setUser(null);
    cacheUser(null);
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
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
