
import React from 'react';
import { FlatList, View } from 'react-native';
import { Surface, Text, Card, ActivityIndicator, Chip, Button } from 'react-native-paper';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { AttendanceLog } from '../../../shared/services/attendance';

export function HistoryView() {
  const { loading, refreshing, logs, onRefresh } = useAttendanceHistory();

  const renderItem = ({ item }: { item: AttendanceLog }) => {
    const dateObj = new Date(item.timestamp);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isIn = item.logType === 'IN';

    return (
      <Card style={{ marginBottom: 12, backgroundColor: '#ffffff' }} mode="outlined">
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Chip
              compact
              style={{
                backgroundColor: isIn ? '#e8f5e9' : '#ffebee',
                alignSelf: 'flex-start',
                marginBottom: 6,
              }}
              textStyle={{
                color: isIn ? '#2e7d32' : '#c62828',
                fontWeight: 'bold',
              }}
            >
              {isIn ? 'CHECK IN' : 'CHECK OUT'}
            </Chip>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {formattedTime}
            </Text>
            <Text variant="bodySmall" style={{ color: '#6e6e73' }}>
              {formattedDate} {item.location ? `• ${item.location}` : ''}
            </Text>
          </View>

          <Chip compact style={{ backgroundColor: '#f5f5f5' }}>
            {item.status}
          </Chip>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating size="large" color="#0066cc" />
      </Surface>
    );
  }

  return (
    <Surface style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>
        Attendance History
      </Text>

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
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Surface>
  );
}