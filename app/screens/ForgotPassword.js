import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onReset = async () => {
    setErr(''); setMsg(''); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMsg('Password reset email sent. Check your inbox.');
    } catch (e) {
      setErr(e.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 24, marginTop: 80, gap: 12 }}>
      <Text variant="headlineSmall">Reset your password</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      {!!err && <Text style={{ color: 'red' }}>{err}</Text>}
      {!!msg && <Text style={{ color: 'green' }}>{msg}</Text>}
      <Button mode="contained" loading={loading} onPress={onReset}>Send reset link</Button>
      <Button onPress={() => navigation.replace('SignIn')}>Back to Sign In</Button>
    </View>
  );
}
