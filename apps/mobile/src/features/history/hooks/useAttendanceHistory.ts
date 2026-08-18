import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getAttendanceHistory, AttendanceLog } from '../../../shared/services/attendance';

export function useAttendanceHistory() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage('');

    try {
      const data = await getAttendanceHistory();
      setLogs(data);
    } catch (error: any) {
      const msg = error.message || 'Failed to load attendance history';
      setErrorMessage(msg);
      Alert.alert('History Error', msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    loading,
    refreshing,
    logs,
    errorMessage,
    onRefresh: () => fetchLogs(true),
  };
}