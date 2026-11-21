import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export type ChoiceType = 'V' | 'F';

export interface ExamChoiceCardProps {
  choice: ChoiceType;
  isSelected: boolean;
  onSelect: (choice: ChoiceType) => void;
  disabled?: boolean;
  isDark?: boolean;
}

export const ExamChoiceCard: React.FC<ExamChoiceCardProps> = ({
  choice,
  isSelected,
  onSelect,
  disabled = false,
  isDark = false,
}) => {
  const isVero = choice === 'V';
  const label = isVero ? 'VERO' : 'FALSO';
  const accessibleLabel = isVero ? 'Vero, true' : 'Falso, false';

  const colors = {
    bg: isDark ? '#131A2A' : '#FFFFFF',
    border: isDark ? '#1E293B' : '#E4E7EE',
    letter: isDark ? '#FFFFFF' : '#0F172A',
    sub: isDark ? '#8F9BB3' : '#64748B',
    activeBg: isDark ? '#1B2552' : '#EAF0FF',
    accent: isDark ? '#4C74FF' : '#2D5BFF',
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? colors.activeBg : colors.bg,
          borderColor: isSelected ? colors.accent : colors.border,
          borderWidth: isSelected ? 2 : 1.5,
        },
      ]}
      onPress={() => onSelect(choice)}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityLabel={accessibleLabel}
      accessibilityState={{ checked: isSelected, disabled }}
    >
      <Text
        style={[
          styles.letter,
          { color: isSelected ? colors.accent : colors.letter },
        ]}
      >
        {choice}
      </Text>
      <Text
        style={[
          styles.label,
          { color: isSelected ? colors.accent : colors.sub },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 114,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  letter: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -1,
    includeFontPadding: false,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});
