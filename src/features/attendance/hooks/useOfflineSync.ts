// src/features/attendance/hooks/useOfflineSync.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useAuthStore } from '../../../store';
import { postEmployeeCheckin, CheckinPayload } from '../api/attendanceApi';

export interface QueuedCheckin {
  id: string;
  employee_field_value: string;
  log_type: 'IN' | 'OUT';
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // Retrieve queue and queue actions from Zustand store (backed by MMKV)
  const offlineQueue: QueuedCheckin[] = useAuthStore(
    (state: any) => state.offlineQueue || state.pendingQueue || []
  );
  const removeFromQueue = useAuthStore(
    (state: any) => state.removeFromQueue || state.popQueueItem
  );

  // Track previous connection state to detect transition from offline -> online
  const wasOffline = useRef<boolean>(false);

  /**
   * Processes each item in the offline queue sequentially
   */
  const syncQueue = useCallback(async () => {
    if (isSyncing || offlineQueue.length === 0) return;

    setIsSyncing(true);

    // Make a shallow copy of the current queue snapshot
    const queueToProcess = [...offlineQueue];

    for (const item of queueToProcess) {
      try {
        // Construct payload with type assertion to bypass strict property checks
        const payload = {
          employee_field_value: item.employee_field_value,
          log_type: item.log_type,
          time: item.timestamp,
          timestamp: item.timestamp,
          ...(item.latitude !== undefined ? { latitude: item.latitude } : {}),
          ...(item.longitude !== undefined ? { longitude: item.longitude } : {}),
        } as unknown as CheckinPayload;

        await postEmployeeCheckin(payload);

        // Remove item from persistent store upon successful sync
        if (typeof removeFromQueue === 'function') {
          removeFromQueue(item.id);
        }
      } catch (error) {
        // Stop processing loop if network fails midway to prevent data loss
        console.warn(`[OfflineSync] Failed to sync item ${item.id}:`, error);
        break;
      }
    }

    setIsSyncing(false);
  }, [offlineQueue, isSyncing, removeFromQueue]);

  /**
   * Listen to network reachability changes
   */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(isOnline);

      // Trigger auto-sync ONLY when transitioning from offline to online
      if (wasOffline.current && isOnline) {
        syncQueue();
      }

      // Update ref state for next transition check
      wasOffline.current = !isOnline;
    });

    return () => unsubscribe();
  }, [syncQueue]);

  return {
    isConnected,
    isSyncing,
    pendingCount: offlineQueue.length,
    syncQueue,
  };
};