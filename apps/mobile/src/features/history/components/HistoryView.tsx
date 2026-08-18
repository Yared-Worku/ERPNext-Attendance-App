
// import React from 'react';
// import { FlatList, View } from 'react-native';
// import { Surface, Text, Card, ActivityIndicator, Chip, Button } from 'react-native-paper';
// import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
// import { AttendanceLog } from '../../../shared/services/attendance';

// export function HistoryView() {
//   const { loading, refreshing, logs, onRefresh } = useAttendanceHistory();

//   const renderItem = ({ item }: { item: AttendanceLog }) => {
//     const dateObj = new Date(item.timestamp);
//     const formattedDate = dateObj.toLocaleDateString();
//     const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const isIn = item.logType === 'IN';

//     return (
//       <Card style={{ marginBottom: 12, backgroundColor: '#ffffff' }} mode="outlined">
//         <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <View>
//             <Chip
//               compact
//               style={{
//                 backgroundColor: isIn ? '#e8f5e9' : '#ffebee',
//                 alignSelf: 'flex-start',
//                 marginBottom: 6,
//               }}
//               textStyle={{
//                 color: isIn ? '#2e7d32' : '#c62828',
//                 fontWeight: 'bold',
//               }}
//             >
//               {isIn ? 'CHECK IN' : 'CHECK OUT'}
//             </Chip>
//             <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
//               {formattedTime}
//             </Text>
//             <Text variant="bodySmall" style={{ color: '#6e6e73' }}>
//               {formattedDate} {item.location ? `• ${item.location}` : ''}
//             </Text>
//           </View>

//           <Chip compact style={{ backgroundColor: '#f5f5f5' }}>
//             {item.status}
//           </Chip>
//         </Card.Content>
//       </Card>
//     );
//   };

//   if (loading) {
//     return (
//       <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator animating size="large" color="#0066cc" />
//       </Surface>
//     );
//   }

//   return (
//     <Surface style={{ flex: 1, padding: 16 }}>
//       <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>
//         Attendance History
//       </Text>

//       {logs.length === 0 ? (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Text variant="bodyLarge" style={{ color: '#6e6e73', marginBottom: 12 }}>
//             No attendance logs found.
//           </Text>
//           <Button mode="outlined" onPress={onRefresh}>
//             RELOAD
//           </Button>
//         </View>
//       ) : (
//         <FlatList
//           data={logs}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           contentContainerStyle={{ paddingBottom: 20 }}
//         />
//       )}
//     </Surface>
//   );
// }

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Surface, Text, ActivityIndicator, Chip, Button, DataTable } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';

export function HistoryView() {
  const insets = useSafeAreaInsets();
  const { loading, logs, onRefresh } = useAttendanceHistory();
  const [page, setPage] = useState<number>(0);
  const itemsPerPage = 10;

  // Sort logs: latest timestamp first
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Pagination bounds
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, sortedLogs.length);
  const paginatedLogs = sortedLogs.slice(from, to);

  if (loading) {
    return (
      <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating size="large" color="#0066cc" />
      </Surface>
    );
  }

  return (
    <Surface
      style={{
        flex: 1,
        paddingTop: insets.top + 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
          Attendance History
        </Text>
        <Button mode="text" onPress={onRefresh} compact>
          REFRESH
        </Button>
      </View>

      {logs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="bodyLarge" style={{ color: '#6e6e73', marginBottom: 12 }}>
            No attendance logs found.
          </Text>
          <Button mode="outlined" onPress={onRefresh}>
            RELOAD
          </Button>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Type</DataTable.Title>
              <DataTable.Title numeric>Time & Date</DataTable.Title>
              <DataTable.Title numeric>Status</DataTable.Title>
            </DataTable.Header>

            {paginatedLogs.map((item) => {
              const dateObj = new Date(item.timestamp);
              const formattedDate = dateObj.toLocaleDateString();
              const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isIn = item.logType === 'IN';

              return (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>
                    <Chip
                      compact
                      style={{
                        backgroundColor: isIn ? '#e8f5e9' : '#ffebee',
                      }}
                      textStyle={{
                        color: isIn ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                        fontSize: 10,
                      }}
                    >
                      {isIn ? 'IN' : 'OUT'}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                        {formattedTime}
                      </Text>
                      <Text variant="bodySmall" style={{ color: '#6e6e73', fontSize: 10 }}>
                        {formattedDate}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Chip compact style={{ backgroundColor: '#f5f5f5' }} textStyle={{ fontSize: 10 }}>
                      {item.status}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(sortedLogs.length / itemsPerPage)}
              onPageChange={(newPage) => setPage(newPage)}
              label={`${from + 1}-${to} of ${sortedLogs.length}`}
              showFastPaginationControls
              numberOfItemsPerPageList={[10]}
              numberOfItemsPerPage={itemsPerPage}
            />
          </DataTable>
        </ScrollView>
      )}
    </Surface>
  );
}