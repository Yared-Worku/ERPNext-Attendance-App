import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { Header } from '../../../shared/components/Header';
import { CheckinPanel } from '../components/CheckinPanel';

type Props = NativeStackScreenProps<MainStackParamList, 'Checkin'>;

export const CheckinScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <Header
        title="Attendance"
        currentScreen="Checkin"
        onNavigateHistory={() => navigation.navigate('History')}
      />
      <CheckinPanel />
    </SafeAreaView>
  );
};