// app/screens/AppLock.js
import React from 'react';
import { View, Text } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();

  async function tryUnlock() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) throw new Error('No biometric hardware');

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) throw new Error('No biometrics enrolled');

      // Optional: check supported types (FaceID vs TouchID)
      // const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // allows passcode
        requireConfirmation: false,
      });

      if (result.success) {
        navigation.replace('RootTabs');
      } else if (result.error) {
        // user cancel / system cancel / lockout — stay on this screen
        console.log('Auth error:', result.error);
      }
    } catch (e) {
      console.log('Auth exception:', e?.message);
    }
  }

  React.useEffect(() => {
    if (isFocused) {
      // small delay so UI mounts before prompt
      const t = setTimeout(tryUnlock, 250);
      return () => clearTimeout(t);
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: spacing(3), backgroundColor: colors.bg }}>
      <Text style={{ color: colors.text, fontSize: 20, marginBottom: spacing(2) }}>
        Tap to unlock with Face ID
      </Text>
      <HLButton title="Unlock" onPress={tryUnlock} />
    </View>
  );
}
