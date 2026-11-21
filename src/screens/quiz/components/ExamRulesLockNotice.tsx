import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ExamRulesLockNoticeProps {
  isDark?: boolean;
}

export const ExamRulesLockNotice: React.FC<ExamRulesLockNoticeProps> = ({
  isDark = false,
}) => {
  const textColor = isDark ? '#8F9BB3' : '#98A2B3';

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={13} color={textColor} style={styles.lockIcon} />
      <Text
        style={[styles.text, { color: textColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.9}
      >
        Exam rules: no translation, no feedback until you submit
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 16,
  },
  lockIcon: {
    marginTop: 1,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    flexShrink: 1,
    includeFontPadding: false,
  },
});
