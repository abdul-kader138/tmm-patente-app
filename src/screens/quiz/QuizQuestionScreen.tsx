import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Easing,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Polygon, Rect } from 'react-native-svg';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { WordSheetModal, WordEntry } from './WordSheetModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/* Types & data                                                               */
/* -------------------------------------------------------------------------- */

type Answer = 'V' | 'F';
type Result = 'correct' | 'wrong' | null;
type SignId = 'level-crossing-barriers';

interface GlossaryTerm {
  term: string; // key into WORD_DICTIONARY (lowercase)
  meaning: string;
}

interface QuizQuestion {
  id: number;
  topic: string;
  signId?: SignId;
  italian: string;
  english: string;
  glossary: GlossaryTerm[];
  answer: Answer;
  explanation: string;
  xp?: number;
}

const MODE_LABEL = 'Practice';
const TOTAL_QUESTIONS = 30;
const INITIAL_SECONDS = 522; // 08:42 in the design snapshot
const DEFAULT_XP = 10;
const BOOKMARK_STORAGE_KEY = '@patente_bookmarked_quizzes';

// TODO: replace with the real quiz session (API / store).
// Snapshot: questions 1-11 already answered (#5 wrong), currently on #12.
const START_INDEX = 11;
const INITIAL_RESULTS: Result[] = Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
  i < START_INDEX ? (i === 4 ? 'wrong' : 'correct') : null,
);

// TODO: replace with real data. Keyed by 0-based question index.
const QUESTIONS_BY_INDEX: Record<number, QuizQuestion> = {
  11: {
    id: 12,
    topic: 'Danger signs',
    signId: 'level-crossing-barriers',
    italian:
      'Il segnale raffigurato preannuncia un passaggio a livello con barriere o semibarriere.',
    english: 'The sign shown warns of a level crossing with barriers or half-barriers.',
    glossary: [
      { term: 'passaggio a livello', meaning: 'level crossing' },
      { term: 'preannuncia', meaning: 'warns ahead' },
    ],
    answer: 'V',
    explanation:
      'The fence (gate) symbol means the crossing is protected by barriers. A crossing without barriers shows a steam locomotive instead.',
  },
  12: {
    id: 13,
    topic: 'Danger signs',
    signId: 'level-crossing-barriers',
    italian: 'Il segnale raffigurato preannuncia un passaggio a livello senza barriere.',
    english: 'The sign shown warns of a level crossing without barriers.',
    glossary: [
      { term: 'passaggio a livello', meaning: 'level crossing' },
      { term: 'senza barriere', meaning: 'without barriers' },
    ],
    answer: 'F',
    explanation:
      'The fence (gate) symbol means the crossing has barriers. A crossing without barriers is shown with a steam locomotive instead.',
  },
};

// TODO: move to a shared data file and reuse in StudyModeScreen. Placeholder copy.
const WORD_DICTIONARY: Record<string, WordEntry> = {
  'passaggio a livello': {
    word: 'passaggio a livello',
    translation: 'Level crossing',
    explanation:
      'A "passaggio a livello" is where a road crosses a railway on the same level. It can be protected by barriers (con barriere) or have none (senza barriere).',
    banglaDurationSec: 24,
    related: [{ label: 'senza barriere · without barriers', word: 'senza barriere' }],
  },
  preannuncia: {
    word: 'preannuncia',
    translation: 'Warns ahead',
    explanation:
      'Danger signs "preannunciano" a hazard: they warn you before you reach it, so you have time to slow down.',
    banglaDurationSec: 18,
    related: [{ label: 'passaggio a livello · level crossing', word: 'passaggio a livello' }],
  },
  'senza barriere': {
    word: 'senza barriere',
    translation: 'Without barriers',
    explanation: 'A level crossing "senza barriere" has no gates. Look and listen before crossing.',
    banglaDurationSec: 15,
    related: [{ label: 'passaggio a livello · level crossing', word: 'passaggio a livello' }],
  },
};

/* -------------------------------------------------------------------------- */
/* Palette (light + dark)                                                     */
/* -------------------------------------------------------------------------- */

