import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const promptingRef = useRef(false);
  const mountedRef = useRef(true);
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || !mountedRef.current) {
      return;
    }

    try {
      promptingRef.current = true;

      if (!available || !enrolled) {
        Alert.alert(
          'Authentication unavailable',
          'Enable biometrics on your device to unlock HustleLedger.',
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        cancelLabel: 'Cancel',
        disableDeviceFallback: Platform.OS === 'ios',
        requireConfirmation: false,
      });

      if (!mountedRef.current) {
        return;
      }

      if (result.success) {
        setTimeout(() => {
          if (mountedRef.current) {
            navigation.replace('RootTabs');
          }
        }, 150);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication error', error);
      }
      Alert.alert('Error', 'Could not start biometric authentication.');
    } finally {
      promptingRef.current = false;
    }
  }, [available, enrolled, navigation]);

  useEffect(() => {
    if (!isFocused || checking || !available || !enrolled) {
      return;
    }
    const timer = setTimeout(() => {
      if (!promptingRef.current) {
        promptAuth();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [available, checking, enrolled, isFocused, promptAuth]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });
    return () => {
      sub.remove();
    };
  }, []);

  const subtitle = !available
    ? 'Biometric hardware is unavailable on this device.'
    : !enrolled
      ? 'Add a Face ID or fingerprint in system settings to continue.'
      : 'Authenticate to unlock your financial cockpit.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: spacing(3) }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing(1) }}>
          Unlock with biometrics
        </Text>
        <Text style={{ color: colors.subtext, lineHeight: 20, marginBottom: spacing(3) }}>
          {checking ? 'Checking device security…' : subtitle}
        </Text>
        <HLButton
          title={checking ? 'Please wait' : 'Unlock'}
          onPress={promptAuth}
          disabled={checking}
          accessibilityLabel="Unlock HustleLedger"
          accessibilityRole="button"
        />
      </View>
    </SafeAreaView>
  );
}
