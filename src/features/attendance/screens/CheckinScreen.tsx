
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store';
import { useCheckin } from '../hooks/useCheckin';
import { StatusCard } from '../components/StatusCard';
import { CheckinButton } from '../components/CheckinButton';

export const CheckinScreen = () => {
  const { handleCheckin, loading } = useCheckin();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initialLetter = user ? user.charAt(0).toUpperCase() : 'E';

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerClassName="p-6">
        
        {/* User Header Profile */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-slate-900 items-center justify-center shadow-md">
              <Text className="text-white font-extrabold text-lg">{initialLetter}</Text>
            </View>
            <View className="ml-3">
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Employee
              </Text>
              <Text className="text-slate-900 font-bold text-base">{user}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={logout}
            className="bg-slate-200/60 px-3.5 py-2 rounded-xl active:bg-slate-300"
          >
            <Text className="text-slate-700 font-semibold text-xs">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Live Clock & Status Card */}
        <StatusCard />

        {/* Action Buttons Row */}
        <View className="flex-row space-x-4 mb-6">
          <CheckinButton type="IN" onPress={() => handleCheckin('IN')} loading={loading} />
          <View className="w-3" />
          <CheckinButton type="OUT" onPress={() => handleCheckin('OUT')} loading={loading} />
        </View>

        {/* Today's Activity Summary Card */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-base mb-4">
            Today's Log Summary
          </Text>

          <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3" />
              <Text className="text-slate-600 font-medium text-sm">First Entry</Text>
            </View>
            <Text className="text-slate-900 font-bold text-sm">-- : --</Text>
          </View>

          <View className="flex-row justify-between items-center pt-3">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-3" />
              <Text className="text-slate-600 font-medium text-sm">Last Exit</Text>
            </View>
            <Text className="text-slate-900 font-bold text-sm">-- : --</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};