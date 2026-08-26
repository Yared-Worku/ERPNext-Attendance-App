import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

interface CheckinButtonProps {
  type: 'IN' | 'OUT';
  onPress: () => void;
  loading: boolean;
}

export const CheckinButton = ({ type, onPress, loading }: CheckinButtonProps) => {
  const { t } = useTranslation();
  const isIn = type === 'IN';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      className={`flex-1 p-4 rounded-2xl ${
        isIn ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-rose-600 dark:bg-rose-700'
      } ${loading ? 'opacity-60' : ''}`}
      style={Platform.select({
        ios: {
          shadowColor: isIn ? '#059669' : '#e11d48',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 10,
        },
        android: { elevation: 4 },
      })}
    >
      <View className="flex-row justify-between items-center mb-2.5">
        <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center">
          <Ionicons
            name={isIn ? 'log-in-outline' : 'log-out-outline'}
            size={16}
            color="#ffffff"
          />
        </View>
        <Text className="text-white/75 text-[10px] font-bold tracking-widest uppercase">
          {isIn ? t('attendance.startDuty', 'Start Duty') : t('attendance.endDuty', 'End Duty')}
        </Text>
      </View>

      {loading ? (
        <View className="py-1.5 items-start">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        <Text className="text-white text-xl font-extrabold tracking-tight">
          {isIn ? t('common.checkIn', 'Check IN') : t('common.checkOut', 'Check OUT')}
        </Text>
      )}
    </TouchableOpacity>
  );
};