import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export const StatusCard = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString([], {
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
            Shift Status
          </Text>
        </View>
        
        {/* GPS Ready Badge */}
        <View className="flex-row items-center bg-emerald-500/20 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 mr-2 animate-pulse" />
          <Text className="text-emerald-200 dark:text-emerald-400 text-xs font-medium">GPS Ready</Text>
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