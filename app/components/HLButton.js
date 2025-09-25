import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColors, radii, spacing } from '../lib/theme';
import { tapHaptic } from '../lib/haptics';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

export default function HLButton({
  title,
  onPress,
  style,
  disabled = false,
  accessibilityLabel,
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {
      damping: 16,
      stiffness: 220,
      mass: 0.6,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 16,
      stiffness: 220,
      mass: 0.6,
    });
  };

  const handlePress = async () => {
    if (disabled) return;
    await tapHaptic();
    onPress?.();
  };

  return (
    <Animated.View style={[styles.shadow, { shadowColor: colors.primary }, animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: !!disabled }}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={['#B388FF', '#7DD3FC']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.gradient, { opacity: disabled ? 0.7 : 1 }]}
        >
          <Text style={styles.label} allowFontScaling accessibilityRole="text">
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 0.38,
    shadowRadius: spacing(2.75),
    shadowOffset: { width: 0, height: spacing(1) },
    elevation: 8,
  },
  pressable: {
    borderRadius: radii.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  gradient: {
    borderRadius: radii.lg,
    paddingVertical: spacing(1.75),
    paddingHorizontal: spacing(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
