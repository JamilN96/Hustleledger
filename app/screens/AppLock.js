import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, AppState, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { spacing, radii, useColors } from '../lib/theme';

const PROMPT_MESSAGE = Platform.select({ ios: 'Unlock HustleLedger', android: 'Unlock HustleLedger' });

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const promptingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (isMounted) {
          setAvailable(hasHardware);
          setEnrolled(isEnrolled);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Biometric availability check failed', error);
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    })();
    return () => {
      isMounted = false;
      promptingRef.current = false;
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

  const promptAuth = useCallback(async () => {
    if (promptingRef.current) return;
    promptingRef.current = true;
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: PROMPT_MESSAGE,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        navigation.replace('RootTabs');
      } else if (result.error === 'not_enrolled') {
        Alert.alert('Biometrics required', 'Set up Face ID or Touch ID to unlock HustleLedger.');
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication failed', error);
      }
      Alert.alert('Authentication failed', 'Please try again or check your device biometrics.');
    } finally {
      promptingRef.current = false;
    }
  }, [navigation]);

  useEffect(() => {
    if (!isFocused || checking) return;
    if (!available || !enrolled) return;
    const timeout = setTimeout(() => {
      if (!promptingRef.current) {
        void promptAuth();
      }
    }, 280);
    return () => clearTimeout(timeout);
  }, [available, checking, enrolled, isFocused, promptAuth]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.accent1 + '33', colors.accent2 + '33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: spacing(3),
            backgroundColor: `${colors.bgSecondary}CC`,
          }}
        >
          <View
            style={{
              borderRadius: radii.xl,
              padding: spacing(3),
              backgroundColor: colors.card,
              gap: spacing(2),
            }}
            accessible
            accessibilityRole="summary"
            accessibilityLabel="Biometric unlock required"
          >
            <Text style={{ color: colors.subtext, fontSize: 14, fontWeight: '600' }}>Security checkpoint</Text>
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', lineHeight: 34 }}>
              Face ID to continue
            </Text>
            <Text style={{ color: colors.subtext, lineHeight: 20 }}>
              {checking
                ? 'Checking device security capabilities…'
                : available && enrolled
                ? 'Authenticate with your biometrics to unlock HustleLedger.'
                : 'Enable Face ID or Touch ID in your device settings to unlock HustleLedger automatically.'}
            </Text>
            <HLButton
              title={checking ? 'Preparing…' : 'Unlock'}
              onPress={promptAuth}
              disabled={checking || !available || !enrolled}
              accessibilityLabel="Trigger Face ID unlock"
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
