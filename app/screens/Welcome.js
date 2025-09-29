import { useEffect, useMemo } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HLButton from '../components/HLButton';
import { spacing, useColors, radii, useIsDarkMode } from '../lib/theme';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      AccessibilityInfo.announceForAccessibility('Welcome to HustleLedger');
    }
  }, []);

  const headingSize = useMemo(() => {
    const max = 38;
    const min = 26;
    return Math.max(min, Math.min(max, width * 0.085));
  }, [width]);

  const taglineSize = useMemo(() => {
    const max = 18;
    const min = 15;
    return Math.max(min, Math.min(max, width * 0.045));
  }, [width]);

  const headingColor = colors.text;
  const taglineColor = colors.subtext;
  const contrastOverlay = isDark ? 'rgba(12, 16, 36, 0.75)' : 'rgba(233, 236, 255, 0.92)';

  const onSignIn = () => {
    navigation.navigate('SignIn');
  };

  const onCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg ?? '#000' }]}
      edges={['top', 'bottom']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.container, { paddingHorizontal: spacing(3.5), paddingVertical: spacing(3.5) }]}>
        <LinearGradient
          colors={[`${colors.accent1}1A`, `${colors.accent2}14`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.heroSurface,
            {
              backgroundColor: isDark ? 'rgba(7, 12, 42, 0.08)' : 'rgba(10, 16, 46, 0.08)',
              borderColor: isDark ? 'rgba(88, 213, 247, 0.12)' : 'rgba(88, 213, 247, 0.14)',
            },
          ]}
        >
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel="HustleLedger holographic monogram"
            style={styles.logoShell}
          >
            <LinearGradient
              colors={[colors.accent1, colors.accent2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.logoOrb,
                {
                  shadowColor: colors.accent2,
                },
              ]}
            >
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: radii.xl,
                  backgroundColor: contrastOverlay,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{ color: headingColor, fontWeight: '700', fontSize: headingSize * 0.38 }}
                  accessibilityRole="text"
                  allowFontScaling
                >
                  HL
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.textBlock, { marginTop: spacing(1.35) }]}>
            <Text
              accessibilityRole="header"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={[
                styles.heading,
                {
                  color: headingColor,
                  fontSize: headingSize,
                },
              ]}
            >
              Command your finances.
            </Text>

            <Text
              style={[
                styles.tagline,
                {
                  color: taglineColor,
                  fontSize: taglineSize,
                  lineHeight: taglineSize * 1.35,
                },
              ]}
            >
              HustleLedger syncs every balance, forecasts cashflow, and keeps you ready for the next opportunity.
            </Text>
          </View>

          <View style={[styles.buttonGroup, { marginTop: spacing(3), gap: spacing(1.35) }]}>
            <HLButton
              title="Sign In"
              onPress={onSignIn}
              accessibilityLabel="Sign in to HustleLedger"
              style={[
                styles.primaryButton,
                {
                  maxWidth: 420,
                  alignSelf: 'stretch',
                },
              ]}
            />
            <View style={{ width: '100%', maxWidth: 420 }}>
              <Pressable
                onPress={onCreateAccount}
                accessibilityRole="button"
                accessibilityLabel="Create a new HustleLedger account"
                hitSlop={spacing(0.5)}
                style={({ pressed }) => [
                  styles.secondaryPressable,
                  {
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <LinearGradient
                  colors={[`${colors.accent2}14`, `${colors.accent1}0F`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.secondarySurface}
                >
                  <Text
                    style={[
                      styles.secondaryLabel,
                      { color: colors.accent1, fontSize: taglineSize * 0.92 },
                    ]}
                  >
                    Create account
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  heroSurface: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(3),
    alignItems: 'center',
    gap: spacing(1.35),
  },
  logoShell: {
    width: 96,
    height: 96,
  },
  logoOrb: {
    flex: 1,
    borderRadius: radii.xl,
    padding: spacing(0.75),
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
  },
  textBlock: {
    alignItems: 'center',
  },
  heading: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing(0.75),
  },
  tagline: {
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 440,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    minHeight: 52,
  },
  secondaryPressable: {
    width: '100%',
    minHeight: 52,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  secondarySurface: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(161, 140, 255, 0.18)',
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontWeight: '600',
  },
});

// Self-check
// - Tap targets >= 44dp (primary button minHeight 52, secondary padding provides >=44)
// - Heading truncates gracefully on small screens via adjustsFontSizeToFit
// - Dynamic type supported with allowFontScaling and flexible layout
// - VoiceOver order: logo, heading, tagline, Sign In, Create account
