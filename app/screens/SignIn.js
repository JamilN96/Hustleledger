import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text as RNText,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { TextInput, Text, Chip } from 'react-native-paper';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import * as Haptics from 'expo-haptics';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function SignIn({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const subtextColor = colors.subtext ?? (isDark ? 'rgba(231, 236, 255, 0.76)' : 'rgba(22, 30, 62, 0.72)');
  const cardBorder = colors.cardBorder ?? 'rgba(130, 115, 255, 0.36)';
  const dangerColor = colors.danger ?? '#FF6F91';
  const gradientStops = isDark
    ? ['#040510', '#10133a', '#261d52']
    : ['#f3f5ff', '#dfe7ff', '#cfdafe'];

  const particleConfigs = useMemo(
    () => [
      { size: 12, left: '14%', delay: 0, duration: 7200 },
      { size: 20, left: '48%', delay: 900, duration: 6800 },
      { size: 10, left: '78%', delay: 1500, duration: 7600 },
    ],
    [],
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigation.replace('AppLock');
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
      setErr(error?.message || 'Sign in failed');
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

  const badgeBackground = isDark ? 'rgba(12, 16, 48, 0.45)' : 'rgba(240, 244, 255, 0.6)';
  const secondaryLinkBg = isDark ? 'rgba(12, 16, 48, 0.24)' : 'rgba(247, 249, 255, 0.72)';
  const secondaryLinkText = isDark ? '#A18CFF' : '#5B4FE6';
  const taglineColor = isDark ? 'rgba(214, 220, 255, 0.66)' : 'rgba(34, 44, 86, 0.6)';

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
        <AnimatedParticles
          configs={particleConfigs}
          fillColor={isDark ? 'rgba(161, 140, 255, 0.4)' : 'rgba(96, 128, 255, 0.35)'}
          shadowColor={isDark ? '#58D5F7' : '#7AA7FF'}
          gridColors={
            isDark
              ? ['rgba(161, 140, 255, 0.12)', 'transparent', 'rgba(88, 213, 247, 0.16)']
              : ['rgba(95, 136, 255, 0.12)', 'transparent', 'rgba(101, 231, 254, 0.18)']
          }
        />

            <GlassCard accessibilityLabel="Sign in to HustleLedger command deck">
              <LinearGradient
                colors={[`${colors.accent1}22`, `${colors.accent2}11`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  padding: spacing(1.75),
                  marginBottom: spacing(2.5),
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              >
                <Text style={{ color: colors.subtext, fontSize: 13, lineHeight: 18 }}>
                  HustleLedger syncs your accounts in real time with our AI engine. Banking-grade encryption keeps your data safe.
                </Text>
              </View>

              <View style={{ marginBottom: spacing(2) }}>
                <View
                  style={{
                    borderRadius: radii.md,
                    backgroundColor: colors.inputBackground,
                    borderWidth: 1,
                    borderColor:
                      focusedField === 'email'
                        ? `${colors.accent2}88`
                        : colors.cardOutline,
                    overflow: 'hidden',
                  }}
                >
                  <TextInput
                    label="Your Access ID"
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
                        color={focusedField === 'email' ? colors.accent2 : colors.subtext}
                      />
                    }
                    textColor={colors.text}
                    style={{ backgroundColor: 'transparent' }}
                    contentStyle={{ fontSize: 16 }}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { onSurfaceVariant: colors.subtext } }}
                    accessibilityLabel="Enter your email"
                  />
                </View>
                <LinearGradient
                  colors={
                    focusedField === 'email'
                      ? [colors.accent1, colors.accent2]
                      : ['rgba(161, 140, 255, 0.35)', 'rgba(88, 213, 247, 0.35)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 3,
                    borderRadius: 999,
                    marginTop: spacing(0.5),
                    opacity: focusedField === 'email' ? 1 : 0.5,
                  }}
                />
              </View>

              <View style={{ marginBottom: spacing(1.5) }}>
                <View
                  style={{
                    borderRadius: radii.md,
                    backgroundColor: colors.inputBackground,
                    borderWidth: 1,
                    borderColor:
                      focusedField === 'password'
                        ? `${colors.accent1}88`
                        : colors.cardBorder,
                    overflow: 'hidden',
                  }}
                >
                  <TextInput
                    label="Secure Key"
                    value={pw}
                    onChangeText={setPw}
                    secureTextEntry
                    textContentType="oneTimeCode"
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    mode="flat"
                    left={
                      <TextInput.Icon
                        icon="lock-outline"
                        color={focusedField === 'password' ? colors.accent1 : colors.subtext}
                      />
                    }
                    textColor={colors.text}
                    style={{ backgroundColor: 'transparent' }}
                    contentStyle={{ fontSize: 16 }}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    theme={{ colors: { onSurfaceVariant: colors.subtext } }}
                    accessibilityLabel="Enter your password"
                  />
                </View>
                <LinearGradient
                  colors={
                    focusedField === 'password'
                      ? [colors.accent2, colors.accent1]
                      : ['rgba(88, 213, 247, 0.35)', 'rgba(161, 140, 255, 0.35)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 3,
                    borderRadius: 999,
                    marginTop: spacing(0.5),
                    opacity: focusedField === 'password' ? 1 : 0.5,
                  }}
                />
              </View>

              <Pressable
                onPress={() => navigation.navigate('ForgotPassword')}
                style={{ alignSelf: 'flex-end', marginBottom: spacing(2) }}
                accessibilityRole="button"
                accessibilityLabel="Recover your secure key"
              >
                <Text style={{ color: colors.accent2, fontWeight: '600' }}>Forgot Secure Key?</Text>
              </Pressable>

                <TextInput
                  label="Password"
                  value={pw}
                  onChangeText={setPw}
                  secureTextEntry
                  textContentType="oneTimeCode"
                  style={styles.input}
                  mode="flat"
                  theme={inputTheme}
                  accessibilityLabel="Password"
                />

                {!!err && (
                  <Text style={{ color: dangerColor, marginBottom: spacing(1) }} allowFontScaling>
                    {err}
                  </Text>
                )}

                <HLButton
                  title={loading ? 'Signing in…' : 'Enter Command Center'}
                  onPress={onSignIn}
                  accessibilityLabel="Sign in to HustleLedger"
                />
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
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.secondaryLinkText,
                    { color: secondaryLinkText },
                  ]}
                  allowFontScaling
                >
                  Create Your Account
                </Text>
              </Pressable>

              <RNText
                style={[
                  styles.tagline,
                  { color: taglineColor },
                ]}
                allowFontScaling
              >
                Banking-grade security. AI-driven growth.
              </RNText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function AnimatedParticles({ configs, fillColor, shadowColor, gridColors }) {
  return (
    <View pointerEvents="none" style={styles.particleContainer}>
      {configs.map((config, index) => (
        <Particle key={index} {...config} fillColor={fillColor} shadowColor={shadowColor} />
      ))}
      <AnimatedGridlines gridColors={gridColors} />
    </View>
  );
}

