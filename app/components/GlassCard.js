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
  const borderGradient = [colors.cardOutline, colors.cardBorder];
  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      layout={Layout.springify().damping(18).stiffness(120)}
      style={[
        {
          borderRadius: radii.xl,
          overflow: 'hidden',
          shadowColor: colors.shadow,
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 18 },
          shadowRadius: 28,
          elevation: 14,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={borderGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.xl, padding: 1.4 }}
      >
        <BlurView
          intensity={isDark ? 50 : 25}
          tint={isDark ? 'dark' : 'light'}
          style={{
            borderRadius: radii.xl,
            backgroundColor: colors.card,
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
