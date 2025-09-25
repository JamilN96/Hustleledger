// app/screens/Settings.js
import { useCallback } from 'react';
import { View, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Chip } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';
import { useTransactions } from '../context/TransactionsContext';

export default function Settings({ navigation }) {
  const colors = useColors();
  const { recurringNotificationsEnabled, toggleRecurringNotifications } = useTransactions();
  const onSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      navigation.replace('SignIn');
    } catch (error) {
      if (__DEV__) {
        console.warn('Sign out error', error);
      }
    }
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: spacing(2) }}>
        <Chip
          mode="outlined"
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderColor: colors.accent1,
            borderRadius: radii.lg,
            marginBottom: spacing(2),
          }}
          textStyle={{ color: colors.accent1, fontWeight: '600' }}
        >
          Profile & security
        </Chip>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Settings</Text>
        <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
          Manage your credentials, security, and personalized AI briefings.
        </Text>

        <GlassCard style={{ marginTop: spacing(2) }} accessibilityLabel="Account security">
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>Security</Text>
          <Text style={{ color: colors.subtext, marginBottom: spacing(2), lineHeight: 18 }}>
            Sign out to remove local session data. You can re-enable biometrics on next login.
          </Text>
          <HLButton title="Sign out" onPress={onSignOut} accessibilityLabel="Sign out of HustleLedger" />
        </GlassCard>

        <GlassCard style={{ marginTop: spacing(2) }} accessibilityLabel="Recurring notification preferences">
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>
            Automation alerts
          </Text>
          <Text style={{ color: colors.subtext, marginBottom: spacing(2), lineHeight: 18 }}>
            Receive a push notification whenever a recurring transaction is created and a reminder one day before the next scheduled run.
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Enable Recurring Notifications</Text>
            <Switch
              value={recurringNotificationsEnabled}
              onValueChange={toggleRecurringNotifications}
              accessibilityLabel="Toggle recurring transaction notifications"
              thumbColor={recurringNotificationsEnabled ? colors.accent1 : undefined}
            />
          </View>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}
