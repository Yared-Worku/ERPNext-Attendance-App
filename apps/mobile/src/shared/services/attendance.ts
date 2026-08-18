// import { API_ENDPOINTS, API_TIMEOUT_MS } from '../constants/config';

// export interface AttendancePayload {
//   logType: 'IN' | 'OUT';
//   latitude: number;
//   longitude: number;
//   timestamp: string;
// }

// export async function postAttendance(payload: AttendancePayload) {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

//   try {
//     const response = await fetch(API_ENDPOINTS.RECORD_ATTENDANCE, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // Includes ERPNext session cookie (sid)
//       body: JSON.stringify({
//         log_type: payload.logType,
//         latitude: payload.latitude,
//         longitude: payload.longitude,
//         time: payload.timestamp,
//       }),
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `Server responded with status ${response.status}`);
//     }

//     return await response.json();
//   } catch (error: any) {
//     clearTimeout(timeoutId);
//     if (error.name === 'AbortError') {
//       throw new Error('Connection timed out. Ensure the backend server is reachable.');
//     }
//     throw error;
//   }
// }


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

    // Fallback Mock for testing before ERPNext is integrated
    if (__DEV__) {
      console.warn('ERPNext endpoint unavailable. Returning Mock response.');
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
      return { status: 'success', message: `Mock ${payload.logType} logged` };
    }

    throw error;
  }
}