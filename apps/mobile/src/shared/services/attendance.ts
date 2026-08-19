import { API_ENDPOINTS, API_TIMEOUT_MS, API_BASE_URL } from '../constants/config';

export interface AttendancePayload {
  logType: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface AttendanceLog {
  id: string;
  logType: 'IN' | 'OUT';
  timestamp: string;
  status: 'Success' | 'Pending' | 'Rejected';
  location?: string;
}

export async function postAttendance(payload: AttendancePayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(API_ENDPOINTS.RECORD_ATTENDANCE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
    // Re-throw the error so useAttendance catches it and saves to SQLite
    throw new Error('Network request failed. Saved to offline queue.');
  }
  // catch (error: any) {
  //   clearTimeout(timeoutId);

  //   if (__DEV__) {
  //     console.warn('ERPNext endpoint unavailable. Returning Mock response.');
  //     await new Promise((resolve) => setTimeout(resolve, 800));
  //     return { status: 'success', message: `Mock ${payload.logType} logged` };
  //   }

  //   throw error;
  // }
}

export async function getAttendanceHistory(): Promise<AttendanceLog[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/method/attendance.api.get_logs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.message || data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (__DEV__) {
      console.warn('ERPNext endpoint unavailable. Returning Mock History.');
      await new Promise((resolve) => setTimeout(resolve, 600));
      const now = Date.now();
      return [
        {
          id: '1',
          logType: 'IN',
          timestamp: new Date(now - 3600000 * 2).toISOString(),
          status: 'Success',
          location: 'Main Office',
        },
        {
          id: '2',
          logType: 'OUT',
          timestamp: new Date(now - 3600000 * 9).toISOString(),
          status: 'Success',
          location: 'Main Office',
        },
        {
          id: '3',
          logType: 'IN',
          timestamp: new Date(now - 3600000 * 26).toISOString(),
          status: 'Success',
          location: 'Main Office',
        },
        {
          id: '4',
          logType: 'OUT',
          timestamp: new Date(now - 3600000 * 34).toISOString(),
          status: 'Success',
          location: 'Main Office',
        },
      ];
    }

    throw error;
  }
}