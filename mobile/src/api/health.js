import { api } from './client';

export async function apiHealthCheck() {
  const { data } = await api.get('/health');
  return data;
}
