import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next'; 
import { useAuthStore } from '../../../store';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { useCheckin } from '../hooks/useCheckin';

export interface AttendanceRecord {
  id: string;
  time: string;
  logType: 'IN' | 'OUT';
  isPending?: boolean;
}

export const HistoryList = () => {
  const { t, i18n } = useTranslation(); 
  const { logs, loading, onRefresh } = useAttendanceHistory();
  const { pendingCount } = useCheckin();

  const offlineQueue = useAuthStore(
    (state: any) => state.offlineQueue || state.pendingQueue || state.queue || []
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const handlePullToRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  const formattedPendingLogs: AttendanceRecord[] = (offlineQueue || []).map(
    (item: any, index: number) => ({
      id: item?.id || `pending-${index}-${item?.timestamp || Date.now()}`,
      time: item?.timestamp || item?.time || new Date().toISOString(),
      logType: item?.log_type || item?.logType || 'IN',
      isPending: true,
    })
  );

  const formattedServerLogs: AttendanceRecord[] = (Array.isArray(logs) ? logs : []).map(
    (item: any, index: number) => ({
      id: item?.name || item?.id || `server-${index}-${item?.time}`,
      time: item?.time || item?.timestamp,
      logType: item?.logType || item?.log_type || 'IN',
      isPending: false,
    })
  );

  const allLogs = [...formattedPendingLogs, ...formattedServerLogs].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { dateStr: 'Invalid Date', timeStr: '--:--' };

    return {
      dateStr: date.toLocaleDateString(i18n.language, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      timeStr: date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => {
    const { dateStr, timeStr } = formatDate(item.time);
    const isIn = item.logType === 'IN';

    return (
      <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-100 dark:border-slate-700 shadow-sm flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-2">
          {/* Dynamic dark mode background/borders for IN vs OUT circles */}
          <View
            className={`w-11 h-11 rounded-2xl items-center justify-center mr-3.5 ${
              isIn 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800'
            }`}
          >
            <Text className={`font-black text-xs tracking-wider ${isIn ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {item.logType}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white font-bold text-base mb-0.5">{timeStr}</Text>
            <Text className="text-slate-400 dark:text-slate-500 text-xs font-medium">{dateStr}</Text>
          </View>
        </View>

        {item.isPending ? (
          <View className="bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full border border-amber-200/60 dark:border-amber-800/60 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            <Text className="text-amber-700 dark:text-amber-400 font-semibold text-xs">
              {t('attendance.pending', 'Pending')}
            </Text>
          </View>
        ) : (
          <View className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            <Text className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
              {t('attendance.synced', 'Synced')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1">
      <View className="px-6 py-4 flex-row space-x-3">
        <View className="flex-1 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <Text className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            {t('attendance.totalLogs', 'Total Logs')}
          </Text>
          <Text className="text-slate-900 dark:text-white font-extrabold text-xl">{allLogs.length}</Text>
        </View>

        <View className="flex-1 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <Text className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            {t('attendance.pendingSync')}
          </Text>
          <Text className="text-amber-600 dark:text-amber-500 font-extrabold text-xl">
            {pendingCount ?? formattedPendingLogs.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={allLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerClassName="px-6 pb-6 pt-1 flex-grow"
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={handlePullToRefresh}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="flex-1 justify-center items-center py-16">
              <View className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 justify-center items-center mb-4">
                <Text className="text-slate-400 dark:text-slate-600 font-bold text-2xl">📋</Text>
              </View>
              <Text className="text-slate-800 dark:text-slate-200 font-bold text-base mb-1">
                {t('attendance.noLogs', 'No Attendance Logs Found')}
              </Text>
              <Text className="text-slate-400 dark:text-slate-500 text-xs text-center max-w-[220px]">
                {t('attendance.noLogsDesc', 'Your checked-in and checked-out activity logs will be listed here.')}
              </Text>
            </View>
          ) : (
            <View className="py-12 justify-center items-center">
              <ActivityIndicator size="large" color="#0284c7" />
            </View>
          )
        }
      />
    </View>
  );
};