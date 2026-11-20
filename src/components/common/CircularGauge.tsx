import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export interface CircularGaugeProps {
  value: number; // e.g. 78
  size?: number; // e.g. 104
  strokeWidth?: number; // e.g. 8
  trackColor?: string; // e.g. 'rgba(255, 255, 255, 0.28)'
  progressColor?: string; // e.g. '#FFFFFF'
  textColor?: string; // e.g. '#FFFFFF'
  showPercentSign?: boolean;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value = 78,
  size = 104,
  strokeWidth = 8,
  trackColor = 'rgba(255, 255, 255, 0.28)',
  progressColor = '#FFFFFF',
  textColor = '#FFFFFF',
  showPercentSign = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (circumference * clampedValue) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Full circular background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Active progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.valueText, { color: textColor }]}>
          {Math.round(clampedValue)}
          {showPercentSign ? '%' : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
