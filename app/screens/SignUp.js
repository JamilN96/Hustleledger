// app/screens/SignUp.js
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Text as RNText, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Text, Button, Chip } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

export default function SignUp({ navigation }) {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    setErr('');
    if (!email.trim()) return setErr('Please enter an email.');
    if (pw.length < 6) return setErr('Password must be at least 6 characters.');
    if (pw !== pw2) return setErr('Passwords do not match.');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pw);
      navigation.replace('AppLock');
    } catch (error) {
      setErr(error?.message || 'Sign up failed');
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
                  backgroundColor: 'rgba(122, 76, 255, 0.15)',
                  borderColor: colors.accent1,
                  borderRadius: radii.lg,
                }}
                textStyle={{ color: colors.accent1, fontWeight: '600' }}
              >
                Launch your AI CFO
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
                Create your HustleLedger account
              </RNText>
              <Text style={{ color: colors.subtext, marginTop: spacing(1.25), lineHeight: 20 }}>
                Get automated forecasting, expense intelligence, and daily cash rituals tailored to your side hustles.
              </Text>
            </View>

            <GlassCard accessibilityLabel="Create your HustleLedger account">
              <LinearGradient
                colors={['rgba(122, 76, 255, 0.25)', 'transparent']}
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
                  We use bank-level security, encrypted vaults, and on-device biometrics to protect every ledger entry.
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
                style={{ marginBottom: spacing(1.5), backgroundColor: 'transparent' }}
                mode="flat"
                theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                accessibilityLabel="Password"
              />

              <TextInput
                label="Confirm password"
                value={pw2}
                onChangeText={setPw2}
                secureTextEntry
                textContentType="oneTimeCode"
                style={{ marginBottom: spacing(2), backgroundColor: 'transparent' }}
                mode="flat"
                theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
                accessibilityLabel="Confirm password"
              />

              {!!err && <Text style={{ color: colors.danger, marginBottom: spacing(1) }}>{err}</Text>}

              <HLButton
                title={loading ? 'Creating…' : 'Secure my account'}
                onPress={onSignUp}
                accessibilityLabel="Create your HustleLedger account"
              />
            </GlassCard>

            <Button
              onPress={() => navigation.replace('SignIn')}
              textColor={colors.accent1}
              style={{ marginTop: spacing(2) }}
              accessibilityLabel="I already have an account"
            >
              I already have an account
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
