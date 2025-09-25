import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Text } from 'react-native-paper';
import HLButton from '../components/HLButton';
import GlassCard from '../components/GlassCard';
import { useColors, spacing } from '../lib/theme';

const AUTH_TYPE_LABELS = {
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Face ID',
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Touch ID',
  [LocalAuthentication.AuthenticationType.IRIS]: 'Iris',
};

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();

  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState([]);
  const [error, setError] = useState('');

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
        const [hasHardware, enrolledAsync, types] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);

        if (!mountedRef.current) {
          return;
        }

        setAvailable(hasHardware);
        setEnrolled(enrolledAsync);
        setSupportedTypes(types ?? []);
      } catch (err) {
        if (__DEV__) {
          console.warn('Biometric capability check failed', err);
        }
        setError('Face ID check did not finish. Try again in a moment.');
      } finally {
        if (mountedRef.current) {
          setChecking(false);
        }
      }
    })();
  }, []);

  const authLabel = useMemo(() => {
    if (!supportedTypes.length) {
      return 'Face ID';
    }

    const priorityOrder = [
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      LocalAuthentication.AuthenticationType.FINGERPRINT,
      LocalAuthentication.AuthenticationType.IRIS,
    ];

    const preferred = priorityOrder.find((type) => supportedTypes.includes(type));
    return AUTH_TYPE_LABELS[preferred] ?? 'Face ID';
  }, [supportedTypes]);

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || checking || !available || !enrolled || !mountedRef.current) {
      return;
    }

    promptingRef.current = true;
    setError('');

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Unlock with ${authLabel}`,
        cancelLabel: Platform.OS === 'ios' ? 'Use Passcode' : 'Cancel',
        fallbackLabel: Platform.OS === 'ios' ? 'Enter Passcode' : undefined,
        disableDeviceFallback: false,
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
        }, 120);
      } else if (result.error) {
        setError('Face ID was interrupted. Try again.');
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('Biometric auth failed to start', err);
      }
      setError('We could not start Face ID. Please try again.');
    } finally {
      promptingRef.current = false;
    }
  }, [authLabel, available, checking, enrolled, navigation]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        promptingRef.current = false;
        if (isFocused) {
          promptAuth();
        }
      }
    });
    return () => sub.remove();
  }, [isFocused, promptAuth]);

  useEffect(() => {
    if (!isFocused || checking) {
      return;
    }

    const timer = setTimeout(() => {
      promptAuth();
    }, 220);

    return () => clearTimeout(timer);
  }, [checking, isFocused, promptAuth]);

  const helperText = useMemo(() => {
    if (checking) {
      return 'Checking device security…';
    }
    if (!available) {
      return 'Biometrics are not supported on this device. Use your passcode in settings.';
    }
    if (!enrolled) {
      return 'Face ID is not set up yet. Add it in Settings to unlock faster.';
    }
    if (error) {
      return error;
    }
    return `${authLabel} keeps your ledger sealed when you look away.`;
  }, [authLabel, available, checking, enrolled, error]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, padding: spacing(2) }}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <GlassCard accessibilityLabel="Biometric unlock">
            <View style={{ gap: spacing(2) }}>
              <View style={{ gap: spacing(1) }}>
                <Text style={{ color: colors.muted, fontSize: 13, letterSpacing: 0.6 }}>
                  SECURE ACCESS
                </Text>
                <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', lineHeight: 30 }}>
                  Unlock with {authLabel}
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 15, lineHeight: 21 }}>{helperText}</Text>
              </View>

              {checking && (
                <ActivityIndicator animating color={colors.accent2} accessibilityLabel="Checking security" />
              )}

              <HLButton
                title={checking ? 'Please wait…' : `Use ${authLabel}`}
                onPress={promptAuth}
                disabled={checking || !available || !enrolled}
                accessibilityLabel={`Unlock with ${authLabel}`}
              />

              <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center' }}>
                Need to use your password? Sign out and sign back in for a passcode option.
              </Text>
            </View>
          </GlassCard>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
