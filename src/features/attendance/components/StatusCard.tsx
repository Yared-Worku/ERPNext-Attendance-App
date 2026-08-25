import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next'; // 1. Imported translation hook

export const StatusCard = () => {
  const { t, i18n } = useTranslation(); // 2. Initialized hook, grabbed i18n for date/time localization
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Passed i18n.language so time/date automatically matches the selected language
  const formattedTime = time.toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString(i18n.language, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View className="bg-blue-600 dark:bg-slate-800 rounded-3xl p-6 shadow-xl dark:shadow-none dark:border dark:border-slate-700 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        
        {/* Shift Status Badge */}
        <View className="bg-blue-500/40 dark:bg-slate-700 px-3 py-1 rounded-full border border-blue-400/30 dark:border-slate-600">
          <Text className="text-blue-100 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
            {t('attendance.shiftStatus', 'Shift Status')} {/* 4. Applied translation */}
          </Text>
        </View>
        
        {/* GPS Ready Badge */}
        <View className="flex-row items-center bg-emerald-500/20 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 mr-2 animate-pulse" />
          <Text className="text-emerald-200 dark:text-emerald-400 text-xs font-medium">
            {t('attendance.gpsReady', 'GPS Ready')} {/* 4. Applied translation */}
          </Text>
        </View>
        
      </View>

      <Text className="text-white text-4xl font-extrabold tracking-tight">
        {formattedTime}
      </Text>
      <Text className="text-blue-200 dark:text-slate-400 font-medium text-sm mt-1">
        {formattedDate}
      </Text>
    </View>
  );
};