function Particle({ size, left, delay, duration, fillColor, shadowColor }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      false,
    );
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.65, 0]),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [0, -80]),
      },
      {
        translateX: interpolate(progress.value, [0, 0.5, 1], [0, 8, 0]),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: fillColor,
          shadowColor,
        },
        animatedStyle,
      ]}
    />
  );
}

function AnimatedGridlines({ gridColors }) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.linear }), -1, false);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-24, 24]),
      },
    ],
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.12, 0.22, 0.12]),
  }));

  return (
    <AnimatedGradient
      colors={gridColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gridlines, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  heroArea: {
    marginBottom: spacing(3),
    alignItems: 'center',
    gap: spacing(1.5),
  },
  badgeGlow: {
    padding: 2,
    borderRadius: radii.xl,
    alignSelf: 'center',
  },
  badge: {
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingHorizontal: spacing(1.5),
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: spacing(2),
  },
  heroHeadline: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroDescription: {
    marginTop: spacing(1),
    lineHeight: 22,
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 320,
  },
  helperGradient: {
    borderRadius: radii.lg,
    padding: spacing(1.5),
    marginBottom: spacing(2),
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  input: {
    marginBottom: spacing(1.5),
    backgroundColor: 'transparent',
  },
  secondaryLink: {
    alignSelf: 'center',
    marginTop: spacing(3),
    borderRadius: radii.xl,
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2.5),
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
  },
  secondaryLinkText: {
    fontWeight: '600',
    fontSize: 15,
  },
  tagline: {
    textAlign: 'center',
    marginTop: spacing(4),
    fontSize: 12,
    letterSpacing: 0.8,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    shadowRadius: 12,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 0 },
  },
  gridlines: {
    position: 'absolute',
    top: '-25%',
    left: '-20%',
    right: '-20%',
    bottom: '-25%',
    borderRadius: radii.xl,
  },
});
