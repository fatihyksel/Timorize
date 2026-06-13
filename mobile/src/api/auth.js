import { api } from './client';
import { setToken, clearToken } from '../storage/token';
import { clearUserId } from '../storage/user';

export async function apiLogin(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (data.token) {
    await setToken(data.token);
  }
  return data;
}

export async function apiRegister(name, email, password) {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function apiLogout() {
  try {
    await api.post('/api/auth/logout');
  } finally {
    await clearToken();
  }
}

export async function apiDeleteUser(userId) {
  await api.delete(`/api/users/${encodeURIComponent(userId)}`);
  await clearToken();
  await clearUserId();
}
