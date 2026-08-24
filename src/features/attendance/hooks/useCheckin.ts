// src/features/attendance/hooks/useCheckin.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { getCurrentLocation } from '../../../services/device/location';
import { postEmployeeCheckin } from '../api/attendanceApi';
import { useAuthStore } from '../../../store';

export const useCheckin = () => {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleCheckin = async (logType: 'IN' | 'OUT') => {
    setLoading(true);
    try {
      const userEmail = typeof user === 'string' 
        ? user 
        : (user as any)?.email || (user as any)?.name || (user as any)?.user || '';

      console.log('=== USE_CHECKIN HOOK STARTED ===');
      console.log('Resolved userEmail:', userEmail);
      console.log('Raw user object from AuthStore:', JSON.stringify(user));

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

      await postEmployeeCheckin({
        userEmail,
        log_type: logType,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      });

      Alert.alert('Success', `Successfully checked ${logType === 'IN' ? 'IN' : 'OUT'}!`);
    } catch (error: any) {
      console.error('Checkin failed in hook:', error);
      Alert.alert('Check-in Error', error.message || 'Failed to submit check-in log.');
    } finally {
      setLoading(false);
    }
  };

  return { handleCheckin, loading };
};