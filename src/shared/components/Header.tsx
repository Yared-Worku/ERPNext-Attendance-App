import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAuthStore } from '../../store';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onNavigateHistory?: () => void;
  currentScreen?: 'Checkin' | 'History';
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Attendance',
  showBack = false,
  onBackPress,
  onNavigateHistory,
  currentScreen = 'Checkin',
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const userDisplay =
    typeof user === 'string'
      ? user
      : (user as any)?.email || (user as any)?.name || 'Employee';

  const initialLetter = userDisplay ? userDisplay.charAt(0).toUpperCase() : 'E';

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  return (
    <View className="px-5 py-3 flex-row items-center justify-between border-b border-slate-100 bg-white z-50">
      {/* Left: Navigation or Screen Title */}
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress}
            className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center active:bg-slate-200 mr-3"
          >
            <Text className="text-slate-700 font-bold text-base">←</Text>
          </TouchableOpacity>
        )}
        <Text className="text-slate-900 font-bold text-lg">{title}</Text>
      </View>

      {/* Right: Enterprise Profile Menu Trigger */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.7}
        className="flex-row items-center bg-slate-100 p-1 pr-2.5 rounded-full border border-slate-200/60"
      >
        <View className="w-8 h-8 rounded-full bg-slate-900 items-center justify-center">
          <Text className="text-white font-extrabold text-xs">{initialLetter}</Text>
        </View>
        <Text className="text-slate-500 font-bold text-xs ml-1.5">▾</Text>
      </TouchableOpacity>

      {/* Popover Action Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View className="flex-1 bg-black/20 justify-start items-end pt-14 pr-5">
            <TouchableWithoutFeedback>
              <View className="w-72 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
                {/* 1. Account Info Badge */}
                <View className="flex-row items-center pb-3 mb-3 border-b border-slate-100">
                  <View className="w-10 h-10 rounded-full bg-slate-900 items-center justify-center">
                    <Text className="text-white font-bold text-sm">{initialLetter}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                      Signed in as
                    </Text>
                    <Text className="text-slate-900 font-bold text-xs" numberOfLines={1}>
                      {userDisplay}
                    </Text>
                  </View>
                </View>

                {/* 2. Global Language Selector */}
                <View className="flex-row justify-between items-center py-2 mb-2">
                  <Text className="text-slate-600 font-medium text-xs">Language</Text>
                  <LanguageSwitcher />
                </View>

                {/* 3. Quick Navigation Link */}
                {onNavigateHistory && currentScreen === 'Checkin' && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuVisible(false);
                      onNavigateHistory();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-sky-50 mb-2 flex-row items-center justify-between"
                  >
                    <Text className="text-sky-700 font-semibold text-xs">Attendance History</Text>
                    <Text className="text-sky-700 font-bold text-xs">→</Text>
                  </TouchableOpacity>
                )}

                {/* 4. Sign Out */}
                <TouchableOpacity
                  onPress={handleLogout}
                  className="py-2.5 px-3 rounded-xl bg-rose-50 flex-row items-center justify-between mt-1"
                >
                  <Text className="text-rose-600 font-semibold text-xs">Sign Out</Text>
                  <Text className="text-rose-600 font-bold text-xs">🚪</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};