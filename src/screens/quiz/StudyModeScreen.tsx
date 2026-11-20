import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { WordSheetModal } from './WordSheetModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface StudyQuestion {
  id: number;
  number: number;
  textItalian: string;
  translation: string;
  answer: 'V' | 'F';
  audioDuration: string;
  underlinedWords: string[];
}

const STUDY_QUESTIONS: StudyQuestion[] = [
  {
    id: 1,
    number: 1,
    textItalian: 'La strada può essere suddivisa in carreggiate',
    translation: 'A road can be divided into carriageways.',
    answer: 'V',
    audioDuration: '0:15 / 0:42',
    underlinedWords: ['strada', 'suddivisa', 'carreggiate'],
  },
  {
    id: 2,
    number: 2,
    textItalian: 'La strada può comprendere le piste ciclabili',
    translation: 'The road may include bicycle lanes.',
    answer: 'V',
    audioDuration: '0:10 / 0:35',
    underlinedWords: ['strada', 'comprendere', 'piste ciclabili'],
  },
  {
    id: 3,
    number: 3,
    textItalian: 'La strada è riservata esclusivamente ai veicoli a motore',
    translation: 'The road is reserved exclusively for motor vehicles.',
    answer: 'F',
    audioDuration: '0:08 / 0:30',
    underlinedWords: ['strada', 'riservata', 'esclusivamente'],
  },
];

export const StudyModeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [showAnswers, setShowAnswers] = useState(true);
  const [langMode, setLangMode] = useState<'IT' | 'EN'>('IT');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState('SOSTA');

  const handleWordClick = (word: string) => {
    setSelectedWord(word.toUpperCase());
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>La strada</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Study mode · 10 questions
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Control Switch Row */}
      <View style={styles.controlsRow}>
        <View style={styles.switchBox}>
          <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>Show answers</Text>
          <Switch
            value={showAnswers}
            onValueChange={setShowAnswers}
            trackColor={{ false: colors.indicatorInactive, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* IT / EN Toggle Pill */}
        <View style={[styles.langTogglePill, { backgroundColor: colors.chipBackground }]}>
          <TouchableOpacity
            style={[styles.langPillOption, langMode === 'IT' && { backgroundColor: colors.primary }]}
            onPress={() => setLangMode('IT')}
          >
            <Text style={[styles.langPillText, { color: langMode === 'IT' ? '#FFFFFF' : colors.textMuted }]}>
              IT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langPillOption, langMode === 'EN' && { backgroundColor: colors.primary }]}
            onPress={() => setLangMode('EN')}
          >
            <Text style={[styles.langPillText, { color: langMode === 'EN' ? '#FFFFFF' : colors.textMuted }]}>
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Questions Cards List */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {STUDY_QUESTIONS.map((q) => (
          <View
            key={q.id}
            style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            {/* Top row with Question Number and Answer Badge */}
            <View style={styles.cardTopRow}>
              <Text style={[styles.questionNumberText, { color: colors.textMuted }]}>#{q.number}</Text>
              {showAnswers && (
                <View
                  style={[
                    styles.answerBadge,
                    {
                      backgroundColor: q.answer === 'V' ? colors.successLight : colors.errorLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.answerBadgeText,
                      { color: q.answer === 'V' ? colors.success : colors.error },
                    ]}
                  >
                    {q.answer}
                  </Text>
                </View>
              )}
            </View>

            {/* Italian Question Text with Clickable Terms */}
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>
              La{' '}
              <Text
                style={[styles.underlinedWord, { color: colors.primary }]}
                onPress={() => handleWordClick('strada')}
              >
                strada
              </Text>{' '}
              può essere{' '}
              <Text
                style={[styles.underlinedWord, { color: colors.primary }]}
                onPress={() => handleWordClick('suddivisa')}
              >
                suddivisa
              </Text>{' '}
              in{' '}
              <Text
                style={[styles.underlinedWord, { color: colors.primary }]}
                onPress={() => handleWordClick('carreggiata')}
              >
                carreggiate
              </Text>
            </Text>

            {/* Translation */}
            <Text style={[styles.translationText, { color: colors.textMuted }]}>
              EN · {q.translation}
            </Text>

            {/* Bangla Audio Explanation */}
            <View style={[styles.audioCard, { backgroundColor: colors.primaryLight }]}>
              <TouchableOpacity style={[styles.audioPlayBox, { backgroundColor: colors.primary }]}>
                <Ionicons name="pause" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.audioWaveform}>
                <Ionicons name="stats-chart" size={18} color={colors.primary} />
                <Text style={[styles.audioLabel, { color: colors.primary }]}>
                  Bangla explanation
                </Text>
              </View>
              <Text style={[styles.audioTime, { color: colors.primary }]}>{q.audioDuration}</Text>
            </View>

            {/* Action Bar */}
            <View style={styles.cardActionsRow}>
              <View style={styles.actionIconsLeft}>
                <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: colors.chipBackground }]}>
                  <Ionicons name="volume-high-outline" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: colors.chipBackground }]}>
                  <Ionicons name="headset-outline" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: colors.chipBackground }]}>
                  <Ionicons name="bookmark-outline" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: colors.chipBackground }]}>
                  <Ionicons name="pencil-outline" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: colors.chipBackground }]}>
                  <Ionicons name="language-outline" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Ask Tutor Button */}
              <TouchableOpacity
                style={[styles.askBtn, { backgroundColor: colors.primaryLight }]}
                onPress={() => navigation.navigate('TeacherChat')}
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
                <Text style={[styles.askBtnText, { color: colors.primary }]}>Ask</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Word Sheet Modal */}
      <WordSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        word={selectedWord}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 6,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  langTogglePill: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
  },
  langPillOption: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },
  questionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumberText: {
    fontSize: 13,
    fontWeight: '700',
  },
  answerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerBadgeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 8,
  },
  underlinedWord: {
    textDecorationLine: 'underline',
    fontWeight: '800',
  },
  translationText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  audioPlayBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  audioLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  audioTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionIconsLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  askBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
