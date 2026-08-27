import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
}

interface LeaveBalanceCardProps {
  balances?: LeaveBalance;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  balances = { annual: 14, sick: 8, casual: 3 },
}) => {
  const { t } = useTranslation();

  return (
    <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
        {t('leave.balanceSummary', 'Leave Balances')}
      </Text>
      <View className="flex-row justify-between">
        <View className="flex-1 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 rounded-2xl mr-2 border border-indigo-100 dark:border-indigo-900/50">
          <Text className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
            {t('leave.annual', 'Annual')}
          </Text>
          <Text className="text-slate-900 dark:text-white text-lg font-bold mt-0.5">
            {balances.annual}
          </Text>
        </View>
        <View className="flex-1 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-2xl mx-1 border border-emerald-100 dark:border-emerald-900/50">
          <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            {t('leave.sick', 'Sick')}
          </Text>
          <Text className="text-slate-900 dark:text-white text-lg font-bold mt-0.5">
            {balances.sick}
          </Text>
        </View>
        <View className="flex-1 bg-purple-50/60 dark:bg-purple-950/30 p-3 rounded-2xl ml-2 border border-purple-100 dark:border-purple-900/50">
          <Text className="text-purple-600 dark:text-purple-400 text-xs font-medium">
            {t('leave.casual', 'Casual')}
          </Text>
          <Text className="text-slate-900 dark:text-white text-lg font-bold mt-0.5">
            {balances.casual}
          </Text>
        </View>
      </View>
    </View>
  );
};