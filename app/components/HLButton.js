import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useColors, radii, spacing } from '../lib/theme';

export default function HLButton({
  title,
  onPress,
  style,
  disabled,
  accessibilityLabel,
  variant = 'primary',
}) {
  const colors = useColors();
  const glow = useSharedValue(0.6);

  useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [glow]);

  const aStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.7,
  }));

  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress && onPress();
  };

  const gradientColors =
    variant === 'danger'
      ? ['#FF5F6D', '#FFC371']
      : [colors.accent1, colors.accent2];

  return (
    <Animated.View style={[{
      shadowColor: colors.accent2,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    }, aStyle, style]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: !!disabled }}
        style={({ pressed }) => ({ opacity: pressed || disabled ? 0.85 : 1 })}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            borderRadius: radii.xl,
            paddingVertical: spacing(1.75),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
            opacity: disabled ? 0.7 : 1,
          }}
        >
          <Text
            style={{ color: '#050510', fontWeight: '700', fontSize: 16 }}
            accessibilityRole="text"
            allowFontScaling
          >
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
