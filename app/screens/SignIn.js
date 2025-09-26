import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text as RNText,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Text, Button, Chip } from 'react-native-paper';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';
import ParticleField from '../components/ParticleField';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const AnimatedRNText = Animated.createAnimatedComponent(RNText);

export default function SignIn({ navigation }) {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const badgeGlow = useSharedValue(0.4);
  const heroProgress = useSharedValue(0);
  const emailFocus = useSharedValue(0);
  const passwordFocus = useSharedValue(0);

  useEffect(() => {
    badgeGlow.value = withRepeat(
      withTiming(1, {
        duration: 3200,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );

    heroProgress.value = withDelay(
      150,
      withTiming(1, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [badgeGlow, heroProgress]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigation.replace('AppLock');
    });
    return () => unsub();
  }, [navigation]);

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

  const badgeStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.28 + badgeGlow.value * 0.4,
    shadowRadius: 12 + badgeGlow.value * 8,
    transform: [{ scale: 0.98 + badgeGlow.value * 0.02 }],
  }));

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroProgress.value,
    transform: [
      {
        translateY: interpolate(
          heroProgress.value,
          [0, 1],
          [24, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const emailUnderlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: interpolate(emailFocus.value, [0, 1], [0.25, 1], Extrapolation.CLAMP),
      },
    ],
    opacity: 0.25 + emailFocus.value * 0.75,
  }));

  const passwordUnderlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: interpolate(passwordFocus.value, [0, 1], [0.25, 1], Extrapolation.CLAMP),
      },
    ],
    opacity: 0.25 + passwordFocus.value * 0.75,
  }));

  const handleFocus = (shared) => {
    shared.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.quad),
    });
  };

  const handleBlur = (shared) => {
    shared.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.quad),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(4), flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ParticleField style={styles.particleLayer} />
            <View style={{ marginBottom: spacing(3) }}>
              <Animated.View style={[styles.badgeShadow, badgeStyle]}>
                <Chip
                  mode="outlined"
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(100, 231, 254, 0.12)',
                    borderColor: colors.accent2,
                    borderRadius: radii.lg,
                  }}
                  textStyle={{ color: colors.accent2, fontWeight: '600' }}
                  accessibilityRole="text"
                  accessibilityLabel="AI Wealth Concierge badge"
                >
                  AI Wealth Concierge
                </Chip>
              </Animated.View>
              <AnimatedRNText
                style={[
                  {
                    color: colors.text,
                    fontSize: 32,
                    fontWeight: '800',
                    marginTop: spacing(2),
                    lineHeight: 38,
                  },
                  heroStyle,
                ]}
                allowFontScaling
                accessibilityRole="header"
                accessibilityLabel="Welcome back, creator"
              >
                Welcome back, creator.
              </AnimatedRNText>
              <Text style={{ color: colors.subtext, marginTop: spacing(1.25), lineHeight: 20 }}>
                Sign in to orchestrate cash flow, automate savings, and keep every hustle aligned with your goals.
              </Text>
            </View>

            <GlassCard accessibilityLabel="Sign in to HustleLedger">
              <LinearGradient
                colors={[colors.cardBorder, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  padding: spacing(1.5),
                  marginBottom: spacing(2),
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              >
                <Text style={{ color: colors.subtext, fontSize: 13, lineHeight: 18 }}>
                  HustleLedger syncs your accounts in real time with our AI engine. Banking-grade encryption keeps your data safe.
                </Text>
              </LinearGradient>

              <View style={{ marginBottom: spacing(1.5) }}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{ backgroundColor: 'transparent' }}
                  mode="flat"
                  onFocus={() => handleFocus(emailFocus)}
                  onBlur={() => handleBlur(emailFocus)}
                  theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                  accessibilityLabel="Email address"
                />
                <Animated.View style={[styles.underline, emailUnderlineStyle]}>
                  <LinearGradient
                    colors={[colors.accent1, colors.accent2]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.underlineFill}
                  />
                </Animated.View>
              </View>

              <View style={{ marginBottom: spacing(2) }}>
                <TextInput
                  label="Password"
                  value={pw}
                  onChangeText={setPw}
                  secureTextEntry
                  textContentType="oneTimeCode"
                  style={{ backgroundColor: 'transparent' }}
                  mode="flat"
                  onFocus={() => handleFocus(passwordFocus)}
                  onBlur={() => handleBlur(passwordFocus)}
                  theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                  accessibilityLabel="Password"
                />
                <Animated.View style={[styles.underline, passwordUnderlineStyle]}>
                  <LinearGradient
                    colors={[colors.accent2, colors.accent1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.underlineFill}
                  />
                </Animated.View>
              </View>

              {!!err && <Text style={{ color: colors.danger, marginBottom: spacing(1) }}>{err}</Text>}

              <HLButton
                title={loading ? 'Signing in…' : 'Enter command center'}
                onPress={onSignIn}
                accessibilityLabel="Sign in to HustleLedger"
              />
            </GlassCard>

            <Button
              onPress={() => navigation.replace('SignUp')}
              textColor={colors.accent1}
              style={{ marginTop: spacing(2) }}
              accessibilityLabel="Create a new account"
            >
              Create an account
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  particleLayer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badgeShadow: {
    alignSelf: 'flex-start',
    shadowColor: '#64E7FE',
    shadowOffset: { width: 0, height: 0 },
  },
  underline: {
    height: 3,
    marginTop: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  underlineFill: {
    flex: 1,
  },
});
