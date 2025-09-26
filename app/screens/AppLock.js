import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const promptingRef = useRef(false);
  const mountedRef = useRef(true);

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
        if (mountedRef.current) {
          setAvailable(hasHardware);
          setEnrolled(isEnrolled);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Biometric availability check failed', error);
        }
      } finally {
        if (mountedRef.current) {
          setChecking(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!isFocused || !available || !enrolled) return;

    const timer = setTimeout(() => {
      if (!promptingRef.current) {
        void promptAuth();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isFocused, available, enrolled, promptAuth]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });

    return () => sub.remove();
  }, []);

  const promptAuth = useCallback(async () => {
    try {
      if (promptingRef.current || checking) return;
      promptingRef.current = true;

      if (!available || !enrolled) {
        Alert.alert(
          'Biometrics unavailable',
          'Set up Face ID or Touch ID in your system settings to unlock HustleLedger.'
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        cancelLabel: 'Cancel',
        disableDeviceFallback: Platform.OS === 'ios',
        requireConfirmation: false,
      });

      if (!mountedRef.current) return;

      if (result.success) {
        setTimeout(() => {
          if (mountedRef.current) {
            navigation.replace('RootTabs');
          }
        }, 150);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication failed', error);
      }
      Alert.alert('Error', 'Could not start authentication. Please try again.');
    } finally {
      promptingRef.current = false;
    }
  }, [available, enrolled, navigation]);

  const helperText = !available
    ? 'Biometric hardware is not available on this device.'
    : !enrolled
    ? 'Add Face ID or Touch ID in settings to unlock instantly.'
    : 'Use biometrics to keep your data encrypted.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient
        colors={[colors.bg, colors.bgSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, padding: spacing(3), justifyContent: 'center' }}
      >
        <View style={{ gap: spacing(2) }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>
            Authenticate to continue
          </Text>
          {!checking && (
            <Text style={{ color: colors.subtext, fontSize: 15, lineHeight: 20 }}>
              {helperText}
            </Text>
          )}
          <HLButton
            title={checking ? 'Checking biometrics…' : 'Unlock with Face ID'}
            onPress={promptAuth}
            disabled={checking || !available || !enrolled}
            accessibilityLabel="Unlock HustleLedger with biometrics"
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
