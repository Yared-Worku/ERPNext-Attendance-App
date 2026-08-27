import { useState, useEffect, useCallback } from 'react';
import { fetchLeaveApplications, submitLeaveApplication, LeaveApplication } from '../api/leaveApi';

export const useLeave = () => {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLeaveApplications();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leave records:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const applyForLeave = async (leaveData: LeaveApplication, onSuccess: () => void) => {
    try {
      setSubmitting(true);
      await submitLeaveApplication(leaveData);
      await loadLeaves();
      onSuccess();
    } catch (error) {
      console.error('Failed to submit leave application:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { leaves, loading, submitting, loadLeaves, applyForLeave };
};