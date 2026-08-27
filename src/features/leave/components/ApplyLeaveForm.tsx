import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface ApplyLeaveFormProps {
  onSuccess?: () => void;
}

const LEAVE_TYPES = [
  { label: 'Annual Leave', value: 'Annual Leave' },
  { label: 'Sick Leave', value: 'Sick Leave' },
  { label: 'Casual Leave', value: 'Casual Leave' },
];

export const ApplyLeaveForm: React.FC<ApplyLeaveFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState('Annual Leave');
  const [fromDate, setFromDate] = useState('2026-09-10'); // Default format YYYY-MM-DD for ERPNext
  const [toDate, setToDate] = useState('2026-09-12');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fromDate || !toDate) {
      Alert.alert(t('common.error', 'Error'), t('leave.dateRequired', 'Please select both from and to dates.'));
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with your actual ERPNext API call, e.g.:
      // await apiClient.post('/api/resource/Leave Application', {
      //   leave_type: selectedType,
      //   from_date: fromDate,
      //   to_date: toDate,
      //   description: description,
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated network request
      
      Alert.alert(
        t('common.success', 'Success'),
        t('leave.submitSuccess', 'Leave application submitted successfully!'),
        [{ text: 'OK', onPress: () => onSuccess?.() }]
      );
    } catch (error) {
      console.error('Failed to submit leave application:', error);
      Alert.alert(t('common.error', 'Error'), t('leave.submitError', 'Failed to submit application. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerClassName="p-6 pb-24">
      {/* Leave Type Selector */}
      <View className="mb-5">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
          {t('leave.selectType', 'Leave Type')}
        </Text>
        <View className="flex-row space-x-2">
          {LEAVE_TYPES.map((type) => {
            const isSelected = selectedType === type.value;
            return (
              <TouchableOpacity
                key={type.value}
                onPress={() => setSelectedType(type.value)}
                activeOpacity={0.7}
                className={`flex-1 py-3 px-3 rounded-2xl border items-center justify-center ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {type.label.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Date Range Inputs */}
      <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-5 border border-slate-100 dark:border-slate-700 shadow-sm">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
          {t('leave.durationSection', 'Duration Dates (YYYY-MM-DD)')}
        </Text>

        <View className="mb-4">
          <Text className="text-slate-600 dark:text-slate-300 text-xs font-medium mb-1.5">
            {t('leave.fromDate', 'From Date')}
          </Text>
          <TextInput
            value={fromDate}
            onChangeText={setFromDate}
            placeholder="2026-09-10"
            placeholderTextColor="#94a3b8"
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white text-sm font-medium"
          />
        </View>

        <View>
          <Text className="text-slate-600 dark:text-slate-300 text-xs font-medium mb-1.5">
            {t('leave.toDate', 'To Date')}
          </Text>
          <TextInput
            value={toDate}
            onChangeText={setToDate}
            placeholder="2026-09-12"
            placeholderTextColor="#94a3b8"
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white text-sm font-medium"
          />
        </View>
      </View>

      {/* Reason / Description Input */}
      <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
          {t('leave.reason', 'Reason for Leave')}
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('leave.reasonPlaceholder', 'Provide details or description for your leave request...')}
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white text-sm"
          style={{ minHeight: 110 }}
        />
      </View>

      {/* Submit Action Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
        className="bg-indigo-600 dark:bg-indigo-500 py-4 rounded-2xl items-center justify-center shadow-lg shadow-indigo-500/25"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-base tracking-wide">
            {t('leave.submitButton', 'Submit Application')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};