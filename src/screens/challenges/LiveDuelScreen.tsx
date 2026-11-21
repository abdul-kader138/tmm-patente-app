import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, G } from 'react-native-svg';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockDuelData } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/* Types & session constants                                                  */
/* -------------------------------------------------------------------------- */

type Choice = 'V' | 'F';
type RoundResult = 'correct' | 'wrong' | null;

const TOTAL_QUESTIONS = 10;
const CURRENT_INDEX = 8; // Q9 of 10 in the design snapshot
const ROUND_SECONDS = 10;
const INITIAL_SECONDS = 6; // design snapshot: 6 s left
const RESULT_DELAY_MS = 1500;
const USER_INITIALS = 'RU'; // TODO: take from the signed-in profile

/**
 * TODO: take the correct answer from the question payload.
 * The previous implementation treated "F" as correct, so that is kept here.
 */
const CORRECT_ANSWER: Choice = 'F';
const OPPONENT_ANSWERED = true; // TODO: drive from the live duel socket

// Rounds 1-8 are already played in the snapshot (round 3 was wrong).
const INITIAL_RESULTS: RoundResult[] = Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
  i < CURRENT_INDEX ? (i === 2 ? 'wrong' : 'correct') : null,
);

const NO_ENTRY_RED = '#D92D20';

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

interface TimerRingProps {
  secondsLeft: number;
  total: number;
  color: string;
  trackColor: string;
  textColor: string;
}

/** 52pt ring, 4pt stroke, round cap; the arc is the remaining time, clockwise from 12 o'clock. */
const TimerRing = memo(({ secondsLeft, total, color, trackColor, textColor }: TimerRingProps) => {
  const size = 52;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = Math.min(1, Math.max(0, secondsLeft / total));

  return (
    <View
      style={styles.timerRing}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${secondsLeft} seconds left`}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
          {progress > 0 && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={color}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${c * progress} ${c}`}
            />
          )}
        </G>
      </Svg>
      <Text style={[styles.timerDigit, { color: textColor }]}>{secondsLeft}</Text>
    </View>
  );
});

type ChoiceState = 'idle' | 'correct' | 'wrong';

interface ChoiceButtonProps {
  letter: Choice;
  label: string;
  state: ChoiceState;
  disabled: boolean;
  onPress: (c: Choice) => void;
}

