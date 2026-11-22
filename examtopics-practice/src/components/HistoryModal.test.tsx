import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../contexts/LanguageContext';
import HistoryModal from './HistoryModal';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, token: 'history-fixture' }),
}));

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

it.each([
  ['en', 'Solutions Architect', 'Statistics'],
  ['vi', 'Kiến trúc sư giải pháp', 'Thống kê'],
])('shows exam codes and localized names in the statistics options (%s)', async (language, name, tab) => {
  localStorage.setItem('language', language);
  const requests: string[] = [];
  let completeStats!: (response: Response) => void;
  const statsResponse = new Promise<Response>(resolve => { completeStats = resolve; });
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    requests.push(new URL(input).pathname);
    switch (new URL(input).pathname) {
      case '/progress/history': return Response.json({ success: true, history: [] });
      case '/progress/completed-exam-ids': return Response.json({ success: true, exams: [{ code: 'SAA-C03', name: { en: 'Solutions Architect', vi: 'Kiến trúc sư giải pháp', ja: 'ソリューションアーキテクト' } }, { code: 'missing-exam', name: 'missing-exam' }] });
      case '/progress/stats/SAA-C03': return statsResponse;
      default: throw new Error(`Unexpected request: ${input}`);
    }
  }));
  render(<LanguageProvider><MemoryRouter><HistoryModal isOpen onClose={() => {}} /></MemoryRouter></LanguageProvider>);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(tab) }));
  // The options can render before the stats effect reaches fetch. Finish the
  // deferred response before assertions/teardown so requests cannot leak tests.
  await waitFor(() => expect(requests).toContain('/progress/stats/SAA-C03'));
  completeStats(Response.json({ success: true, stats: { totalSubmissions: 7 } }));
  expect(await screen.findByText('7')).toBeInTheDocument();
  expect(await screen.findByRole('option', { name: `SAA-C03 — ${name}` })).toHaveValue('SAA-C03');
  expect(screen.getByRole('option', { name: 'missing-exam' })).toHaveValue('missing-exam');
  expect(requests.sort()).toEqual(['/progress/completed-exam-ids', '/progress/history', '/progress/stats/SAA-C03']);
});

it('uses the embedded history exam name and navigates without fetching the exam catalog', async () => {
  localStorage.setItem('language', 'en');
  const requests: string[] = [];
  const onClose = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    const path = new URL(input).pathname;
    requests.push(path);
    if (path === '/progress/history') return Response.json({ success: true, history: [{
      _id: 'history-1', examId: 'SAA-C03', exam: { code: 'SAA-C03', name: 'Solutions Architect' },
      progress: {}, markedForTraining: [], answeredCount: 1,
      score: { totalQuestions: 1, correctAnswers: 1, accuracy: 100 }, submittedAt: '2026-11-21T00:00:00Z',
    }] });
    if (path === '/progress/completed-exam-ids') return Response.json({ success: true, exams: [] });
    throw new Error(`Unexpected request: ${path}`);
  }));
  render(<LanguageProvider><MemoryRouter><HistoryModal isOpen onClose={onClose} /></MemoryRouter></LanguageProvider>);
  fireEvent.click(await screen.findByRole('button', { name: 'SAA-C03 — Solutions Architect' }));
  expect(onClose).toHaveBeenCalledOnce();
  expect(requests.sort()).toEqual(['/progress/completed-exam-ids', '/progress/history']);
});
