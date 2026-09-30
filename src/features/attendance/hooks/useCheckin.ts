import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { getCurrentLocation } from '../../../services/device/location';
import { authenticateWithBiometrics } from '../../../services/device/biometrics';
import { postEmployeeCheckin } from '../api/attendanceApi';
import { useAuthStore } from '../../../store';

export interface QueueItem {
  id: string;
  userEmail: string;
  log_type: 'IN' | 'OUT';
  latitude: number;
  longitude: number;
  timestamp: string;
  attempts: number;
}

const EMPTY_QUEUE: QueueItem[] = [];

export const useCheckin = () => {
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingRef = useRef(false);

  // Extract primitive state and actions with stable selectors
  const user = useAuthStore((state: any) => state.user);
  const rawQueue = useAuthStore((state: any) => state.queue);
  const queue = rawQueue || EMPTY_QUEUE;
  const addToQueue = useAuthStore((state: any) => state.addToQueue);

  // Stable memoized syncQueue function
  const syncQueue = useCallback(async () => {
    const { queue: currentQueue = [], removeFromQueue, incrementAttempts } = useAuthStore.getState();
    if (currentQueue.length === 0 || isSyncingRef.current) return;

    isSyncingRef.current = true;
    setIsSyncing(true);

    for (const item of currentQueue) {
      if (item.attempts >= 5) continue;

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
        break; // Pause queue on failure to preserve exact check-in order
      }
    }

    isSyncingRef.current = false;
    setIsSyncing(false);
  }, []);

  // Mount-only network listener
  useEffect(() => {
          const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        syncQueue();
      }
    });
    return () => unsubscribe();
  }, [syncQueue]);

  // Stable memoized handleCheckin function with Biometric verification
  const handleCheckin = useCallback(async (logType: 'IN' | 'OUT') => {
    const userEmail =
      typeof user === 'string'
        ? user
        : (user as any)?.email || (user as any)?.name || (user as any)?.user || '';

    if (!userEmail) {
      Alert.alert('Auth Error', 'No logged in user email found in state.');
      return;
    }

    // Biometric Verification Guard
    const isVerified = await authenticateWithBiometrics(
      `Verify identity to Check ${logType === 'IN' ? 'IN' : 'OUT'}`
    );

    if (!isVerified) {
      return; // Stop execution if biometric check fails or is canceled
    }

    // Proceed with Location & Attendance Logging
    setLoading(true);

    try {
      const location = await getCurrentLocation();

      if (!location) {
        setLoading(false);
        return;
      }

      const checkinTimestamp = new Date().toISOString();
      const netState = await NetInfo.fetch();
      const isOnline = Boolean(netState.isConnected && netState.isInternetReachable !== false);

      const newItem: QueueItem = {
        id: `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userEmail,
        log_type: logType,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: checkinTimestamp,
        attempts: 0,
      };

      if (!isOnline) {
        addToQueue(newItem);
        Alert.alert(
          'Offline Mode',
          'No internet connection. Your check-in is saved locally and will sync automatically when reconnected.'
        );
        return;
      }

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
        console.warn('[Checkin] Online submit failed, queuing offline log:', error?.message);
        addToQueue(newItem);
        Alert.alert(
          'Saved Offline',
          'Unable to reach server. Check-in saved locally and queued for auto-sync.'
        );
      }
    } catch (error: any) {
      console.error('[Checkin] Error in handleCheckin:', error);
      Alert.alert('Check-in Error', error?.message || 'Failed to submit check-in log.');
    } finally {
      setLoading(false);
    }
  }, [user, addToQueue]);

  return {
    handleCheckin,
    loading,
    pendingCount: queue.length,
    syncQueue,
    isSyncing,
  };
};