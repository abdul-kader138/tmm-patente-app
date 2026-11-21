import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G, Line, Polygon, Polyline, Text as SvgText } from 'react-native-svg';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

/* -------------------------------------------------------------------------- */
/*  Types & mock data                                                         */
/* -------------------------------------------------------------------------- */

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface ExamMistake {
  id: string;
  questionNumber: number;
  topic: string;
  textIt: string;
  textEn: string;
  userAnswer: string;
  correctAnswer: string;
  sign?: 'stop';
}

export interface ExamResult {
  examNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  maxErrors: number;
  durationSeconds: number;
  /** "Top X%" — lower is better */
  topPercent: number;
  /** Scores of the last mock exams, oldest → newest (the last one is this exam) */
  history: number[];
  mistakes: ExamMistake[];
}

/**
 * Fallback so the screen renders standalone.
 * In production pass the real result: navigation.replace('ExamResult', { result }).
 */
const MOCK_RESULT: ExamResult = {
  examNumber: 8,
  totalQuestions: 30,
  correctAnswers: 28,
  maxErrors: 3,
  durationSeconds: 14 * 60 + 32,
  topPercent: 26,
  history: [22, 24, 23, 26, 27, 25, 28, 28],
  mistakes: [
    {
      id: 'q17',
      questionNumber: 17,
      topic: 'Right of way',
      textIt: 'Il segnale obbliga a fermarsi solo se arrivano veicoli.',
      textEn: 'The sign requires you to stop only if vehicles are coming.',
      userAnswer: 'Vero',
      correctAnswer: 'Falso',
      sign: 'stop',
    },
    {
      id: 'q23',
      questionNumber: 23,
      topic: 'Signs',
      textIt: 'Il segnale di pericolo ha forma triangolare.',
      textEn: 'The danger sign is triangular.',
      userAnswer: 'Falso',
      correctAnswer: 'Vero',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Design tokens not (yet) in the theme                                      */
/*  → move into ThemeContext if you need dark-mode variants.                  */
/* -------------------------------------------------------------------------- */

const TOKENS = {
  panelBg: '#EEF0F5',
  divider: '#DCE0E8',
  tileBg: '#EEF0F5',
  stopRed: '#DC2626',
  ring: { size: 132, stroke: 9 },
  chart: { height: 74, overflowX: 8, top: 13, bottom: 19 },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatDuration = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.max(0, Math.round(totalSeconds % 60));
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

interface RingProps {
  progress: number; // 0..1
  color: string;
  trackColor: string;
  children?: React.ReactNode;
}

/** Circular progress starting at 12 o'clock, clockwise, butt caps (as in the design). */
const ScoreRing: React.FC<RingProps> = ({ progress, color, trackColor, children }) => {
  const { size, stroke } = TOKENS.ring;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={styles.ringWrap}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${c * clamped} ${c}`}
          />
        </G>
      </Svg>
      {children}
    </View>
  );
};

interface TrendProps {
  data: number[];
  passMark: number;
  lineColor: string;
  passColor: string;
  dotFill: string;
}

/** Real data-driven line chart. Width is measured, so it fits any screen. */
const TrendChart: React.FC<TrendProps> = ({ data, passMark, lineColor, passColor, dotFill }) => {
  const [width, setWidth] = useState(0);
  const { height, overflowX, top, bottom } = TOKENS.chart;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const points = useMemo(() => {
    if (!width || data.length === 0) return null;
    const lo = Math.min(...data, passMark);
    const hi = Math.max(...data, passMark);
    const range = hi - lo || 1;
    const usableH = height - top - bottom;
    const stepX = data.length > 1 ? width / (data.length - 1) : 0;
    const yOf = (v: number) => top + (1 - (v - lo) / range) * usableH;
    return {
      pts: data.map((v, i) => ({ x: overflowX + i * stepX, y: yOf(v) })),
      passY: yOf(passMark),
    };
  }, [width, data, passMark, height, top, bottom, overflowX]);

  return (
    <View style={styles.chartBox} onLayout={onLayout}>
      {points && (
        <Svg
          width={width + overflowX * 2}
          height={height}
          style={{ marginHorizontal: -overflowX }}
        >
          <Line
            x1={overflowX}
            x2={overflowX + width}
            y1={points.passY}
            y2={points.passY}
            stroke={passColor}
            strokeWidth={1}
            strokeDasharray="6,4"
          />
          <Polyline
            points={points.pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={lineColor}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.pts.map((p, i) => {
            const isLast = i === points.pts.length - 1;
            return isLast ? (
              <Circle key={i} cx={p.x} cy={p.y} r={5.5} fill={lineColor} />
            ) : (
              <Circle key={i} cx={p.x} cy={p.y} r={3.25} fill={dotFill} stroke={lineColor} strokeWidth={2} />
            );
          })}
        </Svg>
      )}
    </View>
  );
};

const StopSign: React.FC<{ size?: number }> = ({ size = 34 }) => {
  const octagon = (inset: number) => {
    const s = size - inset * 2;
    const k = s * 0.2929;
    return [
      [inset + k, inset],
      [inset + s - k, inset],
      [inset + s, inset + k],
      [inset + s, inset + s - k],
      [inset + s - k, inset + s],
      [inset + k, inset + s],
      [inset, inset + s - k],
      [inset, inset + k],
    ]
      .map((p) => p.join(','))
      .join(' ');
  };
  return (
    <Svg width={size} height={size}>
      <Polygon points={octagon(0)} fill={TOKENS.stopRed} />
      <Polygon points={octagon(2)} fill="none" stroke="#FFFFFF" strokeWidth={1} />
      <SvgText
        x={size / 2}
        y={size / 2 + 3.2}
        fontSize={9}
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        STOP
      </SvgText>
    </Svg>
  );
};

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export const ExamResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { colors } = useTheme();

  const result: ExamResult =
    (route.params as { result?: ExamResult } | undefined)?.result ?? MOCK_RESULT;

  const {
    examNumber,
    totalQuestions,
    correctAnswers,
    maxErrors,
    durationSeconds,
    topPercent,
    history,
    mistakes,
  } = result;

  const errors = totalQuestions - correctAnswers;
  const passed = errors <= maxErrors;
  const passMark = totalQuestions - maxErrors;
  const statusColor = passed ? colors.success : colors.error;
  const firstMistake = mistakes[0];

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: passed
          ? `I scored ${correctAnswers}/${totalQuestions} on Mock exam #${examNumber} and passed! 🎉`
          : `I scored ${correctAnswers}/${totalQuestions} on Mock exam #${examNumber}. Practicing for the next one!`,
      });
    } catch {
      /* user dismissed / share unavailable — nothing to do */
    }
  }, [passed, correctAnswers, totalQuestions, examNumber]);

  const goHome = useCallback(() => navigation.navigate('MainTabs'), [navigation]);
  const goReview = useCallback(() => navigation.navigate('Review'), [navigation]);
  const retake = useCallback(() => navigation.replace('ExamSimulation'), [navigation]);

  const heading = passed ? 'You passed!' : 'Not this time';
  const subtext = passed
    ? `${errors} ${plural(errors, 'error', 'errors')} — the limit is ${maxErrors}. You'd pass the real exam today.`
    : `${errors} ${plural(errors, 'error', 'errors')} — the limit is ${maxErrors}. Review your mistakes and try again.`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={goHome}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mock exam #{examNumber}</Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share result"
        >
          <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ScoreRing
            progress={correctAnswers / totalQuestions}
            color={statusColor}
            trackColor={passed ? colors.successLight : colors.errorLight}
          >
            <View style={styles.ringTextBox}>
              <Text style={[styles.scoreValue, { color: colors.textPrimary }]}>
                {correctAnswers}/{totalQuestions}
              </Text>
              <Text style={[styles.scoreLabel, { color: statusColor }]}>{passed ? 'PASSED' : 'FAILED'}</Text>
            </View>
          </ScoreRing>

          <Text style={[styles.resultHeading, { color: colors.textPrimary }]}>{heading}</Text>
          <Text style={[styles.resultSubtext, { color: colors.textMuted }]}>{subtext}</Text>

          {/* Quick stats */}
          <View style={[styles.quickStats, { backgroundColor: TOKENS.panelBg }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>{formatDuration(durationSeconds)}</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>Time</Text>
            </View>
            <View style={[styles.statLine, { backgroundColor: TOKENS.divider }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.error }]}>
                {errors} / {maxErrors}
              </Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>Errors</Text>
            </View>
            <View style={[styles.statLine, { backgroundColor: TOKENS.divider }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.primary }]}>Top {topPercent}%</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>Rank</Text>
            </View>
          </View>
        </View>

        {/* Trend card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Last {history.length} mock exams
            </Text>
            <View style={[styles.passBadge, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.passBadgeText, { color: colors.success }]}>Pass ≥ {passMark}</Text>
            </View>
          </View>
          <TrendChart
            data={history}
            passMark={passMark}
            lineColor={colors.primary}
            passColor={colors.success}
            dotFill={colors.card}
          />
        </View>

        {/* Mistakes preview */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {firstMistake ? (
            <>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Review your {mistakes.length} {plural(mistakes.length, 'mistake', 'mistakes')}
                </Text>
                <TouchableOpacity onPress={goReview} hitSlop={8} accessibilityRole="button">
                  <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.mistakeRow}>
                <View style={[styles.signTile, { backgroundColor: TOKENS.tileBg }]}>
                  {firstMistake.sign === 'stop' ? (
                    <StopSign />
                  ) : (
                    <Ionicons name="alert-circle" size={28} color={colors.error} />
                  )}
                </View>

                <View style={styles.mistakeTextCol}>
                  <Text style={[styles.qTag, { color: colors.textMuted }]}>
                    Q{firstMistake.questionNumber} · {firstMistake.topic.toUpperCase()}
                  </Text>
                  <Text style={[styles.qText, { color: colors.textPrimary }]}>{firstMistake.textIt}</Text>
                  <Text style={[styles.qTranslation, { color: colors.textMuted }]}>{firstMistake.textEn}</Text>

                  <View style={styles.answerRow}>
                    <View style={[styles.ansBadge, { backgroundColor: colors.errorLight }]}>
                      <Ionicons name="close" size={14} color={colors.error} />
                      <Text style={[styles.ansBadgeText, { color: colors.error }]}>You: {firstMistake.userAnswer}</Text>
                    </View>
                    <View style={[styles.ansBadge, { backgroundColor: colors.successLight }]}>
                      <Ionicons name="checkmark" size={14} color={colors.success} />
                      <Text style={[styles.ansBadgeText, { color: colors.success }]}>
                        Correct: {firstMistake.correctAnswer}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.perfectRow}>
              <Ionicons name="trophy" size={28} color={colors.success} />
              <View style={styles.mistakeTextCol}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Perfect score</Text>
                <Text style={[styles.qTranslation, { color: colors.textMuted, marginBottom: 0 }]}>
                  No mistakes to review. Keep the streak going.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.retakeBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={retake}
          accessibilityRole="button"
          accessibilityLabel="Retake exam"
          activeOpacity={0.8}
        >
          <Ionicons name="reload" size={18} color={colors.textPrimary} />
          <Text style={[styles.retakeBtnText, { color: colors.textPrimary }]}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={firstMistake ? goReview : goHome}
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{firstMistake ? 'Review mistakes' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/*  Styles (measured from the 2x mockup: px / 2 = pt)                         */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 1,
    paddingBottom: 0,
    height: 48,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 20,
    gap: 14,
  },

  /* Hero */
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ringWrap: {
    width: TOKENS.ring.size,
    height: TOKENS.ring.size,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTextBox: { alignItems: 'center', marginTop: 4 },
  scoreValue: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 38 },
  scoreLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, lineHeight: 14 },
  resultHeading: { fontSize: 24, fontWeight: '800', lineHeight: 30, marginTop: 14, marginBottom: 4 },
  resultSubtext: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 14 },

  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 16,
    paddingVertical: 12,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', lineHeight: 24 },
  statLbl: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  statLine: { width: 1, height: 24 },

  /* Shared card */
  card: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 23,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', lineHeight: 22 },
  seeAll: { fontSize: 15, fontWeight: '600' },

  /* Trend */
  passBadge: {
    height: 23,
    paddingHorizontal: 9,
    borderRadius: 12,
    justifyContent: 'center',
  },
  passBadgeText: { fontSize: 12, fontWeight: '700' },
  chartBox: { height: TOKENS.chart.height, width: '100%' },

  /* Mistakes */
  mistakeRow: { flexDirection: 'row', gap: 12 },
  perfectRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  signTile: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mistakeTextCol: { flex: 1 },
  qTag: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, lineHeight: 14, marginBottom: 4 },
  qText: { fontSize: 15, fontWeight: '700', lineHeight: 18, marginBottom: 4 },
  qTranslation: { fontSize: 13, lineHeight: 16, marginBottom: 5 },
  answerRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  ansBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 11,
  },
  ansBadgeText: { fontSize: 12, fontWeight: '700' },

  /* Bottom bar */
  bottomBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 10,
  },
  retakeBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retakeBtnText: { fontSize: 16, fontWeight: '700' },
  primaryBtn: {
    flex: 2.2,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});

export default ExamResultScreen;