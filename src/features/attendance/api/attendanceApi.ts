// src/features/attendance/api/attendanceApi.ts
import { apiClient } from '../../../services/api/client';
import { ENV } from '../../../config/env';

export interface CheckinPayload {
  timestamp: string;
  log_type: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
}

export interface CheckinRecord {
  name: string;
  time: string;
  log_type: 'IN' | 'OUT';
  device_id?: string;
  custom_location_name?: string;
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

export const fetchCheckinHistory = async (userEmail: string, limit = 20): Promise<CheckinRecord[]> => {
  const response = await apiClient.get('/api/resource/Employee Checkin', {
    params: {
      filters: JSON.stringify([
        ['or', [['owner', '=', userEmail], ['user_id', '=', userEmail]]]
      ]),
      fields: JSON.stringify(['name', 'time', 'log_type', 'device_id', 'custom_location_name']),
      order_by: 'time desc',
      limit_page_length: limit,
    },
  });
  return response.data.data;
};