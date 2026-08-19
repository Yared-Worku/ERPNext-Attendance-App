import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior for SDK 54+
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Android Notification Channels
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check / Request Permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission denied by user.');
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Device Push Token:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error('Failed to get Expo Push Token:', error);
    return null;
  }
}

export async function syncPushTokenToBackend(token: string): Promise<void> {
  try {
    console.log('Syncing Push Token to backend:', token);
  } catch (error) {
    console.error('Failed to sync push token with server:', error);
  }
}