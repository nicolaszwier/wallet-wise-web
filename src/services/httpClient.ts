import axios from 'axios';
import { localStorageKeys } from '@/app/config/localStorageKeys';
import { analytics } from '@/app/analytics/track';
import { errorTypeFromStatus, sanitizeEndpoint } from '@/app/analytics/sanitizeEndpoint';
import i18next from 'i18next';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use(async config => {
  const accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers['Accept-Language'] = i18next.language;

  return config;
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const requestUrl = error.config?.url;
      const baseURL = error.config?.baseURL ?? '';
      const fullPath = requestUrl
        ? `${baseURL.replace(/\/$/, '')}/${requestUrl.replace(/^\//, '')}`
        : undefined;

      analytics.apiError(
        sanitizeEndpoint(fullPath),
        status,
        errorTypeFromStatus(status),
      );
    }

    return Promise.reject(error);
  },
);
