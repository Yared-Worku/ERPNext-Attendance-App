// src/features/attendance/hooks/useCheckin.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { getCurrentLocation } from '../../../services/device/location';
import { postEmployeeCheckin } from '../api/attendanceApi';
import { useAuthStore } from '../../../store';

export const useCheckin = () => {
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const user = useAuthStore((state) => state.user);
  const queue = useAuthStore((state) => state.queue);
  const addToQueue = useAuthStore((state) => state.addToQueue);
  const removeFromQueue = useAuthStore((state) => state.removeFromQueue);
  const incrementAttempts = useAuthStore((state) => state.incrementAttempts);

  // Sequential queue flusher (FIFO)
  const syncQueue = useCallback(async () => {
    const currentQueue = useAuthStore.getState().queue;
    if (currentQueue.length === 0 || isSyncing) return;

    setIsSyncing(true);

    for (const item of currentQueue) {
      if (item.attempts >= 5) continue; // Skip items exceeding maximum retries

      try {
        await postEmployeeCheckin({
          userEmail: item.userEmail,
          log_type: item.log_type,
          latitude: item.latitude,
          longitude: item.longitude,
          timestamp: item.timestamp,
        });
        removeFromQueue(item.id);
      } catch (error) {
        incrementAttempts(item.id);
        break; // Pause loop on failure to preserve exact check-in sequence
      }
    }

    setIsSyncing(false);
  }, [isSyncing, removeFromQueue, incrementAttempts]);

  // Auto-trigger sync on network reconnect
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        syncQueue();
      }
    });

    return () => unsubscribe();
  }, [syncQueue]);

  const handleCheckin = async (logType: 'IN' | 'OUT') => {
    setLoading(true);
    try {
      const userEmail = typeof user === 'string'
        ? user
        : (user as any)?.email || (user as any)?.name || (user as any)?.user || '';

      console.log('=== USE_CHECKIN HOOK STARTED ===');
      console.log('Resolved userEmail:', userEmail);

      if (!userEmail) {
        Alert.alert('Auth Error', 'No logged in user email found in state.');
        setLoading(false);
        return;
      }

      const location = await getCurrentLocation();
      console.log('Resolved Location:', location);

      if (!location) {
        Alert.alert('Location Error', 'Unable to retrieve device GPS coordinates.');
        setLoading(false);
        return;
      }

      const checkinTimestamp = new Date().toISOString();
      const netState = await NetInfo.fetch();
      const isOnline = netState.isConnected && netState.isInternetReachable !== false;

      // Handle direct offline state
      if (!isOnline) {
        addToQueue({
          userEmail,
          log_type: logType,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: checkinTimestamp,
        });

        Alert.alert(
          'Offline Mode',
          'No internet connection. Your check-in is saved locally and will sync automatically when reconnected.'
        );
        return;
      }

      // Try online submission
      try {
        await postEmployeeCheckin({
          userEmail,
          log_type: logType,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: checkinTimestamp,
        });

        Alert.alert('Success', `Successfully checked ${logType === 'IN' ? 'IN' : 'OUT'}!`);
      } catch (error: any) {
        console.warn('Online submit failed, queuing offline log:', error.message);

        addToQueue({
          userEmail,
          log_type: logType,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: checkinTimestamp,
        });

        Alert.alert(
          'Saved Offline',
          'Unable to reach ERPNext server. Check-in saved locally and queued for auto-sync.'
        );
      }
    } catch (error: any) {
      console.error('Checkin failed in hook:', error);
      Alert.alert('Check-in Error', error.message || 'Failed to submit check-in log.');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCheckin,
    loading,
    pendingCount: queue.length,
    syncQueue,
    isSyncing,
  };
};