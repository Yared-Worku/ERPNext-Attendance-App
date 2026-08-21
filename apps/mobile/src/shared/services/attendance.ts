import * as SecureStore from 'expo-secure-store';
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

/**
 * Formats standard JavaScript / ISO dates into Frappe's expected format: YYYY-MM-DD HH:mm:ss
 */
function formatFrappeDatetime(dateString: string): string {
  const d = new Date(dateString);
  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Retrieves the linked Employee DocName (e.g. "HR-EMP-00002") for a given user email
 */
async function getEmployeeIdForUser(serverUrl: string, userEmail: string, sid: string | null): Promise<string> {
  const filters = encodeURIComponent(JSON.stringify([['user_id', '=', userEmail]]));
  const endpoint = `${serverUrl}/api/resource/Employee?filters=${filters}&fields=["name"]`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Host': 'development.localhost',
  };

  if (sid) {
    headers['Cookie'] = `sid=${sid}`;
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve Employee record for ${userEmail}`);
  }

  const data = await response.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].name;
  }

  throw new Error(`No Employee record found linked to ${userEmail}`);
}

export async function postAttendance(payload: AttendancePayload) {
  const { serverUrl, user } = await getSavedSession();
  const sid = await SecureStore.getItemAsync('erp_sid');
  const userEmail = user || 'kifle@test.com';

  // 1. Resolve Employee ID (e.g. "HR-EMP-00002")
  const employeeId = await getEmployeeIdForUser(serverUrl, userEmail, sid);

  // 2. Call Frappe HRMS whitelisted check-in method
  const endpoint = `${serverUrl}/api/method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log_based_on_employee_field`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Host': 'development.localhost',
  };

  if (sid) {
    headers['Cookie'] = `sid=${sid}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        employee_field_value: employeeId,
        employee_fieldname: 'employee',
        timestamp: formatFrappeDatetime(payload.timestamp),
        log_type: payload.logType,
        device_id: 'Expo Mobile App',
        latitude: payload.latitude,
        longitude: payload.longitude,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    console.log('[Frappe postAttendance Response]:', responseText);

    if (responseText.trim().startsWith('<')) {
      throw new Error('Server returned HTML page. Verify bench site configuration.');
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      let serverErrorMsg = `Server error ${response.status}`;

      if (data._server_messages) {
        try {
          const parsedMsgs = JSON.parse(data._server_messages);
          const firstObj = typeof parsedMsgs[0] === 'string' ? JSON.parse(parsedMsgs[0]) : parsedMsgs[0];
          serverErrorMsg = firstObj.message || serverErrorMsg;
        } catch {
          // Fallback parsing
        }
      } else if (data.exception) {
        serverErrorMsg = data.exception.split(':').pop()?.trim() || data.exception;
      } else if (data.message) {
        serverErrorMsg = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      }

      throw new Error(serverErrorMsg);
    }

    return data.message;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError' || error.message === 'Network request failed') {
      throw new Error('Network request failed. Saved to offline queue.');
    }

    throw error;
  }
}


export async function getAttendanceHistory(): Promise<AttendanceLog[]> {
  const { serverUrl, user } = await getSavedSession();
  const sid = await SecureStore.getItemAsync('erp_sid');
  const userEmail = user || 'kifle@test.com';

  // 1. Resolve Employee ID (e.g., "HR-EMP-00002")
  const employeeId = await getEmployeeIdForUser(serverUrl, userEmail, sid);

  // 2. Fetch records directly from Employee Checkin DocType
  const filters = encodeURIComponent(JSON.stringify([['employee', '=', employeeId]]));
  const fields = encodeURIComponent(JSON.stringify(['name', 'log_type', 'time', 'device_id']));
  const endpoint = `${serverUrl}/api/resource/Employee Checkin?filters=${filters}&fields=${fields}&order_by=time desc&limit_page_length=50`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Host': 'development.localhost',
  };

  if (sid) {
    headers['Cookie'] = `sid=${sid}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
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

    // Map Frappe DB records to mobile app AttendanceLog format
    return (data.data || []).map((item: any) => ({
      id: item.name,
      logType: item.log_type as 'IN' | 'OUT',
      timestamp: item.time,
      status: 'Success',
      location: item.device_id || 'Expo Mobile App',
    }));
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}