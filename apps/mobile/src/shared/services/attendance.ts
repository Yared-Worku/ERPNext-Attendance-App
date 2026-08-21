import { API_TIMEOUT_MS } from '../constants/config';
import { getSavedSession } from './auth';

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
  // 1. Fetch saved server URL dynamically
  const { serverUrl } = await getSavedSession();
  const endpoint = `${serverUrl}/api/method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'development.localhost', // Frappe site routing header
      },
      credentials: 'include',
      body: JSON.stringify({
        log_type: payload.logType,
        latitude: payload.latitude,
        longitude: payload.longitude,
        time: payload.timestamp,
        device_id: 'Expo Mobile App',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();

    // Prevent HTML parse errors
    if (responseText.trim().startsWith('<')) {
      throw new Error('Server returned HTML page. Check bench site configuration.');
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      const serverMsg = data.exception || data.message || `Server responded with status ${response.status}`;
      throw new Error(serverMsg);
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Preserve offline trigger on network drops or timeouts
    if (error.name === 'AbortError' || error.message === 'Network request failed') {
      throw new Error('Network request failed. Saved to offline queue.');
    }

    throw error;
  }
}

export async function getAttendanceHistory(): Promise<AttendanceLog[]> {
  const { serverUrl } = await getSavedSession();
  const endpoint = `${serverUrl}/api/method/hrms.hr.doctype.employee_checkin.employee_checkin.get_checkin_history`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'development.localhost',
      },
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();

    if (responseText.trim().startsWith('<')) {
      throw new Error('Server returned HTML page instead of JSON.');
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(data.message || `Server responded with status ${response.status}`);
    }

    return data.message || [];
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}