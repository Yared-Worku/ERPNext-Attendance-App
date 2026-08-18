// import React from 'react';
// import { AttendanceView } from '../features/attendance/components/AttendanceView';

// export default function Page() {
//   return <AttendanceView />;
// }


// import React from 'react';
// import { ActivityIndicator, Surface } from 'react-native-paper';
// import { AttendanceView } from '../features/attendance/components/AttendanceView';
// import LoginScreen from '../features/auth/components/login';
// import { useLogin } from '../features/auth/hooks/useLogin';

// export default function Page() {
//   const authProps = useLogin();

//   if (authProps.isCheckingSession) {
//     return (
//       <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator animating size="large" color="#0066cc" />
//       </Surface>
//     );
//   }

//   if (!authProps.isAuthenticated) {
//     return <LoginScreen {...authProps} />;
//   }

//   return <AttendanceView onLogout={() => authProps.setIsAuthenticated(false)} />;
// }

import React, { useState } from 'react';
import { ActivityIndicator, Surface, BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AttendanceView } from '../features/attendance/components/AttendanceView';
import { HistoryView } from '../features/history/components/HistoryView';
import LoginScreen from '../features/auth/components/login';
import { useLogin } from '../features/auth/hooks/useLogin';

export default function Page() {
  const authProps = useLogin();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'attendance', title: 'Attendance', focusedIcon: 'clock-check', unfocusedIcon: 'clock-check-outline' },
    { key: 'history', title: 'History', focusedIcon: 'history', unfocusedIcon: 'history' },
  ]);

  if (authProps.isCheckingSession) {
    return (
      <SafeAreaProvider>
        <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating size="large" color="#0066cc" />
        </Surface>
      </SafeAreaProvider>
    );
  }

  if (!authProps.isAuthenticated) {
    return (
      <SafeAreaProvider>
        <LoginScreen {...authProps} />
      </SafeAreaProvider>
    );
  }

  const renderScene = BottomNavigation.SceneMap({
    attendance: () => <AttendanceView onLogout={() => authProps.setIsAuthenticated(false)} />,
    history: HistoryView,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
}