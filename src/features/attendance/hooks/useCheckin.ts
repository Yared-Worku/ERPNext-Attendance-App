
import { useState } from 'react';
import { Alert } from 'react-native';
import { getCurrentLocation } from '../../../services/device/location';
import { postEmployeeCheckin } from '../api/attendanceApi';

export const useCheckin = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckin = async (logType: 'IN' | 'OUT') => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      const payload = {
        timestamp: new Date().toISOString(),
        log_type: logType,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await postEmployeeCheckin(payload);
      Alert.alert('Success', `Successfully checked ${logType === 'IN' ? 'IN' : 'OUT'}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit check-in log.';
      Alert.alert('Check-in Error', message);
    } finally {
      setLoading(false);
    }
  };

  return { handleCheckin, loading };
};