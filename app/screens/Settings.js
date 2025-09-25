// app/screens/Settings.js
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Settings({ navigation }) {
  const onSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('SignIn');
    } catch (e) {
      console.log('Sign out error:', e);
    }
  };

  return (
    <View style={{ padding: 24, marginTop: 80, gap: 12 }}>
      <Text variant="headlineSmall">Settings</Text>
      <Button mode="contained" onPress={onSignOut}>Sign Out</Button>
    </View>
  );
}
