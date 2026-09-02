// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { CheckinScreen } from '../features/attendance/screens/CheckinScreen';
import { HistoryScreen } from '../features/attendance/screens/HistoryScreen';
import { LeaveScreen } from '../features/leave/screens/LeaveScreen'; 
import { ApplyLeaveScreen } from '../features/leave/screens/ApplyLeaveScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => (
  <Stack.Navigator initialRouteName="Checkin" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Checkin" component={CheckinScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="Leave" component={LeaveScreen} />
    <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
  </Stack.Navigator>
);