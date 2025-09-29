import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(2),
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: spacing(2),
  },
  fallbackCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.lg,
    padding: spacing(3),
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.15,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#050510',
    letterSpacing: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  primaryAction: {
    alignSelf: 'stretch',
  },
  secondaryAction: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2),
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

function FallbackGlassCard({ children, style, accessibilityLabel }) {
  return (
    <View
      style={[styles.fallbackCard, style]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const PanelComponent = GlassCard || FallbackGlassCard;

  const badgeGradient = useMemo(
    () => [colors.accent1 + 'AA', colors.accent2 + 'AA'],
    [colors.accent1, colors.accent2],
  );

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={[colors.bg, colors.cardBorder]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.flex}
      >
        <View style={styles.container}>
          <PanelComponent
            style={styles.panel}
            accessibilityLabel="HustleLedger welcome overview"
          >
            <LinearGradient
              colors={badgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Text style={styles.logoText} accessibilityRole="text" allowFontScaling>
                HL
              </Text>
            </LinearGradient>

            <Text style={[styles.title, { color: colors.text }]} allowFontScaling>
              Welcome to HustleLedger
            </Text>
            <Text
              style={[styles.tagline, { color: colors.subtext }]}
              allowFontScaling
              accessibilityRole="text"
            >
              Your AI co-pilot for automating cash flow rituals, insights, and every hustle ledger entry.
            </Text>

            <HLButton
              title="Enter command deck"
              onPress={() => navigation?.navigate?.('SignIn')}
              style={styles.primaryAction}
              accessibilityLabel="Enter the HustleLedger command deck"
            />
            <Pressable
              onPress={() => navigation?.navigate?.('SignUp')}
              accessibilityRole="button"
              accessibilityLabel="Create a HustleLedger account"
              style={styles.secondaryAction}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.secondaryText,
                    { color: colors.accent1, opacity: pressed ? 0.8 : 1 },
                  ]}
                  allowFontScaling
                >
                  Create an account
                </Text>
              )}
            </Pressable>
          </PanelComponent>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
