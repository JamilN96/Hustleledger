import { useEffect, useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const [reduceMotion, setReduceMotion] = useState(false);

  const aura = useSharedValue(0);
  const gridShift = useSharedValue(0);
  const highlight = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setReduceMotion(Boolean(enabled));
        }
      })
      .catch(() => {
        if (isMounted) {
          setReduceMotion(false);
        }
      });

    const handleReduceMotion = (enabled) => {
      setReduceMotion(Boolean(enabled));
    };

    let subscription;
    if (AccessibilityInfo.addEventListener) {
      subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', handleReduceMotion);
    } else {
      AccessibilityInfo.addEventListener?.('reduceMotionChanged', handleReduceMotion);
    }

    return () => {
      isMounted = false;
      if (typeof subscription === 'function') {
        subscription();
      } else if (subscription?.remove) {
        subscription.remove();
      } else {
        AccessibilityInfo.removeEventListener?.('reduceMotionChanged', handleReduceMotion);
      }
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(aura);
      cancelAnimation(gridShift);
      cancelAnimation(highlight);
      aura.value = 0;
      gridShift.value = 0;
      highlight.value = 0;
      return;
    }

    aura.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    gridShift.value = withRepeat(withTiming(1, { duration: 16000, easing: Easing.linear }), -1, false);

    highlight.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 1800, easing: Easing.in(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );
  }, [reduceMotion, aura, gridShift, highlight]);

  const heroGradient = useMemo(() => {
    if (isDark) {
      return ['rgba(82, 56, 255, 0.35)', 'rgba(17, 181, 255, 0.28)', 'rgba(13, 8, 64, 0.65)'];
    }
    return ['rgba(161, 140, 255, 0.35)', 'rgba(88, 213, 247, 0.25)', 'rgba(240, 244, 255, 0.8)'];
  }, [isDark]);

  const gridTravelX = spacing(6);
  const gridTravelY = spacing(4);
  const auraLift = spacing(2);

  const auraStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.4 : 0.32 + aura.value * 0.28,
    transform: [
      { translateY: reduceMotion ? 0 : interpolate(aura.value, [0, 1], [0, -auraLift]) },
      { scale: reduceMotion ? 1 : 1 + aura.value * 0.08 },
    ],
  }));

  const gridStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.35 : 0.45,
    transform: [
      { translateX: reduceMotion ? 0 : interpolate(gridShift.value, [0, 1], [0, -gridTravelX]) },
      { translateY: reduceMotion ? 0 : interpolate(gridShift.value, [0, 1], [0, gridTravelY]) },
    ],
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.22 : 0.18 + highlight.value * 0.5,
  }));

  const onGetStarted = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // haptics optional
    }
    navigation?.navigate?.('SignUp');
  };

  const onSignIn = async () => {
    try {
      await Haptics.selectionAsync();
    } catch {
      // haptics optional
    }
    navigation?.navigate?.('SignIn');
  };

  return (
    <LinearGradient
      colors={colors.bgGradient ?? [colors.bg, colors.bgSecondary ?? colors.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} animated={!reduceMotion} />
      <SafeAreaView style={styles.flex}>
        <View style={[styles.flex, styles.container]}>
          <View
            style={[
              styles.heroWrapper,
              {
                backgroundColor: isDark ? 'rgba(12, 16, 48, 0.35)' : 'rgba(255, 255, 255, 0.78)',
                borderColor: colors.cardOutline,
              },
            ]}
          >
            <AnimatedGradient
              colors={heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.heroGradient, auraStyle]}
            />
            <Animated.View style={[styles.gridOverlay, { borderColor: colors.cardBorder }, gridStyle]} />
            <Animated.View style={[styles.highlight, highlightStyle]} />
            <View style={styles.heroContent} accessible accessibilityRole="header">
              <Text style={[styles.brand, { color: colors.text }]} allowFontScaling accessibilityRole="text">
                HustleLedger
              </Text>
              <Text
                style={[styles.title, { color: colors.text }]}
                variant={Platform.OS === 'ios' ? 'headlineMedium' : undefined}
                allowFontScaling
              >
                Precision finance copilots for modern creators
              </Text>
              <Text
                style={[styles.tagline, { color: colors.subtext }]}
                accessibilityRole="text"
                allowFontScaling
              >
                Track revenue streams, automate reconciliations, and surface insights engineered for studios and
                entrepreneurs who move fast.
              </Text>
            </View>
          </View>

          <View accessible accessibilityLabel="Product highlights" style={styles.featureList}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureItem} accessibilityRole="text">
                <View style={[styles.bullet, { backgroundColor: colors.accent1 + '55' }]} />
                <View style={styles.featureCopy}>
                  <Text style={[styles.featureTitle, { color: colors.text }]} allowFontScaling>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.subtext }]} allowFontScaling>
                    {feature.copy}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.ctaSection}>
            <CTAButton
              title="Get started"
              onPress={onGetStarted}
              reduceMotion={reduceMotion}
              accessibilityLabel="Create your HustleLedger account"
            />
            <Pressable
              onPress={onSignIn}
              accessibilityRole="button"
              accessibilityLabel="Already a member? Sign in"
              style={({ pressed }) => [
                styles.secondaryCta,
                {
                  backgroundColor: isDark ? 'rgba(9, 14, 29, 0.4)' : 'rgba(255, 255, 255, 0.68)',
                  borderColor: colors.cardOutline,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text style={[styles.secondaryText, { color: colors.accent2 }]} allowFontScaling>
                Already on board? Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const FEATURES = [
  {
    title: 'AI-powered ledger intelligence',
    copy: 'Surface projected cash flow, tax holds, and sponsorship pacing with explainable AI narratives.',
  },
  {
    title: 'Bank-level automation',
    copy: 'Secure bank connections, adaptive rules, and reconciliations tuned for multi-platform creators.',
  },
  {
    title: 'Collaboration ready',
    copy: 'Share curated workspaces with managers, editors, and accountants—permissioned and audit trailed.',
  },
];

function CTAButton({ title, onPress, reduceMotion, accessibilityLabel }) {
  const colors = useColors();
  const glow = useSharedValue(0.4);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(glow);
      glow.value = 0;
      return;
    }

    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [glow, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: reduceMotion ? 0.3 : 0.35 + glow.value * 0.25,
    transform: [
      { scale: reduceMotion ? 1 : 0.97 + glow.value * 0.05 },
    ],
  }));

  const handlePress = async () => {
    if (onPress) {
      await onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.primaryShadow,
        { shadowColor: colors.accent2 },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        style={({ pressed }) => [
          styles.primaryButton,
          {
            borderColor: colors.cardBorder,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.accent1, colors.accent2]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryText} allowFontScaling accessibilityRole="text">
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2.5),
    paddingBottom: spacing(2),
    gap: spacing(2.5),
  },
  heroWrapper: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    padding: spacing(2.5),
    borderWidth: 1,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    opacity: 0.35,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  highlight: {
    position: 'absolute',
    bottom: spacing(-4),
    left: -spacing(4),
    right: -spacing(4),
    height: spacing(10),
    borderRadius: spacing(8),
    backgroundColor: 'rgba(88, 213, 247, 0.24)',
    shadowColor: 'rgba(88, 213, 247, 0.6)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.6,
    shadowRadius: 48,
    elevation: 18,
  },
  heroContent: {
    gap: spacing(1.5),
  },
  brand: {
    fontSize: 15,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 22,
  },
  featureList: {
    gap: spacing(1.5),
  },
  featureItem: {
    flexDirection: 'row',
    gap: spacing(1.25),
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: spacing(0.5),
  },
  featureCopy: {
    flex: 1,
    gap: spacing(0.5),
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaSection: {
    gap: spacing(1.5),
  },
  primaryShadow: {
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    borderRadius: radii.xl,
  },
  primaryButton: {
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    borderRadius: radii.xl,
  },
  primaryText: {
    color: '#050510',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryCta: {
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
