import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { postAttendance } from '../../../shared/services/attendance';
import { logoutERPNext } from '../../../shared/services/auth';

export function useAttendance(onLogoutSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready for IN / OUT actions');
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  const handleAttendance = async (type: 'IN' | 'OUT') => {
    if (!locationPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to record attendance.');
      return;
    }

    setLoading(true);
    setStatusMessage(`Capturing location for ${type}...`);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setStatusMessage(`Submitting ${type} action...`);

      await postAttendance({
        logType: type,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      setStatusMessage(`Successfully logged ${type} at ${new Date().toLocaleTimeString()}`);
      Alert.alert('Success', `Attendance ${type} logged successfully!`);
    } catch (error: any) {
      const message = error.message || 'Failed to submit attendance';
      setStatusMessage(`Error: ${message}`);
      Alert.alert('Attendance Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutERPNext();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch {
      Alert.alert('Logout Error', 'Could not clear saved session.');
    }
  };

  return {
    loading,
    statusMessage,
    handleAttendance,
    handleLogout,
  };
}