const getPalette = (isDark: boolean) => ({
  screenBg: isDark ? '#0A0E18' : '#F4F6FB',

  headerTitle: isDark ? '#FFFFFF' : '#0F172A',
  headerSub: isDark ? '#8F9BB3' : '#98A2B3',
  closeBtnBg: isDark ? '#1C253D' : '#FFFFFF',
  closeIcon: isDark ? '#FFFFFF' : '#0F172A',
  timerBg: isDark ? '#372818' : '#FDEFDB',
  timerText: isDark ? '#F59E0B' : '#B54708',

  dotGreen: '#12B76A',
  dotRed: '#F04438',
  dotBlue: isDark ? '#4C74FF' : '#2D5BFF',
  dotInactive: isDark ? '#1B2336' : '#E8EBF2',

  signCardBg: isDark ? '#1B2336' : '#EEF0F6',

  tagBg: isDark ? '#1B2336' : '#EEF0F6',
  tagText: isDark ? '#8F9BB3' : '#475467',
  spkBg: isDark ? '#1B2552' : '#E8EEFF',
  spkIcon: isDark ? '#60A5FA' : '#2D5BFF',
  spkActiveBg: isDark ? '#4C74FF' : '#2D5BFF',
  bmkBg: isDark ? '#1B2336' : '#EEF0F6',
  bmkIcon: isDark ? '#94A3B8' : '#475467',
  bmkActiveBg: isDark ? '#1B2552' : '#E8EEFF',
  bmkActiveIcon: isDark ? '#60A5FA' : '#2D5BFF',

  questionText: isDark ? '#FFFFFF' : '#0F172A',

  transCardBg: isDark ? '#1B2552' : '#E8EEFD',
  transTagText: isDark ? '#60A5FA' : '#2D5BFF',
  transBar: isDark ? '#60A5FA' : '#2D5BFF',
  transContent: isDark ? '#CBD5E1' : '#475467',

  glossaryBg: isDark ? '#232042' : '#F0EBFD',
  glossaryText: isDark ? '#BFA6FE' : '#5B2BD9',

  choiceBg: isDark ? '#131A2A' : '#FFFFFF',
  choiceBorder: isDark ? '#1E293B' : '#E8EAF1',
  choiceText: isDark ? '#FFFFFF' : '#0F172A',
  choiceSub: isDark ? '#8F9BB3' : '#98A2B3',

  veroBorder: '#12B76A',
  veroBg: isDark ? '#0C2B20' : '#E8F7EF',
  veroText: isDark ? '#34D399' : '#067647',

  wrongBorder: '#F04438',
  wrongBg: isDark ? '#2D1618' : '#FEF3F2',
  wrongText: isDark ? '#F97066' : '#B42318',

  sheetBg: isDark ? '#131A2A' : '#FFFFFF',
  sheetDivider: isDark ? '#1E293B' : '#ECEEF3',
  sheetTitle: isDark ? '#FFFFFF' : '#0F172A',
  sheetDesc: isDark ? '#94A3B8' : '#667085',
  sparkleBg: isDark ? '#232042' : '#EEEAFD',
  sparkleIcon: isDark ? '#BFA6FE' : '#6D3DF0',
  xpBg: isDark ? '#0C2B20' : '#E3F6EC',
  xpText: isDark ? '#34D399' : '#067647',

  tutorBg: isDark ? '#1B2336' : '#FFFFFF',
  tutorBorder: isDark ? '#2E3A52' : '#E2E5EC',
  tutorText: isDark ? '#FFFFFF' : '#0F172A',
  nextBg: isDark ? '#4C74FF' : '#2D5BFF',
});

type Palette = ReturnType<typeof getPalette>;

/* -------------------------------------------------------------------------- */
/* Road sign (pure SVG)                                                       */
/* -------------------------------------------------------------------------- */

const LevelCrossingDangerSign = memo(
  ({ width = 117, height = 102 }: { width?: number; height?: number }) => (
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
      <Rect x={58} y={105} width={84} height={9} fill="#111827" />
      <Rect x={58} y={128} width={84} height={9} fill="#111827" />
      <Rect x={62} y={94} width={7} height={49} fill="#111827" />
      <Rect x={80.25} y={94} width={7} height={49} fill="#111827" />
      <Rect x={98.5} y={94} width={7} height={49} fill="#111827" />
      <Rect x={116.75} y={94} width={7} height={49} fill="#111827" />
      <Rect x={135} y={94} width={7} height={49} fill="#111827" />
    </Svg>
  ),
);

