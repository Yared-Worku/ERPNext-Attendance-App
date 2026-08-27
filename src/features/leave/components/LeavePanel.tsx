import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LeaveCard, LeaveApplicationItem } from './LeaveCard';
import { LeaveBalanceCard } from './LeaveBalanceCard';

interface LeavePanelProps {
  onNavigateApply?: () => void;
}

export const LeavePanel: React.FC<LeavePanelProps> = ({ onNavigateApply }) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock list mirroring Frappe Leave Application data structure
  const [leaveList, setLeaveList] = useState<LeaveApplicationItem[]>([
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

  return (
    <View className="flex-1 relative">
      <ScrollView
        // Increased bottom padding so the last card is fully scrollable above the button
        contentContainerClassName="p-6 pb-36"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
      >
        {/* Leave Balances Summary Widget Component */}
        <LeaveBalanceCard />

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
          leaveList.map((item) => <LeaveCard key={item.name} item={item} />)
        )}
      </ScrollView>

      {/* Floating Action Button with increased bottom offset */}
      <View
        className="absolute bottom-20 right-8 z-50"
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