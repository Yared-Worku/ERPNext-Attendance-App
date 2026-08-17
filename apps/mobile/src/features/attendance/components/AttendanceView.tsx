import React from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAttendance } from '../hooks/useAttendance';
import { styles } from '../styles/attendance.styles';

export function AttendanceView() {
  const { loading, statusMessage, handleAttendance } = useAttendance();

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