
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useCheckin } from '../hooks/useCheckin';
import { useAuthStore } from '../../../store';

export const CheckinScreen = () => {
  const { handleCheckin, loading } = useCheckin();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-between p-6">
        <View className="items-center mt-6">
          <Text className="text-2xl font-bold text-gray-900">Attendance Check-in</Text>
          <Text className="text-gray-500 mt-1">Logged in as {user}</Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            className="w-full bg-emerald-600 rounded-2xl py-6 items-center shadow-lg active:bg-emerald-700"
            onPress={() => handleCheckin('IN')}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-xl font-bold">Check IN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-rose-600 rounded-2xl py-6 items-center shadow-lg active:bg-rose-700"
            onPress={() => handleCheckin('OUT')}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-xl font-bold">Check OUT</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="items-center py-4" onPress={logout}>
          <Text className="text-gray-500 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};