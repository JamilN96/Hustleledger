import { useMemo } from 'react';
import { SafeAreaView, StatusBar, View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors, spacing, radii, useIsDarkMode } from '../lib/theme';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();

  const containerStyle = useMemo(
    () => [
      styles.container,
      { backgroundColor: colors.bgSecondary ?? colors.bg ?? '#0B0F23' },
    ],
    [colors.bg, colors.bgSecondary],
  );

  const cardStyle = useMemo(
    () => [
      styles.card,
      {
        backgroundColor: colors.card ?? 'rgba(12, 16, 48, 0.55)',
        borderColor: colors.cardOutline ?? 'rgba(161, 140, 255, 0.16)',
      },
    ],
    [colors.card, colors.cardOutline],
  );

  const onSignIn = () => {
    navigation?.navigate?.('SignIn');
  };

  const onSignUp = () => {
    navigation?.navigate?.('SignUp');
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.bg ?? '#02030A' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.flex}>
        <View style={containerStyle}>
          <View
            accessible
            accessibilityRole="header"
            accessibilityLabel="Welcome to HustleLedger"
            style={styles.hero}
          >
            <Text style={[styles.title, { color: colors.text ?? '#F7F9FF' }]} allowFontScaling>
              HustleLedger
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.subtext ?? 'rgba(231, 236, 255, 0.76)' },
              ]}
              allowFontScaling
            >
              Command your cashflow with real-time AI insights.
            </Text>
          </View>

          <View style={cardStyle} accessibilityRole="summary">
            <Text
              style={[
                styles.body,
                { color: colors.text ?? '#F7F9FF' },
              ]}
              allowFontScaling
            >
              Connect accounts, automate savings, and unlock predictive forecasting tailored to creators.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onSignIn}
              accessibilityRole="button"
              accessibilityLabel="Sign in to your HustleLedger account"
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: pressed
                    ? `${colors.accent1 ?? '#A18CFF'}CC`
                    : colors.accent1 ?? '#A18CFF',
                },
              ]}
            >
              <Text style={styles.primaryText} allowFontScaling>
                Sign In
              </Text>
            </Pressable>

            <Pressable
              onPress={onSignUp}
              accessibilityRole="button"
              accessibilityLabel="Create a new HustleLedger account"
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.accent2 ?? '#58D5F7',
                  backgroundColor: pressed
                    ? `${colors.card ?? 'rgba(12, 16, 48, 0.55)'}DD`
                    : colors.card ?? 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.secondaryText,
                  { color: colors.accent2 ?? '#58D5F7' },
                ]}
                allowFontScaling
              >
                Create account
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing(3),
    justifyContent: 'space-between',
  },
  hero: {
    gap: spacing(1),
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing(2),
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
  },
  actions: {
    gap: spacing(1.5),
  },
  primaryButton: {
    borderRadius: radii.xl,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050510',
  },
  secondaryButton: {
    borderRadius: radii.xl,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
