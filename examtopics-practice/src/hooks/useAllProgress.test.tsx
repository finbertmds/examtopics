import { act, renderHook, waitFor } from '@testing-library/react';
import { useAllProgress } from './useAllProgress';

const auth = vi.hoisted(() => ({ isAuthenticated: true, token: 'fixture-session' as string | null }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => auth }));

const progress = { fixture: {
  examId: 'fixture', answers: { '1-1': { isCorrect: true, answeredAt: '2026-11-20T00:00:00Z' } },
  markedForTraining: [], currentQuestion: 2, isRandomized: false, lastUpdated: '2026-11-20T00:00:00Z',
} };

afterEach(() => {
  auth.isAuthenticated = true;
  auth.token = 'fixture-session';
  vi.unstubAllGlobals();
});

it('clears the progress shown on Home when the user signs out', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, progress })));
  const { result, rerender } = renderHook(() => useAllProgress());
  await waitFor(() => expect(result.current.getProgressStats('fixture')?.totalAnswers).toBe(1));
  auth.isAuthenticated = false;
  auth.token = null;
  rerender();
  expect(result.current.getProgressStats('fixture')).toBeNull();
});

it('ignores a late response from the previous session', async () => {
  let finish!: (response: Response) => void;
  vi.stubGlobal('fetch', vi.fn()
    .mockImplementationOnce(() => new Promise<Response>(resolve => { finish = resolve; }))
    .mockResolvedValueOnce(Response.json({ success: true, progress: {} })));
  const { result, rerender } = renderHook(() => useAllProgress());
  await waitFor(() => expect(finish).toBeDefined());
  auth.token = 'new-session';
  rerender();
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await act(async () => { finish(Response.json({ success: true, progress })); });
  expect(result.current.allProgress).toEqual({});
});
