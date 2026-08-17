export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.53.19.40:8000';
export const API_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS) || 10000;

export const API_ENDPOINTS = {
  RECORD_ATTENDANCE: `${API_BASE_URL}/api/method/attendance.api.record_log`,
  LOGIN: `${API_BASE_URL}/api/method/login`,
};