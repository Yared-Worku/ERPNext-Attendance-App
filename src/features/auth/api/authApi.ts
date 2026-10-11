import { apiClient, setBaseUrl } from '../../../services/api/client';
import { ENV } from '../../../config/env';

export interface LoginPayload {
  baseUrl: string;
  usr: string;
  pwd: string;
}

export const loginApi = async ({ baseUrl, usr, pwd }: LoginPayload) => {
  setBaseUrl(baseUrl);
  const response = await apiClient.post(ENV.ENDPOINTS.LOGIN, { usr, pwd });
  return response.data;
};