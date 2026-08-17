import { API_ENDPOINTS, API_TIMEOUT_MS } from '../constants/config';

export interface AttendancePayload {
  logType: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
  timestamp: string;
}

export async function postAttendance(payload: AttendancePayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(API_ENDPOINTS.RECORD_ATTENDANCE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        log_type: payload.logType,
        latitude: payload.latitude,
        longitude: payload.longitude,
        time: payload.timestamp,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Ensure the backend server is running on port 8000.');
    }
    throw error;
  }
}