import { act, renderHook } from '@testing-library/react';
import { useQuestions } from './useQuestions';

const item = (number: number) => ({ question_number: number, question_text: 'Fixture' });
const page = (number: number, revision = 'fixture:1') => Response.json({
  data: [item(number)],
  pagination: { page: number, totalPages: 2, revision },
});

afterEach(() => vi.unstubAllGlobals());

it('loads all pages in order without requesting an unbounded response', async () => {
  const fetch = vi.fn().mockImplementationOnce(() => page(1)).mockImplementationOnce(() => page(2));
  vi.stubGlobal('fetch', fetch);
  const { result } = renderHook(() => useQuestions('fixture-exam', undefined));
  await act(() => result.current.loadQuestions());

  const calls = fetch.mock.calls.map(([url]) => new URL(url).searchParams);
  expect(calls.map((params) => [params.get('page'), params.get('limit')])).toEqual([['1', '100'], ['2', '100']]);
  expect(result.current.questions.map((question) => question.question_number)).toEqual([1, 2]);
});

it('does not display an exam assembled from different revisions', async () => {
  vi.stubGlobal('fetch', vi.fn().mockImplementationOnce(() => page(1)).mockImplementationOnce(() => page(2, 'fixture:2')));
  const { result } = renderHook(() => useQuestions('fixture-exam', undefined));
  await act(() => result.current.loadQuestions());

  expect(result.current.questions).toEqual([]);
  expect(result.current.error).toBeTruthy();
});

it('clears the previous exam and ignores its late response after the route changes', async () => {
  let finishPrevious!: (response: Response) => void;
  const previous = new Promise<Response>(resolve => { finishPrevious = resolve; });
  const fetch = vi.fn()
    .mockReturnValueOnce(previous)
    .mockResolvedValueOnce(Response.json({
      data: [item(2)],
      pagination: { page: 1, totalPages: 1, revision: 'new:1' },
    }));
  vi.stubGlobal('fetch', fetch);
  const { result, rerender } = renderHook(({ code }) => useQuestions(code), { initialProps: { code: 'old' } });
  let oldLoad!: Promise<void>;
  act(() => { oldLoad = result.current.loadQuestions(); });
  rerender({ code: 'new' });
  expect(result.current.questions).toEqual([]);

  await act(() => result.current.loadQuestions());
  finishPrevious(Response.json({ data: [item(1)], pagination: { page: 1, totalPages: 1, revision: 'old:1' } }));
  await act(() => oldLoad);

  expect(result.current.questions.map((question) => question.question_number)).toEqual([2]);
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
});
