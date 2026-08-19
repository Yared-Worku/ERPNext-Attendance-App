import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { postAttendance } from '../../../shared/services/attendance';
import { sendLocalNotification } from '../../../core/notifications/pushNotifications';
import { logoutERPNext } from '../../../shared/services/auth';
import { 
  savePendingLog, 
  getPendingLogs, 
  debugDumpDatabase 
} from '../../../core/database/attendanceStorage';
import { syncPendingAttendance } from '../../../core/sync/attendanceSync';

export function useAttendance(onLogoutSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready for IN / OUT actions');
  const [pendingCount, setPendingCount] = useState(0);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  const refreshPendingCount = async () => {
    const logs = await getPendingLogs();
    setPendingCount(logs.length);
    // Dump local SQLite records to Metro terminal whenever queue refreshes
    debugDumpDatabase();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      await refreshPendingCount();
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
      const payload = {
        logType: type,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      };

      try {
        setStatusMessage(`Submitting ${type} action...`);
        await postAttendance(payload);
        setStatusMessage(`Successfully logged ${type} at ${new Date().toLocaleTimeString()}`);
        Alert.alert('Success', `Attendance ${type} logged online!`);
      } catch (netError) {
        // Offline Fallback
        await savePendingLog(payload);
        await refreshPendingCount();
        setStatusMessage(`Offline: Log queued locally (${type})`);
        Alert.alert('Saved Offline', `Network unavailable. ${type} request queued locally and will sync when online.`);
      }
    } catch (error: any) {
      const message = error.message || 'Failed to capture location or submit';
      setStatusMessage(`Error: ${message}`);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setLoading(true);
    setStatusMessage('Syncing queued offline logs...');
    try {

      // Inside handleSyncNow / performSync:
     const result = await syncPendingAttendance();
        await refreshPendingCount();

    if (result.syncedCount > 0) {
  await sendLocalNotification(
    'Sync Successful',
    `Uploaded ${result.syncedCount} offline attendance log(s) to server.`
  );
}
      setStatusMessage(`Sync complete. ${result.syncedCount} uploaded, ${result.failedCount} failed.`);
      Alert.alert('Sync Finished', `Uploaded ${result.syncedCount} queued log(s).`);
    } catch (error: any) {
      Alert.alert('Sync Error', error.message || 'Failed to process offline queue.');
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
    pendingCount,
    handleAttendance,
    handleSyncNow,
    handleLogout,
  };
}