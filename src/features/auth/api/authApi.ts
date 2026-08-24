// src/features/auth/api/authApi.ts
import { apiClient, setBaseUrl } from '../../../services/api/client';

export interface LoginParams {
  baseUrl: string;
  usr: string;
  pwd: string;
}

export const loginToFrappe = async ({ baseUrl, usr, pwd }: LoginParams) => {
  setBaseUrl(baseUrl);

  const response = await apiClient.post('/api/method/login', {
    usr,
    pwd,
  });

  // Frappe returns { message: "Logged In", home_page: "..." } on success
  return response.data;
};