import React from 'react';
import { View, Text, AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useIsFocused } from '@react-navigation/native';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AppLock({ navigation }) {
  const colors = useColors();
  const isFocused = useIsFocused();

  // guards
  const promptingRef = React.useRef(false);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // OPTIONAL: if you were prompting automatically on focus, keep it,
  // but we add guards + tiny delay so the modal doesn't conflict with mounting.
  React.useEffect(() => {
    if (!isFocused) return;
    const t = setTimeout(() => {
      if (!promptingRef.current) promptAuth();
    }, 250);
    return () => clearTimeout(t);
  }, [isFocused]);

  // If app goes background during prompt (user switches apps / lock screen),
  // we reset the guard when it comes back.
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // allow prompting again when returning
        promptingRef.current = false;
      }
    });
    return () => sub.remove();
  }, []);

  async function promptAuth() {
    try {
      if (promptingRef.current || !mountedRef.current) return;
      promptingRef.current = true;

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Show a message or fall back to a PIN screen you control
        promptingRef.current = false;
        return;
      }

      // --- Test 1: turn OFF device fallback to see if crash stops.
      // If this works (no crash), the crash was from passcode fallback timing.
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HustleLedger',
        cancelLabel: 'Cancel',
        // TEST mode: Face ID only (no passcode sheet). Flip to false later.
        disableDeviceFallback: true,
        requireConfirmation: false,
      });

      if (!mountedRef.current) return;

      if (result.success) {
        // Don't navigate while the system sheet is still closing.
        setTimeout(() => {
          if (mountedRef.current) navigation.replace('RootTabs');
        }, 150);
      } else {
        // user cancel / system cancel / lockout. Stay on AppLock.
        // console.log('Auth failed:', result);
      }
    } catch (e) {
      // Prevent crash by swallowing any unexpected throws
      console.log('Auth exception:', e?.message);
    } finally {
      promptingRef.current = false;
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: spacing(3), backgroundColor: colors.bg }}>
      <Text style={{ color: colors.text, fontSize: 20, marginBottom: spacing(2) }}>
        Unlock with Face ID
      </Text>
      <HLButton title="Unlock" onPress={promptAuth} />
    </View>
  );
}
