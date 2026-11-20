import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthSession, User } from '../types';
import { apiClient } from '../utils/apiClient';
import { beginGoogleLogin } from '../utils/loginExchange';
import { registerSessionAccess, SessionAccess } from '../utils/sessionAccess';
import { clearHomeSectionPreferences } from '../utils/homeSectionPreferences';

type SessionNotice = 'sessionCookieUnavailable' | 'sessionRestoreFailed' | 'sessionLogoutFailed' | 'sessionLogoutUnconfirmed';

interface AuthContextType {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notice: SessionNotice | null;
  login: () => void;
  logout: () => void;
  retryRestore: () => void;
  acceptSession: (session: AuthSession) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ACTIVITY_INTERVAL_MS = 60_000;
const COOKIE_NOTICE_KEY = 'examtopics-session-cookie-unavailable';
const LOGOUT_PENDING_KEY = 'examtopics-logout-pending';

interface ActiveSession extends SessionAccess {
  userId: string;
  id?: string;
  deadline: number;
  absoluteDeadline: number;
  lastActivityAttempt: number;
  cookieUnavailable: boolean;
}

function bearerClaims(token: string): { exp?: number; sid?: string } {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { exp: Number.isSafeInteger(payload.exp) ? payload.exp : undefined,
      sid: typeof payload.sid === 'string' ? payload.sid : undefined };
  } catch {
    return {};
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [notice, setNotice] = useState<SessionNotice | null>(null);
  const active = useRef<ActiveSession | null>(null);
  const expirationTimer = useRef<number | undefined>(undefined);
  const revision = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const logoutBearer = useRef<string | undefined>(undefined);
  const bootRequest = useRef<Promise<Awaited<ReturnType<typeof apiClient.restoreSession>>> | null>(null);

  const clearSession = useCallback(() => {
    window.clearTimeout(expirationTimer.current);
    if (active.current) {
      clearHomeSectionPreferences(active.current.userId);
      active.current.bearer = null;
    }
    clearHomeSectionPreferences();
    active.current = null;
    setToken(null);
    setSessionId(null);
    setUser(null);
  }, []);

  const checkExpiry = useCallback(function check() {
    window.clearTimeout(expirationTimer.current);
    const session = active.current;
    if (!session) return;
    const remaining = session.deadline - Date.now();
    if (remaining <= 0) {
      clearSession();
    } else {
      expirationTimer.current = window.setTimeout(check, remaining);
    }
  }, [clearSession]);

  const installSession = useCallback((data: AuthSession) => {
    if (active.current) active.current.bearer = null;
    const session: ActiveSession = {
      userId: data.user.id,
      handle: data.token,
      bearer: data.token,
      id: bearerClaims(data.token).sid,
      absoluteDeadline: data.absoluteExpiresAt,
      deadline: Math.min(data.idleExpiresAt, data.absoluteExpiresAt),
      lastActivityAttempt: -Infinity,
      cookieUnavailable: false,
      pending: null,
    };
    active.current = session;
    registerSessionAccess(session);
    setUser(data.user);
    setToken(session.handle);
    // The session ID stays stable when the short-lived access token is renewed.
    setSessionId(session.id || `expires:${data.absoluteExpiresAt}`);
    setNotice(null);
    setLoading(false);
    checkExpiry();
    return session;
  }, [checkExpiry]);

  const completeRestore = useCallback((result: Awaited<ReturnType<typeof apiClient.restoreSession>>) => {
    if (result.data?.success) {
      sessionStorage.removeItem(COOKIE_NOTICE_KEY);
      installSession(result.data);
    } else if (result.status === 401) {
      clearSession();
      if (sessionStorage.getItem(COOKIE_NOTICE_KEY)) setNotice('sessionCookieUnavailable');
    } else {
      setNotice('sessionRestoreFailed');
    }
    setLoading(false);
  }, [clearSession, installSession]);

  useEffect(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('cached_user');
    if (window.location.pathname === '/auth/callback') {
      setLoading(false);
      return;
    }

    if (sessionStorage.getItem(LOGOUT_PENDING_KEY)) {
      setNotice('sessionLogoutUnconfirmed');
      setLoading(false);
      return;
    }
    const expected = revision.current;
    let mounted = true;
    bootRequest.current ??= apiClient.restoreSession();
    void bootRequest.current.then(result => {
      if (mounted && revision.current === expected) completeRestore(result);
    });
    return () => { mounted = false; };
  }, [completeRestore]);

  const retryRestore = useCallback(() => {
    const expected = ++revision.current;
    setLoading(true);
    void apiClient.restoreSession().then(result => {
      if (revision.current === expected) completeRestore(result);
    });
  }, [completeRestore]);

