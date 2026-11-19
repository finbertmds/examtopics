import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Home from './Home';

const exam = {
  code: 'aws-fixture', name: 'Fixture exam', description: 'Practice',
  questionCount: 10, category: 'AWS', difficulty: 'Beginner', estimatedTime: 20, tags: [],
};
const progress = {
  [exam.code]: {
    examId: exam.code,
    answers: { '1-1': { topicNumber: 1, questionNumber: 1, selectedAnswers: ['A'], isCorrect: true, answeredAt: '2026-11-20T00:00:00Z' } },
    markedForTraining: ['1-1'], currentQuestion: 2, isRandomized: false, lastUpdated: '2026-11-20T00:00:00Z',
  },
};

beforeEach(() => {
  localStorage.setItem('language', 'en');
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function start(progressResponse: () => Response, completedIds: string[] = []) {
  let restore!: () => void;
  const session = new Promise<Response>(resolve => {
    restore = () => resolve(Response.json({
      success: true, token: 'home-fixture-token',
      user: { id: 'home-fixture-user', name: 'Fixture', email: 'fixture@example.test' },
      idleExpiresAt: Date.now() + 60_000, absoluteExpiresAt: Date.now() + 120_000,
    }));
  });
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    switch (new URL(input).pathname) {
      case '/auth/session': return session;
      case '/api/exams': return Response.json({ exams: [exam] });
      case '/progress/all': return progressResponse();
      case '/progress/completed-exam-ids': return Response.json({ success: true, examIds: completedIds });
      default: throw new Error(`Unexpected request: ${input}`);
    }
  }));
  render(<StrictMode><LanguageProvider><ThemeProvider><AuthProvider><MemoryRouter><Home /></MemoryRouter></AuthProvider></ThemeProvider></LanguageProvider></StrictMode>);
  return async () => { await act(async () => restore()); };
}

it('displays saved progress after the session is restored on Home', async () => {
  const restore = start(() => Response.json({ success: true, progress }));
  await restore();
  expect(await screen.findByRole('button', { name: /Continue/ })).toBeInTheDocument();
  expect(screen.getByText('10%')).toBeInTheDocument();
  expect(screen.getByText('100% Accuracy')).toBeInTheDocument();
});

it('loads completed exams after the session is restored', async () => {
  const restore = start(() => Response.json({ success: true, progress: {} }), [exam.code]);
  await restore();
  expect(await screen.findByRole('heading', { name: /Completed Exams \(1\)/ })).toBeInTheDocument();
});

it('lets the user retry a failed progress load and displays the recovered progress', async () => {
  let failed = true;
  const restore = start(() => failed
    ? Response.json({ success: false, error: 'Progress temporarily unavailable' }, { status: 503 })
    : Response.json({ success: true, progress }));
  await restore();
  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load progress');
  failed = false;
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByRole('button', { name: /Continue/ })).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
