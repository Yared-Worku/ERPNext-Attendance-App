// import React from 'react';
// import { AttendanceView } from '../features/attendance/components/AttendanceView';

// export default function Page() {
//   return <AttendanceView />;
// }
import React from 'react';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { AttendanceView } from '../features/attendance/components/AttendanceView';
import LoginScreen from '../features/auth/components/login';
import { useLogin } from '../features/auth/hooks/useLogin';

export default function Page() {
  const authProps = useLogin();

  if (authProps.isCheckingSession) {
    return (
      <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating size="large" color="#0066cc" />
      </Surface>
    );
  }

  if (!authProps.isAuthenticated) {
    return <LoginScreen {...authProps} />;
  }

  return <AttendanceView onLogout={() => authProps.setIsAuthenticated(false)} />;
}