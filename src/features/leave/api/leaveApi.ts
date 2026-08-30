import { apiClient as api } from '../../../services/api/client';
import { ENV } from '../../../config/env';

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
  const response = await api.get(ENV.ENDPOINTS.LEAVE_APPLICATION, {
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
    
    const empResponse = await api.get(ENV.ENDPOINTS.LEAVE_BALANCE, {
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

  // 3. Post the valid payload and catch Frappe-specific errors
  try {
    const response = await api.post(ENV.ENDPOINTS.LEAVE_APPLICATION, {
      employee: employeeId,
      leave_approver: leaveApprover,
      leave_type: data.leave_type,
      from_date: data.from_date,
      to_date: data.to_date,
      description: data.description,
    });
    
    return response.data.data;
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred while submitting your leave application.';

    // Dig into the Axios error to find Frappe's specific error message payload
    if (error.response?.data) {
      const responseData = error.response.data;

      if (responseData._server_messages) {
        try {
          // Frappe returns an array of stringified JSON objects
          const messages = JSON.parse(responseData._server_messages);
          if (messages.length > 0) {
            const firstMessageObj = JSON.parse(messages[0]);
            // Extract the message and strip out any HTML tags (like <b>) Frappe includes
            errorMessage = firstMessageObj.message.replace(/<[^>]*>?/gm, '');
          }
        } catch (parseError) {
          console.warn('Failed to parse Frappe server messages');
        }
      } else if (responseData.exc_type) {
        errorMessage = `Server Error: ${responseData.exc_type}`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Throw the cleaned-up string so your UI (React component) can display it directly
    throw new Error(errorMessage);
  }
};

export const fetchLeaveBalances = async (userEmailOrId: string): Promise<LeaveBalance> => {
  try {
    let employeeId = userEmailOrId;

    // Lookup the actual Employee record ID if an email is passed
    if (userEmailOrId.includes('@')) {
      const empResponse = await api.get(ENV.ENDPOINTS.LEAVE_BALANCE, {
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

    // Get today's date in YYYY-MM-DD format to calculate active balances as of today
    const today = new Date().toISOString().split('T')[0];

    // Use the official Frappe HR RPC method instead of querying the raw table.
    // This bypasses the document visibility block and calculates (Allocated - Taken = Remaining).
    const response = await api.get(ENV.ENDPOINTS.LEAVE_DETAIL, {
      params: {
        employee: employeeId,
        date: today
      },
    });

    // RPC methods return their payload inside a 'message' object, not 'data'
    const leaveData = response.data.message?.leave_allocation || {};

    return {
      annual: leaveData['Annual Leave']?.remaining_leaves || 0,
      sick: leaveData['Sick Leave']?.remaining_leaves || 0,
      casual: leaveData['Casual Leave']?.remaining_leaves || 0,
    };

  } catch (error: any) {
    console.error('Failed to fetch true leave balances:', error.response?.data || error.message);
    return { annual: 0, sick: 0, casual: 0 };
  }
};