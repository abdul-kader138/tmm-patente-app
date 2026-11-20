import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { WordSheetModal, WordEntry } from './WordSheetModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** A piece of the Italian sentence. `lookup` => underlined + tappable. */
interface Segment {
  text: string;
  lookup?: string;
}

interface StudyQuestion {
  id: number;
  number: number;
  segments: Segment[];
  translation: string;
  answer: 'V' | 'F';
  audioDurationSec: number;
  /** Design-snapshot only: where the audio starts. Remove in production. */
  audioStartSec?: number;
}

const TOTAL_QUESTIONS = 10; // TODO: derive from API response

const STUDY_QUESTIONS: StudyQuestion[] = [
  {
    id: 1,
    number: 1,
    segments: [
      { text: 'La ' },
      { text: 'strada', lookup: 'strada' },
      { text: ' può essere ' },
      { text: 'suddivisa', lookup: 'suddivisa' },
      { text: ' in ' },
      { text: 'carreggiate', lookup: 'carreggiata' },
    ],
    translation: 'A road can be divided into carriageways.',
    answer: 'V',
    audioDurationSec: 42,
    audioStartSec: 15,
  },
  {
    id: 2,
    number: 2,
    segments: [
      { text: 'La strada può ' },
      { text: 'comprendere', lookup: 'comprendere' },
      { text: ' le ' },
      { text: 'piste ciclabili', lookup: 'piste ciclabili' },
    ],
    translation: 'The road may include bicycle lanes.',
    answer: 'V',
    audioDurationSec: 35,
  },
  {
    id: 3,
    number: 3,
    segments: [
      { text: 'La strada è ' },
      { text: 'riservata', lookup: 'riservata' },
      { text: ' ' },
      { text: 'esclusivamente', lookup: 'esclusivamente' },
      { text: ' ai veicoli a motore' },
    ],
    translation: 'The road is reserved exclusively for motor vehicles.',
    answer: 'F',
    audioDurationSec: 30,
  },
];

const getPlainText = (q: StudyQuestion) => q.segments.map((s) => s.text).join('');

const formatTime = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

/* ------------------------------------------------------------------ */
/* Design tokens that are not in the theme yet                         */
/* ------------------------------------------------------------------ */

// "Ask" button is violet in the design (not the blue primary).
// TODO: move into ThemeContext as `accent` / `accentLight`.
const ASK = { fg: '#5B2BD9', bg: '#EEE9FD' };

