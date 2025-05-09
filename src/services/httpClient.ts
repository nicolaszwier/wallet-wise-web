import axios from 'axios';
import { localStorageKeys } from '@/app/config/localStorageKeys';
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

httpClient.interceptors.response.use(async data => {
  return data;
});
