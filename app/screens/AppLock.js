import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const promptingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [hasHardware, isEnrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);

        if (isMounted) {
          setAvailable(hasHardware && isEnrolled);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Unable to determine biometric availability', error);
        }
      } finally {
        if (isMounted) setChecking(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || checking) return;

    try {
      promptingRef.current = true;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        disableDeviceFallback: Platform.OS === 'ios',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setTimeout(() => {
          promptingRef.current = false;
          navigation.replace('RootTabs');
        }, 150);
      } else {
        promptingRef.current = false;
      }
    } catch (error) {
      promptingRef.current = false;
      if (__DEV__) {
        console.warn('Biometric authentication failed to start', error);
      }
    }
  }, [checking, navigation]);

  useEffect(() => {
    if (!isFocused || !available || checking) return;
    const timeout = setTimeout(() => {
      if (!promptingRef.current) {
        void promptAuth();
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [available, checking, isFocused, promptAuth]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.background, colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: spacing(3),
            gap: spacing(2),
          }}
        >
          <Text
            style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}
            accessibilityRole="header"
          >
            Unlock with Face ID
          </Text>
          <Text style={{ color: colors.subtext, fontSize: 15, lineHeight: 20 }}>
            Secure your financial cockpit with biometrics. You can enable passcode
            fallback in settings if needed.
          </Text>
          <HLButton
            title={checking ? 'Checking biometrics…' : 'Unlock'}
            onPress={promptAuth}
            disabled={!available || checking}
            accessibilityLabel="Unlock HustleLedger with biometrics"
            style={{ borderRadius: radii.lg }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
