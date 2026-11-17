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

const RENEWAL_WINDOW_MS = 24 * 60 * 60 * 1000;

// Client scheduling only. The API verifies the signature and expiration.
function readTokenTiming(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!Number.isSafeInteger(payload.exp)) return;
    return {
      expiresAt: payload.exp * 1000,
      sessionEndsAt: Number.isSafeInteger(payload.sessionExpiresAt) ? payload.sessionExpiresAt * 1000 : undefined,
    };
  } catch {
    return;
  }
}

function cacheUser(user: User | null) {
  try {
    if (user) localStorage.setItem('cached_user', JSON.stringify(user));
    else localStorage.removeItem('cached_user');
  } catch (error) {
    console.error('Error caching user:', error);
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('auth_token');
    cacheUser(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    if (token) {
      const response = await apiClient.getCurrentUser(token);
      if (localStorage.getItem('auth_token') !== token) return;

      if (response.success && response.data?.user) {
        const newUser = response.data.user;
        setUser(newUser);
        cacheUser(newUser);
      } else if (response.error === 'Invalid or expired token') {
        clearSession();
      }
    }
    setIsLoading(false);
  }, [token, clearSession]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const syncTokenFromAnotherTab = (event: StorageEvent) => {
      if (event.key !== 'auth_token' && event.key !== null) return;
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken === token) return;
      setUser(null);
      setTokenState(storedToken);
    };
    window.addEventListener('storage', syncTokenFromAnotherTab);
    return () => window.removeEventListener('storage', syncTokenFromAnotherTab);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const timing = readTokenTiming(token);
    if (!timing) return;
    const { expiresAt, sessionEndsAt } = timing;

    let timer: number;
    let nextRefreshAttempt = 0;
    let refreshPending = false;
    let cancelled = false;

    const checkExpiry = () => {
      if (localStorage.getItem('auth_token') !== token) return;
      window.clearTimeout(timer);
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) clearSession();
      else timer = window.setTimeout(checkExpiry, remaining);
    };

    const renewOnActivity = async (event: Event) => {
      if (!event.isTrusted || document.visibilityState !== 'visible') return;
      if (localStorage.getItem('auth_token') !== token) return;

      const now = Date.now();
      const remaining = expiresAt - now;
      if (remaining <= 0) {
        checkExpiry();
        return;
      }
      if (sessionEndsAt === undefined || expiresAt >= sessionEndsAt ||
          remaining > RENEWAL_WINDOW_MS || refreshPending || now < nextRefreshAttempt) return;

      refreshPending = true;
      nextRefreshAttempt = now + 60_000;
      try {
        const response = await apiClient.refreshToken(token);
        const renewedToken = response.data?.token;
        if (response.success && renewedToken && !cancelled && localStorage.getItem('auth_token') === token) {
          localStorage.setItem('auth_token', renewedToken);
          setTokenState(renewedToken);
        }
      } finally {
        refreshPending = false;
      }
    };

    checkExpiry();
    window.addEventListener('click', renewOnActivity, true);
    window.addEventListener('keydown', renewOnActivity, true);
    document.addEventListener('visibilitychange', checkExpiry);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('click', renewOnActivity, true);
      window.removeEventListener('keydown', renewOnActivity, true);
      document.removeEventListener('visibilitychange', checkExpiry);
    };
  }, [token, clearSession]);

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
    clearSession();
    window.location.href = '/';
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
