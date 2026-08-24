// src/features/attendance/api/attendanceApi.ts
import { apiClient } from '../../../services/api/client';
import { ENV } from '../../../config/env';

export interface CheckinPayload {
  userEmail: string;
  log_type: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
  timestamp?: string;
}

export interface CheckinRecord {
  name: string;
  time: string;
  log_type: 'IN' | 'OUT';
  employee?: string;
  employee_name?: string;
  device_id?: string;
}

// Fetch ERPNext Employee ID for the user email
const fetchEmployeeIdByEmail = async (email: string): Promise<string | null> => {
  try {
    const response = await apiClient.get('/api/resource/Employee', {
      params: {
        filters: JSON.stringify([['user_id', '=', email]]),
        fields: JSON.stringify(['name']),
        limit_page_length: 1,
      },
    });
    const records = response.data?.data;
    if (records && records.length > 0) {
      return records[0].name;
    }
  } catch (error) {
    console.warn('Failed to resolve Employee ID:', error);
  }
  return null;
};

export const postEmployeeCheckin = async (payload: CheckinPayload) => {
  if (!payload.userEmail) {
    throw new Error('User email is missing. Please re-login.');
  }

  // 1. Resolve Employee ID matching user_id email
  const employeeId = await fetchEmployeeIdByEmail(payload.userEmail);

  if (!employeeId) {
    throw new Error(`No Employee record found for email "${payload.userEmail}". Ensure your User ID is linked to an Employee record in ERPNext.`);
  }

  const formattedTimestamp = payload.timestamp
    ? payload.timestamp.replace('T', ' ').substring(0, 19)
    : new Date().toISOString().replace('T', ' ').substring(0, 19);

  // 2. Pass 'employee' as employee_fieldname
  const requestBody = {
    employee_field_value: employeeId,
    employee_fieldname: 'employee',
    timestamp: formattedTimestamp,
    log_type: payload.log_type,
    latitude: payload.latitude,
    longitude: payload.longitude,
    device_id: 'Mobile App',
  };

  console.log('=== CHECK-IN REQUEST PAYLOAD ===');
  console.log('URL:', ENV.ENDPOINTS.CHECKIN);
  console.log('Body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await apiClient.post(ENV.ENDPOINTS.CHECKIN, requestBody);
    console.log('=== CHECK-IN SUCCESS RESPONSE ===');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.log('=== CHECK-IN ERROR DETAILED LOG ===');
    console.log('Status Code:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));

    let extractedMessage = '';

    if (error.response?.data?._server_messages) {
      try {
        const messages = JSON.parse(error.response.data._server_messages);
        const parsedObj = JSON.parse(messages[0]);
        extractedMessage = parsedObj.message.replace(/<[^>]*>?/gm, '');
      } catch (e) {
        console.log('Failed to parse _server_messages:', e);
      }
    }

    if (!extractedMessage && error.response?.data?.exception) {
      extractedMessage = error.response.data.exception;
    }

    if (!extractedMessage && error.response?.data?.message) {
      extractedMessage = typeof error.response.data.message === 'string'
        ? error.response.data.message
        : JSON.stringify(error.response.data.message);
    }

    const finalErrorMessage = extractedMessage || error.message || 'Unknown Frappe error';
    console.log('Extracted Error Message:', finalErrorMessage);

    throw new Error(finalErrorMessage);
  }
};

export const getAttendanceHistory = async (): Promise<CheckinRecord[]> => {
  const response = await apiClient.get('/api/resource/Employee Checkin', {
    params: {
      fields: JSON.stringify(['name', 'time', 'log_type', 'employee', 'employee_name', 'device_id']),
      order_by: 'time desc',
      limit_page_length: 30,
    },
  });
  return response.data?.data || [];
};