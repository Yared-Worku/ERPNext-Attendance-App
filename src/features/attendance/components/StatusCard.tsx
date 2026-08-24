
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
    <View className="bg-blue-600 rounded-3xl p-6 shadow-xl mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-blue-500/40 px-3 py-1 rounded-full border border-blue-400/30">
          <Text className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
            Shift Status
          </Text>
        </View>
        
        <View className="flex-row items-center bg-emerald-500/20 px-2.5 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          <Text className="text-emerald-200 text-xs font-medium">GPS Ready</Text>
        </View>
      </View>

      <Text className="text-white text-4xl font-extrabold tracking-tight">
        {formattedTime}
      </Text>
      <Text className="text-blue-200 font-medium text-sm mt-1">{formattedDate}</Text>
    </View>
  );
};