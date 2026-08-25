// src/features/attendance/screens/CheckinScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store';
import { useCheckin } from '../hooks/useCheckin';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { StatusCard } from '../components/StatusCard';
import { CheckinButton } from '../components/CheckinButton';
import { OfflineBanner } from '../components/OfflineBanner';

type Props = NativeStackScreenProps<MainStackParamList, 'Checkin'>;

export const CheckinScreen = ({ navigation }: Props) => {
  const { handleCheckin, loading, pendingCount, syncQueue, isSyncing } = useCheckin();
  const { logs, onRefresh } = useAttendanceHistory();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initialLetter = typeof user === 'string' && user ? user.charAt(0).toUpperCase() : 'E';

  // Fetch history on component mount
  useEffect(() => {
    onRefresh();
  }, []);

  // Filter logs recorded today
  const todayStr = new Date().toDateString();
  const logsList = Array.isArray(logs) ? logs : [];

  const todayLogs = logsList.filter((log) => {
    if (!log?.time) return false;
    return new Date(log.time).toDateString() === todayStr;
  });

  // Earliest 'IN' check-in today
  const firstEntryLog = todayLogs
    .filter((log) => log.logType === 'IN' || (log as any).log_type === 'IN')
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())[0];

  // Latest 'OUT' check-out today
  const lastExitLog = todayLogs
    .filter((log) => log.logType === 'OUT' || (log as any).log_type === 'OUT')
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];

  // Format time string to HH:MM format
  const formatTime = (timeValue?: string) => {
    if (!timeValue) return '-- : --';
    const date = new Date(timeValue);
    if (isNaN(date.getTime())) return '-- : --';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const firstEntry = formatTime(firstEntryLog?.time);
  const lastExit = formatTime(lastExitLog?.time);

  const onCheckinPress = async (type: 'IN' | 'OUT') => {
    await handleCheckin(type);
    await onRefresh(); // Refresh today's summary immediately after checking in/out
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerClassName="p-6">

        {/* User Header Profile */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-slate-900 items-center justify-center shadow-md">
              <Text className="text-white font-extrabold text-lg">{initialLetter}</Text>
            </View>
            <View className="ml-3">
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Employee
              </Text>
              <Text className="text-slate-900 font-bold text-base">{user || 'Employee'}</Text>
            </View>
          </View>

          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('History')}
              className="bg-sky-100 px-3.5 py-2 rounded-xl active:bg-sky-200"
            >
              <Text className="text-sky-700 font-semibold text-xs">History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={logout}
              className="bg-slate-200/60 px-3.5 py-2 rounded-xl active:bg-slate-300"
            >
              <Text className="text-slate-700 font-semibold text-xs">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Offline Status & Pending Queue Banner */}
        <OfflineBanner
          pendingCount={pendingCount}
          isSyncing={isSyncing}
          onSyncPress={syncQueue}
        />

        {/* Live Clock & Status Card */}
        <StatusCard />

        {/* Action Buttons Row */}
        <View className="flex-row space-x-4 mb-6">
          <CheckinButton type="IN" onPress={() => onCheckinPress('IN')} loading={loading} />
          <View className="w-3" />
          <CheckinButton type="OUT" onPress={() => onCheckinPress('OUT')} loading={loading} />
        </View>

        {/* Today's Activity Summary Card */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-base mb-4">
            Today's Log Summary
          </Text>

          <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3" />
              <Text className="text-slate-600 font-medium text-sm">First Entry</Text>
            </View>
            <Text className="text-slate-900 font-bold text-sm">{firstEntry}</Text>
          </View>

          <View className="flex-row justify-between items-center pt-3">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-3" />
              <Text className="text-slate-600 font-medium text-sm">Last Exit</Text>
            </View>
            <Text className="text-slate-900 font-bold text-sm">{lastExit}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};