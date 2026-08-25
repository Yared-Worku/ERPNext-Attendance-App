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
    <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4 flex-row items-center justify-between">
      <View className="flex-1 mr-3">
        <Text className="text-amber-800 font-semibold text-sm">
          {pendingCount} Pending Check-{pendingCount === 1 ? 'in' : 'ins'}
        </Text>
        <Text className="text-amber-700/80 text-xs mt-0.5">
          Saved locally. Will auto-sync when internet reconnects.
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSyncPress}
        disabled={isSyncing}
        className="bg-amber-600 active:bg-amber-700 px-3 py-2 rounded-lg flex-row items-center justify-center min-w-[80px]"
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