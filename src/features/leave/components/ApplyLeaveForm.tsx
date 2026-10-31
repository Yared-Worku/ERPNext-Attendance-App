import React, { useState } from 'react';
import { submitLeaveApplication } from '../api/leaveApi';
import { useAuthStore } from '../../../store'; 
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

interface ApplyLeaveFormProps {
  onSuccess?: () => void;
}

const LEAVE_TYPES = [
  { key: 'Annual Leave', labelKey: 'leave.annual', fallback: 'Annual' },
  { key: 'Sick Leave', labelKey: 'leave.sick', fallback: 'Sick' },
  { key: 'Casual Leave', labelKey: 'leave.casual', fallback: 'Casual' },
];

// Helper to format JS Date to YYYY-MM-DD securely considering local timezones
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const ApplyLeaveForm: React.FC<ApplyLeaveFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const user = useAuthStore((state: any) => state.user);

  const [selectedType, setSelectedType] = useState('Annual Leave');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Date Picker State
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'from' | 'to'>('from');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android fires the event and immediately closes the picker
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      if (pickerMode === 'from') {
        setFromDate(selectedDate);
        // Automatically ensure "To Date" is not before "From Date"
        if (selectedDate > toDate) {
          setToDate(selectedDate);
        }
      } else {
        setToDate(selectedDate);
      }
    }
  };

  const openPicker = (mode: 'from' | 'to') => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userIdentifier = typeof user === 'string' 
        ? user 
        : (user as any)?.user || (user as any)?.employee;

      await submitLeaveApplication({
        leave_type: selectedType,
        from_date: formatDate(fromDate), // Convert Date object back to YYYY-MM-DD
        to_date: formatDate(toDate),
        description: description,
      }, userIdentifier);
      
      Alert.alert(
        t('common.success', 'Success'),
        t('leave.submitSuccess', 'Leave application submitted successfully!'),
        [{ text: 'OK', onPress: () => onSuccess?.() }]
      );
    } catch (error: any) {
      console.error('Failed to submit leave application:', error);
      Alert.alert(t('common.error', 'Error'), error?.message || t('leave.submitError', 'Failed to submit application. Try again.'));
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
            const isSelected = selectedType === type.key;
            return (
              <TouchableOpacity
                key={type.key}
                onPress={() => setSelectedType(type.key)}
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
                  {t(type.labelKey, type.fallback)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Date Range Selectors */}
      <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-5 border border-slate-100 dark:border-slate-700 shadow-sm">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
          {t('leave.durationSection', 'Duration Dates')}
        </Text>

        <View className="mb-4">
          <Text className="text-slate-600 dark:text-slate-300 text-xs font-medium mb-1.5">
            {t('leave.fromDate', 'From Date')}
          </Text>
          <TouchableOpacity 
            onPress={() => openPicker('from')}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5"
          >
            <Text className="text-slate-900 dark:text-white text-sm font-medium">
              {formatDate(fromDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-slate-600 dark:text-slate-300 text-xs font-medium mb-1.5">
            {t('leave.toDate', 'To Date')}
          </Text>
          <TouchableOpacity 
            onPress={() => openPicker('to')}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5"
          >
            <Text className="text-slate-900 dark:text-white text-sm font-medium">
              {formatDate(toDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* The Native Date Picker Modal/Overlay */}
      {showPicker && (
        <DateTimePicker
          value={pickerMode === 'from' ? fromDate : toDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={pickerMode === 'to' ? fromDate : undefined} // Prevents selecting a 'to' date before 'from' date
        />
      )}

      {/* iOS requires a close button since the spinner doesn't auto-close like Android */}
      {Platform.OS === 'ios' && showPicker && (
        <TouchableOpacity 
          onPress={() => setShowPicker(false)}
          className="mb-4 items-end px-2"
        >
          <Text className="text-indigo-600 font-bold">Done</Text>
        </TouchableOpacity>
      )}

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