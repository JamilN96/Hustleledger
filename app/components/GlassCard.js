import React from 'react';
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
      entering={FadeIn.duration(260)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify().damping(16).stiffness(120)}
      style={[{ borderRadius: radii.xl, overflow: 'hidden' }, style]}
    >
      <LinearGradient
        colors={borderGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.xl, padding: 1.25 }}
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
            style={{ padding: spacing(2) }}
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