const ChoiceButton = memo(({ letter, label, state, disabled, onPress }: ChoiceButtonProps) => {
  const { colors } = useTheme();
  const tone =
    state === 'correct'
      ? { bg: colors.successLight, border: colors.success }
      : state === 'wrong'
        ? { bg: colors.errorLight, border: colors.error }
        : { bg: colors.card, border: colors.border };

  return (
    <TouchableOpacity
      style={[styles.choiceBtn, { backgroundColor: tone.bg, borderColor: tone.border }]}
      onPress={() => onPress(letter)}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${label}`}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.choiceLetter, { color: colors.textPrimary }]}>{letter}</Text>
      <Text style={[styles.choiceLabel, { color: colors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  );
});

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const LiveDuelScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const duel = mockDuelData.activeDuel;

  const [userScore, setUserScore] = useState<number>(duel.userScore);
  const [opponentScore] = useState<number>(duel.opponentScore);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [selectedAns, setSelectedAns] = useState<Choice | null>(null);
  const [resolved, setResolved] = useState(false);
  const [results, setResults] = useState<RoundResult[]>(INITIAL_RESULTS);

  const resolvedRef = useRef(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Locks the round, scores it and moves on to the result screen. `null` = time ran out. */
  const resolveRound = useCallback(
    (choice: Choice | null) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;

      const correct = choice !== null && choice === CORRECT_ANSWER;
      const finalScore = userScore + (correct ? 1 : 0);

      setSelectedAns(choice);
      setResolved(true);
      setUserScore(finalScore);
      setResults((prev) => {
        const next = [...prev];
        next[CURRENT_INDEX] = correct ? 'correct' : 'wrong';
        return next;
      });

      navTimeoutRef.current = setTimeout(() => {
        navigation.navigate('ExamResult', { score: finalScore, passed: finalScore > opponentScore });
      }, RESULT_DELAY_MS);
    },
    [userScore, opponentScore, navigation],
  );

  // Countdown: one tick per second, paused once the round is resolved.
  useEffect(() => {
    if (resolved) return;
    if (secondsLeft <= 0) {
      resolveRound(null);
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, resolved, resolveRound]);

  useEffect(
    () => () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    },
    [],
  );

  const choiceState = useCallback(
    (c: Choice): ChoiceState => {
      if (!resolved) return 'idle';
      if (c === CORRECT_ANSWER) return 'correct';
      if (c === selectedAns) return 'wrong';
      return 'idle';
    },
    [resolved, selectedAns],
  );

  const segmentColors = useMemo(
    () =>
      results.map((r, i) => {
        if (i === CURRENT_INDEX && !resolved) return colors.primary;
        if (r === 'correct') return colors.success;
        if (r === 'wrong') return colors.error;
        return colors.indicatorInactive;
      }),
    [results, resolved, colors],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* 1-vs-1 score header */}
      <View style={styles.topScoreHeader}>
        <View style={styles.scoreSideLeft}>
          <View style={[styles.playerAvatar, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{USER_INITIALS}</Text>
          </View>
          <View>
            <Text style={[styles.playerNameText, { color: colors.textPrimary }]}>You</Text>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>{userScore}</Text>
          </View>
        </View>

        <View style={styles.centerTimerBox}>
          <Text style={[styles.qIndexText, { color: colors.textMuted }]}>
            Q {CURRENT_INDEX + 1} / {TOTAL_QUESTIONS}
          </Text>
          <TimerRing
            secondsLeft={secondsLeft}
            total={ROUND_SECONDS}
            color={colors.warning}
            trackColor={colors.chipBackground}
            textColor={colors.textPrimary}
          />
        </View>

        <View style={styles.scoreSideRight}>
          <View style={styles.opponentTextCol}>
            <Text style={[styles.playerNameText, { color: colors.textPrimary }]}>{duel.opponentName}</Text>
            <Text style={[styles.scoreValue, { color: colors.error }]}>{opponentScore}</Text>
          </View>
          <View style={[styles.playerAvatar, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.avatarText, { color: colors.error }]}>{duel.opponentInitials}</Text>
          </View>
        </View>
      </View>

      {/* Round progress */}
      <View
        style={styles.progressBarRow}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Question ${CURRENT_INDEX + 1} of ${TOTAL_QUESTIONS}`}
      >
        {segmentColors.map((bg, i) => (
          <View key={i} style={[styles.barSegment, { backgroundColor: bg }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Road sign (No entry) */}
        <View style={[styles.signCard, { backgroundColor: colors.cardHighlight }]}>
          <View style={styles.noEntrySign}>
            <View style={styles.whiteDash} />
          </View>
        </View>

        <Text style={[styles.questionText, { color: colors.textPrimary }]}>{duel.question.textItalian}</Text>

        <View style={[styles.transCard, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="language" size={15} color={colors.primary} style={styles.transIcon} />
          <Text style={[styles.transText, { color: colors.textPrimary }]}>{duel.question.translation}</Text>
        </View>

        <View style={styles.choiceRow}>
          <ChoiceButton letter="V" label="VERO" state={choiceState('V')} disabled={resolved} onPress={resolveRound} />
          <ChoiceButton letter="F" label="FALSO" state={choiceState('F')} disabled={resolved} onPress={resolveRound} />
        </View>

        {OPPONENT_ANSWERED && (
          <View style={styles.opponentStatusRow}>
            <View style={[styles.miniBadge, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.miniBadgeText, { color: colors.error }]}>{duel.opponentInitials}</Text>
            </View>
            <Text style={[styles.opponentStatusText, { color: colors.textMuted }]}>
              {duel.opponentName} has already answered
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LiveDuelScreen;

/* -------------------------------------------------------------------------- */
/* Styles (measured from the 780x1688 @2x design: px / 2 = pt)                */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header: natural-width sides + space-between puts the timer at x=188.5 like the design
  topScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 7,
  },
  scoreSideLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreSideRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  opponentTextCol: { alignItems: 'flex-end' },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', includeFontPadding: false },
  playerNameText: { fontSize: 13, lineHeight: 16, fontWeight: '700', includeFontPadding: false },
  scoreValue: { fontSize: 24, lineHeight: 28, fontWeight: '900', includeFontPadding: false },

  centerTimerBox: { alignItems: 'center', gap: 3.5 },
  qIndexText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  timerRing: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  timerDigit: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },

  // 10 dashes: 28pt wide, 6pt gap, 6pt high, 28pt side padding
  progressBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    gap: 6,
    marginTop: 13,
  },
  barSegment: { flex: 1, height: 6, borderRadius: 3 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  signCard: {
    height: 150,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  noEntrySign: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: NO_ENTRY_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteDash: {
    width: 64,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  questionText: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 13,
    includeFontPadding: false,
  },
  transCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    gap: 8,
    marginBottom: 14,
  },
  transIcon: { width: 14, marginTop: 2 },
  transText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    opacity: 0.78,
    includeFontPadding: false,
  },
  choiceRow: { flexDirection: 'row', gap: 13, marginBottom: 14 },
  choiceBtn: {
    flex: 1,
    height: 78,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '900',
    includeFontPadding: false,
  },
  choiceLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  opponentStatusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  miniBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBadgeText: { fontSize: 9, fontWeight: '800', includeFontPadding: false },
  opponentStatusText: { fontSize: 14, lineHeight: 18, fontWeight: '500', includeFontPadding: false },
});