import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useColors, radii, spacing } from '../lib/theme';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

export default function GlassCard({
  children,
  style,
  accessibilityLabel = 'Information card',
  accessibilityRole = 'summary',
}) {
  const colors = useColors();

  return (
    <Animated.View
      entering={FadeIn.duration(260)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify().damping(16).stiffness(120)}
      style={[styles.container, { shadowColor: colors.primary }, style]}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(139,92,246,0.14)', 'rgba(56,189,248,0.10)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.inner, { backgroundColor: colors.card + '80' }]}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    shadowOpacity: 0.32,
    shadowRadius: spacing(3),
    shadowOffset: { width: 0, height: spacing(1.25) },
    elevation: 12,
    backgroundColor: 'transparent',
  },
  inner: {
    padding: spacing(2),
    minHeight: spacing(6),
  },
});
