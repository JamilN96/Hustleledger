import { useCallback } from 'react';
import { Platform, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

const enableHaptics = Platform.OS !== 'web';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();

  const gradientStops = colors.bgGradient ?? [colors.bg, colors.bgSecondary ?? colors.bg];

  const handleSignInPress = useCallback(async () => {
    if (enableHaptics) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        if (__DEV__) {
          console.warn('Sign-in haptics failed', error);
        }
      }
    }
    navigation.navigate('SignIn');
  }, [navigation]);

  const handleSignUpPress = useCallback(async () => {
    if (enableHaptics) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        if (__DEV__) {
          console.warn('Sign-up haptics failed', error);
        }
      }
    }
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient colors={gradientStops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}> 
            <Text style={[styles.title, { color: colors.text }]}>Welcome to HustleLedger</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>Your AI copilot for command-level finance.</Text>
            <Pressable
              onPress={handleSignInPress}
              accessibilityRole="button"
              accessibilityLabel="Sign in to HustleLedger"
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  borderColor: colors.cardOutline,
                  backgroundColor: pressed ? `${colors.accent1}33` : colors.card,
                },
              ]}
            >
              <Text style={[styles.primaryText, { color: colors.text }]} allowFontScaling>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSignUpPress}
              accessibilityRole="button"
              accessibilityLabel="Create a HustleLedger account"
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.cardOutline,
                  backgroundColor: pressed ? `${colors.accent2}22` : 'transparent',
                },
              ]}
            >
              <Text style={[styles.secondaryText, { color: colors.accent2 }]} allowFontScaling>
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(2),
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing(2),
    gap: spacing(1.5),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
