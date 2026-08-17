import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { postAttendance } from '../shared/services/attendance';

export default function App() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Mobile App</Text>
      <Text style={styles.status}>{statusMessage}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.btnIn]}
            onPress={() => handleAttendance('IN')}
          >
            <Text style={styles.buttonText}>CHECK IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.btnOut]}
            onPress={() => handleAttendance('OUT')}
          >
            <Text style={styles.buttonText}>CHECK OUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1d1d1f',
  },
  status: {
    fontSize: 16,
    color: '#6e6e73',
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnIn: {
    backgroundColor: '#2e7d32',
  },
  btnOut: {
    backgroundColor: '#c62828',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});