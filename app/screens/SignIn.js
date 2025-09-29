import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text } from 'react-native-paper';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import * as Haptics from 'expo-haptics';

import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

export default function SignIn({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('AppLock');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const gradientStops = isDark
    ? [colors.bg ?? '#02030A', colors.bgSecondary ?? '#0B0F23']
    : [colors.bg ?? '#FFFFFF', colors.bgSecondary ?? '#F2F2F7'];

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      navigation.replace('AppLock');
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setError(err?.message ?? 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={gradientStops}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: spacing(3),
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ gap: spacing(2) }}>
              <View style={{ alignItems: 'center', gap: spacing(1) }}>
                <Text
                  variant="headlineMedium"
                  style={{ color: colors.text, fontWeight: '700', textAlign: 'center' }}
                  allowFontScaling
                >
                  Welcome back to HustleLedger
                </Text>
                <Text
                  style={{
                    color: colors.subtext,
                    textAlign: 'center',
                    maxWidth: 320,
                  }}
                  allowFontScaling
                >
                  Sign in to orchestrate your cash flow automations and stay ahead of every hustle.
                </Text>
              </View>

              <GlassCard accessibilityLabel="Sign in form">
                <View style={{ gap: spacing(2) }}>
                  <View
                    style={{
                      borderRadius: radii.md,
                      backgroundColor: colors.inputBackground,
                      borderWidth: 1,
                      borderColor: colors.cardOutline,
                    }}
                  >
                    <TextInput
                      label="Email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="username"
                      mode="flat"
                      style={{ backgroundColor: 'transparent' }}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                      accessibilityLabel="Enter your email address"
                    />
                  </View>

                  <View
                    style={{
                      borderRadius: radii.md,
                      backgroundColor: colors.inputBackground,
                      borderWidth: 1,
                      borderColor: colors.cardOutline,
                    }}
                  >
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      textContentType="password"
                      mode="flat"
                      style={{ backgroundColor: 'transparent' }}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                      accessibilityLabel="Enter your password"
                    />
                  </View>

                  {error ? (
                    <Text style={{ color: colors.danger, textAlign: 'center' }} allowFontScaling>
                      {error}
                    </Text>
                  ) : null}

                  <HLButton
                    title={loading ? 'Signing in…' : 'Sign in'}
                    onPress={onSubmit}
                    accessibilityLabel="Sign in to HustleLedger"
                    disabled={loading}
                  />

                  <Pressable
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={{ alignSelf: 'flex-end' }}
                    accessibilityRole="button"
                    accessibilityLabel="Forgot your password"
                  >
                    <Text style={{ color: colors.accent2, fontWeight: '600' }} allowFontScaling>
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>
              </GlassCard>

              <Pressable
                onPress={() => navigation.replace('SignUp')}
                accessibilityRole="link"
                accessibilityLabel="Create a HustleLedger account"
                style={({ pressed }) => ({
                  alignSelf: 'center',
                  paddingVertical: spacing(1),
                  paddingHorizontal: spacing(2.5),
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: colors.accent1, fontWeight: '600' }} allowFontScaling>
                  Need an account? Join HustleLedger
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
