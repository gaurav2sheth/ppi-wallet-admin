import axios from 'axios';
import type { ApiError } from '../types/api.types';

const RENDER_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = RENDER_URL ? `${RENDER_URL}/api` : 'http://localhost:3000/v1';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: RENDER_URL ? 15000 : 3000,
  headers: { 'Content-Type': 'application/json' },
});

export let apiReachable = false;

const healthUrl = RENDER_URL ? `${RENDER_URL}/health` : '/health';
api.get(healthUrl)
  .then(() => { apiReachable = true; console.info(`[admin] backend OK at ${API_BASE}`); })
  .catch(() => { apiReachable = false; console.info('[admin] backend unavailable — using mock data'); });

api.interceptors.response.use(
  (res) => { apiReachable = true; return res.data; },
  (err) => {
    if (!err.response) apiReachable = false;
    const apiError: ApiError = {
      code: err.response?.data?.code ?? 'NETWORK_ERROR',
      message: err.response?.data?.message ?? 'Network error',
      statusCode: err.response?.status ?? 0,
    };
    return Promise.reject(apiError);
  },
);

export function isBackendConfigured(): boolean {
  return Boolean(RENDER_URL);
}

export function getApiBase(): string {
  return API_BASE;
}
