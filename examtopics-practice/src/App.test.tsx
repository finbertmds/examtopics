import { StrictMode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.setItem('language', 'en');
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
});

afterEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

function start(progressResponse = () => Promise.resolve(Response.json({ success: true, progress: {} }))) {
  const requests: { path: string; authorization: string | null }[] = [];
  let finishRestore!: (response: Response) => void;
  const restore = new Promise<Response>(resolve => { finishRestore = resolve; });
  vi.stubGlobal('fetch', vi.fn(async (input: string, options: RequestInit = {}) => {
    const path = new URL(input).pathname;
    requests.push({ path, authorization: new Headers(options.headers).get('Authorization') });
    switch (path) {
      case '/auth/exchange': return Response.json({
        success: true, token: 'restored-app-token',
        user: { id: 'app-user', email: 'fixture@example.test', name: 'Fixture' },
        idleExpiresAt: Date.now() + 60_000, absoluteExpiresAt: Date.now() + 120_000,
      });
      case '/auth/session': return restore;
      case '/api/exams': return Response.json({ exams: [] });
      case '/api/exams/me/created': return Response.json({ exams: [] });
      case '/api/exams/metadata/info': return Response.json({ categories: [], tags: [] });
      case '/progress/all': return progressResponse();
      case '/progress/completed-exam-ids': return Response.json({ success: true, exams: [] });
      default: throw new Error(`Unexpected request: ${path}`);
    }
  }));
  render(<StrictMode><App /></StrictMode>);
  return { requests, finishRestore };
}

it.each(['/', '/exam/fixture'])('waits for session restoration before mounting route %s', async path => {
  window.history.replaceState({}, '', path);
  const { requests } = start();
  await act(async () => {});
  expect(requests.map(request => request.path)).toEqual(['/auth/session']);
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
});

it('navigates to the exam management page from the user menu', async () => {
  const { finishRestore } = start();
  await act(async () => {
    finishRestore(Response.json({
      success: true, token: 'restored-app-token',
      user: { id: 'app-user', email: 'fixture@example.test', name: 'Fixture' },
      idleExpiresAt: Date.now() + 60_000, absoluteExpiresAt: Date.now() + 120_000,
    }));
  });

  fireEvent.click(await screen.findByRole('button', { name: 'User menu' }));
  fireEvent.click(await screen.findByRole('button', { name: /Manage Exams/ }));

  await waitFor(() => expect(window.location.pathname).toBe('/create-exam'));
  expect(await screen.findByRole('heading', { name: 'Manage Exams' })).toBeInTheDocument();
});

it('loads exams and progress with the restored session after auth/session finishes', async () => {
  const { requests, finishRestore } = start();
  await act(async () => {
    finishRestore(Response.json({
      success: true, token: 'restored-app-token',
      user: { id: 'app-user', email: 'fixture@example.test', name: 'Fixture' },
      idleExpiresAt: Date.now() + 60_000, absoluteExpiresAt: Date.now() + 120_000,
    }));
  });
  await waitFor(() => expect(requests).toHaveLength(4));
  expect(requests[0].path).toBe('/auth/session');
  expect(requests.slice(1).map(request => request.path).sort()).toEqual([
    '/api/exams', '/progress/all', '/progress/completed-exam-ids',
  ]);
  expect(requests.slice(1).map(request => request.authorization)).toEqual([
    'Bearer restored-app-token', 'Bearer restored-app-token', 'Bearer restored-app-token',
  ]);
  expect(await screen.findByRole('heading', { name: /Exam Practice Platform/ })).toBeInTheDocument();
});

it('loads public exams after auth/session confirms there is no session', async () => {
  const { requests, finishRestore } = start();
  await act(async () => { finishRestore(Response.json({ success: false }, { status: 401 })); });
  await waitFor(() => expect(requests).toEqual([
    { path: '/auth/session', authorization: null },
    { path: '/api/exams', authorization: null },
  ]));
  expect(await screen.findByRole('heading', { name: /Exam Practice Platform/ })).toBeInTheDocument();
});

it.each([true, false])('waits for progress/all to settle before requesting all exams (success: %s)', async success => {
  let finishProgress!: (response: Response) => void;
  const progress = new Promise<Response>(resolve => { finishProgress = resolve; });
  const { requests, finishRestore } = start(() => progress);
  await act(async () => {
    finishRestore(Response.json({
      success: true, token: 'restored-app-token',
      user: { id: 'app-user', email: 'fixture@example.test', name: 'Fixture' },
      idleExpiresAt: Date.now() + 60_000, absoluteExpiresAt: Date.now() + 120_000,
    }));
  });
  await waitFor(() => expect(requests.some(request => request.path === '/progress/all')).toBe(true));
  expect(requests.some(request => request.path === '/api/exams')).toBe(false);
  await act(async () => {
    finishProgress(Response.json(success ? { success: true, progress: {} } : { success: false, error: 'Unavailable' }));
  });
  await waitFor(() => expect(requests.filter(request => request.path === '/api/exams')).toHaveLength(1));
  expect(await screen.findByRole('heading', { name: /Exam Practice Platform/ })).toBeInTheDocument();
  if (!success) expect(screen.getByRole('alert')).toHaveTextContent('Unable to load progress');
});

it('allows the OAuth callback to exchange its code before checking the session', async () => {
  window.history.replaceState({}, '', '/auth/callback#code=fixture-code');
  sessionStorage.setItem('oauth_login_verifier', 'fixture-verifier');
  const { requests, finishRestore } = start();
  await waitFor(() => expect(requests.map(request => request.path)).toEqual(['/auth/exchange', '/auth/session']));
  await act(async () => {
    finishRestore(Response.json({
      success: true, token: 'restored-app-token',
      user: { id: 'app-user', email: 'fixture@example.test', name: 'Fixture' },
      idleExpiresAt: Date.now() + 60_000, absoluteExpiresAt: Date.now() + 120_000,
    }));
  });
  expect(await screen.findByRole('heading', { name: /Exam Practice Platform/ })).toBeInTheDocument();
  await waitFor(() => expect(requests.some(request => request.path === '/api/exams')).toBe(true));
});
