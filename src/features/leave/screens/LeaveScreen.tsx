import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { MainStackParamList } from '../../../navigation/types';
import { Header } from '../../../shared/components/Header';
import { LeavePanel } from '../components/LeavePanel';

type Props = NativeStackScreenProps<MainStackParamList, 'Leave'>;

export const LeaveScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <Header
        title={t('leave.title', 'Leave Management')}
        currentScreen="Leave"
        onNavigateHistory={() => navigation.navigate('History')}
        onNavigateLeave={() => {}} // Already on Leave screen
      />
      <LeavePanel onNavigateApply={() => {
        navigation.navigate('ApplyLeave'); // Uncomment when apply screen is ready
      }} />
    </SafeAreaView>
  );
};