const SOFT_SHADOW = {
  shadowColor: '#1B2A4E',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

interface IconButtonProps {
  icon: IoniconName;
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const IconButton = memo(({ icon, label, active = false, onPress }: IconButtonProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.actionIconBtn,
        { backgroundColor: active ? colors.primaryLight : colors.chipBackground },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Ionicons name={icon} size={16} color={active ? colors.primary : colors.textPrimary} />
    </TouchableOpacity>
  );
});

const WAVEFORM_HEIGHTS = [
  6, 12, 8, 16, 10, 20, 14, 18, 8, 14, 20, 10, 6, 12, 16, 8, 14, 10, 18, 12, 8, 16, 10, 14, 6,
  12, 18, 8, 14, 10, 16, 6, 12, 8, 14, 10, 6, 8,
];
const BAR_WIDTH = 2;
const BAR_GAP = 1.5;
const WAVEFORM_WIDTH = WAVEFORM_HEIGHTS.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

interface AudioPlayerProps {
  durationSec: number;
  initialPositionSec?: number;
}

/**
 * Bangla explanation player.
 * NOTE: playback is simulated with a timer until real audio URLs exist.
 * Swap the interval for expo-audio's player status (position / play / pause / seekTo).
 */
const BanglaAudioPlayer = memo(({ durationSec, initialPositionSec = 0 }: AudioPlayerProps) => {
  const { colors } = useTheme();
  const [position, setPosition] = useState(initialPositionSec);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setPosition((p) => Math.min(p + 1, durationSec)), 1000);
    return () => clearInterval(timer);
  }, [playing, durationSec]);

  useEffect(() => {
    if (playing && position >= durationSec) setPlaying(false);
  }, [playing, position, durationSec]);

  const togglePlay = () => {
    if (!playing && position >= durationSec) setPosition(0);
    setPlaying((p) => !p);
  };

  const handleSeek = (e: GestureResponderEvent) => {
    const ratio = Math.min(Math.max(e.nativeEvent.locationX / WAVEFORM_WIDTH, 0), 1);
    setPosition(Math.round(ratio * durationSec));
  };

  const filledBars = Math.round((position / durationSec) * WAVEFORM_HEIGHTS.length);

  return (
    <View style={[styles.audioCard, { backgroundColor: colors.primaryLight }]}>
      <TouchableOpacity
        style={[styles.audioPlayBox, { backgroundColor: colors.primary }]}
        onPress={togglePlay}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause explanation' : 'Play explanation'}
      >
        <Ionicons
          name={playing ? 'pause' : 'play'}
          size={14}
          color="#FFFFFF"
          style={playing ? undefined : { marginLeft: 1 }}
        />
      </TouchableOpacity>

      <View style={styles.audioBody}>
        <Pressable
          onPress={handleSeek}
          hitSlop={{ top: 8, bottom: 8 }}
          style={styles.waveform}
          accessibilityRole="adjustable"
          accessibilityLabel="Seek audio"
        >
          {WAVEFORM_HEIGHTS.map((h, i) => (
            <View
              key={i}
              pointerEvents="none"
              style={{
                width: BAR_WIDTH,
                height: h,
                borderRadius: 1,
                marginRight: i === WAVEFORM_HEIGHTS.length - 1 ? 0 : BAR_GAP,
                backgroundColor: colors.primary,
                opacity: i < filledBars ? 1 : 0.2,
              }}
            />
          ))}
        </Pressable>

        <View style={styles.audioMetaRow}>
          <Text style={[styles.audioLabel, { color: colors.primary }]}>Bangla explanation</Text>
          <Text style={[styles.audioTime, { color: colors.textMuted }]}>
            {formatTime(position)} / {formatTime(durationSec)}
          </Text>
        </View>
      </View>
    </View>
  );
});

/* ------------------------------------------------------------------ */
/* Question card                                                       */
/* ------------------------------------------------------------------ */

interface QuestionCardProps {
  q: StudyQuestion;
  langMode: 'IT' | 'EN';
  showAnswers: boolean;
  translationVisible: boolean;
  audioOpen: boolean;
  bookmarked: boolean;
  speaking: boolean;
  onWordPress: (lookup: string) => void;
  onToggleTranslation: (id: number) => void;
  onToggleAudio: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  onSpeak: (id: number) => void;
  onEdit: (id: number) => void;
  onAsk: (id: number) => void;
}

