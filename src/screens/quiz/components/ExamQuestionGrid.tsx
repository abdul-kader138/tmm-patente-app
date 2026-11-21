import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type ExamAnswers = Record<number, 'V' | 'F'>;

export interface ExamQuestionGridProps {
  totalQuestions?: number;
  currentQuestion: number;
  answers: ExamAnswers;
  onSelectQuestion: (questionNumber: number) => void;
  isDark?: boolean;
}

export const ExamQuestionGrid = memo<ExamQuestionGridProps>(({
  totalQuestions = 30,
  currentQuestion,
  answers,
  onSelectQuestion,
  isDark = false,
}) => {
  const colors = {
    chipBg: isDark ? '#131A2A' : '#FFFFFF',
    chipBorder: isDark ? '#1E293B' : '#E4E7EE',
    chipText: isDark ? '#8F9BB3' : '#98A2B3',
    chipAnsweredBg: isDark ? '#3B4663' : '#475467',
    chipAnsweredBorder: isDark ? '#4B5878' : '#D0D5DD',
    accent: isDark ? '#4C74FF' : '#2D5BFF',
  };

  return (
    <View style={styles.grid}>
      {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => {
        const isAnswered = answers[qNum] !== undefined;
        const isCurrent = qNum === currentQuestion;

        return (
          <TouchableOpacity
            key={qNum}
            activeOpacity={0.7}
            hitSlop={{ top: 4, bottom: 4, left: 3, right: 3 }}
            style={[
              styles.chip,
              {
                backgroundColor: isAnswered ? colors.chipAnsweredBg : colors.chipBg,
                borderColor: isCurrent
                  ? colors.accent
                  : isAnswered
                  ? colors.chipAnsweredBorder
                  : colors.chipBorder,
                borderWidth: isCurrent ? 1.5 : 1,
              },
            ]}
            onPress={() => onSelectQuestion(qNum)}
            accessibilityRole="button"
            accessibilityLabel={`Question ${qNum}, ${isAnswered ? 'answered' : 'unanswered'}`}
            accessibilityState={{ selected: isCurrent }}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isAnswered ? '#FFFFFF' : isCurrent ? colors.accent : colors.chipText,
                },
              ]}
            >
              {qNum}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

ExamQuestionGrid.displayName = 'ExamQuestionGrid';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 14,
    columnGap: 3.5,
    rowGap: 5,
  },
  chip: {
    width: 19,
    height: 19,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    includeFontPadding: false,
  },
});
