import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polygon, Rect } from 'react-native-svg';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { WordSheetModal } from './WordSheetModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TOTAL_QUESTIONS = 30;
const CURRENT_INDEX = 12;
const BOOKMARK_STORAGE_KEY = '@patente_bookmarked_quizzes';

/* -------------------------------------------------------------------------- */
/* Pure SVG Ministerial Road Sign (Level crossing with barriers)              */
/* -------------------------------------------------------------------------- */

const LevelCrossingDangerSign: React.FC<{ width?: number; height?: number }> = ({
  width = 117,
  height = 102,
}) => (
  <Svg width={width} height={height} viewBox="0 0 200 175">
    <Polygon
      points="100,4 196,172 4,172"
      fill="#D82D20"
      stroke="#D82D20"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Polygon points="100,43 163,152 37,152" fill="#FFFFFF" />
    {/* 2 Horizontal Rails */}
    <Rect x={58} y={105} width={84} height={9} fill="#111827" />
    <Rect x={58} y={128} width={84} height={9} fill="#111827" />
    {/* 5 Vertical Pickets */}
    <Rect x={62} y={94} width={7} height={49} fill="#111827" />
    <Rect x={80.25} y={94} width={7} height={49} fill="#111827" />
    <Rect x={98.5} y={94} width={7} height={49} fill="#111827" />
    <Rect x={116.75} y={94} width={7} height={49} fill="#111827" />
    <Rect x={135} y={94} width={7} height={49} fill="#111827" />
  </Svg>
);

/* -------------------------------------------------------------------------- */
/* Quiz Question Screen                                                       */
/* -------------------------------------------------------------------------- */

