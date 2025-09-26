import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useColors, useIsDarkMode, radii, spacing } from '../lib/theme';

export default function GlassCard({
  children,
  style,
  accessibilityLabel = 'Information card',
  accessibilityRole = 'summary',
}) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const borderGradient = [colors.accent1, colors.accent2, colors.accent1];
  const glassBackground = isDark ? 'rgba(16, 20, 35, 0.55)' : 'rgba(255, 255, 255, 0.55)';
  const shadowColor = isDark ? 'rgba(6, 11, 25, 0.7)' : 'rgba(15, 23, 42, 0.16)';
  return (
    <Animated.View
      entering={FadeIn.duration(260)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify().damping(16).stiffness(120)}
      style={[
        {
          borderRadius: radii.lg,
          overflow: 'hidden',
          shadowColor,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.32,
          shadowRadius: 24,
          elevation: 16,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={borderGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.lg, padding: 1.5 }}
      >
        <BlurView
          intensity={isDark ? 70 : 40}
          tint={isDark ? 'dark' : 'light'}
          style={{
            borderRadius: radii.lg,
            backgroundColor: glassBackground,
          }}
        >
          <View
            style={{ padding: spacing(2.5) }}
            accessible
            accessibilityRole={accessibilityRole}
            accessibilityLabel={accessibilityLabel}
          >
            {children}
          </View>
        </BlurView>
      </LinearGradient>
    </Animated.View>
  );
}
