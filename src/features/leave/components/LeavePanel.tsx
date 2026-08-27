import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LeaveApplication {
  name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_leave_days: number;
  status: 'Open' | 'Approved' | 'Rejected' | 'Cancelled';
  description: string;
}

interface LeavePanelProps {
  onNavigateApply?: () => void;
}

export const LeavePanel: React.FC<LeavePanelProps> = ({ onNavigateApply }) => {
  const { t, i18n } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock list mirroring Frappe Leave Application data structure
  const [leaveList, setLeaveList] = useState<LeaveApplication[]>([
    {
      name: 'HR-LAP-2026-00042',
      leave_type: 'Annual Leave',
      from_date: '2026-09-10',
      to_date: '2026-09-15',
      total_leave_days: 5,
      status: 'Approved',
      description: 'Family vacation and personal rest.',
    },
    {
      name: 'HR-LAP-2026-00038',
      leave_type: 'Sick Leave',
      from_date: '2026-08-02',
      to_date: '2026-08-03',
      total_leave_days: 2,
      status: 'Open',
      description: 'Medical checkup and recovery.',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Connect your actual useLeave hook or API action here
    setTimeout(() => setRefreshing(false), 800);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const getStatusBadgeStyle = (status: LeaveApplication['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
      case 'Open':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'Rejected':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <View className="flex-1 relative">
      <ScrollView
        contentContainerClassName="p-6 pb-24"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
      >
        {/* Leave Balances Summary Card */}
        <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            {t('leave.balanceSummary', 'Leave Balances')}
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-1 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 rounded-2xl mr-2 border border-indigo-100 dark:border-indigo-900/50">
              <Text className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">Annual</Text>
              <Text className="text-slate-900 dark:text-white text-lg font-bold mt-0.5">14</Text>
            </View>
            <View className="flex-1 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-2xl mx-1 border border-emerald-100 dark:border-emerald-900/50">
              <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Sick</Text>
              <Text className="text-slate-900 dark:text-white text-lg font-bold mt-0.5">8</Text>
            </View>
            <View className="flex-1 bg-purple-50/60 dark:bg-purple-950/30 p-3 rounded-2xl ml-2 border border-purple-100 dark:border-purple-900/50">
              <Text className="text-purple-600 dark:text-purple-400 text-xs font-medium">Casual</Text>
              <Text className="text-slate-900 dark:text-white text-lg font-bold mt-0.5">3</Text>
            </View>
          </View>
        </View>

        {/* Section Heading */}
        <View className="flex-row items-center justify-between mb-4 px-1">
          <Text className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('leave.myRequests', 'My Leave History')}
          </Text>
          <Text className="text-xs text-slate-400 dark:text-slate-600 font-medium">
            {leaveList.length} {t('common.records', 'records')}
          </Text>
        </View>

        {/* Leave Requests List */}
        {leaveList.length === 0 ? (
          <View className="bg-white dark:bg-slate-800 rounded-3xl p-8 items-center justify-center border border-slate-100 dark:border-slate-700">
            <Text className="text-3xl mb-2">🏝️</Text>
            <Text className="text-slate-800 dark:text-slate-200 font-semibold text-base">
              {t('leave.noRequests', 'No leave applications found')}
            </Text>
            <Text className="text-slate-400 dark:text-slate-500 text-xs text-center mt-1">
              {t('leave.noRequestsSub', 'Tap the button below to submit a new leave request.')}
            </Text>
          </View>
        ) : (
          leaveList.map((item) => {
            const badgeClass = getStatusBadgeStyle(item.status);
            return (
              <View
                key={item.name}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700/60 items-center justify-center mr-3">
                      <Text className="text-sm">📅</Text>
                    </View>
                    <View>
                      <Text className="text-slate-900 dark:text-white font-bold text-sm">
                        {item.leave_type}
                      </Text>
                      <Text className="text-slate-400 dark:text-slate-500 text-[11px]">
                        {item.name}
                      </Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full border ${badgeClass}`}>
                    <Text className="text-[11px] font-bold">{item.status}</Text>
                  </View>
                </View>

                <View className="my-2 py-3 border-t border-b border-slate-100 dark:border-slate-700/60 flex-row justify-between items-center">
                  <View>
                    <Text className="text-[10px] uppercase font-semibold text-slate-400">Duration</Text>
                    <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      {item.from_date} → {item.to_date}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] uppercase font-semibold text-slate-400">Total Days</Text>
                    <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {item.total_leave_days} {item.total_leave_days === 1 ? 'Day' : 'Days'}
                    </Text>
                  </View>
                </View>

                {item.description ? (
                  <Text className="text-slate-600 dark:text-slate-400 text-xs mt-1" numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button to trigger application form */}
      <View
        className="absolute bottom-6 right-6"
        style={Platform.select({
          ios: { shadowColor: '#6366F1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 8 },
          android: { elevation: 8 },
        })}
      >
        <TouchableOpacity
          onPress={onNavigateApply}
          activeOpacity={0.8}
          className="bg-indigo-600 dark:bg-indigo-500 flex-row items-center py-3.5 px-5 rounded-full"
        >
          <Text className="text-white text-base mr-2 font-bold">+</Text>
          <Text className="text-white font-bold text-sm tracking-wide">
            {t('leave.applyAction', 'Apply Leave')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};