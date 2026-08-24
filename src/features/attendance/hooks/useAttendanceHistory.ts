// src/features/attendance/hooks/useAttendanceHistory.ts
import { useState, useCallback, useEffect } from 'react';
import { fetchCheckinHistory, CheckinRecord } from '../api/attendanceApi';
import { useAuthStore } from '../../../store';

export interface UnifiedCheckinItem {
  id: string;
  time: string;
  logType: 'IN' | 'OUT';
  location?: string;
  isPendingSync: boolean;
}

const EMPTY_QUEUE: any[] = [];

export const useAttendanceHistory = () => {
  const user = useAuthStore((state) => state.user);
  const rawOfflineQueue = useAuthStore((state: any) => state.offlineQueue);
  const offlineQueue = rawOfflineQueue ?? EMPTY_QUEUE;

  const userEmail = typeof user === 'string' ? user : (user as any)?.email || '';

  const [history, setHistory] = useState<UnifiedCheckinItem[]>([]);
  // Default to true to prevent initial render flicker
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let remoteFormatted: UnifiedCheckinItem[] = [];

    if (userEmail) {
      try {
        const remoteLogs = await fetchCheckinHistory(userEmail);
        remoteFormatted = (remoteLogs || []).map((log: CheckinRecord) => ({
          id: log.name,
          time: log.time,
          logType: log.log_type,
          location: log.custom_location_name || log.device_id || 'Mobile App',
          isPendingSync: false,
        }));
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch remote history.');
      }
    }

    const offlineFormatted: UnifiedCheckinItem[] = offlineQueue.map((item: any) => ({
      id: item.id || `pending-${item.timestamp}`,
      time: item.timestamp,
      logType: item.log_type || item.logType,
      location: 'Offline Log',
      isPendingSync: true,
    }));

    const merged = [...offlineFormatted, ...remoteFormatted].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    setHistory(merged);
    setIsLoading(false);
  }, [userEmail]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { history, isLoading, error, refresh: loadHistory };
};