import { act, fireEvent, render, screen } from '@testing-library/react';
import { apiClient } from '../utils/apiClient';
import { AuthProvider, useAuth } from './AuthContext';
import { LanguageProvider } from './LanguageContext';
import CollapsibleExamSection from '../components/CollapsibleExamSection';

const now = 1_790_000_000_000;
const day = 86_400_000;
const fixture = {
  token: 'access-token', user: { id: 'candidate' },
  idleExpiresAt: now + day, absoluteExpiresAt: now + 30 * day,
};

const fallbackBearer = `fixture.${btoa(JSON.stringify({ exp: now / 1000 + 600, sid: 'fixture-session' }))}.fixture`;

function SessionStatus() {
  const { isAuthenticated, token, user, sessionId, logout, notice, acceptSession } = useAuth();
  return <>
    <output>{isAuthenticated ? token : 'Signed out'}</output>
    <span>{notice}</span>
    <LanguageProvider>
      <CollapsibleExamSection userId={user?.id} sessionId={sessionId} sectionId="available" title="Available Exams">
        <p>Available fixture</p>
      </CollapsibleExamSection>
    </LanguageProvider>
    <button onClick={logout}>Sign out</button>
    <button onClick={() => acceptSession({ ...fixture, token: fallbackBearer, user: { id: 'candidate', email: 'fixture@example.test', name: 'Fixture' } })}>
      Accept fixture exchange
    </button>
  </>;

}

function start(fetch: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetch);
  const listeners = vi.spyOn(window, 'addEventListener');
  const app = render(<AuthProvider><SessionStatus /></AuthProvider>);
  const activity = () => {
    const listener = listeners.mock.calls.findLast(([name]) => name === 'click')?.[1];
    if (typeof listener === 'function') listener.call(window, { isTrusted: true } as Event);
  };
  return { ...app, activity };
}

function path(input: string) {
  return new URL(input).pathname;
}

beforeEach(() => {
  localStorage.setItem('language', 'en');
  vi.useFakeTimers();
  vi.setSystemTime(now);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

it.each(['logout', 'expiry'])('resets Home section preferences after %s and a new login', async reason => {
  const fetch = vi.fn(async () => Response.json({ success: true, ...fixture, idleExpiresAt: now + 60_000 }));
  start(fetch);
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: /Collapse Available Exams/ }));
  expect(screen.getByText('Available fixture')).not.toBeVisible();
  if (reason === 'logout') {
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign out' })); });
  } else {
    await act(() => vi.advanceTimersByTimeAsync(60_000));
  }
  expect(screen.getByText('Signed out')).toBeInTheDocument();
  expect(screen.getByText('Available fixture')).toBeVisible();
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Accept fixture exchange' })); });
  expect(screen.getByText('Available fixture')).toBeVisible();
});

it('preserves Home section preferences across restores and activity token renewal', async () => {
  let currentToken = fallbackBearer;
  const fetch = vi.fn(async () => Response.json({ success: true, ...fixture, token: currentToken }));
  const first = start(fetch);
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: /Collapse Available Exams/ }));
  first.unmount();
  currentToken = `fixture.${btoa(JSON.stringify({ exp: now / 1000 + 900, sid: 'fixture-session' }))}.renewed`;
  const restored = start(fetch);
  await act(async () => {});
  expect(screen.getByText('Available fixture')).not.toBeVisible();
  await act(async () => restored.activity());
  expect(screen.getByText('Available fixture')).not.toBeVisible();
});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('restores on reload without registering activity or persisting the bearer', async () => {
  localStorage.setItem('auth_token', 'old-credential');
  const fetch = vi.fn(async (_input: string, _options: RequestInit) => Response.json({ success: true, ...fixture }));
  const first = start(fetch);
  await act(async () => {});
  expect(screen.getByText(fixture.token)).toBeInTheDocument();
  fireEvent.click(window);
  fireEvent(document, new Event('visibilitychange'));
  first.unmount();

  render(<AuthProvider><SessionStatus /></AuthProvider>);
  await act(async () => {});
  expect(screen.getByText(fixture.token)).toBeInTheDocument();
  expect(fetch.mock.calls.map(([url]) => path(url))).toEqual(['/auth/session', '/auth/session']);
  expect(fetch.mock.calls[0][1]).toMatchObject({ credentials: 'include' });
  expect(localStorage.getItem('auth_token')).toBeNull();
});

