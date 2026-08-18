// import React from 'react';
// import { View } from 'react-native';
// import { Button, Text, ActivityIndicator, Surface } from 'react-native-paper';
// import { useAttendance } from '../hooks/useAttendance';

// interface AttendanceViewProps {
//   onLogout?: () => void;
// }

// export function AttendanceView({ onLogout }: AttendanceViewProps) {
//   const { loading, statusMessage, handleAttendance, handleLogout } = useAttendance(onLogout);

//   return (
//     <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//       <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
//         Attendance Mobile App
//       </Text>
//       <Text variant="bodyLarge" style={{ color: '#6e6e73', marginBottom: 24, textAlign: 'center' }}>
//         {statusMessage}
//       </Text>

//       {loading ? (
//         <ActivityIndicator animating size="large" color="#0066cc" />
//       ) : (
//         <View style={{ gap: 16, width: '100%', alignItems: 'center' }}>
//           <View style={{ flexDirection: 'row', gap: 12 }}>
//             <Button
//               mode="contained"
//               buttonColor="#2e7d32"
//               contentStyle={{ height: 48 }}
//               onPress={() => handleAttendance('IN')}
//             >
//               CHECK IN
//             </Button>

//             <Button
//               mode="contained"
//               buttonColor="#c62828"
//               contentStyle={{ height: 48 }}
//               onPress={() => handleAttendance('OUT')}
//             >
//               CHECK OUT
//             </Button>
//           </View>

//           <Button
//             mode="outlined"
//             textColor="#c62828"
//             style={{ marginTop: 20, borderColor: '#c62828' }}
//             onPress={handleLogout}
//           >
//             LOG OUT
//           </Button>
//         </View>
//       )}
//     </Surface>
//   );
// }


import React from 'react';
import { View } from 'react-native';
import { Button, Text, ActivityIndicator, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAttendance } from '../hooks/useAttendance';

interface AttendanceViewProps {
  onLogout?: () => void;
}

export function AttendanceView({ onLogout }: AttendanceViewProps) {
  const insets = useSafeAreaInsets();
  const { loading, statusMessage, handleAttendance, handleLogout } = useAttendance(onLogout);

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}
    >
      <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
        Attendance Mobile App
      </Text>
      <Text variant="bodyLarge" style={{ color: '#6e6e73', marginBottom: 24, textAlign: 'center' }}>
        {statusMessage}
      </Text>

      {loading ? (
        <ActivityIndicator animating size="large" color="#0066cc" />
      ) : (
        <View style={{ gap: 16, width: '100%', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              mode="contained"
              buttonColor="#2e7d32"
              contentStyle={{ height: 48 }}
              onPress={() => handleAttendance('IN')}
            >
              CHECK IN
            </Button>

            <Button
              mode="contained"
              buttonColor="#c62828"
              contentStyle={{ height: 48 }}
              onPress={() => handleAttendance('OUT')}
            >
              CHECK OUT
            </Button>
          </View>

          <Button
            mode="outlined"
            textColor="#c62828"
            style={{ marginTop: 20, borderColor: '#c62828', width: '60%' }}
            onPress={handleLogout}
          >
            LOG OUT
          </Button>
        </View>
      )}
    </Surface>
  );
}