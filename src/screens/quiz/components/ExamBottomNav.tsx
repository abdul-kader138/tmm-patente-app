import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ExamBottomNavProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isDark?: boolean;
}

export const ExamBottomNav: React.FC<ExamBottomNavProps> = ({
  currentQuestion,
  totalQuestions,
  answeredCount,
  onPrev,
  onNext,
  onSubmit,
  isDark = false,
}) => {
  const insets = useSafeAreaInsets();
  const remainingCount = totalQuestions - answeredCount;
  const isFirst = currentQuestion === 1;
  const isLast = currentQuestion === totalQuestions;

  const colors = {
    barBorder: isDark ? '#1E293B' : '#E4E7EE',
    arrowBg: isDark ? '#131A2A' : '#FFFFFF',
    arrowBorder: isDark ? '#1E293B' : '#E4E7EE',
    arrowIcon: isDark ? '#FFFFFF' : '#0F172A',
    summary: isDark ? '#8F9BB3' : '#64748B',
    submitBg: isDark ? '#4C74FF' : '#2D5BFF',
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: colors.barBorder,
          paddingBottom: Math.max(insets.bottom - 4, 16),
        },
      ]}
    >
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[
            styles.arrowBtn,
            {
              backgroundColor: colors.arrowBg,
              borderColor: colors.arrowBorder,
              opacity: isFirst ? 0.35 : 1,
            },
          ]}
          onPress={onPrev}
          disabled={isFirst}
          accessibilityRole="button"
          accessibilityLabel="Previous question"
          accessibilityState={{ disabled: isFirst }}
        >
          <Ionicons name="arrow-back" size={17} color={colors.arrowIcon} />
        </TouchableOpacity>

        <Text style={[styles.statusSummary, { color: colors.summary }]}>
          {answeredCount} answered · {remainingCount} left
        </Text>

        <TouchableOpacity
          style={[
            styles.arrowBtn,
            {
              backgroundColor: colors.arrowBg,
              borderColor: colors.arrowBorder,
              opacity: isLast ? 0.35 : 1,
            },
          ]}
          onPress={onNext}
          disabled={isLast}
          accessibilityRole="button"
          accessibilityLabel="Next question"
          accessibilityState={{ disabled: isLast }}
        >
          <Ionicons name="arrow-forward" size={17} color={colors.arrowIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: colors.submitBg }]}
        onPress={onSubmit}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Submit exam"
      >
        <Text style={styles.submitBtnText}>Submit exam</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSummary: {
    fontSize: 13,
    fontWeight: '600',
    includeFontPadding: false,
  },
  submitBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
});
