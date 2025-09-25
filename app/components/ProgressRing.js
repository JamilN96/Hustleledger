import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useColors } from '../lib/theme';

export default function ProgressRing({ size = 180, stroke = 14, progress = 0.65 }) {
  const colors = useColors();
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = useMemo(() => circumference * (1 - Math.min(Math.max(progress, 0), 1)), [progress, circumference]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="hlGrad" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0%" stopColor={colors.accent1} />
            <Stop offset="100%" stopColor={colors.accent2} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="url(#hlGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>
    </View>
  );
}
