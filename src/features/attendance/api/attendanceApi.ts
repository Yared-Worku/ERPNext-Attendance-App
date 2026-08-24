
import { apiClient } from '../../../services/api/client';
import { ENV } from '../../../config/env';

export interface CheckinPayload {
  timestamp: string;
  log_type: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
}

export const postEmployeeCheckin = async (payload: CheckinPayload) => {
  const response = await apiClient.post(ENV.ENDPOINTS.CHECKIN, {
    log_type: payload.log_type,
    time: payload.timestamp,
    latitude: payload.latitude,
    longitude: payload.longitude,
  });
  return response.data;
};