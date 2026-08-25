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
  title,
  showBack = false,
  onBackPress,
  onNavigateHistory,
  currentScreen = 'Checkin',
}) => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  // NativeWind Hook for Manual Theme Toggling
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const displayTitle = title || t('common.attendance');

  const userDisplay =
    typeof user === 'string'
      ? user
      : (user as any)?.email || (user as any)?.name || t('common.employee');

  const initialLetter = userDisplay ? userDisplay.charAt(0).toUpperCase() : 'E';

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  return (
    <View className="px-5 py-3.5 flex-row items-center justify-between border-b border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 z-50">
      
      {/* Left: Navigation or Screen Title */}
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mr-3"
          >
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-base mt-[-2px]">←</Text>
          </TouchableOpacity>
        )}
        <Text className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight">
          {displayTitle}
        </Text>
      </View>

      {/* Right: Theme Toggle & Profile Menu */}
      <View className="flex-row items-center">
        
        {/* Quick Theme Toggle (Outside Menu) */}
        <TouchableOpacity
          onPress={toggleColorScheme}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center mr-3"
        >
          <Text className="text-base mt-[-2px]">
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
        </TouchableOpacity>

        {/* Enterprise Profile Menu Trigger */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
          className="flex-row items-center bg-slate-50 dark:bg-slate-800 py-1 pl-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700"
        >
          <View className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 items-center justify-center ring-2 ring-white dark:ring-slate-900">
            <Text className="text-white font-bold text-xs">{initialLetter}</Text>
          </View>
          <Text className="text-slate-400 dark:text-slate-300 font-bold text-[10px] ml-2">▼</Text>
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
          <View className="flex-1 bg-slate-900/20 dark:bg-black/40 justify-start items-end pt-16 pr-5">
            <TouchableWithoutFeedback>
              <View 
                className="w-72 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800"
                style={{
                  ...Platform.select({
                    ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
                    android: { elevation: 10 },
                  })
                }}
              >
                {/* Account Info Badge */}
                <View className="flex-row items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <View className="w-11 h-11 rounded-full bg-slate-900 dark:bg-slate-700 items-center justify-center">
                    <Text className="text-white font-bold text-base">{initialLetter}</Text>
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
                <View className="flex-row justify-between items-center py-2 mb-3">
                  <Text className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
                    {t('header.language')}
                  </Text>
                  <LanguageSwitcher />
                </View>

                {/* Quick Navigation Link */}
                {onNavigateHistory && currentScreen === 'Checkin' && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuVisible(false);
                      onNavigateHistory();
                    }}
                    activeOpacity={0.7}
                    className="py-3 px-4 rounded-2xl bg-sky-50 dark:bg-sky-900/30 mb-2 flex-row items-center justify-between"
                  >
                    <Text className="text-sky-700 dark:text-sky-400 font-bold text-sm">
                      {t('header.history')}
                    </Text>
                    <Text className="text-sky-700 dark:text-sky-400 font-black text-sm">→</Text>
                  </TouchableOpacity>
                )}

                {/* Sign Out */}
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.7}
                  className="py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex-row items-center justify-between mt-1"
                >
                  <Text className="text-rose-600 dark:text-rose-400 font-bold text-sm">
                    {t('header.signOut')}
                  </Text>
                  <View className="w-5 h-5 rounded-full bg-rose-200/50 dark:bg-rose-900/50 items-center justify-center">
                    <Text className="text-rose-600 dark:text-rose-400 font-black text-[10px]">✕</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};