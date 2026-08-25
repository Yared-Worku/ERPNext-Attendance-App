import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Denied',
      'Location access is required to verify your check-in position.'
    );
    return false;
  }
  return true;
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  try {
    // Attempt high-accuracy GPS capture
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.warn('[LocationService] High accuracy position timed out. Trying balanced accuracy...');
    
    // Fallback to cell/WiFi triangulation if GPS fails indoors
    try {
      const fallbackLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: fallbackLocation.coords.latitude,
        longitude: fallbackLocation.coords.longitude,
      };
    } catch (fallbackError) {
      Alert.alert('Location Error', 'Unable to retrieve current GPS position. Please check location settings.');
      return null;
    }
  }
};