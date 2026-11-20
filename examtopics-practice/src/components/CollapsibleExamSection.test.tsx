import { fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import CollapsibleExamSection from './CollapsibleExamSection';
import { forceCleanupLegacyCache } from '../utils/legacyCacheCleanup';

beforeEach(() => localStorage.setItem('language', 'en'));
afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

function section(userId: string | null = 'alice', sectionId: 'progress' | 'completed' | 'available' = 'progress', sessionId = 'session-a') {
  return <LanguageProvider><CollapsibleExamSection userId={userId ?? undefined} sessionId={sessionId} sectionId={sectionId} title="Exams in Progress (1)">
    <p>Saved exam</p>
  </CollapsibleExamSection></LanguageProvider>;
}

it('collapses and expands the exam list while keeping its heading visible', () => {
  render(section());
  const collapse = screen.getByRole('button', { name: /Collapse Exams in Progress/ });
  expect(collapse).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(collapse);
  expect(screen.getByText('Saved exam')).not.toBeVisible();
  expect(screen.getByRole('heading', { name: 'Exams in Progress (1)' })).toBeVisible();
  const expand = screen.getByRole('button', { name: /Expand Exams in Progress/ });
  expect(expand).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(expand);
  expect(screen.getByText('Saved exam')).toBeVisible();
});

it('keeps the collapsed state across repeated reload-loop cache cleanup', async () => {
  let view = render(section());
  fireEvent.click(screen.getByRole('button', { name: /Collapse/ }));
  for (let reload = 0; reload < 3; reload++) {
    view.unmount();
    localStorage.setItem('exam-progress', 'obsolete cache');
    await forceCleanupLegacyCache();
    expect(localStorage.getItem('exam-progress')).toBeNull();
    view = render(section());
    expect(screen.getByText('Saved exam')).not.toBeVisible();
  }
});

it('starts expanded when the same user gets a new session', () => {
  const view = render(section());
  fireEvent.click(screen.getByRole('button', { name: /Collapse/ }));
  view.rerender(section('alice', 'progress', 'session-b'));
  expect(screen.getByText('Saved exam')).toBeVisible();
});

it('restores each user’s preference and keeps section and guest preferences separate', () => {
  const view = render(section());
  fireEvent.click(screen.getByRole('button', { name: /Collapse/ }));
  view.rerender(section('bob'));
  expect(screen.getByText('Saved exam')).toBeVisible();
  view.rerender(section(null));
  expect(screen.getByText('Saved exam')).toBeVisible();
  view.rerender(section('alice', 'completed'));
  expect(screen.getByText('Saved exam')).toBeVisible();
  view.rerender(section('alice', 'available'));
  expect(screen.getByText('Saved exam')).toBeVisible();
  view.unmount();
  const restored = render(section());
  expect(screen.getByText('Saved exam')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /Expand/ }));
  restored.unmount();
  render(section());
  expect(screen.getByText('Saved exam')).toBeVisible();
});

it('still toggles when browser storage is unavailable', () => {
  const getItem = Storage.prototype.getItem;
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
    if (key.startsWith('examtopics:home-sections:')) throw new Error('Storage blocked');
    return getItem.call(this, key);
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage full'); });
  render(section());
  fireEvent.click(screen.getByRole('button', { name: /Collapse/ }));
  expect(screen.getByText('Saved exam')).not.toBeVisible();
});