  const acceptSession = useCallback((data: AuthSession) => {
    ++revision.current;
    logoutBearer.current = undefined;
    sessionStorage.removeItem(COOKIE_NOTICE_KEY);
    sessionStorage.removeItem(LOGOUT_PENDING_KEY);
    clearHomeSectionPreferences(data.user.id);
    clearHomeSectionPreferences();
    const session = installSession(data);
    // Check cookie delivery, since Set-Cookie is not readable from JavaScript.
    session.pending = apiClient.restoreSession().then(result => {
      if (active.current !== session) return;
      const restoredId = result.data && bearerClaims(result.data.token).sid;
      if (result.status !== 401 && (!result.data || restoredId === session.id)) return;
      session.cookieUnavailable = true;
      const exp = bearerClaims(data.token).exp;
      session.deadline = Math.min(session.deadline, exp === undefined ? Date.now() : exp * 1000);
      sessionStorage.setItem(COOKIE_NOTICE_KEY, '1');
      setNotice('sessionCookieUnavailable');
      checkExpiry();
    }).finally(() => { session.pending = null; });
  }, [checkExpiry, installSession]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const connection = new BroadcastChannel('examtopics-session-events');
    channel.current = connection;
    connection.onmessage = ({ data }) => {
      const session = active.current;
      if (!session?.id || session.id !== data?.id || session.cookieUnavailable) return;
      if (data.type === 'logout') {
        clearSession();
      } else if (data.type === 'activity' && Number.isSafeInteger(data.deadline)) {
        session.deadline = Math.max(session.deadline, Math.min(data.deadline, session.absoluteDeadline));
        checkExpiry();
      }
    };
    return () => {
      channel.current = null;
      connection.close();
    };
  }, [checkExpiry, clearSession]);

  useEffect(() => {
    const renewOnActivity = (event: Event) => {
      if (!event.isTrusted || document.visibilityState !== 'visible') return;
      const session = active.current;
      if (!session?.bearer) return;
      const now = Date.now();
      if (now >= session.deadline) {
        checkExpiry();
        return;
      }
      if (session.cookieUnavailable || session.pending || now - session.lastActivityAttempt < ACTIVITY_INTERVAL_MS) return;

      session.lastActivityAttempt = now;
      session.pending = apiClient.recordActivity(session.bearer).then(result => {
        if (active.current !== session || !session.bearer) return;
        if (result.data?.success) {
          session.bearer = result.data.token;
          session.deadline = Math.max(session.deadline, Math.min(result.data.idleExpiresAt, session.absoluteDeadline));
          if (session.id) channel.current?.postMessage({ type: 'activity', id: session.id, deadline: session.deadline });
          checkExpiry();
        } else if (result.status === 401) {
          clearSession();
        }
      }).finally(() => { session.pending = null; });
    };

    window.addEventListener('click', renewOnActivity, true);
    window.addEventListener('keydown', renewOnActivity, true);
    document.addEventListener('visibilitychange', checkExpiry);
    return () => {
      window.clearTimeout(expirationTimer.current);
      window.removeEventListener('click', renewOnActivity, true);
      window.removeEventListener('keydown', renewOnActivity, true);
      document.removeEventListener('visibilitychange', checkExpiry);
    };
  }, [checkExpiry, clearSession]);

  useEffect(() => {
    if (!token) return;
    const refreshUser = async () => {
      const session = active.current;
      const result = await apiClient.getCurrentUser(token);
      if (active.current === session && result.data?.user) setUser(result.data.user);
    };
    window.addEventListener('current-user-changed', refreshUser);
    return () => window.removeEventListener('current-user-changed', refreshUser);
  }, [token]);

  const login = () => {
    void beginGoogleLogin().catch(() => console.error('Unable to start Google sign-in'));
  };

  const logout = () => {
    const expected = ++revision.current;
    logoutBearer.current = active.current?.bearer ?? logoutBearer.current;
    const revokedId = logoutBearer.current && bearerClaims(logoutBearer.current).sid;
    clearSession();
    setLoading(false);
    setNotice(null);
    sessionStorage.removeItem(COOKIE_NOTICE_KEY);
    sessionStorage.setItem(LOGOUT_PENDING_KEY, '1');
    void apiClient.logoutSession(logoutBearer.current).then(result => {
      if (revision.current !== expected) return;
      if (result.data?.success) {
        logoutBearer.current = undefined;
        sessionStorage.removeItem(LOGOUT_PENDING_KEY);
        if (revokedId) channel.current?.postMessage({ type: 'logout', id: revokedId });
      } else {
        setNotice(logoutBearer.current ? 'sessionLogoutFailed' : 'sessionLogoutUnconfirmed');
      }
    });
  };

  return (
    <AuthContext.Provider value={{
      user, token, sessionId, isAuthenticated: !!user, isLoading, notice, login, logout, retryRestore, acceptSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
