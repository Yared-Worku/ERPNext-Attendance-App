import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LeaveCard } from './LeaveCard';
import { LeaveBalanceCard } from './LeaveBalanceCard';
import { useLeave } from '../hooks/useLeave'; 

interface LeavePanelProps {
  onNavigateApply?: () => void;
}

export const LeavePanel: React.FC<LeavePanelProps> = ({ onNavigateApply }) => {
  const { t } = useTranslation();
  const { leaves, balances, loading, loadLeaves } = useLeave();

  return (
    <View className="flex-1 relative">
      <ScrollView
        // Tighter bottom padding to minimize the gap above the floating button
        contentContainerClassName="p-6 pb-20"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLeaves} tintColor="#6366F1" />
        }
      >
        {/* Leave Balances Summary Widget Component with live balances passed */}
        <LeaveBalanceCard balances={balances} />

        {/* Section Heading */}
        <View className="flex-row items-center justify-between mb-4 px-1">
          <Text className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('leave.myRequests', 'My Leave History')}
          </Text>
          <Text className="text-xs text-slate-400 dark:text-slate-600 font-medium">
            {leaves.length} {t('common.records', 'records')}
          </Text>
        </View>

        {/* Leave Requests List or Loading/Empty States */}
        {loading && leaves.length === 0 ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator size="small" color="#6366F1" />
          </View>
        ) : leaves.length === 0 ? (
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
          leaves.map((item) => (
            <LeaveCard 
              key={item.name || item.from_date} 
              item={{
                ...item,
                name: item.name || 'TEMP-ID',
                total_leave_days: item.total_leave_days || 0,
                status: item.status || 'Open' // Fallback guarantee for status
              }} 
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button positioned closer to the last card */}
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