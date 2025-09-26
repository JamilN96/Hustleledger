import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

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
    let cancelled = false;

    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = hasHardware ? await LocalAuthentication.isEnrolledAsync() : false;
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

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });
    return () => sub.remove();
  }, []);

  const biometricLabel = Platform.OS === 'ios' ? 'Face ID' : 'biometrics';
  const enrollmentLabel = Platform.OS === 'ios' ? 'Face ID or Touch ID' : 'your device biometrics';
  const buttonLabel = Platform.OS === 'ios' ? 'Unlock with Face ID' : 'Unlock with biometrics';
  const gradient = [colors.bgSecondary + 'E6', colors.bg + 'F2'];

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || checking || !mountedRef.current) return;
    promptingRef.current = true;

    try {
      if (!available || !enrolled) {
        Alert.alert(
          'Biometrics unavailable',
          `Update your device security settings to enable ${enrollmentLabel}.`,
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
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
        console.warn('Biometric authentication failed to start', error);
      }
      Alert.alert('Error', 'Could not start authentication.');
    } finally {
      promptingRef.current = false;
    }
  }, [available, checking, enrolled, enrollmentLabel, navigation]);

  useEffect(() => {
    if (!isFocused || checking) return;

    const timeout = setTimeout(() => {
      if (!promptingRef.current) {
        promptAuth();
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [checking, isFocused, promptAuth]);


  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: spacing(3),
          }}
          accessibilityLabel="Unlock HustleLedger"
          accessibilityRole="summary"
        >
          <View
            style={{
              borderRadius: radii.xl,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              padding: spacing(3),
              backgroundColor: colors.card + 'B3',
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 28,
                fontWeight: '800',
                marginBottom: spacing(1),
              }}
            >
              Biometric required
            </Text>
            <Text style={{ color: colors.subtext, lineHeight: 20 }}>
              Protect your mission control with {biometricLabel}. HustleLedger only unlocks after confirming it is you.
            </Text>

            {!checking && (!available || !enrolled) ? (
              <Text
                style={{
                  color: colors.danger,
                  marginTop: spacing(2),
                  lineHeight: 18,
                }}
              >
                Biometrics appear to be disabled on this device. Enable {enrollmentLabel} in system settings and try again.
              </Text>
            ) : null}

            <HLButton
              title={checking ? 'Checking biometrics…' : buttonLabel}
              onPress={promptAuth}
              disabled={checking || !available || !enrolled}
              style={{ marginTop: spacing(3) }}
              accessibilityLabel="Authenticate with biometrics"
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