const QuestionCard = memo((p: QuestionCardProps) => {
  const { colors } = useTheme();
  const { q } = p;
  const isTrue = q.answer === 'V';
  // In EN mode the English sentence is the main text, so the extra line would be a duplicate.
  const showTranslationLine = p.langMode === 'IT' && p.translationVisible;
  const hasExtras = showTranslationLine || p.audioOpen;

  return (
    <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Number + sentence on the left, V/F badge on the right */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardTextCol}>
          <Text style={[styles.questionNumberText, { color: colors.textMuted }]}>#{q.number}</Text>
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {p.langMode === 'IT'
              ? q.segments.map((seg, i) =>
                  seg.lookup ? (
                    <Text
                      key={i}
                      style={styles.underlinedWord}
                      suppressHighlighting
                      accessibilityRole="link"
                      onPress={() => p.onWordPress(seg.lookup!)}
                    >
                      {seg.text}
                    </Text>
                  ) : (
                    <React.Fragment key={i}>{seg.text}</React.Fragment>
                  ),
                )
              : q.translation}
          </Text>
        </View>

        {p.showAnswers && (
          <View
            style={[
              styles.answerBadge,
              { backgroundColor: isTrue ? colors.successLight : colors.errorLight },
            ]}
            accessibilityLabel={isTrue ? 'Answer: true' : 'Answer: false'}
          >
            <Text style={[styles.answerBadgeText, { color: isTrue ? colors.success : colors.error }]}>
              {q.answer}
            </Text>
          </View>
        )}
      </View>

      {showTranslationLine && (
        <Text style={[styles.translationText, { color: colors.textMuted }]}>EN · {q.translation}</Text>
      )}

      {p.audioOpen && (
        <BanglaAudioPlayer durationSec={q.audioDurationSec} initialPositionSec={q.audioStartSec} />
      )}

      {/* Action bar */}
      <View style={[styles.cardActionsRow, { marginTop: hasExtras ? 12 : 18 }]}>
        <View style={styles.actionIconsLeft}>
          <IconButton
            icon="volume-high-outline"
            label="Listen in Italian"
            active={p.speaking}
            onPress={() => p.onSpeak(q.id)}
          />
          <IconButton icon="headset-outline" label="Bangla audio explanation" onPress={() => p.onToggleAudio(q.id)} />
          <IconButton
            icon="bookmark-outline"
            label="Bookmark"
            active={p.bookmarked}
            onPress={() => p.onToggleBookmark(q.id)}
          />
          <IconButton icon="pencil-outline" label="Add note" onPress={() => p.onEdit(q.id)} />
          <IconButton icon="language-outline" label="Show translation" onPress={() => p.onToggleTranslation(q.id)} />
        </View>

        <TouchableOpacity
          style={[styles.askBtn, { backgroundColor: ASK.bg }]}
          onPress={() => p.onAsk(q.id)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ask the tutor"
        >
          <MaterialCommunityIcons name="message-text-outline" size={16} color={ASK.fg} />
          <Text style={[styles.askBtnText, { color: ASK.fg }]}>Ask</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const StudyModeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [showAnswers, setShowAnswers] = useState(true);
  const [langMode, setLangMode] = useState<'IT' | 'EN'>('IT');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');

  // Initial values mirror the design snapshot (card #1 expanded + bookmarked).
  const [translationOpen, setTranslationOpen] = useState<Record<number, boolean>>({ 1: true });
  const [activeAudioId, setActiveAudioId] = useState<number | null>(1);
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({ 1: true });
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const speakingRef = useRef<number | null>(null);

  useEffect(() => () => void Speech.stop(), []);

  const setSpeaking = (id: number | null) => {
    speakingRef.current = id;
    setSpeakingId(id);
  };

  const handleWordPress = useCallback((lookup: string) => {
    setSelectedWord(lookup.toUpperCase());
    setModalVisible(true);
  }, []);

  const handleToggleTranslation = useCallback(
    (id: number) => setTranslationOpen((s) => ({ ...s, [id]: !s[id] })),
    [],
  );

  // Only one audio explanation open (and playing) at a time.
  const handleToggleAudio = useCallback(
    (id: number) => setActiveAudioId((cur) => (cur === id ? null : id)),
    [],
  );

  const handleToggleBookmark = useCallback(
    (id: number) => setBookmarks((s) => ({ ...s, [id]: !s[id] })),
    [],
  );

  const handleSpeak = useCallback((id: number) => {
    if (speakingRef.current === id) {
      Speech.stop();
      setSpeaking(null);
      return;
    }
    const q = STUDY_QUESTIONS.find((x) => x.id === id);
    if (!q) return;
    Speech.stop();
    setSpeaking(id);
    const clear = () => {
      if (speakingRef.current === id) setSpeaking(null);
    };
    Speech.speak(getPlainText(q), { language: 'it-IT', onDone: clear, onStopped: clear, onError: clear });
  }, []);

  const handleEdit = useCallback((_id: number) => {
    // TODO: open note editor (no spec yet)
  }, []);

  const handleAsk = useCallback(
    (_id: number) => navigation.navigate('TeacherChat'),
    [navigation],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>La strada</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Study mode · {TOTAL_QUESTIONS} questions
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <View style={styles.switchBox}>
          <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>Show answers</Text>
          <Switch
            style={styles.switch}
            value={showAnswers}
            onValueChange={setShowAnswers}
            trackColor={{ false: colors.indicatorInactive, true: colors.success }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Show answers"
          />
        </View>

        <View style={[styles.langTogglePill, { backgroundColor: colors.chipBackground }]}>
          {(['IT', 'EN'] as const).map((mode) => {
            const active = langMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.langPillOption, active && { backgroundColor: colors.primary }]}
                onPress={() => setLangMode(mode)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.langPillText, { color: active ? '#FFFFFF' : colors.textMuted }]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Questions */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {STUDY_QUESTIONS.map((q) => (
          <QuestionCard
            key={q.id}
            q={q}
            langMode={langMode}
            showAnswers={showAnswers}
            translationVisible={!!translationOpen[q.id]}
            audioOpen={activeAudioId === q.id}
            bookmarked={!!bookmarks[q.id]}
            speaking={speakingId === q.id}
            onWordPress={handleWordPress}
            onToggleTranslation={handleToggleTranslation}
            onToggleAudio={handleToggleAudio}
            onToggleBookmark={handleToggleBookmark}
            onSpeak={handleSpeak}
            onEdit={handleEdit}
            onAsk={handleAsk}
          />
        ))}
      </ScrollView>

      <WordSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        word={selectedWord}
      />
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SOFT_SHADOW,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, lineHeight: 16 },

  // Controls
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  switchBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  switchLabel: { fontSize: 14, fontWeight: '600' },
  switch: { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] },
  langTogglePill: { flexDirection: 'row', borderRadius: 20, padding: 2 },
  langPillOption: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 18 },
  langPillText: { fontSize: 12, lineHeight: 16, fontWeight: '700' },

  // List
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },

  // Card
  questionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    ...SOFT_SHADOW,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardTextCol: { flex: 1 },
  questionNumberText: { fontSize: 13, lineHeight: 14, fontWeight: '600', marginBottom: 9 },
  questionText: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  underlinedWord: { textDecorationLine: 'underline' },
  answerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerBadgeText: { fontSize: 22, fontWeight: '800' },
  translationText: { fontSize: 13, lineHeight: 18, marginTop: 10 },

  // Audio
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 7,
    paddingLeft: 8,
    paddingRight: 12,
    gap: 10,
    marginTop: 12,
  },
  audioPlayBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBody: { flex: 1 },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    width: WAVEFORM_WIDTH,
  },
  audioMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  audioLabel: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  audioTime: { fontSize: 12, lineHeight: 16, fontWeight: '500' },

  // Actions
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionIconsLeft: { flexDirection: 'row', gap: 6 },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 10,
    gap: 5,
  },
  askBtnText: { fontSize: 13, fontWeight: '700' },
});

const DICTIONARY: Record<string, WordEntry> = {
  strada: {
    word: 'strada',
    translation: 'Road',
    explanation: 'A "strada" is the whole area open to public traffic, including carriageways, lanes, and sidewalks.',
    banglaDurationSec: 24,
    related: [{ label: 'carreggiata · carriageway', word: 'carreggiata' }],
  },
  carreggiata: {
    word: 'carreggiata',
    translation: 'Carriageway',
    explanation: 'The part of the road used for vehicle traffic, made of one or more lanes.',
    banglaDurationSec: 20,
    related: [{ label: 'strada · road', word: 'strada' }],
  },
  // suddivisa, comprendere, "piste ciclabili", riservata, esclusivamente ...
};