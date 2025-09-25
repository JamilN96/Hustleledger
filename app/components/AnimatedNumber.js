// app/components/AnimatedNumber.js
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

// Helper to format as currency
const formatMoney = (n) =>
  (n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function AnimatedNumber({ value = 0, duration = 1200, style }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // animate from 0 to 1 for each new value
    progress.value = 0;
    progress.value = withTiming(1, { duration });
  }, [duration, progress, value]);

  const animatedProps = useAnimatedProps(() => {
    // simple ease: 0..1 → 0..value
    const current = Math.round(progress.value * value);
    return { text: formatMoney(current) };
  });

  // @ts-ignore: AnimatedText supports animatedProps.text
  return <AnimatedText style={style} animatedProps={animatedProps} />;
}
