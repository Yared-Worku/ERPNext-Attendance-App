// import React from 'react';
// import { AttendanceView } from '../features/attendance/components/AttendanceView';

// export default function Page() {
//   return <AttendanceView />;
// }

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AttendanceView } from '../features/attendance/components/AttendanceView';
import LoginScreen from '../features/attendance/components/login';
import { useLogin } from '../features/attendance/hooks/useLogin';

export default function Page() {
  const authProps = useLogin();

  if (authProps.isCheckingSession) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating size="large" color="#0066cc" />
      </View>
    );
  }

  if (!authProps.isAuthenticated) {
    return <LoginScreen {...authProps} />;
  }

  return <AttendanceView />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});