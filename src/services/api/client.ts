// src/services/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

export const setBaseUrl = (url: string) => {
  // Trim trailing slashes for clean endpoint concatenation
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  apiClient.defaults.baseURL = cleanUrl;
};