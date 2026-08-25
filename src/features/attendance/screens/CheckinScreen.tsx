import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useCheckin } from '../hooks/useCheckin';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { StatusCard } from '../components/StatusCard';
import { CheckinButton } from '../components/CheckinButton';
import { OfflineBanner } from '../components/OfflineBanner';
import { Header } from '../../../shared/components/Header';

type Props = NativeStackScreenProps<MainStackParamList, 'Checkin'>;

export const CheckinScreen = ({ navigation }: Props) => {
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
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Shared Reusable Header */}
      <Header
  title="Attendance"
  currentScreen="Checkin"
  onNavigateHistory={() => navigation.navigate('History')}
   />

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

        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-base mb-4">
            Today's Log Summary
          </Text>

          <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3" />
              <Text className="text-slate-600 font-medium text-sm">First Entry</Text>
            </View>
            <Text className="text-slate-900 font-bold text-sm">{formatTime(firstEntryLog?.time)}</Text>
          </View>

          <View className="flex-row justify-between items-center pt-3">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-3" />
              <Text className="text-slate-600 font-medium text-sm">Last Exit</Text>
            </View>
            <Text className="text-slate-900 font-bold text-sm">{formatTime(lastExitLog?.time)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};