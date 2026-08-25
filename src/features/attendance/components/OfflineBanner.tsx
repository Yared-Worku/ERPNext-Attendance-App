import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface OfflineBannerProps {
  pendingCount: number;
  isSyncing: boolean;
  onSyncPress: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  pendingCount,
  isSyncing,
  onSyncPress,
}) => {
  if (pendingCount === 0) return null;

  return (
    <View className="bg-amber-500/10 dark:bg-amber-900/20 border border-amber-500/30 dark:border-amber-800/50 rounded-xl p-4 mb-4 flex-row items-center justify-between">
      <View className="flex-1 mr-3">
        <Text className="text-amber-800 dark:text-amber-400 font-semibold text-sm">
          {pendingCount} Pending Check-{pendingCount === 1 ? 'in' : 'ins'}
        </Text>
        <Text className="text-amber-700/80 dark:text-amber-400/80 text-xs mt-0.5">
          Saved locally. Will auto-sync when internet reconnects.
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSyncPress}
        disabled={isSyncing}
        className="bg-amber-600 dark:bg-amber-500 active:bg-amber-700 px-3 py-2 rounded-lg flex-row items-center justify-center min-w-[80px]"
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-white font-medium text-xs">Sync Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};