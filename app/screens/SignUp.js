// app/screens/SignUp.js
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Text as RNText } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { colors, spacing } from '../lib/theme';

export default function SignUp({ navigation }) {
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
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, padding: spacing(2), justifyContent: 'center' }}>
        {/* Big soft title */}
        <RNText style={{
          color: colors.text, fontSize: 28, fontWeight: '700', opacity: 0.9, marginBottom: spacing(2)
        }}>
          Create your HustleLedger account
        </RNText>

        {/* Glassy sign-up card */}
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
            style={{ marginBottom: spacing(1.5) }}
            mode="flat"
            theme={{ colors: { onSurfaceVariant: colors.subtext } }}
          />

          <TextInput
            label="Confirm password"
            value={pw2}
            onChangeText={setPw2}
            secureTextEntry
            textContentType="oneTimeCode"
            style={{ marginBottom: spacing(2) }}
            mode="flat"
            theme={{ colors: { onSurfaceVariant: colors.subtext } }}
          />

          {!!err && <Text style={{ color: '#FF6B88', marginBottom: spacing(1) }}>{err}</Text>}

          <HLButton title={loading ? 'Creating…' : 'Create account'} onPress={onSignUp} />
        </GlassCard>

        {/* Subtle link */}
        <Button
          onPress={() => navigation.replace('SignIn')}
          textColor={colors.accent1}
          style={{ marginTop: spacing(2) }}
        >
          I already have an account
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
