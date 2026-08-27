import { apiClient as api } from '../../../services/api/client';

export interface LeaveApplication {
  name?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  description: string;
  total_leave_days?: number;
  status?: 'Open' | 'Approved' | 'Rejected' | 'Cancelled';
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
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
        'total_leave_days'
      ]),
      order_by: 'creation desc',
    },
  });
  return response.data.data;
};

export const submitLeaveApplication = async (data: LeaveApplication, userIdentifier: string) => {
  let employeeId = userIdentifier;
  let leaveApprover = '';

  if (!userIdentifier) {
    throw new Error('User context is missing. Please log in again.');
  }

  // 1. Fetch Employee record to get the exact Employee ID and configured Leave Approver
  try {
    const isEmail = userIdentifier.includes('@');
    const filterField = isEmail ? 'user_id' : 'name';
    
const empResponse = await api.get('/api/resource/Employee', {
      params: {
        filters: JSON.stringify([[filterField, '=', userIdentifier]]),
        // MUST include 'leave_approver' here:
        fields: JSON.stringify(['name', 'leave_approver']) 
      }
    });

    const employees = empResponse.data.data || [];
    if (employees.length > 0) {
      employeeId = employees[0].name;
      leaveApprover = employees[0].leave_approver; // <-- This will now populate correctly
    }
  } catch (e) {
    console.error('Failed to fetch employee details for leave submission:', e);
  }

  // 2. Validate before hitting Frappe so you see a clear message instead of a backend trace error
  if (!employeeId) {
    throw new Error('Could not resolve an Employee profile for this user.');
  }

  if (!leaveApprover) {
    throw new Error(`No Leave Approver is assigned to employee ${employeeId}. Please configure a Leave Approver in ERPNext first.`);
  }

  // 3. Post the valid payload
  const response = await api.post('/api/resource/Leave Application', {
    employee: employeeId,
    leave_approver: leaveApprover,
    leave_type: data.leave_type,
    from_date: data.from_date,
    to_date: data.to_date,
    description: data.description,
  });
  
  return response.data.data;
};

export const fetchLeaveBalances = async (userEmailOrId: string): Promise<LeaveBalance> => {
  try {
    let employeeId = userEmailOrId;

    // Lookup the actual Employee record ID if an email is passed
    if (userEmailOrId.includes('@')) {
      const empResponse = await api.get('/api/resource/Employee', {
        params: {
          filters: JSON.stringify([['user_id', '=', userEmailOrId]]),
          fields: JSON.stringify(['name'])
        }
      });
      const employees = empResponse.data.data || [];
      if (employees.length > 0) {
        employeeId = employees[0].name;
      }
    }

    const response = await api.get('/api/resource/Leave Allocation', {
      params: {
        filters: JSON.stringify([['employee', '=', employeeId], ['docstatus', '=', 1]]),
        fields: JSON.stringify(['leave_type', 'total_leaves_allocated'])
      },
    });

    const allocations = response.data.data || [];
    const balances: LeaveBalance = { annual: 0, sick: 0, casual: 0 };
    
    allocations.forEach((item: any) => {
      if (item.leave_type === 'Annual Leave') balances.annual = item.total_leaves_allocated;
      if (item.leave_type === 'Sick Leave') balances.sick = item.total_leaves_allocated;
      if (item.leave_type === 'Casual Leave') balances.casual = item.total_leaves_allocated;
    });

    return balances;
  } catch (error: any) {
    console.warn('Failed to fetch leave balances:', error);
    return { annual: 0, sick: 0, casual: 0 };
  }
};