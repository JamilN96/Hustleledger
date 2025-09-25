import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useColors, radii, spacing } from '../lib/theme';

export default function GlassCard({ children, style }) {
  const colors = useColors();
  return (
    <Animated.View
      entering={FadeIn.duration(260)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify().damping(16).stiffness(120)}
      style={[{ borderRadius: radii.xl, overflow: 'hidden' }, style]}
    >
      <BlurView intensity={30} tint="dark" style={{
        borderRadius: radii.xl,
        backgroundColor: colors.card,
      }}>
        <View style={{ padding: spacing(2) }}>
          {children}
        </View>
      </BlurView>
    </Animated.View>
  );
}
