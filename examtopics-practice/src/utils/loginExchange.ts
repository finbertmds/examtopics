import type { AuthSession } from '../types';
import { apiClient } from './apiClient';

const verifierKey = 'oauth_login_verifier';

function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function beginGoogleLogin() {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  sessionStorage.setItem(verifierKey, verifier);
  window.location.assign(apiClient.getGoogleAuthUrl(base64Url(new Uint8Array(hash))));
}

export async function finishGoogleLogin(): Promise<AuthSession | undefined> {
  const code = new URLSearchParams(window.location.hash.slice(1)).get('code');
  window.history.replaceState(window.history.state, '', window.location.pathname);

  try {
    const verifier = sessionStorage.getItem(verifierKey);
    sessionStorage.removeItem(verifierKey);
    if (!code || !verifier) return;
    const response = await apiClient.exchangeLoginCode(code, verifier);
    if (response.data?.success) return response.data;
  } catch {
    return;
  }
}
