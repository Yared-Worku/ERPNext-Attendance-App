import * as LocalAuthentication from 'expo-local-authentication';

export async function checkBiometricHardware(): Promise<{
  hasHardware: boolean;
  isEnrolled: boolean;
}> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return { hasHardware, isEnrolled };
}

export async function authenticateWithBiometrics(
  promptMessage = 'Verify your identity to record attendance'
): Promise<boolean> {
  try {
    const { hasHardware, isEnrolled } = await checkBiometricHardware();

    // Pass through if hardware is missing or no biometrics enrolled on device
    if (!hasHardware || !isEnrolled) {
      console.warn('Biometrics not available or not enrolled. Proceeding without biometric check.');
      return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use PIN / Passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error('Biometric auth error:', error);
    return false;
  }
}
