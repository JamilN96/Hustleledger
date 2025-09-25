// app/screens/AppLock.js
import React, { useEffect, useState } from 'react';
import { View, Alert, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setAvailable(hasHardware);
        setEnrolled(isEnrolled);
      } catch (_error) {
        // If anything fails, allow continue button
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const tryAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: Platform.OS === 'ios' ? 'Unlock with Face ID' : 'Unlock',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.replace('RootTabs'); // go into the app
      } else {
        Alert.alert('Locked', 'Authentication failed.');
      }
    } catch (_error) {
      Alert.alert('Error', 'Could not start authentication.');
    }
  };

  // If device can’t do biometrics, let them continue (still premium UX)
  const continueWithoutBiometrics = () => navigation.replace('RootTabs');

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing(2), backgroundColor: colors.bg }}>
        <Text style={{ color: colors.text, textAlign: 'center' }}>Checking device security…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: spacing(2), backgroundColor: colors.bg }}>
      <GlassCard>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: spacing(1) }}>
          App Locked
        </Text>
        <Text style={{ color: colors.subtext, marginBottom: spacing(2) }}>
          {available
            ? (enrolled
              ? 'Use Face ID / Touch ID to unlock.'
              : 'Biometrics available, but not set up. You can continue without it.')
            : 'Biometrics not available on this device.'}
        </Text>

        {available && enrolled ? (
          <HLButton title="Unlock with Face ID" onPress={tryAuth} />
        ) : (
          <HLButton title="Continue without biometrics" onPress={continueWithoutBiometrics} />
        )}
      </GlassCard>
    </View>
  );
}
