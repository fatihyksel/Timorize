const TOKEN_KEY = 'timorize_token';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}


export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Giriş başarısız');
  return data;
}

export async function apiRegister(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Kayıt başarısız');
  return data;
}

function authHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiListTimeLogs() {
  const res = await fetch(`${API_BASE_URL}/api/timers/logs`, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Kayıtlar alınamadı');
  return data;
}

export async function apiCreateTimeLog(taskName, durationInMinutes) {
  const res = await fetch(`${API_BASE_URL}/api/timers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ taskName, durationInMinutes }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Kayıt oluşturulamadı');
  return data;
}

export async function apiDeleteTimeLog(logId) {
  const res = await fetch(`${API_BASE_URL}/api/timers/logs/${encodeURIComponent(logId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Silinemedi');
  }
}

export async function apiDeleteUser(userId) {
  const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Hesap silinemedi');
  }
  return true;
}