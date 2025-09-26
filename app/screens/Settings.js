// app/screens/Settings.js
import { useCallback } from 'react';
import { Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Chip } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';
import { useBudgetNotificationSetting } from '../lib/settings/budgetNotifications.js';

export default function Settings({ navigation }) {
  const colors = useColors();
  const subtextColor = colors.subtext ?? `${colors.text ?? '#FFFFFF'}B3`;
  const {
    enabled: budgetNotificationsEnabled,
    isLoading: budgetNotificationsLoading,
    error: budgetNotificationsError,
    setEnabled: setBudgetNotificationsEnabled,
  } = useBudgetNotificationSetting(true);

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

  const handleBudgetNotificationToggle = useCallback(
    (nextValue) => {
      void setBudgetNotificationsEnabled(nextValue);
    },
    [setBudgetNotificationsEnabled]
  );

  const trackOnColor = colors.accent1 ?? '#6C5CE7';
  const trackOffColor = colors.text ?? '#FFFFFF';

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
        <Text style={{ color: subtextColor, marginTop: spacing(1), lineHeight: 18 }}>
          Manage your credentials, security, and personalized AI briefings.
        </Text>

        <GlassCard
          style={{ marginTop: spacing(2) }}
          accessibilityRole="summary"
          accessibilityLabel="Budget notification preference"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2) }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>Budget alerts</Text>
              <Text style={{ color: subtextColor, marginTop: spacing(0.5), lineHeight: 18 }}>
                Get a nudge when spending crosses 50%, 80%, or 100% of your budget.
              </Text>
              {budgetNotificationsError ? (
                <Text style={{ color: trackOnColor, marginTop: spacing(0.5), lineHeight: 16 }}>
                  We couldn't update your preference. Please try again.
                </Text>
              ) : null}
            </View>
            <Switch
              value={budgetNotificationsEnabled}
              onValueChange={handleBudgetNotificationToggle}
              disabled={budgetNotificationsLoading}
              accessibilityRole="switch"
              accessibilityLabel="Enable budget notifications"
              thumbColor={budgetNotificationsEnabled ? trackOnColor : trackOffColor}
              trackColor={{ false: `${trackOffColor}33`, true: `${trackOnColor}80` }}
              ios_backgroundColor={`${trackOffColor}33`}
            />
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: spacing(2) }} accessibilityLabel="Account security">
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>Security</Text>
          <Text style={{ color: subtextColor, marginBottom: spacing(2), lineHeight: 18 }}>
            Sign out to remove local session data. You can re-enable biometrics on next login.
          </Text>
          <HLButton title="Sign out" onPress={onSignOut} accessibilityLabel="Sign out of HustleLedger" />
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}
