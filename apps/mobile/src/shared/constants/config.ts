export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.53.19.40:8000';
export const API_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS) || 10000;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/method/login`,
  EMPLOYEE_RESOURCE: `${API_BASE_URL}/api/resource/Employee`,
  RECORD_ATTENDANCE: `${API_BASE_URL}/api/method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log_based_on_employee_field`,
  ATTENDANCE_CHECKIN_RESOURCE: `${API_BASE_URL}/api/resource/Employee Checkin`,
};