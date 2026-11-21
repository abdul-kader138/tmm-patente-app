import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ExamTimerBadgeProps {
  secondsRemaining: number;
  isDark?: boolean;
}

export const ExamTimerBadge: React.FC<ExamTimerBadgeProps> = ({
  secondsRemaining,
  isDark = false,
}) => {
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const bgColor = isDark ? '#3A1A1A' : '#FEECEA';
  const textColor = isDark ? '#F97066' : '#B42318';

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor }]}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`Time remaining: ${timeFormatted}`}
    >
      <Ionicons name="time-outline" size={15} color={textColor} />
      <Text style={[styles.text, { color: textColor }]}>{timeFormatted}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
});
