import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../store';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onNavigateHistory?: () => void;
  onNavigateLeave?: () => void; // 1. Added optional leave navigation prop
  currentScreen?: 'Checkin' | 'History' | 'Leave'; // 2. Added 'Leave' to screen types
}

// Deterministic accent per user — gives every account a stable, distinct identity
const AVATAR_RING_COLORS = [
  '#6366F1', // indigo
  '#0EA5E9', // sky
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // violet
];

function getAccentColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_RING_COLORS[Math.abs(hash) % AVATAR_RING_COLORS.length];
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  onNavigateHistory,
  onNavigateLeave,
  currentScreen = 'Checkin',
}) => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { colorScheme, setColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleToggleTheme = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setColorScheme(newTheme);
    try {
      await AsyncStorage.setItem('@app_theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  const displayTitle = title || t('common.attendance');

  const userDisplay =
    typeof user === 'string'
      ? user
      : (user as any)?.email || (user as any)?.name || t('common.employee');

  const initialLetter = userDisplay ? userDisplay.charAt(0).toUpperCase() : 'E';
  const accentColor = getAccentColor(userDisplay || 'E');

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  const getEyebrowText = () => {
    if (currentScreen === 'Checkin') return t('header.eyebrowCheckin', 'Live status');
    if (currentScreen === 'History') return t('header.eyebrowHistory', 'Attendance log');
    return t('leave.title', 'Leave Management');
  };

  return (
    <View
      className="px-5 py-3 flex-row items-center justify-between bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/70 dark:border-slate-800/70 z-50"
      style={Platform.select({
        ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
        android: { elevation: 2 },
      })}
    >
      {/* Left: Navigation or Screen Title */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="w-9 h-9 rounded-full items-center justify-center mr-3 bg-slate-100 dark:bg-slate-900"
          >
            <Text className="text-slate-600 dark:text-slate-300 font-semibold text-base">‹</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text className="text-slate-950 dark:text-white font-bold text-[19px] tracking-[-0.3px]">
            {displayTitle}
          </Text>
          <Text className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide mt-0.5">
            {getEyebrowText()}
          </Text>
        </View>
      </View>

      {/* Right: Theme Toggle & Profile Trigger */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={handleToggleTheme}
          activeOpacity={0.6}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-9 h-9 rounded-full items-center justify-center mr-2.5 bg-slate-100 dark:bg-slate-900"
        >
          <Text className="text-[15px]">{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.75}
          className="relative"
        >
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{
              borderWidth: 2,
              borderColor: accentColor,
            }}
          >
            <View className="w-full h-full rounded-full items-center justify-center bg-slate-900 dark:bg-slate-800">
              <Text className="text-white font-bold text-xs">{initialLetter}</Text>
            </View>
          </View>
          {/* Presence dot */}
          <View
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950"
            style={{ backgroundColor: '#10B981' }}
          />
        </TouchableOpacity>
      </View>

      {/* Popover Action Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View className="flex-1 bg-slate-950/25 dark:bg-black/50 justify-start items-end pt-16 pr-5">
            <TouchableWithoutFeedback>
              <View
                className="w-60 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-100 dark:border-slate-800"
                style={Platform.select({
                  ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 24 },
                  android: { elevation: 12 },
                })}
              >
                {/* Account Info Badge */}
                <View className="flex-row items-center px-3 pt-3 pb-4 mb-1 border-b border-slate-100 dark:border-slate-800">
                  <View
                    className="w-11 h-11 rounded-full items-center justify-center"
                    style={{ borderWidth: 2, borderColor: accentColor }}
                  >
                    <View className="w-full h-full rounded-full items-center justify-center bg-slate-900 dark:bg-slate-800">
                      <Text className="text-white font-bold text-sm">{initialLetter}</Text>
                    </View>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      {t('header.signedInAs')}
                    </Text>
                    <Text className="text-slate-900 dark:text-white font-bold text-sm" numberOfLines={1}>
                      {userDisplay}
                    </Text>
                  </View>
                </View>

                {/* Global Language Selector */}
                <View className="px-3 py-2 mb-1">
                  <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                    {t('header.language')}
                  </Text>
                  <LanguageSwitcher />
                </View>

                {/* Quick Navigation Link: History */}
                {onNavigateHistory && currentScreen !== 'History' && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuVisible(false);
                      onNavigateHistory();
                    }}
                    activeOpacity={0.6}
                    className="py-3 px-3 rounded-xl mb-1 flex-row items-center justify-between"
                  >
                    <Text className="text-slate-700 dark:text-slate-200 font-semibold text-sm">
                      {t('header.history')}
                    </Text>
                    <Text className="text-slate-300 dark:text-slate-600 font-bold text-sm">›</Text>
                  </TouchableOpacity>
                )}

                {/* Quick Navigation Link: Leave Management */}
                {onNavigateLeave && currentScreen !== 'Leave' && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuVisible(false);
                      onNavigateLeave();
                    }}
                    activeOpacity={0.6}
                    className="py-3 px-3 rounded-xl mb-1 flex-row items-center justify-between"
                  >
                    <Text className="text-slate-700 dark:text-slate-200 font-semibold text-sm">
                      {t('leave.title', 'Leave Management')}
                    </Text>
                    <Text className="text-slate-300 dark:text-slate-600 font-bold text-sm">›</Text>
                  </TouchableOpacity>
                )}

                {/* Sign Out */}
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.6}
                  className="py-3 px-3 rounded-xl flex-row items-center justify-between"
                >
                  <Text className="text-rose-600 dark:text-rose-400 font-semibold text-sm">
                    {t('header.signOut')}
                  </Text>
                  <Text className="text-rose-300 dark:text-rose-700 font-bold text-sm">›</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};