import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Text as RNText } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { colors, spacing } from '../lib/theme';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigation.replace('AppLock');
    });
    return () => unsub();
  }, []);

  const onSignIn = async () => {
    setErr('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      navigation.replace('AppLock');
    } catch (e) {
      setErr(e.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, padding: spacing(2), justifyContent: 'center' }}>
        {/* Big soft title */}
        <RNText style={{
          color: colors.text, fontSize: 28, fontWeight: '700', opacity: 0.9, marginBottom: spacing(2)
        }}>
          Welcome to HustleLedger
        </RNText>

        {/* Glassy auth card */}
        <GlassCard>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ marginBottom: spacing(1.5) }}
            mode="flat"
            theme={{ colors: { onSurfaceVariant: colors.subtext } }}
          />

          <TextInput
            label="Password"
            value={pw}
            onChangeText={setPw}
            secureTextEntry
            textContentType="oneTimeCode"
            style={{ marginBottom: spacing(2) }}
            mode="flat"
            theme={{ colors: { onSurfaceVariant: colors.subtext } }}
          />

          {!!err && <Text style={{ color: '#FF6B88', marginBottom: spacing(1) }}>{err}</Text>}

          <HLButton title={loading ? 'Signing in…' : 'Sign In'} onPress={onSignIn} />
        </GlassCard>

        {/* Subtle link */}
        <Button
          onPress={() => navigation.replace('SignUp')}
          textColor={colors.accent1}
          style={{ marginTop: spacing(2) }}
        >
          Create an account
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
