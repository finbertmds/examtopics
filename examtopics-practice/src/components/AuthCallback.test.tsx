import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import AuthCallback from './AuthCallback';

function Home() {
  const { token } = useAuth();
  return <output>{token === 'fixture-bearer' ? 'Signed in' : 'Signed out'}</output>;
}

function renderCallback() {
  render(
    <StrictMode>
      <LanguageProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={['/auth/callback']}>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </LanguageProvider>
    </StrictMode>
  );
}

afterEach(() => {
  window.history.replaceState(null, '', '/');
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

it('clears the callback URL before exchanging a code and exchanges only once', async () => {
  window.history.replaceState(null, '', '/auth/callback#code=fixture-code');
  sessionStorage.setItem('oauth_login_verifier', 'fixture-verifier');
  const exchange = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async (input: string, options: RequestInit) => {
    if (new URL(input).pathname === '/auth/exchange') {
      expect(window.location.hash).toBe('');
      expect(sessionStorage.getItem('oauth_login_verifier')).toBeNull();
      exchange(JSON.parse(options.body as string));
      return Response.json({ success: true, token: 'fixture-bearer', user: { id: 'fixture' }, idleExpiresAt: Date.now() + 3600000, absoluteExpiresAt: Date.now() + 3600000 });
    }
    return Response.json({ success: true, token: 'fixture-bearer', user: { id: 'fixture' }, idleExpiresAt: Date.now() + 3600000, absoluteExpiresAt: Date.now() + 3600000 });
  }));

  renderCallback();
  await screen.findByText('Signed in');
  expect(exchange).toHaveBeenCalledExactlyOnceWith({ code: 'fixture-code', verifier: 'fixture-verifier' });
  expect(localStorage.getItem('auth_token')).toBeNull();
});

it('does not accept a legacy bearer from the callback query', async () => {
  window.history.replaceState(null, '', '/auth/callback?token=fixture-bearer');
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);

  renderCallback();
  await screen.findByText('Signed out');
  expect(window.location.search).toBe('');
  expect(fetch).not.toHaveBeenCalled();
});
