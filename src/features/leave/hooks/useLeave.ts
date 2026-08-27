import { useState, useEffect, useCallback } from 'react';
import { fetchLeaveApplications, submitLeaveApplication, fetchLeaveBalances, LeaveApplication, LeaveBalance } from '../api/leaveApi';
import { useAuthStore } from '../../../store';

export const useLeave = () => {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [balances, setBalances] = useState<LeaveBalance>({ annual: 0, sick: 0, casual: 0 });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Extract user safely from Zustand store
  const user = useAuthStore((state: any) => state.user);

  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);

      // Resolve the correct employee identifier from state (matches your check-in logic)
      const employeeId =
        typeof user === 'string'
          ? user
          : (user as any)?.employee || (user as any)?.name || (user as any)?.user;

      const [applicationsData, balanceData] = await Promise.all([
        fetchLeaveApplications(),
        fetchLeaveBalances(employeeId)
      ]);

      setLeaves(applicationsData || []);
      setBalances(balanceData || { annual: 0, sick: 0, casual: 0 });
    } catch (error) {
      console.error('Failed to load leave data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

const applyForLeave = async (leaveData: LeaveApplication, onSuccess: () => void) => {
    try {
      setSubmitting(true);
      
      // Resolve the identifier just like you did in loadLeaves
      const userIdentifier = typeof user === 'string' 
        ? user 
        : (user as any)?.user || (user as any)?.employee;

      // Pass userIdentifier as the second argument
      await submitLeaveApplication(leaveData, userIdentifier); 
      
      await loadLeaves();
      onSuccess();
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { leaves, balances, loading, submitting, loadLeaves, applyForLeave };
};