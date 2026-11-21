import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Answer = 'V' | 'F';
type Answers = Record<number, Answer>;

/* -------------------------------------------------------------------------- */
/* Config & data                                                              */
/* -------------------------------------------------------------------------- */

const TOTAL_QUESTIONS = 30;
const MAX_ERRORS_TO_PASS = 3; // Patente B: max 3 errors out of 30
const INITIAL_SECONDS = 17 * 60 + 42; // 17:42 (design snapshot)
const AUTO_ADVANCE_MS = 180;

// Design snapshot: questions 1-13 answered, currently on 14.
// TODO: remove both once the real session exists.
const START_QUESTION = 14;
const INITIAL_ANSWERS: Answers = {
  1: 'V', 2: 'F', 3: 'V', 4: 'V', 5: 'F', 6: 'V', 7: 'F',
  8: 'V', 9: 'V', 10: 'F', 11: 'V', 12: 'V', 13: 'F',
};

interface ExamQuestion {
  id: number;
  italian: string;
  correct: Answer;
  speedLimit?: number; // sign graphic
}

// TODO: replace with the real exam set (API). Placeholder: same sample for all 30.
const SAMPLE: Omit<ExamQuestion, 'id'> = {
  italian: 'Il segnale raffigurato indica che non si deve superare la velocità di 50 km/h.',
  correct: 'V',
  speedLimit: 50,
};
const EXAM_QUESTIONS: ExamQuestion[] = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => ({
  id: i + 1,
  ...SAMPLE,
}));

const formatTimer = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/* -------------------------------------------------------------------------- */
/* Palette (light + dark)                                                     */
/* -------------------------------------------------------------------------- */

const getPalette = (isDark: boolean) => ({
  screenBg: isDark ? '#0A0E18' : '#F4F6FB',

  headerSub: isDark ? '#8F9BB3' : '#98A2B3',
  headerTitle: isDark ? '#FFFFFF' : '#0F172A',
  timerBg: isDark ? '#3A1A1A' : '#FEECEA',
  timerText: isDark ? '#F97066' : '#B42318',

  chipBg: isDark ? '#131A2A' : '#FFFFFF',
  chipBorder: isDark ? '#1E293B' : '#E4E7EE',
  chipText: isDark ? '#8F9BB3' : '#98A2B3',
  chipAnsweredBg: isDark ? '#3B4663' : '#475467',
  chipAnsweredBorder: isDark ? '#4B5878' : '#D0D5DD',

  accent: isDark ? '#4C74FF' : '#2D5BFF',
  accentLight: isDark ? '#1B2552' : '#EAF0FF',

  signCardBg: isDark ? '#1B2336' : '#EFF1F6',
  signRing: '#D92D20',
  signInner: '#FFFFFF',
  signText: '#111827',

  questionText: isDark ? '#FFFFFF' : '#0F172A',
  lockText: isDark ? '#8F9BB3' : '#98A2B3',

  choiceBg: isDark ? '#131A2A' : '#FFFFFF',
  choiceBorder: isDark ? '#1E293B' : '#E4E7EE',
  choiceLetter: isDark ? '#FFFFFF' : '#0F172A',
  choiceSub: isDark ? '#8F9BB3' : '#98A2B3',

  barBorder: isDark ? '#1E293B' : '#E6E8EF',
  arrowBg: isDark ? '#131A2A' : '#FFFFFF',
  arrowBorder: isDark ? '#1E293B' : '#E4E7EE',
  arrowIcon: isDark ? '#FFFFFF' : '#0F172A',
  summary: isDark ? '#CBD5E1' : '#475467',
  submitBg: isDark ? '#4C74FF' : '#2D5BFF',
});

type Palette = ReturnType<typeof getPalette>;

/* -------------------------------------------------------------------------- */
/* Question grid                                                              */
/* -------------------------------------------------------------------------- */

interface GridProps {
  answers: Answers;
  current: number;
  onSelect: (n: number) => void;
  c: Palette;
}

