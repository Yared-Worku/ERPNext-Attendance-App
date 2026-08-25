import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next'; // 1. Imported translation hook

interface CheckinButtonProps {
  type: 'IN' | 'OUT';
  onPress: () => void;
  loading: boolean;
}

export const CheckinButton = ({ type, onPress, loading }: CheckinButtonProps) => {
  const { t } = useTranslation(); // 2. Initialized the hook
  const isIn = type === 'IN';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      className={`flex-1 p-5 rounded-2xl border ${
        isIn
          ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-none dark:border-emerald-700'
          : 'bg-rose-600 border-rose-500 shadow-lg shadow-rose-200 dark:shadow-none dark:border-rose-700'
      }`}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
          <Text className="text-white font-bold text-sm">{isIn ? '↓' : '↑'}</Text>
        </View>
        <Text className="text-white/70 text-xs font-bold tracking-widest uppercase">
          {/* 3. Applied translations for Start/End Duty */}
          {isIn ? t('attendance.startDuty', 'Start Duty') : t('attendance.endDuty', 'End Duty')}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#ffffff" className="my-1" />
      ) : (
        <Text className="text-white text-2xl font-black tracking-wide">
          {/* 4. Used your existing common.checkIn / checkOut keys! */}
          {isIn ? t('common.checkIn', 'Check IN') : t('common.checkOut', 'Check OUT')}
        </Text>
      )}
    </TouchableOpacity>
  );
};