const SIGN_COMPONENTS: Record<SignId, React.ComponentType> = {
  'level-crossing-barriers': () => <LevelCrossingDangerSign />,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/* -------------------------------------------------------------------------- */
/* Progress dots                                                              */
/* -------------------------------------------------------------------------- */

interface ProgressDotsProps {
  results: Result[];
  currentIndex: number;
  c: Palette;
}

const ProgressDots = memo(({ results, currentIndex, c }: ProgressDotsProps) => (
  <View
    style={styles.dotsRow}
    accessible
    accessibilityRole="progressbar"
    accessibilityLabel={`Question ${currentIndex + 1} of ${results.length}`}
    accessibilityValue={{ min: 1, max: results.length, now: currentIndex + 1 }}
  >
    {results.map((r, i) => {
      let color = c.dotInactive;
      if (i === currentIndex) color = c.dotBlue;
      else if (r === 'correct') color = c.dotGreen;
      else if (r === 'wrong') color = c.dotRed;
      return <View key={i} style={[styles.dot, { backgroundColor: color }]} />;
    })}
  </View>
));

/* -------------------------------------------------------------------------- */
/* Choice button (VERO / FALSO)                                               */
/* -------------------------------------------------------------------------- */

type ChoiceState = 'idle' | 'correct' | 'wrong';

interface ChoiceButtonProps {
  kind: Answer;
  state: ChoiceState;
  disabled: boolean;
  onPress: (a: Answer) => void;
  c: Palette;
}

const ChoiceButton = memo(({ kind, state, disabled, onPress, c }: ChoiceButtonProps) => {
  const label = kind === 'V' ? 'VERO' : 'FALSO';
  const sub = kind === 'V' ? 'True' : 'False';

  const tone =
    state === 'correct'
      ? { bg: c.veroBg, border: c.veroBorder, text: c.veroText, sub: c.veroText, radio: c.veroBorder }
      : state === 'wrong'
        ? { bg: c.wrongBg, border: c.wrongBorder, text: c.wrongText, sub: c.wrongText, radio: c.wrongBorder }
        : { bg: c.choiceBg, border: c.choiceBorder, text: c.choiceText, sub: c.choiceSub, radio: 'transparent' };

  return (
    <TouchableOpacity
      style={[styles.choiceBtn, { backgroundColor: tone.bg, borderColor: tone.border }]}
      onPress={() => onPress(kind)}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityLabel={`${label}, ${sub}`}
      accessibilityState={{ checked: state !== 'idle', disabled }}
    >
      <View style={styles.choiceHeader}>
        <View
          style={[
            styles.choiceRadio,
            { borderColor: state === 'idle' ? c.choiceBorder : tone.border, backgroundColor: tone.radio },
          ]}
        >
          {state === 'correct' && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          {state === 'wrong' && <Ionicons name="close" size={16} color="#FFFFFF" />}
        </View>
        <Text style={[styles.choiceLetter, { color: tone.text }]}>{label}</Text>
      </View>
      <Text style={[styles.choiceSub, { color: tone.sub }]}>{sub}</Text>
    </TouchableOpacity>
  );
});

/* -------------------------------------------------------------------------- */
/* Feedback bottom sheet (docked, full-bleed)                                 */
/* -------------------------------------------------------------------------- */

interface FeedbackSheetProps {
  c: Palette;
  correct: boolean;
  xp: number;
  explanation: string;
  isLast: boolean;
  onAskTutor: () => void;
  onNext: () => void;
  onHeight: (h: number) => void;
}

const FeedbackSheet = memo(
  ({ c, correct, xp, explanation, isLast, onAskTutor, onNext, onHeight }: FeedbackSheetProps) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(240)).current;

    useEffect(() => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [translateY]);

    const handleLayout = (e: LayoutChangeEvent) => onHeight(e.nativeEvent.layout.height);

    return (
      <Animated.View
        onLayout={handleLayout}
        style={[styles.sheet, { backgroundColor: c.sheetBg, transform: [{ translateY }] }]}
      >
        <View style={styles.sheetBody}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <View style={[styles.sparkleBox, { backgroundColor: c.sparkleBg }]}>
                <MaterialCommunityIcons name="star-four-points" size={14} color={c.sparkleIcon} />
              </View>
              <Text style={[styles.sheetTitle, { color: c.sheetTitle }]} accessibilityLiveRegion="polite">
                {correct ? "Correct! Here's why" : "Incorrect! Here's why"}
              </Text>
            </View>
            {correct && (
              <View style={[styles.xpBadge, { backgroundColor: c.xpBg }]}>
                <Text style={[styles.xpText, { color: c.xpText }]}>+{xp} XP</Text>
              </View>
            )}
          </View>

          <Text style={[styles.sheetDesc, { color: c.sheetDesc }]}>{explanation}</Text>

          <View style={styles.sheetActions}>
            <TouchableOpacity
              style={[styles.tutorBtn, { backgroundColor: c.tutorBg, borderColor: c.tutorBorder }]}
              onPress={onAskTutor}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Ask tutor"
            >
              <MaterialCommunityIcons name="message-text-outline" size={18} color={c.tutorText} />
              <Text style={[styles.tutorBtnText, { color: c.tutorText }]}>Ask tutor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: c.nextBg }]}
              onPress={onNext}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={isLast ? 'Finish quiz' : 'Next question'}
            >
              <Text style={styles.nextBtnText}>{isLast ? 'Finish quiz' : 'Next question'}</Text>
              <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Safe-area strip under the actions, separated by a hairline like the design */}
        <View
          style={[
            styles.sheetSafeArea,
            { height: Math.max(insets.bottom - 6, 12), borderTopColor: c.sheetDivider },
          ]}
        />
      </Animated.View>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const QuizQuestionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const c = getPalette(isDark);

  const scrollRef = useRef<any>(null);

  // Session
  const [index, setIndex] = useState(START_INDEX);
  const [results, setResults] = useState<Result[]>(INITIAL_RESULTS);
  const [selected, setSelected] = useState<Answer | null>(null);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const endAtRef = useRef(Date.now() + INITIAL_SECONDS * 1000);
  const timeUpShownRef = useRef(false);

  // Audio / bookmarks
  const [speaking, setSpeaking] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  // Word sheet
  const [wordSheetVisible, setWordSheetVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [wordBookmarks, setWordBookmarks] = useState<Record<string, boolean>>({});

  const [sheetHeight, setSheetHeight] = useState(0);

  const question = QUESTIONS_BY_INDEX[index];
  const isLast = !QUESTIONS_BY_INDEX[index + 1];
  const answered = selected !== null;
  const isCorrect = selected === question.answer;
  const isBookmarked = bookmarkedIds.includes(question.id);
  const SignComponent = question.signId ? SIGN_COMPONENTS[question.signId] : null;

  /* ---- navigation ---- */

  const leave = useCallback(() => {
    Speech.stop();
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('MainTabs');
  }, [navigation]);

  const handleClose = useCallback(() => {
    Alert.alert('Leave quiz?', 'Your progress in this session will be lost.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: leave },
    ]);
  }, [leave]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
  }, [handleClose]);

  /* ---- countdown (deadline based, so it stays accurate after backgrounding) ---- */

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (secondsLeft > 0 || timeUpShownRef.current) return;
    timeUpShownRef.current = true;
    Speech.stop();
    Alert.alert('Time is up', 'Your quiz time has ended.', [{ text: 'OK', onPress: leave }], {
      cancelable: false,
    });
  }, [secondsLeft, leave]);

  /* ---- bookmarks ---- */

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (stored) setBookmarkedIds(JSON.parse(stored));
      } catch {
        // best effort
      }
    })();
  }, []);

  const handleToggleBookmark = useCallback(async () => {
    const id = question.id;
    const next = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((x) => x !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(next);
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best effort
    }
  }, [bookmarkedIds, question.id]);

  /* ---- speech ---- */

  useEffect(() => () => void Speech.stop(), []);

  const handleToggleSpeak = useCallback(() => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    Speech.stop();
    setSpeaking(true);
    const finish = () => setSpeaking(false);
    Speech.speak(question.italian, {
      language: 'it-IT',
      rate: 0.9,
      onDone: finish,
      onStopped: finish,
      onError: finish,
    });
  }, [speaking, question.italian]);

  /* ---- answering ---- */

  const handleAnswer = useCallback(
    (a: Answer) => {
      if (selected !== null || secondsLeft === 0) return;
      setSelected(a);
      setResults((prev) => {
        const next = [...prev];
        next[index] = a === question.answer ? 'correct' : 'wrong';
        return next;
      });
    },
    [selected, secondsLeft, index, question.answer],
  );

  const handleNext = useCallback(() => {
    Speech.stop();
    setSpeaking(false);
    if (isLast) {
      // TODO: navigate to the results screen once it exists.
      leave();
      return;
    }
    setSelected(null);
    setSheetHeight(0);
    setIndex((i) => i + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [isLast, leave]);

  const handleAskTutor = useCallback(() => navigation.navigate('TeacherChat'), [navigation]);

  /* ---- glossary / word sheet ---- */

  const handleOpenWord = useCallback((term: string) => {
    setSelectedWord(term);
    setWordSheetVisible(true);
  }, []);

  const handleToggleWordBookmark = useCallback(
    (w: string) => setWordBookmarks((s) => ({ ...s, [w]: !s[w] })),
    [],
  );

  const choiceState = (a: Answer): ChoiceState => {
    if (!answered) return 'idle';
    if (a === question.answer) return 'correct';
    if (a === selected) return 'wrong';
    return 'idle';
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: c.screenBg }]}
    >
	<StatusBar style={isDark ? 'light' : 'dark'} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: c.closeBtnBg }]}
          onPress={handleClose}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close quiz"
        >
          <Ionicons name="close" size={20} color={c.closeIcon} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.topicSub, { color: c.headerSub }]}>
            {question.topic} · {MODE_LABEL}
          </Text>
          <Text style={[styles.questionIndex, { color: c.headerTitle }]}>
            Question {index + 1} of {TOTAL_QUESTIONS}
          </Text>
        </View>

        <View
          style={[styles.timerBadge, { backgroundColor: c.timerBg }]}
          accessible
          accessibilityRole="timer"
          accessibilityLabel={`Time left ${formatTimer(secondsLeft)}`}
        >
          <Ionicons name="time-outline" size={14} color={c.timerText} />
          <Text style={[styles.timerText, { color: c.timerText }]}>{formatTimer(secondsLeft)}</Text>
        </View>
      </View>

      <ProgressDots results={results} currentIndex={index} c={c} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: answered ? sheetHeight + 16 : insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Road sign card */}
        {SignComponent && (
          <View style={[styles.signCard, { backgroundColor: c.signCardBg }]}>
            <SignComponent />
          </View>
        )}

        {/* Tag + actions */}
        <View style={styles.metaRow}>
          <View style={[styles.officialBadge, { backgroundColor: c.tagBg }]}>
            <Text style={[styles.officialText, { color: c.tagText }]}>ITALIAN · OFFICIAL</Text>
          </View>

          <View style={styles.metaActions}>
            <TouchableOpacity
              style={[styles.metaActionBtn, { backgroundColor: speaking ? c.spkActiveBg : c.spkBg }]}
              onPress={handleToggleSpeak}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={speaking ? 'Stop Italian audio' : 'Listen in Italian'}
            >
              <Ionicons name="volume-medium" size={18} color={speaking ? '#FFFFFF' : c.spkIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.metaActionBtn, { backgroundColor: isBookmarked ? c.bmkActiveBg : c.bmkBg }]}
              onPress={handleToggleBookmark}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Bookmark question"
              accessibilityState={{ selected: isBookmarked }}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? c.bmkActiveIcon : c.bmkIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question */}
        <Text style={[styles.questionText, { color: c.questionText }]}>{question.italian}</Text>

        {/* English */}
        <View style={[styles.translationCard, { backgroundColor: c.transCardBg }]}>
          <View style={styles.transTagRow}>
            <View style={[styles.transBar, { backgroundColor: c.transBar }]} />
            <Text style={[styles.transTag, { color: c.transTagText }]}>ENGLISH</Text>
          </View>
          <Text style={[styles.transContent, { color: c.transContent }]}>{question.english}</Text>
        </View>

        {/* Glossary */}
        <View style={styles.glossaryRow}>
          {question.glossary.map((g) => (
            <TouchableOpacity
              key={g.term}
              style={[styles.glossaryPill, { backgroundColor: c.glossaryBg }]}
              onPress={() => handleOpenWord(g.term)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Open glossary for ${g.term}`}
            >
              <Text style={[styles.glossaryText, { color: c.glossaryText }]}>
                {g.term} = {g.meaning}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* VERO / FALSO */}
        <View style={styles.choicesRow} accessibilityRole="radiogroup">
          <ChoiceButton kind="V" state={choiceState('V')} disabled={answered} onPress={handleAnswer} c={c} />
          <ChoiceButton kind="F" state={choiceState('F')} disabled={answered} onPress={handleAnswer} c={c} />
        </View>
      </ScrollView>

      {/* Docked feedback sheet */}
      {answered && (
        <FeedbackSheet
          key={question.id}
          c={c}
          correct={isCorrect}
          xp={question.xp ?? DEFAULT_XP}
          explanation={question.explanation}
          isLast={isLast}
          onAskTutor={handleAskTutor}
          onNext={handleNext}
          onHeight={setSheetHeight}
        />
      )}

      <WordSheetModal
        visible={wordSheetVisible}
        onClose={() => setWordSheetVisible(false)}
        word={selectedWord}
        entry={WORD_DICTIONARY[selectedWord]}
        bookmarked={!!wordBookmarks[selectedWord]}
        onToggleBookmark={handleToggleWordBookmark}
        onSelectRelated={setSelectedWord}
      />
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles (measured from the 780x1688 @2x design, values in pt)               */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header (buttons y 48-88)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 1,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerCenter: { alignItems: 'center' },
  topicSub: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    includeFontPadding: false,
    marginBottom: 2,
  },
  questionIndex: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
  },
  timerText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },

  // Progress dots: fixed 7x4 dashes, 4.4 gap (shrink on narrow screens)
  dotsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    columnGap: 4.4,
  },
  dot: { width: 7, height: 4, borderRadius: 2, flexShrink: 1 },

  // Scroll content
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  signCard: {
    height: 136,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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
    borderRadius: 11,
  },
  officialText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  metaActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 12,
    includeFontPadding: false,
  },
  translationCard: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 13,
    borderRadius: 16,
    marginBottom: 12,
  },
  transTagRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  transBar: { width: 3, height: 10, borderRadius: 1.5 },
  transTag: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  transContent: {
    marginTop: 3,
    marginLeft: 12, // aligns with the "ENGLISH" label (bar 3 + gap 9)
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    includeFontPadding: false,
  },
  glossaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 6.5,
    marginBottom: 14,
  },
  glossaryPill: {
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  glossaryText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    includeFontPadding: false,
  },
  choicesRow: { flexDirection: 'row', gap: 12 },
  choiceBtn: {
    flex: 1,
    height: 58,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
  },
  choiceHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  choiceRadio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  choiceSub: {
    marginLeft: 36, // radio 26 + gap 10
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    includeFontPadding: false,
  },

  // Docked feedback sheet (top edge y=646 in the design)
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetBody: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 3,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  sparkleBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    includeFontPadding: false,
    flexShrink: 1,
  },
  xpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 11,
  },
  xpText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    includeFontPadding: false,
  },
  sheetDesc: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '400',
    includeFontPadding: false,
    marginBottom: 10,
  },
  sheetActions: { flexDirection: 'row', gap: 8 },
  tutorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 9,
  },
  tutorBtnText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    includeFontPadding: false,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 16,
    gap: 10,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    includeFontPadding: false,
  },
  sheetSafeArea: { borderTopWidth: StyleSheet.hairlineWidth },
});