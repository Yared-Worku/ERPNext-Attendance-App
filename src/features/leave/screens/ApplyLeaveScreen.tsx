import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { MainStackParamList } from '../../../navigation/types';
import { Header } from '../../../shared/components/Header';
import { ApplyLeaveForm } from '../components/ApplyLeaveForm';

type Props = NativeStackScreenProps<MainStackParamList, 'ApplyLeave'>;

export const ApplyLeaveScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <Header
        title={t('leave.applyTitle', 'New Leave Request')}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        currentScreen="Leave"
      />
      <ApplyLeaveForm
        onSuccess={() => {
          // Navigate back or refresh history upon successful submission
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};