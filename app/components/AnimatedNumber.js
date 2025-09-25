// app/components/AnimatedNumber.js
import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

const formatMoney = (n, precision) => {
  'worklet';
  return (n || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function AnimatedNumber({ value = 0, duration = 1200, precision = 0, style }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration });
  }, [duration, progress, value]);

  const animatedProps = useAnimatedProps(() => {
    const current = progress.value * value;
    return { text: formatMoney(current, precision) };
  });

  // @ts-ignore: AnimatedText supports animatedProps.text
  return <AnimatedText style={style} animatedProps={animatedProps} accessibilityRole="text" allowFontScaling />;
}
