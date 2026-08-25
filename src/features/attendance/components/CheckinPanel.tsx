import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useCheckin } from '../hooks/useCheckin';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { StatusCard } from './StatusCard';
import { CheckinButton } from './CheckinButton';
import { OfflineBanner } from './OfflineBanner';

export const CheckinPanel = () => {
  const { handleCheckin, loading, pendingCount, syncQueue, isSyncing } = useCheckin();
  const { logs, onRefresh } = useAttendanceHistory();

  useEffect(() => {
    onRefresh();
  }, []);

  const todayStr = new Date().toDateString();
  const logsList = Array.isArray(logs) ? logs : [];

  const todayLogs = logsList.filter((log) => {
    if (!log?.time) return false;
    return new Date(log.time).toDateString() === todayStr;
  });

  const firstEntryLog = todayLogs
    .filter((log) => log.logType === 'IN' || (log as any).log_type === 'IN')
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())[0];

  const lastExitLog = todayLogs
    .filter((log) => log.logType === 'OUT' || (log as any).log_type === 'OUT')
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];

  const formatTime = (timeValue?: string) => {
    if (!timeValue) return '-- : --';
    const date = new Date(timeValue);
    if (isNaN(date.getTime())) return '-- : --';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onCheckinPress = async (type: 'IN' | 'OUT') => {
    await handleCheckin(type);
    await onRefresh();
  };

  return (
    <ScrollView contentContainerClassName="p-6">
      <OfflineBanner
        pendingCount={pendingCount}
        isSyncing={isSyncing}
        onSyncPress={syncQueue}
      />

      <StatusCard />

      <View className="flex-row space-x-4 mb-6">
        <CheckinButton type="IN" onPress={() => onCheckinPress('IN')} loading={loading} />
        <View className="w-3" />
        <CheckinButton type="OUT" onPress={() => onCheckinPress('OUT')} loading={loading} />
      </View>

      <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
        <Text className="text-slate-900 dark:text-white font-bold text-base mb-4">
          Today's Log Summary
        </Text>

        <View className="flex-row justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3" />
            <Text className="text-slate-600 dark:text-slate-300 font-medium text-sm">First Entry</Text>
          </View>
          <Text className="text-slate-900 dark:text-white font-bold text-sm">{formatTime(firstEntryLog?.time)}</Text>
        </View>

        <View className="flex-row justify-between items-center pt-3">
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-3" />
            <Text className="text-slate-600 dark:text-slate-300 font-medium text-sm">Last Exit</Text>
          </View>
          <Text className="text-slate-900 dark:text-white font-bold text-sm">{formatTime(lastExitLog?.time)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};