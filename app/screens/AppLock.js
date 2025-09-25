import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

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
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });
    return () => sub.remove();
  }, []);

  const promptAuth = useCallback(async () => {
    try {
      if (promptingRef.current || !mountedRef.current) return;
      promptingRef.current = true;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        cancelLabel: 'Cancel',
        disableDeviceFallback: Platform.OS === 'ios',
        requireConfirmation: false,
      });

      if (!mountedRef.current) return;

      if (result.success) {
        globalThis.setTimeout(() => {
          if (mountedRef.current) {
            navigation.replace('RootTabs');
          }
        }, 160);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication error', error);
      }
      Alert.alert('Authentication failed', 'Please try again.');
    } finally {
      promptingRef.current = false;
    }
  }, [navigation]);

  useEffect(() => {
    if (!isFocused || !available || !enrolled) return;
    const timeout = globalThis.setTimeout(() => {
      if (!promptingRef.current) {
        promptAuth();
      }
    }, 250);
    return () => globalThis.clearTimeout(timeout);
  }, [available, enrolled, isFocused, promptAuth]);

  const disabledCopy = !available
    ? 'Biometric authentication is not available on this device.'
    : !enrolled
      ? 'Set up Face ID or Touch ID in settings to continue.'
      : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing(3) }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: spacing(1) }}>
            Unlock command center
          </Text>
          <Text style={{ color: colors.subtext, marginBottom: spacing(2), lineHeight: spacing(2.25) }}>
            Secure biometric access keeps your ledgers private. We never store your Face ID or Touch ID data.
          </Text>
          {!!disabledCopy && (
            <Text style={{ color: colors.danger, marginBottom: spacing(2) }}>
              {disabledCopy}
            </Text>
          )}
          <HLButton
            title={checking ? 'Checking biometrics…' : 'Unlock with Face ID'}
            onPress={promptAuth}
            disabled={!available || !enrolled || checking}
            accessibilityLabel="Unlock HustleLedger with biometrics"
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
