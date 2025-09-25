import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const promptingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (mounted) {
          setAvailable(hasHardware);
          setEnrolled(isEnrolled);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Biometric availability check failed', error);
        }
        if (mounted) {
          setMessage('We could not verify Face ID availability.');
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (appStateRef.current.match(/inactive|background/) && state === 'active') {
        promptingRef.current = false;
      }
      appStateRef.current = state;
    });
    return () => subscription.remove();
  }, []);

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || checking) {
      return;
    }

    if (!available || !enrolled) {
      setMessage('Enable Face ID or Touch ID in your device settings to unlock with biometrics.');
      return;
    }

    promptingRef.current = true;
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        cancelLabel: 'Cancel',
        disableDeviceFallback: Platform.OS === 'android',
        requireConfirmation: false,
      });

      if (result.success) {
        navigation.replace('RootTabs');
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication failed to start', error);
      }
      Alert.alert('Authentication error', 'Could not start Face ID or Touch ID.');
    } finally {
      promptingRef.current = false;
    }
  }, [available, checking, enrolled, navigation]);

  useEffect(() => {
    if (isFocused) {
      const timeout = setTimeout(() => {
        promptAuth();
      }, 250);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isFocused, promptAuth]);

  return (
    <LinearGradient
      colors={[colors.bg, colors.bgSecondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: spacing(3) }}>
        <View accessible accessibilityRole="summary" accessibilityLabel="Unlock HustleLedger">
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing(1.5) }}>
            Unlock with Face ID
          </Text>
          <Text style={{ color: colors.subtext, lineHeight: 20, marginBottom: spacing(3) }}>
            HustleLedger keeps your command center secured. Authenticate to re-enter your dashboard.
          </Text>
          {!!message && (
            <Text style={{ color: colors.danger, marginBottom: spacing(1) }} accessibilityRole="alert">
              {message}
            </Text>
          )}
          <HLButton
            title={checking ? 'Checking…' : 'Unlock'}
            onPress={promptAuth}
            disabled={checking}
            accessibilityLabel="Authenticate with biometrics"
          />
          <Text
            style={{ color: colors.subtext, marginTop: spacing(2), fontSize: 13 }}
            accessibilityRole="text"
          >
            Having trouble? You can set up biometrics in your device settings and reopen HustleLedger.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
