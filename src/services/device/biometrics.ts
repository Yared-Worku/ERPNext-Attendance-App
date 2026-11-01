import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export interface BiometricCheckResult {
  isAvailable: boolean;
  biometricType: string;
}

/**
  Checks if biometric hardware exists and has enrolled biometrics (Face ID/Fingerprint)
 */
export const checkBiometricAvailability = async (): Promise<BiometricCheckResult> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType = 'Biometrics';
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'Fingerprint';
    }

    return {
      isAvailable: hasHardware && isEnrolled,
      biometricType,
    };
  } catch (error) {
    console.error('[Biometrics] Check failed:', error);
    return { isAvailable: false, biometricType: 'Biometrics' };
  }
};

/**
  Triggers native OS biometric prompt (Face ID / Fingerprint / Passcode fallback)
 */
export const authenticateWithBiometrics = async (
  promptMessage: string = 'Verify identity to confirm check-in'
): Promise<boolean> => {
  try {
    const { isAvailable, biometricType } = await checkBiometricAvailability();

    if (!isAvailable) {
      Alert.alert(
        'Biometrics Disabled',
        `Please ensure ${biometricType} is enabled in your device settings.`
      );
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error('[Biometrics] Authentication error:', error);
    Alert.alert('Authentication Error', 'Biometric check failed. Please try again.');
    return false;
  }
};