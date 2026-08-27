import { apiClient as api } from '../../../services/api/client';

export interface LeaveApplication {
  name?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  description: string;
  total_leave_days?: number; // <--- Add this property
  status?: 'Open' | 'Approved' | 'Rejected' | 'Cancelled';
}

export const fetchLeaveApplications = async () => {
  const response = await api.get('/api/resource/Leave Application', {
    params: {
      fields: JSON.stringify([
        'name', 
        'leave_type', 
        'from_date', 
        'to_date', 
        'description', 
        'status', 
        'total_leave_days' // <--- Include it in fetch fields
      ]),
      order_by: 'creation desc',
    },
  });
  return response.data.data;
};

export const submitLeaveApplication = async (data: LeaveApplication) => {
  const response = await api.post('/api/resource/Leave Application', data);
  return response.data.data;
};