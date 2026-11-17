import { act, fireEvent, render, screen } from '@testing-library/react';
import { apiClient } from '../utils/apiClient';
import { AuthProvider, useAuth } from './AuthContext';

const DAY = 24 * 60 * 60;
const now = 1_790_000_000;

function sessionToken(exp: number, sessionExpiresAt = now + 30 * DAY) {
  return `header.${btoa(JSON.stringify({ exp, sessionExpiresAt }))}.signature`;
}

function SessionStatus() {
  const { isAuthenticated, token } = useAuth();
  return <output data-testid="session">{isAuthenticated ? token : 'Signed out'}</output>;
}

function jsonResponse(status: number, body: object) {
  return new Response(JSON.stringify(body), { status });
}

function openSession(token: string) {
  localStorage.setItem('auth_token', token);
  const renewedToken = sessionToken(now + 7 * DAY);
  const refresh = vi.fn(async () => jsonResponse(200, { success: true, token: renewedToken }));
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    const { pathname } = new URL(input);
    if (pathname === '/auth/me') return jsonResponse(200, { success: true, user: { id: 'candidate' } });
    if (pathname === '/auth/refresh') return refresh();
    return jsonResponse(403, { success: false, error: 'Invalid or expired token' });
  }));
  const listeners = vi.spyOn(window, 'addEventListener');
  render(<AuthProvider><SessionStatus /></AuthProvider>);

  // A real browser marks input events trusted. jsdom only exposes script-generated events.
  const activity = (type: string) => {
    for (const [eventType, listener] of listeners.mock.calls) {
      if (eventType === type && typeof listener === 'function') {
        listener.call(window, { type, isTrusted: true } as Event);
      }
    }
  };
  return { refresh, renewedToken, activity };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now * 1000);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('renews in the last day only after foreground user input', async () => {
  const token = sessionToken(now + DAY);
  const { refresh, renewedToken, activity } = openSession(token);
  await act(async () => {});
  await act(() => apiClient.loadAllProgress(token));
  fireEvent.click(window);
  fireEvent(document, new Event('visibilitychange'));
  expect(refresh).not.toHaveBeenCalled();

  await act(async () => activity('click'));
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('session')).toHaveTextContent(renewedToken);
});

it('excludes early tokens from renewal on user activity', async () => {
  const token = sessionToken(now + DAY + 1);
  const { refresh, activity } = openSession(token);
  await act(async () => activity('click'));

  expect(refresh).not.toHaveBeenCalled();
});

it('does not renew a token that already ends at the absolute limit', async () => {
  const deadline = now + DAY;
  const { refresh, activity } = openSession(sessionToken(deadline, deadline));
  await act(async () => activity('keydown'));

  expect(refresh).not.toHaveBeenCalled();
});

it('expires the idle session without a renewal request', async () => {
  const { refresh, activity } = openSession(sessionToken(now + 60));
  await act(async () => {});
  await act(() => vi.advanceTimersByTimeAsync(60_000));

  expect(screen.getByTestId('session')).toHaveTextContent('Signed out');
  expect(localStorage.getItem('auth_token')).toBeNull();
  expect(localStorage.getItem('cached_user')).toBeNull();

  await act(async () => activity('keydown'));
  expect(refresh).not.toHaveBeenCalled();
});

it('ignores a late successful renewal if the token has already changed', async () => {
  const { refresh, activity } = openSession(sessionToken(now + DAY));
  const replacementToken = sessionToken(now + 4 * DAY);
  refresh.mockImplementationOnce(async () => {
    localStorage.setItem('auth_token', replacementToken);
    return jsonResponse(200, { success: true, token: sessionToken(now + 7 * DAY) });
  });

  await act(async () => activity('click'));
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem('auth_token')).toBe(replacementToken);
});

it('uses the renewed token from another tab before the old token expires', async () => {
  const initialToken = sessionToken(now + 60);
  const { renewedToken } = openSession(initialToken);
  await act(async () => {});
  await act(async () => {
    localStorage.setItem('auth_token', renewedToken);
    window.dispatchEvent(new StorageEvent('storage', { key: 'auth_token' }));
  });
  await act(() => vi.advanceTimersByTimeAsync(60_000));

  expect(screen.getByTestId('session')).toHaveTextContent(renewedToken);
});
