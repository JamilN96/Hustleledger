import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Platform, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';

import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();
  const [checking, setChecking] = useState(true);
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
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
        const hardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setHasHardware(hardware);
        setIsEnrolled(enrolled);
      } catch (error) {
        if (__DEV__) {
          console.warn('Biometric availability check failed', error);
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isFocused || checking || !hasHardware || !isEnrolled) {
      return;
    }
    const timer = globalThis.setTimeout
      ? globalThis.setTimeout(() => {
          if (!promptingRef.current) {
            promptAuth();
          }
        }, 250)
      : null;
    return () => {
      if (timer && globalThis.clearTimeout) {
        globalThis.clearTimeout(timer);
      }
    };
  }, [checking, hasHardware, isEnrolled, isFocused, promptAuth]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        promptingRef.current = false;
      }
    });
    return () => subscription.remove();
  }, []);

  const promptAuth = useCallback(async () => {
    if (promptingRef.current || checking || !hasHardware || !isEnrolled) {
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

      if (result.success && globalThis.setTimeout) {
        globalThis.setTimeout(() => {
          if (mountedRef.current) {
            navigation.replace('RootTabs');
          }
        }, 150);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Biometric authentication failed', error);
      } else {
        Alert.alert('Authentication failed', 'Unable to unlock with biometrics.');
      }
    } finally {
      promptingRef.current = false;
    }
  }, [checking, hasHardware, isEnrolled, navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.bg, colors.bgSecondary]}
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
          <View
            style={{
              backgroundColor: `${colors.bgSecondary}CC`,
              padding: spacing(3),
              borderRadius: radii.lg,
              gap: spacing(1.5),
            }}
          >
            <HLButton
              title="Unlock"
              onPress={promptAuth}
              accessibilityLabel="Unlock HustleLedger"
              disabled={checking || !hasHardware || !isEnrolled}
            />
            <View>
              <TextBlock
                primary="Biometric security"
                secondary={
                  checking
                    ? 'Checking device security…'
                    : hasHardware && isEnrolled
                      ? 'Face ID is ready to unlock your finances.'
                      : 'Enroll Face ID or Touch ID to enable quick unlocking.'
                }
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function TextBlock({ primary, secondary }) {
  const colors = useColors();
  return (
    <View>
      <View>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: spacing(0.5) }}>{primary}</Text>
        <Text style={{ color: colors.subtext ?? '#889', lineHeight: 18 }}>{secondary}</Text>
      </View>
    </View>
  );
}
