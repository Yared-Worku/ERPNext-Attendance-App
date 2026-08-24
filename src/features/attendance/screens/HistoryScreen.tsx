// src/features/attendance/screens/HistoryScreen.tsx
import React from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store';
import { useAttendanceHistory, UnifiedCheckinItem } from '../hooks/useAttendanceHistory';

type Props = NativeStackScreenProps<MainStackParamList, 'History'>;

export const HistoryScreen = ({ navigation }: Props) => {
  const { history, isLoading, error, refresh } = useAttendanceHistory();
  const user = useAuthStore((state) => state.user);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      formattedDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      formattedTime: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const renderItem = ({ item }: { item: UnifiedCheckinItem }) => {
    const { formattedDate, formattedTime } = formatDate(item.time);
    const isIn = item.logType === 'IN';

    return (
      <View className="mb-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <View className="flex-row items-center space-x-3">
          <View className={`h-10 w-10 items-center justify-center rounded-full ${isIn ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <Text className={`text-base font-bold ${isIn ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isIn ? '↓' : '↑'}
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-slate-800">
              Check {isIn ? 'In' : 'Out'}
            </Text>
            <Text className="text-xs text-slate-500">
              {formattedDate} • {formattedTime}
            </Text>
            {item.location && (
              <Text className="text-xs text-slate-400 mt-0.5">{item.location}</Text>
            )}
          </View>
        </View>

        <View className="items-end">
          {item.isPendingSync ? (
            <View className="rounded-full bg-amber-50 px-2.5 py-1 border border-amber-200">
              <Text className="text-xs font-medium text-amber-700">Pending Sync</Text>
            </View>
          ) : (
            <View className="rounded-full bg-slate-100 px-2.5 py-1">
              <Text className="text-xs font-medium text-slate-600">Synced</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 py-4 border-b border-slate-200 bg-white">
        <Text className="text-xl font-bold text-slate-900">Attendance History</Text>
        <Text className="text-xs text-slate-500">Log history for {user || 'Employee'}</Text>
      </View>

      {error && (
        <View className="m-4 rounded-lg bg-red-50 p-3 border border-red-200">
          <Text className="text-sm text-red-700">{error}</Text>
        </View>
      )}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} colors={['#0284c7']} />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0284c7" />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-base font-semibold text-slate-700">No Check-in Logs Found</Text>
              <Text className="mt-1 text-center text-xs text-slate-400">
                Perform a check-in from the Home tab or pull down to refresh.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};