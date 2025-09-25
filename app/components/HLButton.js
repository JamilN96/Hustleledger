import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useColors, radii, spacing } from '../lib/theme';

export default function HLButton({ title, onPress, style, disabled }) {
  const colors = useColors();
  const glow = useSharedValue(0.6);

  React.useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [glow]);

  const aStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.7,
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress && onPress();
  };

  return (
    <Animated.View style={[{
      shadowColor: colors.accent2,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    }, aStyle, style]}>
      <Pressable onPress={handlePress} disabled={disabled} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <LinearGradient
          colors={[colors.accent1, colors.accent2]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            borderRadius: radii.xl,
            paddingVertical: spacing(1.75),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#0B0B0F', fontWeight: '700', fontSize: 16 }}>{title}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
