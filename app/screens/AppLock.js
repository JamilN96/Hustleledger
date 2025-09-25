import { useEffect, useRef, useState } from 'react';
import { AppState, Alert, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, ActivityIndicator } from 'react-native-paper';
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
        promptAuth();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [available, enrolled, isFocused]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });
    return () => sub.remove();
  }, []);

  const promptAuth = async () => {
    if (promptingRef.current || !mountedRef.current) return;
    promptingRef.current = true;

    try {
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
        }, 180);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication failed to start', error);
      }
      Alert.alert('Authentication failed', 'Try again or use your passcode.');
    } finally {
      promptingRef.current = false;
    }
  };

  const showFallback = !available || !enrolled;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.bg, colors.bgSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing(3) }}>
          <Text style={{ color: colors.subtext, fontWeight: '600', marginBottom: spacing(1) }}>
            Secure entry
          </Text>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: spacing(2) }}>
            Unlock HustleLedger
          </Text>
          <Text style={{ color: colors.subtext, lineHeight: 20, marginBottom: spacing(2) }}>
            Face ID on iOS 16+ keeps your command center private. We silence the passcode sheet to avoid crashes on older builds.
          </Text>

          {checking ? (
            <ActivityIndicator color={colors.accent1} accessibilityLabel="Checking Face ID availability" />
          ) : showFallback ? (
            <>
              <Text style={{ color: colors.danger, marginBottom: spacing(2), lineHeight: 20 }}>
                {available
                  ? 'Enroll Face ID or Touch ID in Settings to unlock instantly next time.'
                  : 'This device does not support Face ID or Touch ID. Use your passcode to continue.'}
              </Text>
              <HLButton
                title="Continue without Face ID"
                onPress={() => navigation.replace('RootTabs')}
                accessibilityLabel="Continue without biometric authentication"
              />
            </>
          ) : (
            <HLButton
              title="Authenticate with Face ID"
              onPress={promptAuth}
              accessibilityLabel="Authenticate with Face ID"
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
