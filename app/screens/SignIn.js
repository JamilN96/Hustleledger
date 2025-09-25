import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text as RNText,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Text, Button, Chip, Divider } from 'react-native-paper';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

export default function SignIn({ navigation }) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const heroOrbs = useMemo(
    () => [
      {
        size: Math.min(width * 0.5, 220),
        opacity: 0.75,
        colors: [colors.accent2, colors.accent1],
        translate: { x: -spacing(3), y: -spacing(2) },
      },
      {
        size: Math.min(width * 0.36, 160),
        opacity: 0.65,
        colors: [colors.accent3, colors.accent2],
        translate: { x: width * 0.42, y: -spacing(5) },
      },
      {
        size: Math.min(width * 0.42, 180),
        opacity: 0.45,
        colors: ['rgba(255,255,255,0.28)', colors.accent4],
        translate: { x: width * 0.12, y: spacing(1) },
      },
    ],
    [colors.accent1, colors.accent2, colors.accent3, colors.accent4, width],
  );

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
            <View
              style={{
                marginBottom: spacing(3),
                padding: spacing(2),
                borderRadius: radii.xl,
                overflow: 'hidden',
                backgroundColor: colors.bgSecondary,
              }}
              accessible
              accessibilityRole="header"
              accessibilityLabel="Welcome back area"
            >
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {heroOrbs.map((orb, index) => (
                  <LinearGradient
                    key={`orb-${index}`}
                    colors={orb.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      width: orb.size,
                      height: orb.size,
                      borderRadius: orb.size / 2,
                      opacity: orb.opacity,
                      transform: [
                        { translateX: orb.translate.x },
                        { translateY: orb.translate.y },
                      ],
                    }}
                  />
                ))}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1) }}>
                <Chip
                  mode="flat"
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(76, 209, 246, 0.15)',
                    borderRadius: radii.lg,
                  }}
                  textStyle={{ color: colors.accent2, fontWeight: '600' }}
                >
                  AI Wealth Guide
                </Chip>
                <View
                  style={{
                    paddingHorizontal: spacing(1.25),
                    paddingVertical: spacing(0.5),
                    borderRadius: radii.lg,
                    backgroundColor: 'rgba(159, 140, 255, 0.18)',
                  }}
                  accessibilityRole="text"
                  accessibilityLabel="Bank-grade shield active"
                >
                  <RNText
                    style={{ color: colors.accent1, fontSize: 12, fontWeight: '600', letterSpacing: 0.4 }}
                  >
                    Shield On
                  </RNText>
                </View>
              </View>

              <RNText
                style={{
                  color: colors.text,
                  fontSize: 32,
                  fontWeight: '800',
                  marginTop: spacing(2),
                  lineHeight: 38,
                }}
              >
                Welcome back, Creator.
              </RNText>
              <Text
                style={{
                  color: colors.subtext,
                  marginTop: spacing(1.25),
                  lineHeight: 22,
                  fontSize: 15,
                }}
              >
                Sign in to guide cash flow, automate smart savings, and keep every hustle moving with calm clarity.
              </Text>
            </View>

            <GlassCard accessibilityLabel="Sign in to HustleLedger">
              <View style={{ gap: spacing(2) }}>
                <View style={{ gap: spacing(1) }}>
                  <RNText style={{ color: colors.muted, fontSize: 13, letterSpacing: 0.6 }}>
                    SECURE SIGN IN
                  </RNText>
                  <Text style={{ color: colors.subtext, fontSize: 14, lineHeight: 20 }}>
                    Accounts sync in real time with encrypted links. Face ID unlock keeps your command center ready.
                  </Text>
                </View>

                <Divider style={{ backgroundColor: colors.divider }} accessibilityElementsHidden />

                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  style={{ marginBottom: spacing(1), backgroundColor: 'transparent' }}
                  mode="flat"
                  theme={{ colors: { onSurfaceVariant: colors.muted, primary: colors.accent1 } }}
                  accessibilityLabel="Email address"
                  textContentType="emailAddress"
                />

                <TextInput
                  label="Password"
                  value={pw}
                  onChangeText={setPw}
                  secureTextEntry
                  textContentType="password"
                  autoComplete="password"
                  style={{ marginBottom: spacing(1), backgroundColor: 'transparent' }}
                  mode="flat"
                  theme={{ colors: { onSurfaceVariant: colors.muted, primary: colors.accent1 } }}
                  accessibilityLabel="Password"
                />

                {!!err && (
                  <Text style={{ color: colors.danger, marginBottom: spacing(1), fontSize: 13 }}>
                    {err}
                  </Text>
                )}

                <HLButton
                  title={loading ? 'Signing in…' : 'Enter command hub'}
                  onPress={onSignIn}
                  accessibilityLabel="Sign in to HustleLedger"
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing(0.5),
                  }}
                >
                  <RNText style={{ color: colors.muted, fontSize: 13 }}>Need an account?</RNText>
                  <Button
                    onPress={() => navigation.replace('SignUp')}
                    textColor={colors.accent1}
                    accessibilityLabel="Create a new account"
                    compact
                  >
                    Create one
                  </Button>
                </View>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
