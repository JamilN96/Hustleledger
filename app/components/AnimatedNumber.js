// app/components/AnimatedNumber.js
import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

// Helper to format as currency
const defaultFormatter = (n) =>
  (n || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function AnimatedNumber({ value = 0, duration = 1200, style, formatter = defaultFormatter }) {
  const progress = useSharedValue(0);
  const target = useSharedValue(value);

  useEffect(() => {
    target.value = value;
    // animate from 0 to 1 for each new value
    progress.value = 0;
    progress.value = withTiming(1, { duration });
  }, [duration, progress, target, value]);

  const animatedProps = useAnimatedProps(() => {
    // simple ease: 0..1 → 0..value
    const current = progress.value * target.value;
    const formatted = formatter ? formatter(current) : String(current);
    return { text: formatted };
  });

  // @ts-ignore: AnimatedText supports animatedProps.text
  return <AnimatedText style={style} animatedProps={animatedProps} />;
}
