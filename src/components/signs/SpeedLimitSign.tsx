import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export interface SpeedLimitSignProps {
  speed?: number;
  size?: number;
  borderColor?: string;
  innerBgColor?: string;
  textColor?: string;
}

/**
 * SpeedLimitSign
 * Authentic Italian ministerial regulatory speed limit sign (Codice della Strada Art. 116).
 * Pure vector frontend component with exact geometrical proportions and crisp rendering.
 */
export const SpeedLimitSign: React.FC<SpeedLimitSignProps> = ({
  speed = 50,
  size = 104,
  borderColor = '#D92D20',
  innerBgColor = '#FFFFFF',
  textColor = '#111827',
}) => {
  const strokeWidth = size * 0.135; // Standard Italian regulatory border ratio
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const fontSize = Math.round(size * 0.38);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background fill */}
        <Circle cx={center} cy={center} r={size / 2} fill={innerBgColor} />
        {/* Outer Red Ministerial Ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={borderColor}
          strokeWidth={strokeWidth}
          fill={innerBgColor}
        />
      </Svg>
      {/* Center speed numeral with exact typography and centering */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.textContainer}>
          <RNText
            style={[
              styles.speedText,
              {
                fontSize,
                color: textColor,
                lineHeight: fontSize * 1.05,
              },
            ]}
            numberOfLines={1}
          >
            {speed}
          </RNText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
  },
});
