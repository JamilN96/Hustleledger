// app/screens/AppLock.js
import { useEffect, useState } from 'react';
import { View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

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
      } catch (error) {
        if (__DEV__) {
          console.warn('Biometric availability check failed', error);
        }
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
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication failed to start', error);
      }
      Alert.alert('Error', 'Could not start authentication.');
    }
  };

  // If device can’t do biometrics, let them continue (still premium UX)
  const continueWithoutBiometrics = () => navigation.replace('RootTabs');

  const content = (
    <GlassCard accessibilityLabel="App lock status">
      <LinearGradient
        colors={[colors.accent1 + '33', colors.accent2 + '22']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.lg, padding: spacing(1.5), marginBottom: spacing(2) }}
      >
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>Biometric shield</Text>
        <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
          Ledger AI locks your data behind Face ID / Touch ID and bank-grade encryption.
        </Text>
      </LinearGradient>

      <Text style={{ color: colors.subtext, marginBottom: spacing(2) }}>
        {available
          ? (enrolled
            ? 'Use your biometrics to unlock command center.'
            : 'Biometrics are available but not set up yet. You can continue without them.')
          : 'Biometrics are not available on this device.'}
      </Text>

      {available && enrolled ? (
        <HLButton title="Unlock with Face ID" onPress={tryAuth} accessibilityLabel="Unlock with biometrics" />
      ) : (
        <HLButton title="Continue without biometrics" onPress={continueWithoutBiometrics} accessibilityLabel="Continue without biometrics" />
      )}
    </GlassCard>
  );

  if (checking) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing(2) }}>
          {content}
          <Text style={{ color: colors.subtext, marginTop: spacing(2), textAlign: 'center' }}>Checking device security…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing(2) }}>
        {content}
      </View>
    </SafeAreaView>
  );
}
