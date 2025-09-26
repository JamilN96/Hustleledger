import { useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '../lib/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_COUNT = 14;

function Particle({ config }) {
  const { top, left, size, driftX, driftY, delay, color } = config;
  const opacity = useSharedValue(0.4);
  const progress = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 4800,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );

    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [delay, opacity, progress]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top,
    left,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    opacity: 0.18 + opacity.value * 0.32,
    transform: [
      { translateX: (progress.value - 0.5) * driftX },
      { translateY: (progress.value - 0.5) * driftY },
      { scale: 0.8 + opacity.value * 0.35 },
    ],
  }));

  return <Animated.View pointerEvents="none" style={style} />;
}

export default function ParticleField({ style }) {
  const colors = useColors();

  const particles = useMemo(() => {
    const palette = [colors.accent1, colors.accent2, colors.accent3 ?? colors.accent1];
    return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
      id: `particle-${index}`,
      top: Math.random() * SCREEN_HEIGHT * 0.6,
      left: Math.random() * SCREEN_WIDTH * 0.8,
      size: 6 + Math.random() * 16,
      driftX: 12 + Math.random() * 26,
      driftY: 12 + Math.random() * 26,
      delay: index * 280,
      color: palette[index % palette.length] + '33',
    }));
  }, [colors.accent1, colors.accent2, colors.accent3]);

  return (
    <Animated.View pointerEvents="none" style={style}>
      {particles.map((particle) => (
        <Particle key={particle.id} config={particle} />
      ))}
    </Animated.View>
  );
}
