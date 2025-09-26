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
        if (mountedRef.current) setChecking(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isFocused || checking || !available || !enrolled) return;
    const timeout = setTimeout(() => {
      if (!promptingRef.current) promptAuth();
    }, 250);
    return () => clearTimeout(timeout);
  }, [isFocused, checking, available, enrolled, promptAuth]);

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
          'Enable Face ID or Touch ID in your device settings to unlock HustleLedger.',
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
          if (mountedRef.current) navigation.replace('RootTabs');
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

  return (
    <LinearGradient
      colors={[colors.bg, colors.bgSecondary ?? colors.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, padding: spacing(3) }}>
        <View
          style={{ flex: 1, justifyContent: 'center', gap: spacing(2) }}
          accessibilityLabel="Biometric unlock"
          accessibilityRole="summary"
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: '700',
              textAlign: 'center',
            }}
            allowFontScaling
          >
            Secure Command Center
          </Text>
          <Text
            style={{
              color: colors.subtext ?? 'rgba(231, 236, 255, 0.76)',
              textAlign: 'center',
              lineHeight: 20,
            }}
            allowFontScaling
          >
            Authenticate with Face ID to resume your AI-guided wealth strategy.
          </Text>
          <HLButton
            title={checking ? 'Preparing…' : 'Unlock'}
            onPress={promptAuth}
            accessibilityLabel="Unlock HustleLedger"
            disabled={checking}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
