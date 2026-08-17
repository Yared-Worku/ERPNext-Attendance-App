export interface AttendancePayload {
  logType: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
  timestamp: string;
}

const API_BASE_URL = 'http://10.53.19.40:8000';

export async function postAttendance(payload: AttendancePayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const response = await fetch(`${API_BASE_URL}/api/method/attendance.api.record_log`, {
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