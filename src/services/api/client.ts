import axios from 'axios';
import { ENV } from '../../config/env';

export const apiClient = axios.create({
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


export const setBaseUrl = (url: string) => {
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  apiClient.defaults.baseURL = cleanUrl;
};