it('waits for genuine activity renewal before making an authenticated request', async () => {
  const renew = { ...fixture, token: 'replacement-token' };
  let resolveActivity!: (response: Response) => void;
  const pending = new Promise<Response>(resolve => { resolveActivity = resolve; });
  const fetch = vi.fn(async (input: string, _options: RequestInit) => {
    if (path(input) === '/auth/activity') return pending;
    if (path(input) === '/auth/session') return Response.json({ success: true, ...fixture });
    return Response.json({ success: true });
  });
  const { activity } = start(fetch);
  await act(async () => {});
  let request!: ReturnType<typeof apiClient.loadAllProgress>;
  act(() => {
    activity();
    request = apiClient.loadAllProgress(fixture.token);
  });
  await act(async () => {});
  expect(fetch.mock.calls.map(([url]) => path(url))).toEqual(['/auth/session', '/auth/activity']);

  await act(async () => {
    resolveActivity(Response.json({ success: true, ...renew }));
    await request;
  });
  const requestOptions = fetch.mock.calls.at(-1)![1] as RequestInit;
  expect(new Headers(requestOptions.headers).get('Authorization')).toBe('Bearer replacement-token');
  expect(screen.getByText(fixture.token)).toBeInTheDocument();
});

it('signs out at the idle deadline without a background renewal', async () => {
  const fetch = vi.fn(async () => Response.json({ success: true, ...fixture, idleExpiresAt: now + 60_000 }));
  start(fetch);
  await act(async () => {});
  await act(() => vi.advanceTimersByTimeAsync(60_000));
  expect(screen.getByText('Signed out')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('ignores a late restore after logout', async () => {
  let resolveRestore!: (response: Response) => void;
  const pending = new Promise<Response>(resolve => { resolveRestore = resolve; });
  const fetch = vi.fn(async (input: string) => path(input) === '/auth/session' ? pending : Response.json({ success: true }));
  start(fetch);

  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign out' })); });
  await act(async () => { resolveRestore(Response.json({ success: true, ...fixture })); });

  expect(screen.getByText('Signed out')).toBeInTheDocument();
  expect(fetch.mock.calls.map(([url]) => path(url))).toEqual(['/auth/session', '/auth/logout']);
});

it('keeps a blocked-cookie session in memory and retries logout with its bearer', async () => {
  const logout = vi.fn()
    .mockResolvedValueOnce(Response.json({ success: false }, { status: 503 }))
    .mockResolvedValueOnce(Response.json({ success: true }));
  const fetch = vi.fn(async (input: string, options: RequestInit) => {
    if (path(input) === '/auth/logout') return logout(new Headers(options.headers).get('Authorization'));
    return Response.json({ success: false }, { status: 401 });
  });
  const { activity } = start(fetch);
  await act(async () => {});
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Accept fixture exchange' })); });
  expect(screen.getByText('sessionCookieUnavailable')).toBeInTheDocument();
  expect(screen.getByText(fallbackBearer)).toBeInTheDocument();
  await act(async () => activity());
  expect(fetch.mock.calls.map(([url]) => path(url))).not.toContain('/auth/activity');

  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign out' })); });
  expect(screen.getByText('sessionLogoutFailed')).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign out' })); });
  expect(logout.mock.calls).toEqual([[ `Bearer ${fallbackBearer}` ], [ `Bearer ${fallbackBearer}` ]]);
  expect(screen.getByText('Signed out')).toBeInTheDocument();
});

it('does not restore or revoke a potentially different cookie session after an unconfirmed logout and reload', async () => {
  sessionStorage.setItem('examtopics-logout-pending', '1');
  const fetch = vi.fn();
  start(fetch);
  await act(async () => {});

  expect(screen.getByText('Signed out')).toBeInTheDocument();
  expect(screen.getByText('sessionLogoutUnconfirmed')).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
