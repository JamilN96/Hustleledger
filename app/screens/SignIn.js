import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text, Chip } from 'react-native-paper';
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
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const subtextColor = colors.subtext ?? (isDark ? 'rgba(231, 236, 255, 0.76)' : 'rgba(22, 30, 62, 0.72)');
  const dangerColor = colors.danger ?? '#FF6F91';
  const gradientStops = isDark
    ? ['#040510', '#10133a', '#261d52']
    : ['#f3f5ff', '#dfe7ff', '#cfdafe'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('AppLock');
      }
    });

    return () => unsub();
  }, [navigation]);

  const handleFocus = (fieldKey) => {
    setFocusedField(fieldKey);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleBlur = () => {
    setFocusedField(null);
    Haptics.selectionAsync().catch(() => {});
  };

  const onSignIn = async () => {
    setErr('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      navigation.replace('AppLock');
    } catch (error) {
      setErr(error?.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const inputTheme = {
    colors: {
      onSurfaceVariant: subtextColor,
      primary: colors.accent1,
    },
  };

  const badgeGlow = isDark ? 'rgba(88, 213, 247, 0.18)' : 'rgba(161, 140, 255, 0.16)';
  const chipBackground = isDark ? 'rgba(12, 16, 48, 0.45)' : 'rgba(240, 244, 255, 0.75)';
  const secondaryLinkBg = isDark ? 'rgba(12, 16, 48, 0.3)' : 'rgba(247, 249, 255, 0.85)';
  const secondaryLinkText = isDark ? '#A18CFF' : '#5B4FE6';
  const taglineColor = isDark ? 'rgba(214, 220, 255, 0.66)' : 'rgba(34, 44, 86, 0.6)';
  const inputBackground = colors.inputBackground ?? (isDark ? 'rgba(9, 14, 29, 0.6)' : 'rgba(255, 255, 255, 0.9)');
  const cardOutline = colors.cardOutline ?? 'rgba(161, 140, 255, 0.16)';
  const cardBorder = colors.cardBorder ?? 'rgba(130, 115, 255, 0.24)';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={gradientStops}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.flex}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.contentWrapper}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.heroArea}>
              <View style={[styles.badgeGlow, { backgroundColor: badgeGlow }]}>
                <Chip
                  textStyle={{ color: colors.text, fontWeight: '600' }}
                  style={{
                    backgroundColor: chipBackground,
                    borderColor: colors.accent1,
                    borderWidth: 0.5,
                  }}
                >
                  Command Deck Access
                </Chip>
              </View>
              <Text
                style={[styles.brandTitle, { color: colors.text }]}
                allowFontScaling
              >
                HustleLedger
              </Text>
              <Text
                style={[styles.heroHeadline, { color: colors.text }]}
                allowFontScaling
              >
                Command your hustle
              </Text>
              <Text
                style={[styles.heroDescription, { color: subtextColor }]}
                allowFontScaling
              >
                Enter your credentials to sync every revenue stream with biometric-grade security.
              </Text>
            </View>

            <GlassCard
              style={{ marginTop: spacing(2) }}
              accessibilityLabel="Sign in to HustleLedger command deck"
            >
              <View style={{ gap: spacing(2) }}>
                <View>
                  <View
                    style={{
                      borderRadius: radii.md,
                      backgroundColor: inputBackground,
                      borderWidth: 1,
                      borderColor:
                        focusedField === 'email' ? `${colors.accent2}88` : cardOutline ?? cardBorder,
                    }}
                  >
                    <TextInput
                      label="Your access ID"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      mode="flat"
                      left={
                        <TextInput.Icon
                          icon="email-outline"
                          color={focusedField === 'email' ? colors.accent2 : subtextColor}
                        />
                      }
                      textColor={colors.text}
                      style={{ backgroundColor: 'transparent' }}
                      contentStyle={{ fontSize: 16 }}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      theme={inputTheme}
                      accessibilityLabel="Enter your email"
                    />
                  </View>
                </View>

                <View>
                  <View
                    style={{
                      borderRadius: radii.md,
                      backgroundColor: inputBackground,
                      borderWidth: 1,
                      borderColor:
                        focusedField === 'password' ? `${colors.accent1}88` : cardBorder,
                    }}
                  >
                    <TextInput
                      label="Secure key"
                      value={pw}
                      onChangeText={setPw}
                      secureTextEntry
                      textContentType="password"
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      mode="flat"
                      left={
                        <TextInput.Icon
                          icon="lock-outline"
                          color={focusedField === 'password' ? colors.accent1 : subtextColor}
                        />
                      }
                      textColor={colors.text}
                      style={{ backgroundColor: 'transparent' }}
                      contentStyle={{ fontSize: 16 }}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      theme={inputTheme}
                      accessibilityLabel="Enter your password"
                    />
                  </View>
                </View>

                <Pressable
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={{ alignSelf: 'flex-end' }}
                  accessibilityRole="button"
                  accessibilityLabel="Recover your secure key"
                >
                  <Text style={{ color: colors.accent2, fontWeight: '600' }} allowFontScaling>
                    Forgot secure key?
                  </Text>
                </Pressable>

                {!!err && (
                  <Text style={{ color: dangerColor }} allowFontScaling>
                    {err}
                  </Text>
                )}

                <HLButton
                  title={loading ? 'Signing in…' : 'Enter command center'}
                  onPress={onSignIn}
                  accessibilityLabel="Sign in to HustleLedger"
                  accessibilityRole="button"
                  disabled={loading}
                />
              </View>
            </GlassCard>

            <Pressable
              onPress={() => navigation.replace('SignUp')}
              accessibilityRole="link"
              accessibilityLabel="Create your HustleLedger account"
              style={({ pressed }) => [
                styles.secondaryLink,
                {
                  backgroundColor: secondaryLinkBg,
                  shadowColor: colors.accent1,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[styles.secondaryLinkText, { color: secondaryLinkText }]}
                allowFontScaling
              >
                Create your account
              </Text>
            </Pressable>

            <Text
              style={[styles.tagline, { color: taglineColor }]}
              allowFontScaling
            >
              Banking-grade security. AI-driven growth.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contentWrapper: {
    flexGrow: 1,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(4),
    justifyContent: 'center',
    gap: spacing(3),
  },
  heroArea: {
    alignItems: 'center',
    gap: spacing(1.5),
  },
  badgeGlow: {
    padding: 2,
    borderRadius: radii.xl,
  },
  brandTitle: {
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroHeadline: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroDescription: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  secondaryLink: {
    alignSelf: 'center',
    borderRadius: radii.xl,
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2.5),
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    shadowOpacity: 0.2,
  },
  secondaryLinkText: {
    fontWeight: '600',
    fontSize: 15,
  },
  tagline: {
    textAlign: 'center',
    marginTop: spacing(2),
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
