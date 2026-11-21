import { act, renderHook } from '@testing-library/react';
import { useProgress } from './useProgress';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, token: 'completed-fixture' }),
}));

afterEach(() => vi.unstubAllGlobals());

it('derives completed exam IDs from the exam summaries returned by the API', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, exams: [
    { code: 'SAA-C03', name: 'Solutions Architect' },
    { code: 'DVA-C02', name: 'Developer' },
  ] })));
  const { result } = renderHook(() => useProgress());
  let ids: string[] = [];
  await act(async () => { ids = await result.current.getCompletedExamIds(); });
  expect(ids).toEqual(['SAA-C03', 'DVA-C02']);
});
