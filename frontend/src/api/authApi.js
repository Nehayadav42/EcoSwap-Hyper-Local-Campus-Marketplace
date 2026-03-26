import { apiFetch } from './apiClient';
import { getToken } from '../auth/session';

async function register(email, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

async function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

async function verify(email, code) {
  return apiFetch('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  });
}

async function resend(email) {
  return apiFetch('/api/auth/resend', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

async function me() {
  const token = getToken();
  return apiFetch('/api/auth/me', { token });
}

export { register, login, verify, resend, me };