export const QuizQuestionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { isDark } = useTheme();

  // Active answer: initial 'V' to match Figma C3 snapshot
  const [selectedAnswer, setSelectedAnswer] = useState<'V' | 'F' | null>('V');
  const [secondsRemaining, setSecondsRemaining] = useState(522); // 08:42
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Word sheet modal state
  const [wordSheetVisible, setWordSheetVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState('PASSAGGIO A LIVELLO');

  const questionItalian =
    'Il segnale raffigurato preannuncia un passaggio a livello con barriere o semibarriere.';

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check saved bookmark status
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (stored) {
          const list: number[] = JSON.parse(stored);
          setIsBookmarked(list.includes(CURRENT_INDEX));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => () => void Speech.stop(), []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Italian speech
  const handleToggleSpeak = useCallback(() => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    Speech.stop();
    setSpeaking(true);
    const finish = () => setSpeaking(false);
    Speech.speak(questionItalian, {
      language: 'it-IT',
      pitch: 1.0,
      rate: 0.9,
      onDone: finish,
      onStopped: finish,
      onError: finish,
    });
  }, [speaking]);

  // Toggle bookmark
  const handleToggleBookmark = useCallback(async () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      let list: number[] = stored ? JSON.parse(stored) : [];
      if (next) {
        if (!list.includes(CURRENT_INDEX)) list.push(CURRENT_INDEX);
      } else {
        list = list.filter((id) => id !== CURRENT_INDEX);
      }
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, [isBookmarked]);

  const handleOpenWordSheet = (word: string) => {
    setSelectedWord(word);
    setWordSheetVisible(true);
  };

  const isCorrect = selectedAnswer === 'V';

  /* -------------------------------------------------------------------------- */
  /* Palette calibrated directly from Figma C3 Light and Dark Mockups           */
  /* -------------------------------------------------------------------------- */
  const colors = {
    screenBg: isDark ? '#0A0E18' : '#F5F7FB',
    headerTitle: isDark ? '#FFFFFF' : '#0F172A',
    headerSub: isDark ? '#8F9BB3' : '#64748B',
    closeBtnBg: isDark ? '#1C253D' : '#FFFFFF',
    closeIcon: isDark ? '#FFFFFF' : '#0F172A',
    timerBg: isDark ? '#372818' : '#FEF3C7',
    timerText: isDark ? '#F59E0B' : '#B45309',

    // Dots
    dotGreen: '#12B76A',
    dotRed: '#F04438',
    dotBlue: isDark ? '#4C74FF' : '#2D5BFF',
    dotInactive: isDark ? '#1B2336' : '#E7EAF0',

    // Road sign card
    signCardBg: isDark ? '#1B2336' : '#F0F2F7',

    // Official tag & actions
    tagBg: isDark ? '#1B2336' : '#F0F2F7',
    tagText: isDark ? '#8F9BB3' : '#475569',
    spkBg: isDark ? '#1B2552' : '#EBF0FF',
    spkIcon: isDark ? '#60A5FA' : '#2D5BFF',
    bmkBg: isDark ? '#1B2336' : '#F0F2F7',
    bmkIcon: isDark ? '#94A3B8' : '#475569',

    // Question
    questionText: isDark ? '#FFFFFF' : '#0F172A',

    // English card (matches Lesson player caption typography)
    transCardBg: isDark ? '#1B2552' : '#EBF0FF',
    transTagText: isDark ? '#60A5FA' : '#2D5BFF',
    transBar: isDark ? '#60A5FA' : '#2D5BFF',
    transContent: isDark ? '#CBD5E1' : '#334155',

    // Glossary chips
    glossaryBg: isDark ? '#232042' : '#F2EEFE',
    glossaryText: isDark ? '#BFA6FE' : '#5E2BE2',

    // Choice buttons
    choiceBorder: isDark ? '#1E293B' : '#E2E8F0',
    choiceBg: isDark ? '#131A2A' : '#FFFFFF',
    choiceText: isDark ? '#FFFFFF' : '#0F172A',
    choiceSub: isDark ? '#8F9BB3' : '#64748B',

    // Selected VERO
    veroBorder: '#12B76A',
    veroBg: isDark ? '#0C2B20' : '#ECFDF5',
    veroText: isDark ? '#34D399' : '#027A48',

    // Feedback sheet
    feedbackBg: isDark ? '#131A2A' : '#FFFFFF',
    feedbackBorder: isDark ? '#1E293B' : '#EAECF0',
    feedbackTitle: isDark ? '#FFFFFF' : '#0F172A',
    feedbackDesc: isDark ? '#94A3B8' : '#475467',
    sparkleBg: isDark ? '#232042' : '#F2EEFE',
    sparkleIcon: isDark ? '#BFA6FE' : '#5E2BE2',
    xpBg: isDark ? '#0C2B20' : '#ECFDF5',
    xpText: isDark ? '#34D399' : '#027A48',

    // Actions
    tutorBtnBg: isDark ? '#1B2336' : '#FFFFFF',
    tutorBorder: isDark ? '#2E3A52' : '#D0D5DD',
    tutorText: isDark ? '#FFFFFF' : '#344054',
    nextBtnBg: isDark ? '#4C74FF' : '#2D5BFF',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBg }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.closeBtnBg }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close quiz"
        >
          <Ionicons name="close" size={20} color={colors.closeIcon} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.topicSub, { color: colors.headerSub }]}>
            Danger signs · Practice
          </Text>
          <Text style={[styles.questionIndex, { color: colors.headerTitle }]}>
            Question 12 of 30
          </Text>
        </View>

        <View style={[styles.timerBadge, { backgroundColor: colors.timerBg }]}>
          <Ionicons name="time-outline" size={14} color={colors.timerText} />
          <Text style={[styles.timerText, { color: colors.timerText }]}>
            {formatTimer(secondsRemaining)}
          </Text>
        </View>
      </View>

      {/* 30-Dots Progress Indicator */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => {
          let dotColor = colors.dotInactive;
          if (index < 4) dotColor = colors.dotGreen;
          else if (index === 4) dotColor = colors.dotRed;
          else if (index < 11) dotColor = colors.dotGreen;
          else if (index === 11) dotColor = colors.dotBlue;

          return <View key={index} style={[styles.dot, { backgroundColor: dotColor }]} />;
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Road Sign Graphic Card (Pure Vector SVG) */}
        <View style={[styles.signCard, { backgroundColor: colors.signCardBg }]}>
          <LevelCrossingDangerSign width={117} height={102} />
        </View>

        {/* Official Tag, Audio & Bookmark */}
        <View style={styles.metaRow}>
          <View style={[styles.officialBadge, { backgroundColor: colors.tagBg }]}>
            <Text style={[styles.officialText, { color: colors.tagText }]}>
              ITALIAN · OFFICIAL
            </Text>
          </View>

          <View style={styles.metaActions}>
            <TouchableOpacity
              style={[
                styles.metaActionBtn,
                { backgroundColor: speaking ? colors.nextBtnBg : colors.spkBg },
              ]}
              onPress={handleToggleSpeak}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Listen Italian pronunciation"
            >
              <Ionicons
                name="volume-medium"
                size={19}
                color={speaking ? '#FFFFFF' : colors.spkIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.metaActionBtn,
                { backgroundColor: isBookmarked ? '#FEF3C7' : colors.bmkBg },
              ]}
              onPress={handleToggleBookmark}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Bookmark quiz question"
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? '#D97706' : colors.bmkIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Italian Ministerial Question Text */}
        <Text style={[styles.questionText, { color: colors.questionText }]}>
          {questionItalian}
        </Text>

        {/* English Translation Box (Lesson Player Typography Alignment) */}
        <View style={[styles.translationCard, { backgroundColor: colors.transCardBg }]}>
          <View style={styles.transTagRow}>
            <View style={[styles.transBar, { backgroundColor: colors.transBar }]} />
            <Text style={[styles.transTag, { color: colors.transTagText }]}>ENGLISH</Text>
          </View>
          <Text style={[styles.transContent, { color: colors.transContent }]}>
            The sign shown warns of a level crossing with barriers or half-barriers.
          </Text>
        </View>

        {/* Glossary Keyword Pills (Interactive with WordSheetModal) */}
        <View style={styles.glossaryPillsRow}>
          <TouchableOpacity
            style={[styles.glossaryPill, { backgroundColor: colors.glossaryBg }]}
            onPress={() => handleOpenWordSheet('PASSAGGIO A LIVELLO')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open glossary for passaggio a livello"
          >
            <Text style={[styles.glossaryPillText, { color: colors.glossaryText }]}>
              passaggio a livello = level crossing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.glossaryPill, { backgroundColor: colors.glossaryBg }]}
            onPress={() => handleOpenWordSheet('PREANNUNCIA')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open glossary for preannuncia"
          >
            <Text style={[styles.glossaryPillText, { color: colors.glossaryText }]}>
              preannuncia = warns ahead
            </Text>
          </TouchableOpacity>
        </View>

        {/* Big VERO / FALSO Buttons */}
        <View style={styles.answerButtonsRow}>
          {/* VERO Button */}
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedAnswer === 'V'
                ? {
                    backgroundColor: colors.veroBg,
                    borderColor: colors.veroBorder,
                    borderWidth: 2,
                  }
                : {
                    backgroundColor: colors.choiceBg,
                    borderColor: colors.choiceBorder,
                    borderWidth: 1,
                  },
            ]}
            onPress={() => setSelectedAnswer('V')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedAnswer === 'V' }}
          >
            <View style={styles.choiceHeader}>
              <View
                style={[
                  styles.choiceRadio,
                  selectedAnswer === 'V'
                    ? {
                        borderColor: colors.veroBorder,
                        backgroundColor: colors.veroBorder,
                      }
                    : {
                        borderColor: colors.choiceBorder,
                        backgroundColor: 'transparent',
                      },
                ]}
              >
                {selectedAnswer === 'V' && (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={[
                  styles.choiceLetter,
                  { color: selectedAnswer === 'V' ? colors.veroText : colors.choiceText },
                ]}
              >
                VERO
              </Text>
            </View>
            <Text
              style={[
                styles.choiceSub,
                { color: selectedAnswer === 'V' ? colors.veroText : colors.choiceSub },
              ]}
            >
              True
            </Text>
          </TouchableOpacity>

          {/* FALSO Button */}
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedAnswer === 'F'
                ? {
                    backgroundColor: colors.feedbackBg,
                    borderColor: '#F04438',
                    borderWidth: 2,
                  }
                : {
                    backgroundColor: colors.choiceBg,
                    borderColor: colors.choiceBorder,
                    borderWidth: 1,
                  },
            ]}
            onPress={() => setSelectedAnswer('F')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedAnswer === 'F' }}
          >
            <View style={styles.choiceHeader}>
              <View
                style={[
                  styles.choiceRadio,
                  selectedAnswer === 'F'
                    ? {
                        borderColor: '#F04438',
                        backgroundColor: '#F04438',
                      }
                    : {
                        borderColor: colors.choiceBorder,
                        backgroundColor: 'transparent',
                      },
                ]}
              >
                {selectedAnswer === 'F' && (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={[
                  styles.choiceLetter,
                  { color: selectedAnswer === 'F' ? '#F04438' : colors.choiceText },
                ]}
              >
                FALSO
              </Text>
            </View>
            <Text
              style={[
                styles.choiceSub,
                { color: selectedAnswer === 'F' ? '#F04438' : colors.choiceSub },
              ]}
            >
              False
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instant Explanation Feedback Sheet */}
        {selectedAnswer !== null && (
          <View
            style={[
              styles.feedbackCard,
              {
                backgroundColor: colors.feedbackBg,
                borderColor: colors.feedbackBorder,
              },
            ]}
          >
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackTitleRow}>
                <View
                  style={[
                    styles.sparkleIcon,
                    { backgroundColor: colors.sparkleBg },
                  ]}
                >
                  <Ionicons name="sparkles" size={14} color={colors.sparkleIcon} />
                </View>
                <Text style={[styles.feedbackTitle, { color: colors.feedbackTitle }]}>
                  {isCorrect ? "Correct! Here's why" : "Incorrect! Here's why"}
                </Text>
              </View>
              <View style={[styles.xpBadge, { backgroundColor: colors.xpBg }]}>
                <Text style={[styles.xpText, { color: colors.xpText }]}>+10 XP</Text>
              </View>
            </View>

            <Text style={[styles.feedbackExplanation, { color: colors.feedbackDesc }]}>
              The fence (gate) symbol means the crossing is protected by barriers. A crossing
              without barriers shows a steam locomotive instead.
            </Text>

            <View style={styles.feedbackActionsRow}>
              <TouchableOpacity
                style={[
                  styles.tutorBtn,
                  {
                    backgroundColor: colors.tutorBtnBg,
                    borderColor: colors.tutorBorder,
                  },
                ]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Ask tutor for help"
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={16}
                  color={colors.tutorText}
                />
                <Text style={[styles.tutorBtnText, { color: colors.tutorText }]}>
                  Ask tutor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: colors.nextBtnBg }]}
                onPress={() => setSelectedAnswer(null)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Proceed to next question"
              >
                <Text style={styles.nextBtnText}>Next question</Text>
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Embedded WordSheetModal for glossary lookups */}
      <WordSheetModal
        visible={wordSheetVisible}
        onClose={() => setWordSheetVisible(false)}
        word={selectedWord}
      />
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles (Measured from Figma C3 Quiz question @2x)                          */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  topicSub: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    includeFontPadding: false,
    marginBottom: 2,
  },
  questionIndex: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  timerText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
  dotsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 3.5,
    marginBottom: 12,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signCard: {
    height: 133,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  officialBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 7,
  },
  officialText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  metaActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  metaActionBtn: {
    width: 38,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 12,
    includeFontPadding: false,
  },
  translationCard: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  transTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  transBar: {
    width: 3,
    height: 11,
    borderRadius: 1.5,
  },
  transTag: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  transContent: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    includeFontPadding: false,
  },
  glossaryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  glossaryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  glossaryPillText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    includeFontPadding: false,
  },
  answerButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  choiceBtn: {
    flex: 1,
    height: 72,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: 'center',
  },
  choiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  choiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    includeFontPadding: false,
  },
  choiceSub: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    includeFontPadding: false,
    marginLeft: 28,
  },
  feedbackCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackTitle: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    includeFontPadding: false,
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  xpText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    includeFontPadding: false,
  },
  feedbackExplanation: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    includeFontPadding: false,
  },
  feedbackActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  tutorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  tutorBtnText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    includeFontPadding: false,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 14,
    gap: 6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
});
