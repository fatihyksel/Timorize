import { api } from './client';

export async function apiListTimeLogs() {
  const { data } = await api.get('/api/timers/logs');
  return data;
}

export async function apiCreateTimeLog(taskName, durationInMinutes) {
  const { data } = await api.post('/api/timers', { taskName, durationInMinutes });
  return data;
}

export async function apiDeleteTimeLog(logId) {
  await api.delete(`/api/timers/logs/${encodeURIComponent(logId)}`);
}
