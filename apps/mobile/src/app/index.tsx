import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CheckinType } from '@attendance/shared-types';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Mobile App</Text>
      <Text>Status: Ready for {CheckinType.IN} / {CheckinType.OUT} actions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});