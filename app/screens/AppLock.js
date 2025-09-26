import { useCallback, useEffect, useRef, useState } from 'react';
<<<<<<< HEAD
import { View, Text, Alert, AppState, Platform } from 'react-native';
=======
import { AppState, Alert, Platform, Text, View } from 'react-native';
>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
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
<<<<<<< HEAD
        if (mountedRef.current) setChecking(false);
=======
        if (mountedRef.current) {
          setChecking(false);
        }
>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
      }
    })();
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (!isFocused || checking || !available || !enrolled) return;
    const timeout = setTimeout(() => {
      if (!promptingRef.current) promptAuth();
    }, 250);
    return () => clearTimeout(timeout);
  }, [isFocused, checking, available, enrolled, promptAuth]);

=======
    if (!isFocused || !available || !enrolled) return;

    const timer = setTimeout(() => {
      if (!promptingRef.current) {
        void promptAuth();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isFocused, available, enrolled, promptAuth]);

>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
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
<<<<<<< HEAD
          'Enable Face ID or Touch ID in your device settings to unlock HustleLedger.',
=======
          'Set up Face ID or Touch ID in your system settings to unlock HustleLedger.'
>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
  );
}
