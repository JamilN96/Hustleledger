// app/screens/AppLock.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Alert, AppState, Platform } from 'react-native';
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
  const [available, setAvailable] = useState(true);
  const [enrolled, setEnrolled] = useState(true);
  const promptingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!cancelled) {
          setAvailable(hasHardware);
          setEnrolled(isEnrolled);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Biometric availability check failed', error);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || checking) {
      return;
    }

    if (!available || !enrolled) {
      Alert.alert(
        'Face ID unavailable',
        'Set up Face ID or Touch ID in your device settings to unlock HustleLedger.'
      );
      return;
    }

    promptingRef.current = true;

    try {
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
        console.warn('Biometric authentication failed to start', error);
      }
      Alert.alert('Error', 'Could not start authentication.');
    } finally {
      promptingRef.current = false;
    }
  }, [available, checking, enrolled, navigation]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const timer = setTimeout(() => {
      if (!promptingRef.current) {
        void promptAuth();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isFocused, promptAuth]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });
    return () => sub.remove();
  }, []);

  const headline = available && enrolled
    ? 'Unlock with Face ID'
    : 'Secure your account';
  const bodyCopy = !available
    ? 'This device does not support biometrics. Update your security settings to continue.'
    : !enrolled
      ? 'Biometrics are turned off. Enroll your face or fingerprint to unlock HustleLedger.'
      : 'Face ID keeps your financial command center locked until you authenticate.';

  return (
    <LinearGradient
      colors={[colors.accent1 + '22', colors.accent2 + '22']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing(3) }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing(1.5) }}>
            {headline}
          </Text>
          <Text style={{ color: colors.subtext ?? colors.text, marginBottom: spacing(3), lineHeight: 20 }}>
            {bodyCopy}
          </Text>
          <HLButton
            title={checking ? 'Checking sensors…' : 'Unlock'}
            onPress={promptAuth}
            disabled={checking || !available || !enrolled}
            accessibilityLabel="Authenticate to unlock HustleLedger"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
