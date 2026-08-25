import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next'; // 1. Import this
import { MainStackParamList } from '../../../navigation/types';
import { Header } from '../../../shared/components/Header';
import { CheckinPanel } from '../components/CheckinPanel';

type Props = NativeStackScreenProps<MainStackParamList, 'Checkin'>;

export const CheckinScreen = ({ navigation }: Props) => {
  const { t } = useTranslation(); // 2. Call the hook

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <Header
        title={t('common.attendance')} // 3. Use the translation key!
        currentScreen="Checkin"
        onNavigateHistory={() => navigation.navigate('History')}
      />
      <CheckinPanel />
    </SafeAreaView>
  );
};