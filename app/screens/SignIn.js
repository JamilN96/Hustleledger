import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Text as RNText, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Text, Button, Chip } from 'react-native-paper';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

// Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.

export default function SignIn({ navigation }) {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

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
            <View style={{ marginBottom: spacing(3) }}>
              <Chip
                mode="outlined"
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(100, 231, 254, 0.12)',
                  borderColor: colors.accent2,
                  borderRadius: radii.lg,
                }}
                textStyle={{ color: colors.accent2, fontWeight: '600' }}
              >
                AI Wealth Concierge
              </Chip>
              <RNText
                style={{
                  color: colors.text,
                  fontSize: 32,
                  fontWeight: '800',
                  marginTop: spacing(2),
                  lineHeight: 38,
                }}
              >
                Welcome back, creator.
              </RNText>
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

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ marginBottom: spacing(1.5), backgroundColor: 'transparent' }}
                mode="flat"
                theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                accessibilityLabel="Email address"
              />

              <TextInput
                label="Password"
                value={pw}
                onChangeText={setPw}
                secureTextEntry
                textContentType="oneTimeCode"
                style={{ marginBottom: spacing(2), backgroundColor: 'transparent' }}
                mode="flat"
                theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                accessibilityLabel="Password"
              />

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