const QuestionGrid = memo(({ answers, current, onSelect, c }: GridProps) => (
  <View style={styles.grid}>
    {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i + 1).map((n) => {
      const answered = answers[n] !== undefined;
      const isCurrent = n === current;

      return (
        <TouchableOpacity
          key={n}
          activeOpacity={0.7}
          hitSlop={{ top: 3, bottom: 3, left: 2, right: 2 }}
          style={[
            styles.chip,
            {
              backgroundColor: answered ? c.chipAnsweredBg : c.chipBg,
              borderColor: isCurrent ? c.accent : answered ? c.chipAnsweredBorder : c.chipBorder,
              borderWidth: isCurrent ? 1.5 : 1,
            },
          ]}
          onPress={() => onSelect(n)}
          accessibilityRole="button"
          accessibilityLabel={`Question ${n}, ${answered ? 'answered' : 'not answered'}`}
          accessibilityState={{ selected: isCurrent }}
        >
          <Text
            style={[
              styles.chipText,
              { color: answered ? '#FFFFFF' : isCurrent ? c.accent : c.chipText },
            ]}
          >
            {n}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
));

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const ExamSimulationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const c = getPalette(isDark);

  const [currentQuestion, setCurrentQuestion] = useState(START_QUESTION);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_SECONDS);

  const scrollRef = useRef<any>(null);
  const endAtRef = useRef(Date.now() + INITIAL_SECONDS * 1000);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);
  const allowLeaveRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const question = EXAM_QUESTIONS[currentQuestion - 1];
  const currentAnswer = answers[currentQuestion];
  const timeUp = secondsRemaining === 0;

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const remainingCount = TOTAL_QUESTIONS - answeredCount;
  const isFirst = currentQuestion === 1;
  const isLast = currentQuestion === TOTAL_QUESTIONS;

  /* ---- question navigation ---- */

  const cancelAdvance = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  const goTo = useCallback((n: number) => {
    setCurrentQuestion(Math.min(Math.max(n, 1), TOTAL_QUESTIONS));
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleGridSelect = useCallback(
    (n: number) => {
      cancelAdvance();
      goTo(n);
    },
    [goTo],
  );

  const goPrev = useCallback(() => {
    cancelAdvance();
    goTo(currentQuestion - 1);
  }, [currentQuestion, goTo]);

  const goNext = useCallback(() => {
    cancelAdvance();
    goTo(currentQuestion + 1);
  }, [currentQuestion, goTo]);

  useEffect(() => cancelAdvance, []);

  /* ---- answering ---- */

  const handleSelectAnswer = useCallback(
    (ans: Answer) => {
      if (timeUp || finishedRef.current) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion]: ans }));

      // Exam-style flow: move on shortly after answering (except on the last question).
      cancelAdvance();
      if (currentQuestion < TOTAL_QUESTIONS) {
        const answeredAt = currentQuestion;
        advanceTimerRef.current = setTimeout(() => {
          advanceTimerRef.current = null;
          setCurrentQuestion((cur) => (cur === answeredAt ? answeredAt + 1 : cur));
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }, AUTO_ADVANCE_MS);
      }
    },
    [currentQuestion, timeUp],
  );

  /* ---- submit ---- */

  const finishExam = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    allowLeaveRef.current = true;
    cancelAdvance();

    const given = answersRef.current;
    // Unanswered counts as an error, as in the real exam.
    const correct = EXAM_QUESTIONS.filter((q) => given[q.id] === q.correct).length;
    const errors = TOTAL_QUESTIONS - correct;

    navigation.replace('ExamResult', { score: correct, passed: errors <= MAX_ERRORS_TO_PASS });
  }, [navigation]);

  const handleSubmit = useCallback(() => {
    const unanswered = TOTAL_QUESTIONS - Object.keys(answersRef.current).length;
    const message =
      unanswered > 0
        ? `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to finish?`
        : `You answered all ${TOTAL_QUESTIONS} questions. Ready to submit?`;

    Alert.alert('Submit Exam', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', style: 'destructive', onPress: finishExam },
    ]);
  }, [finishExam]);

  /* ---- exit guard ----
     Hardware back button handling for Android. On iOS, gestureEnabled is false in the navigator. */

  const confirmExit = useCallback(() => {
    Alert.alert('Exit exam', 'Your progress will be lost. Are you sure?', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => {
          allowLeaveRef.current = true;
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('MainTabs');
          }
        },
      },
    ]);
  }, [navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (allowLeaveRef.current || finishedRef.current) return false;
      confirmExit();
      return true;
    });
    return () => sub.remove();
  }, [confirmExit]);

  /* ---- timer: deadline based, accurate after backgrounding ---- */

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setSecondsRemaining(left);
      if (left === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!timeUp || finishedRef.current) return;
    cancelAdvance();
    Alert.alert(
      'Time is up',
      'Your exam will be submitted automatically.',
      [{ text: 'OK', onPress: finishExam }],
      { cancelable: false },
    );
  }, [timeUp, finishExam]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerSubtitle, { color: c.headerSub }]}>Exam simulation · Patente B</Text>
          <Text style={[styles.headerTitle, { color: c.headerTitle }]}>
            Question {currentQuestion} of {TOTAL_QUESTIONS}
          </Text>
        </View>

        <View
          style={[styles.timerBadge, { backgroundColor: c.timerBg }]}
          accessible
          accessibilityRole="timer"
          accessibilityLabel={`Time left ${formatTimer(secondsRemaining)}`}
        >
          <Ionicons name="time-outline" size={15} color={c.timerText} />
          <Text style={[styles.timerText, { color: c.timerText }]}>{formatTimer(secondsRemaining)}</Text>
        </View>
      </View>

      {/* Question grid */}
      <QuestionGrid answers={answers} current={currentQuestion} onSelect={handleGridSelect} c={c} />

      {/* Content */}
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {question.speedLimit !== undefined && (
          <View style={[styles.signCard, { backgroundColor: c.signCardBg }]}>
            <View style={[styles.speedCircle, { borderColor: c.signRing, backgroundColor: c.signInner }]}>
              <Text style={[styles.speedText, { color: c.signText }]}>{question.speedLimit}</Text>
            </View>
          </View>
        )}

        <Text style={[styles.questionText, { color: c.questionText }]}>{question.italian}</Text>

        <View style={styles.rulesLockRow}>
          <Ionicons name="lock-closed" size={13} color={c.lockText} style={styles.lockIcon} />
          <Text
            style={[styles.rulesLockText, { color: c.lockText }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.9}
          >
            Exam rules: no translation, no feedback until you submit
          </Text>
        </View>

        <View style={styles.answerButtonsRow} accessibilityRole="radiogroup">
          {(['V', 'F'] as const).map((a) => {
            const active = currentAnswer === a;
            return (
              <TouchableOpacity
                key={a}
                style={[
                  styles.choiceBtn,
                  {
                    backgroundColor: active ? c.accentLight : c.choiceBg,
                    borderColor: active ? c.accent : c.choiceBorder,
                    borderWidth: active ? 2 : 1.5,
                  },
                ]}
                onPress={() => handleSelectAnswer(a)}
                disabled={timeUp}
                activeOpacity={0.85}
                accessibilityRole="radio"
                accessibilityLabel={a === 'V' ? 'Vero, true' : 'Falso, false'}
                accessibilityState={{ checked: active, disabled: timeUp }}
              >
                <Text style={[styles.choiceLetter, { color: active ? c.accent : c.choiceLetter }]}>{a}</Text>
                <Text style={[styles.choiceSub, { color: active ? c.accent : c.choiceSub }]}>
                  {a === 'V' ? 'VERO' : 'FALSO'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          { borderTopColor: c.barBorder, paddingBottom: Math.max(insets.bottom - 7, 14) },
        ]}
      >
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.arrowBtn,
              { backgroundColor: c.arrowBg, borderColor: c.arrowBorder, opacity: isFirst ? 0.4 : 1 },
            ]}
            onPress={goPrev}
            disabled={isFirst}
            accessibilityRole="button"
            accessibilityLabel="Previous question"
            accessibilityState={{ disabled: isFirst }}
          >
            <Ionicons name="arrow-back" size={17} color={c.arrowIcon} />
          </TouchableOpacity>

          <Text style={[styles.statusSummary, { color: c.summary }]}>
            {answeredCount} answered · {remainingCount} left
          </Text>

          <TouchableOpacity
            style={[
              styles.arrowBtn,
              { backgroundColor: c.arrowBg, borderColor: c.arrowBorder, opacity: isLast ? 0.4 : 1 },
            ]}
            onPress={goNext}
            disabled={isLast}
            accessibilityRole="button"
            accessibilityLabel="Next question"
            accessibilityState={{ disabled: isLast }}
          >
            <Ionicons name="arrow-forward" size={17} color={c.arrowIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: c.submitBg }]}
          onPress={handleSubmit}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Submit exam"
        >
          <Text style={styles.submitBtnText}>Submit exam</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles (measured from the 780x1688 @2x design C4, values in pt)            */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header (text block y 52-90, timer 36pt tall)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 5.5,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    includeFontPadding: false,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },

  // Grid: fixed 19x19 chips, 3.5 / 5 gaps. 15 chips fit per row, so it wraps 15 + 15.
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

  // Content
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 },
  signCard: {
    height: 150,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  speedCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -1.5,
    includeFontPadding: false,
  },

  questionText: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.1,
    marginBottom: 14,
    includeFontPadding: false,
  },

  rulesLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    marginBottom: 14,
  },
  lockIcon: { width: 14, marginRight: 6 },
  rulesLockText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '400',
    includeFontPadding: false,
  },

  answerButtonsRow: { flexDirection: 'row', gap: 12 },
  choiceBtn: {
    flex: 1,
    height: 83,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 3,
    includeFontPadding: false,
  },
  choiceSub: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
    includeFontPadding: false,
  },

  // Bottom bar (hairline at y 705)
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrowBtn: {
    width: 59,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSummary: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    includeFontPadding: false,
  },
  submitBtn: {
    height: 45,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    includeFontPadding: false,
  },
});