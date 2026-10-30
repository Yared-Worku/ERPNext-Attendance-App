import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { MainStackParamList } from '../../../navigation/types';
import { Header } from '../../../shared/components/Header';
import { HistoryList } from '../components/HistoryList';

type Props = NativeStackScreenProps<MainStackParamList, 'History'>;

export const HistoryScreen = ({ navigation }: Props) => {
  const { t } = useTranslation(); 

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <Header
        title={t('header.history')} 
        currentScreen="History"
        showBack
        onBackPress={() => navigation.goBack()}
        onNavigateLeave={() => navigation.navigate('Leave')}
      />
      <HistoryList />
    </SafeAreaView>
  );
};