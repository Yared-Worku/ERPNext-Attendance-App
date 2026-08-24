// src/features/attendance/hooks/useAttendanceHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { getAttendanceHistory, CheckinRecord } from '../api/attendanceApi';

export interface UnifiedCheckinItem {
  id: string;
  time: string;
  logType: 'IN' | 'OUT';
  location?: string;
  isPendingSync: boolean;
}

export function useAttendanceHistory() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [logs, setLogs] = useState<UnifiedCheckinItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchLogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage('');

    try {
      const data = await getAttendanceHistory();
      const formattedLogs: UnifiedCheckinItem[] = data.map((log: CheckinRecord) => ({
        id: log.name,
        time: log.time,
        logType: log.log_type,
        location: log.device_id || 'Mobile App',
        isPendingSync: false,
      }));
      setLogs(formattedLogs);
    } catch (error: any) {
      const msg = error?.message || 'Failed to load attendance history';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    loading,
    refreshing,
    logs,
    errorMessage,
    onRefresh: () => fetchLogs(true),
  };
}