import React from 'react';
import { View, Text } from 'react-native';

export interface LeaveApplicationItem {
  name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_leave_days: number;
  status: 'Open' | 'Approved' | 'Rejected' | 'Cancelled';
  description?: string;
}

interface LeaveCardProps {
  item: LeaveApplicationItem;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({ item }) => {
  const getStatusBadgeStyle = (status: LeaveApplicationItem['status']) => {
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

  const badgeClass = getStatusBadgeStyle(item.status);

  return (
    <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 border border-slate-100 dark:border-slate-700 shadow-sm">
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
};