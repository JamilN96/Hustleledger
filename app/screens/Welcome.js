import { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

const DARK_BACKGROUND_ALPHA = 0.07;
const LIGHT_BACKGROUND_ALPHA = 0.04;
const DARK_BORDER_ALPHA = 0.16;
const LIGHT_BORDER_ALPHA = 0.12;

const clamp01 = (value) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const toRgb = (input) => {
  if (!input) return null;

  if (input.startsWith('#')) {
    const hex = input.replace('#', '');
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
    return null;
  }

  const numericParts = input.match(/\d+(?:\.\d+)?/g);
  if (!numericParts || numericParts.length < 3) return null;

  const [r, g, b] = numericParts;
  return { r: Number(r), g: Number(g), b: Number(b) };
};

const withAlpha = (color, alpha, fallbackHex) => {
  const rgb = toRgb(color) ?? toRgb(fallbackHex);
  if (!rgb) {
    return color ?? fallbackHex;
  }

  const nextAlpha = clamp01(alpha);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${nextAlpha.toFixed(2)})`;
};

export default function Welcome() {
  const colors = useColors();
  const systemScheme = useIsDarkMode() ? 'dark' : 'light';
  const scheme = colors.scheme ?? systemScheme;
  const isDark = scheme === 'dark';

  const glassBackground = useMemo(() => {
    const base = isDark ? '#0C1030' : '#FFFFFF';
    const source = colors.card ?? base;
    const alpha = isDark ? DARK_BACKGROUND_ALPHA : LIGHT_BACKGROUND_ALPHA;
    return withAlpha(source, alpha, base);
  }, [colors.card, isDark]);

  const glassBorder = useMemo(() => {
    const base = isDark ? '#A18CFF' : '#7363F6';
    const source = colors.cardBorder ?? base;
    const alpha = isDark ? DARK_BORDER_ALPHA : LIGHT_BORDER_ALPHA;
    return withAlpha(source, alpha, base);
  }, [colors.cardBorder, isDark]);

  const gradientStops = colors.bgGradient ?? [colors.bg, colors.bgSecondary ?? colors.bg];
  const buttonBackground = isDark ? colors.accent2 : colors.accent1;
  const buttonText = isDark ? '#071021' : '#FFFFFF';

  return (
    <LinearGradient colors={gradientStops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.flex}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.content}>
          <BlurView
            intensity={isDark ? 42 : 28}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.glass, { backgroundColor: glassBackground, borderColor: glassBorder }]}
          >
            <Text style={[styles.title, { color: colors.text }]} allowFontScaling>
              Welcome to HustleLedger
            </Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]} allowFontScaling>
              Command your finances with a clarity-first cockpit interface tuned for your current theme.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue to sign in"
              style={[styles.cta, { backgroundColor: buttonBackground }]}
            >
              <Text style={[styles.ctaText, { color: buttonText }]} allowFontScaling>
                Continue
              </Text>
            </Pressable>
          </BlurView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(3),
  },
  glass: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing(3),
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
  cta: {
    marginTop: spacing(1.5),
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2.5),
    borderRadius: radii.md,
    alignSelf: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
