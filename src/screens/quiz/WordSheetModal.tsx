import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Rect, Circle, Line, G, Text as SvgText, Defs, ClipPath } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface RelatedWord {
  label: string;
  word: string;
}

export interface WordEntry {
  word: string;
  translation: string;
  explanation: string;
  banglaDurationSec?: number;
  related?: RelatedWord[];
  illustrationType?: 'parking' | 'carreggiata' | 'road' | 'crossing' | 'generic';
}

export interface WordSheetModalProps {
  visible: boolean;
  onClose: () => void;
  entry?: WordEntry;
  word?: string;
  translation?: string;
  bookmarked?: boolean;
  onToggleBookmark?: (word: string) => void;
  onSelectRelated?: (word: string) => void;
}

/* ------------------------------------------------------------------ */
/* Patente Vocabulary Database                                         */
/* ------------------------------------------------------------------ */

export const PATENTE_VOCABULARY: Record<string, WordEntry> = {
  SOSTA: {
    word: 'SOSTA',
    translation: 'Stopping / parking',
    explanation:
      'A “sosta” is when you leave the vehicle stopped for a longer time, and the driver may walk away. A “fermata” is only a brief stop to let people get on or off.',
    banglaDurationSec: 24,
    related: [
      { label: 'fermata · brief stop', word: 'FERMATA' },
      { label: 'sosta di emergenza', word: 'SOSTA DI EMERGENZA' },
    ],
    illustrationType: 'parking',
  },
  FERMATA: {
    word: 'FERMATA',
    translation: 'Brief stop / Passenger drop-off',
    explanation:
      'La “fermata” è la temporanea sospensione della marcia del veicolo per consentire la salita o la discesa delle persone. Il conducente deve essere presente e pronto a riprendere la marcia.',
    banglaDurationSec: 18,
    related: [
      { label: 'sosta · parking', word: 'SOSTA' },
      { label: 'arresto · stopping', word: 'ARRESTO' },
    ],
    illustrationType: 'parking',
  },
  'SOSTA DI EMERGENZA': {
    word: 'SOSTA DI EMERGENZA',
    translation: 'Emergency stop',
    explanation:
      "L'interruzione della marcia conseguente a guasto del veicolo o a malessere fisico del conducente o di un passeggero, da effettuare preferibilmente nella corsia o piazzola di emergenza.",
    banglaDurationSec: 22,
    related: [
      { label: 'sosta · parking', word: 'SOSTA' },
      { label: 'corsia di emergenza', word: 'CORSIA DI EMERGENZA' },
    ],
    illustrationType: 'parking',
  },
  CARREGGIATA: {
    word: 'CARREGGIATA',
    translation: 'Carriageway / Main road',
    explanation:
      'La carreggiata è la parte della strada destinata normalmente alla circolazione dei veicoli. Può essere a senso unico o a doppio senso di circolazione ed è formata da una o più corsie.',
    banglaDurationSec: 32,
    related: [
      { label: 'corsia · lane', word: 'CORSIA' },
      { label: 'spartitraffico · median', word: 'SPARTITRAFFICO' },
    ],
    illustrationType: 'carreggiata',
  },
  CORSIA: {
    word: 'CORSIA',
    translation: 'Traffic lane',
    explanation:
      'Parte longitudinale della carreggiata delimitata da strisce continue o discontinue, di larghezza idonea a consentire il transito di una sola fila di veicoli.',
    banglaDurationSec: 20,
    related: [
      { label: 'carreggiata', word: 'CARREGGIATA' },
      { label: 'corsia di emergenza', word: 'CORSIA DI EMERGENZA' },
    ],
    illustrationType: 'carreggiata',
  },
  STRADA: {
    word: 'STRADA',
    translation: 'Public roadway / street',
    explanation:
      "L'area ad uso pubblico aperta alla circolazione dei pedoni, dei veicoli e degli animali. Comprende le carreggiate, le banchine, i marciapiedi e le piste ciclabili.",
    banglaDurationSec: 28,
    related: [
      { label: 'carreggiata · carriageway', word: 'CARREGGIATA' },
      { label: 'banchina · verge', word: 'BANCHINA' },
    ],
    illustrationType: 'road',
  },
  BANCHINA: {
    word: 'BANCHINA',
    translation: 'Road shoulder / verge',
    explanation:
      'La banchina è la parte della strada posta al di fuori della carreggiata, compresa tra la linea bianca di margine e il limite della sede stradale. Non consente il transito ordinario dei veicoli.',
    banglaDurationSec: 20,
    related: [
      { label: 'strada · road', word: 'STRADA' },
      { label: 'corsia di emergenza', word: 'CORSIA DI EMERGENZA' },
    ],
    illustrationType: 'road',
  },
  SUDDIVISA: {
    word: 'SUDDIVISA',
    translation: 'Divided / partitioned',
    explanation:
      'Indica una carreggiata o strada ripartita in più corsie o parti separate fisicamente (es. spartitraffico) per regolare ed incanalare i diversi flussi di traffico.',
    banglaDurationSec: 16,
    related: [
      { label: 'spartitraffico', word: 'SPARTITRAFFICO' },
      { label: 'carreggiata', word: 'CARREGGIATA' },
    ],
    illustrationType: 'carreggiata',
  },
  SPARTITRAFFICO: {
    word: 'SPARTITRAFFICO',
    translation: 'Traffic island / median barrier',
    explanation:
      'Dispositivo o elemento longitudinale in rilievo non transitabile, destinato a separare fisicamente due carreggiate o correnti veicolari contrapposte.',
    banglaDurationSec: 25,
    related: [
      { label: 'carreggiata', word: 'CARREGGIATA' },
      { label: 'strada', word: 'STRADA' },
    ],
    illustrationType: 'carreggiata',
  },
  'PASSAGGIO A LIVELLO': {
    word: 'PASSAGGIO A LIVELLO',
    translation: 'Level crossing / railroad crossing',
    explanation:
      "Intersezione a raso tra una strada e una linea ferroviaria o tranviaria su sede propria, protetta con barriere, semibarriere o croce di Sant'Andrea.",
    banglaDurationSec: 30,
    related: [
      { label: 'croce di s. andrea', word: 'CROCE DI SANT ANDREA' },
      { label: 'barriere', word: 'BARRIERE' },
    ],
    illustrationType: 'crossing',
  },
  'SEDILE DEL CONDUCENTE': {
    word: 'SEDILE DEL CONDUCENTE',
    translation: "Driver's seat",
    explanation:
      'Il sedile riservato al conducente per la guida del veicolo, regolabile in altezza e distanza per garantire una visibilità e postura ottimale sui comandi.',
    banglaDurationSec: 18,
    related: [
      { label: 'cintura di sicurezza', word: 'CINTURA' },
      { label: 'specchietti', word: 'SPECCHIETTI' },
    ],
    illustrationType: 'generic',
  },
  IMPASTICCIARE: {
    word: 'IMPASTICCIARE',
    translation: 'To tamper / mess up',
    explanation:
      'Alterare o manomettere. Nei quiz ministeriali della patente i termini dialettali, colloquiali o incongrui sono una spia che indica quasi sempre una risposta FALSA.',
    banglaDurationSec: 15,
    related: [
      { label: 'alterare', word: 'ALTERARE' },
      { label: 'manomettere', word: 'MANOMETTERE' },
    ],
    illustrationType: 'generic',
  },
};

const getResolvedEntry = (lookupWord: string, fallbackEntry?: WordEntry): WordEntry => {
  if (fallbackEntry && fallbackEntry.word) return fallbackEntry;
  const clean = lookupWord.trim().toUpperCase();
  if (PATENTE_VOCABULARY[clean]) return PATENTE_VOCABULARY[clean];

  // Partial match check
  for (const [key, value] of Object.entries(PATENTE_VOCABULARY)) {
    if (clean.includes(key) || key.includes(clean)) {
      return value;
    }
  }

  // Dynamic sensible fallback
  return {
    word: clean || 'VOCABOLO',
    translation: 'Termine tecnico patente',
    explanation: `Termine fondamentale per la comprensione dei quiz ministeriali della patente di guida italiana categoria B.`,
    banglaDurationSec: 20,
    related: [
      { label: 'carreggiata', word: 'CARREGGIATA' },
      { label: 'strada', word: 'STRADA' },
    ],
    illustrationType: 'generic',
  };
};

/* ------------------------------------------------------------------ */
/* Pure SVG Illustrations (100% Vector, Pixel-Perfect)                */
/* ------------------------------------------------------------------ */

interface IllustrationProps {
  type?: string;
  isDark: boolean;
}

const WordIllustration: React.FC<IllustrationProps> = ({ type, isDark }) => {
  if (type === 'parking') {
    // Exact mathematical vector replica of Figma C2 Word sheet.png
    return (
      <View style={styles.illustrationContainer}>
        <Svg width="100%" height={135} viewBox="0 0 350 135">
          <Defs>
            <ClipPath id="cardClip">
              <Rect x={0} y={0} width={350} height={135} rx={16} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#cardClip)">
            {/* Top dark charcoal background */}
            <Rect x={0} y={0} width={350} height={135} fill={isDark ? '#2E3544' : '#3F4652'} />
            {/* Bottom asphalt road */}
            <Rect x={0} y={95} width={350} height={40} fill={isDark ? '#5B6678' : '#9AA3AF'} />

            {/* Parking Badge P at top-right (above dashed line) */}
            <Circle cx={323} cy={26} r={13} fill="#2D5BFF" />
            <SvgText
              x={323}
              y={31}
              fill="#FFFFFF"
              fontSize={14}
              fontWeight="800"
              textAnchor="middle"
            >
              P
            </SvgText>

            {/* Top dashed road marking (9 dashes along y=44) */}
            {[10, 48, 86, 124, 162, 200, 238, 276, 314].map((dx, i) => (
              <Rect key={i} x={dx} y={43} width={22} height={2.5} fill="#FFFFFF" rx={1} />
            ))}

            {/* Parking stall divider lines (white vertical lines from y=59 to y=95) */}
            {[9, 77, 145, 213, 281, 349].map((lx, i) => (
              <Line key={i} x1={lx} y1={59} x2={lx} y2={95} stroke="#FFFFFF" strokeWidth={2} />
            ))}

            {/* 5 Cars parked side by side (height 24, y=62.5, width 52, rx=10) */}
            {/* Car 1: Grey */}
            <G>
              <Rect x={16} y={62.5} width={52} height={24} rx={10} fill="#8E9CAD" />
              <Rect x={46} y={65.5} width={14} height={18} rx={5} fill="#4D5766" />
            </G>

            {/* Car 2: Blue */}
            <G>
              <Rect x={84} y={62.5} width={52} height={24} rx={10} fill="#2F70F5" />
              <Rect x={114} y={65.5} width={14} height={18} rx={5} fill="#193C85" />
            </G>

            {/* Car 3: Red */}
            <G>
              <Rect x={152} y={62.5} width={52} height={24} rx={10} fill="#E74646" />
              <Rect x={182} y={65.5} width={14} height={18} rx={5} fill="#7E222A" />
            </G>

            {/* Car 4: Green */}
            <G>
              <Rect x={220} y={62.5} width={52} height={24} rx={10} fill="#1CB55C" />
              <Rect x={250} y={65.5} width={14} height={18} rx={5} fill="#125732" />
            </G>

            {/* Car 5: Orange */}
            <G>
              <Rect x={288} y={62.5} width={52} height={24} rx={10} fill="#EE940E" />
              <Rect x={318} y={65.5} width={14} height={18} rx={5} fill="#774A07" />
            </G>
          </G>
        </Svg>
      </View>
    );
  }

  if (type === 'carreggiata') {
    // Multi-lane roadway with traffic lanes
    return (
      <View style={styles.illustrationContainer}>
        <Svg width="100%" height={135} viewBox="0 0 350 135">
          <Defs>
            <ClipPath id="carrClip">
              <Rect x={0} y={0} width={350} height={135} rx={16} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#carrClip)">
            <Rect x={0} y={0} width={350} height={135} fill={isDark ? '#1F2636' : '#2D3748'} />
            {/* Road borders */}
            <Rect x={0} y={15} width={350} height={105} fill={isDark ? '#2D3748' : '#4A5568'} />
            {/* Center median / spartitraffico */}
            <Rect x={0} y={64} width={350} height={7} fill="#10B981" />
            {/* Top lane dashed line */}
            {[20, 70, 120, 170, 220, 270, 320].map((dx, i) => (
              <Rect key={`t-${i}`} x={dx} y={38} width={26} height={3} fill="#FFFFFF" rx={1.5} />
            ))}
            {/* Bottom lane dashed line */}
            {[20, 70, 120, 170, 220, 270, 320].map((dx, i) => (
              <Rect key={`b-${i}`} x={dx} y={93} width={26} height={3} fill="#FFFFFF" rx={1.5} />
            ))}
            {/* Car moving right */}
            <G>
              <Rect x={100} y={24} width={48} height={24} rx={6} fill="#3B82F6" />
              <Rect x={126} y={27} width={15} height={18} rx={3} fill="#1E40AF" />
            </G>
            {/* Car moving left */}
            <G>
              <Rect x={220} y={78} width={48} height={24} rx={6} fill="#EF4444" />
              <Rect x={227} y={81} width={15} height={18} rx={3} fill="#991B1B" />
            </G>
          </G>
        </Svg>
      </View>
    );
  }

  if (type === 'crossing') {
    // Level crossing railroad tracks
    return (
      <View style={styles.illustrationContainer}>
        <Svg width="100%" height={135} viewBox="0 0 350 135">
          <Defs>
            <ClipPath id="crossClip">
              <Rect x={0} y={0} width={350} height={135} rx={16} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#crossClip)">
            <Rect x={0} y={0} width={350} height={135} fill={isDark ? '#1F2636' : '#334155'} />
            {/* Railroad ballast */}
            <Rect x={0} y={20} width={350} height={95} fill={isDark ? '#2D3748' : '#475569'} />
            {/* Ties / Sleepers */}
            {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320].map((tx, i) => (
              <Rect key={i} x={tx} y={35} width={12} height={65} rx={2} fill="#78350F" />
            ))}
            {/* Metal Rails */}
            <Rect x={0} y={48} width={350} height={6} fill="#CBD5E1" />
            <Rect x={0} y={80} width={350} height={6} fill="#CBD5E1" />
            {/* Red & White crossing gate on left */}
            <G>
              <Rect x={130} y={10} width={18} height={115} rx={4} fill="#EF4444" />
              <Rect x={130} y={30} width={18} height={20} fill="#FFFFFF" />
              <Rect x={130} y={70} width={18} height={20} fill="#FFFFFF" />
            </G>
          </G>
        </Svg>
      </View>
    );
  }

  // Generic / Road default
  return (
    <View style={styles.illustrationContainer}>
      <Svg width="100%" height={135} viewBox="0 0 350 135">
        <Defs>
          <ClipPath id="genClip">
            <Rect x={0} y={0} width={350} height={135} rx={16} />
          </ClipPath>
        </Defs>
        <G clipPath="url(#genClip)">
          <Rect x={0} y={0} width={350} height={135} fill={isDark ? '#1F2636' : '#334155'} />
          <Rect x={0} y={25} width={350} height={85} fill={isDark ? '#2E384D' : '#475569'} />
          {/* White dashed center line */}
          {[20, 65, 110, 155, 200, 245, 290, 335].map((dx, i) => (
            <Rect key={i} x={dx} y={65} width={24} height={4} fill="#FFFFFF" rx={2} />
          ))}
          {/* Subtle vehicle on road */}
          <G>
            <Rect x={150} y={35} width={50} height={24} rx={6} fill="#3B82F6" />
            <Rect x={175} y={38} width={18} height={18} rx={3} fill="#1D4ED8" />
          </G>
        </G>
      </Svg>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Waveform Visualization Component                                    */
/* ------------------------------------------------------------------ */

interface WaveformProps {
  progress: number; // 0 to 1
  isPlaying: boolean;
  isDark: boolean;
}

const BAR_HEIGHTS = [
  6, 19, 8, 10, 12, 19, 16, 11, 8, 10, 21, 9, 16, 7, 14, 12, 20, 13, 9, 11, 13, 20, 10, 11, 7, 18, 10, 19, 10, 8,
];

const Waveform: React.FC<WaveformProps> = ({ progress, isPlaying, isDark }) => {
  const activeColor = isDark ? '#4C74FF' : '#2D5BFF';
  const inactiveColor = isDark ? '#25314C' : '#D4DCF3';

  return (
    <View style={styles.waveformRow}>
      {BAR_HEIGHTS.map((h, i) => {
        const barProgress = i / BAR_HEIGHTS.length;
        const isPast = progress >= barProgress;
        return (
          <View
            key={i}
            style={[
              styles.waveformBar,
              {
                height: isPlaying ? Math.max(5, h * (0.8 + ((i % 3) * 0.2))) : h,
                backgroundColor: isPast ? activeColor : inactiveColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Main WordSheetModal Component                                       */
/* ------------------------------------------------------------------ */

const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 0.8;
const BOOKMARK_STORAGE_KEY = '@patente_bookmarked_words';

export const WordSheetModal: React.FC<WordSheetModalProps> = ({
  visible,
  onClose,
  entry: initialEntry,
  word: initialWord = '',
  translation: initialTranslation,
  bookmarked: propBookmarked,
  onToggleBookmark,
  onSelectRelated,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Active lookup word state (supports tapping related words without closing modal)
  const [activeWord, setActiveWord] = useState<string>(initialWord || initialEntry?.word || 'SOSTA');

  // Resolved word data
  const currentEntry = useMemo(() => {
    const res = getResolvedEntry(activeWord, activeWord === initialEntry?.word ? initialEntry : undefined);
    if (initialTranslation && activeWord === initialWord) {
      return { ...res, translation: initialTranslation };
    }
    return res;
  }, [activeWord, initialEntry, initialTranslation, initialWord]);

  const title = currentEntry.word.toUpperCase();
  const duration = currentEntry.banglaDurationSec ?? 24;

  // Local bookmark state synced with AsyncStorage
  const [isBookmarked, setIsBookmarked] = useState<boolean>(propBookmarked ?? false);

  // Audio & Speech States
  const [speaking, setSpeaking] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPos, setAudioPos] = useState(0);

  // Swipe-down to dismiss
  const translateY = useRef(new Animated.Value(0)).current;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_DISTANCE || g.vy > DISMISS_VELOCITY) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
        }
      },
    }),
  ).current;

  // Update active word when prop word changes
  useEffect(() => {
    if (initialWord) {
      setActiveWord(initialWord);
    } else if (initialEntry?.word) {
      setActiveWord(initialEntry.word);
    }
  }, [initialWord, initialEntry]);

  // Load bookmark status from storage
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (stored && isMounted) {
          const list: string[] = JSON.parse(stored);
          setIsBookmarked(list.includes(title));
        }
      } catch {}
    })();
    return () => {
      isMounted = false;
    };
  }, [title]);

  // Reset transient states whenever visibility or word changes
  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      setAudioPos(0);
      setAudioPlaying(false);
      setSpeaking(false);
      Speech.stop();
    }
  }, [visible, title, translateY]);

  useEffect(() => () => void Speech.stop(), []);

  // Bangla audio playback interval simulation
  useEffect(() => {
    if (!audioPlaying) return;
    const interval = setInterval(() => {
      setAudioPos((prev) => {
        if (prev + 1 >= duration) {
          setAudioPlaying(false);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [audioPlaying, duration]);

  // Italian voice pronunciation
  const handleSpeak = useCallback(() => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    Speech.stop();
    setSpeaking(true);
    const finish = () => setSpeaking(false);
    Speech.speak(title.toLowerCase(), {
      language: 'it-IT',
      pitch: 1.0,
      rate: 0.9,
      onDone: finish,
      onStopped: finish,
      onError: finish,
    });
  }, [speaking, title]);

  // Toggle Bangla Audio
  const handleToggleAudio = useCallback(() => {
    if (!duration) return;
    if (!audioPlaying && audioPos >= duration) {
      setAudioPos(0);
    }
    setAudioPlaying((prev) => !prev);
  }, [audioPlaying, audioPos, duration]);

  // Toggle Bookmark
  const handleBookmarkToggle = useCallback(async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    onToggleBookmark?.(title);

    try {
      const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (nextState) {
        if (!list.includes(title)) list.push(title);
      } else {
        list = list.filter((item) => item !== title);
      }
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, [isBookmarked, title, onToggleBookmark]);

  // Select Related Word
  const handleSelectRelated = useCallback(
    (relatedWord: string) => {
      Speech.stop();
      setSpeaking(false);
      setAudioPlaying(false);
      setAudioPos(0);
      setActiveWord(relatedWord);
      onSelectRelated?.(relatedWord);
    },
    [onSelectRelated],
  );

  // Close handler
  const handleClose = useCallback(() => {
    Speech.stop();
    setSpeaking(false);
    setAudioPlaying(false);
    onClose();
  }, [onClose]);

  // Color tokens exactly calibrated to Figma C2 Word sheet (Light & Dark)
  const sheetBg = isDark ? '#131A2A' : '#FFFFFF';
  const handleBg = isDark ? '#2A354C' : '#E7EAF0';
  const titleColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtitleColor = isDark ? '#4C74FF' : '#2D5BFF';
  const spkBg = isDark ? '#1B2552' : '#EBF0FF';
  const spkIcon = isDark ? '#60A5FA' : '#2D5BFF';
  const bmkBg = isDark ? '#1B2336' : '#F0F2F7';
  const bmkIcon = isDark ? '#94A3B8' : '#475569';
  const descColor = isDark ? '#94A3B8' : '#475467';
  const audioBarBg = isDark ? '#1B2544' : '#EDF2FE';
  const audioPlayBtnBg = isDark ? '#4C74FF' : '#2D5BFF';
  const audioTextColor = isDark ? '#7C9EFF' : '#2D5BFF';
  const relatedTitleColor = isDark ? '#56647D' : '#8A94A6';
  const chipBg = isDark ? '#232042' : '#F2EEFE';
  const chipText = isDark ? '#BFA6FE' : '#5E2BE2';
  const gotItBtnBg = isDark ? '#4C74FF' : '#2D5BFF';

  // Format time
  const timeString = `Bangla · ${audioPlaying || audioPos > 0 ? `0:${String(audioPos).padStart(2, '0')} / ` : ''}0:${String(duration).padStart(2, '0')}`;
  const audioProgress = duration > 0 ? audioPos / duration : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
        />

        <Animated.View
          style={[
            styles.sheetContainer,
            { backgroundColor: sheetBg, transform: [{ translateY }] },
          ]}
        >
          {/* Pull / Drag Handle */}
          <View {...panResponder.panHandlers} style={styles.dragZone}>
            <View style={[styles.dragHandle, { backgroundColor: handleBg }]} />
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: Math.max(insets.bottom, 16) + 20 },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Header Row: Word Title, Subtitle, Pronunciation & Bookmark buttons */}
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text style={[styles.wordTitle, { color: titleColor }]}>{title}</Text>
                <Text style={[styles.translationText, { color: subtitleColor }]}>
                  {currentEntry.translation}
                </Text>
              </View>

              <View style={styles.headerActions}>
                {/* Speaker pronunciation button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: speaking ? audioPlayBtnBg : spkBg },
                  ]}
                  onPress={handleSpeak}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Listen Italian pronunciation"
                >
                  <Ionicons
                    name="volume-medium"
                    size={20}
                    color={speaking ? '#FFFFFF' : spkIcon}
                  />
                </TouchableOpacity>

                {/* Bookmark / Save word button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: isBookmarked ? '#FEF3C7' : bmkBg },
                  ]}
                  onPress={handleBookmarkToggle}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Save word to vocabulary"
                >
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={19}
                    color={isBookmarked ? '#D97706' : bmkIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Illustration Graphic Card */}
            <WordIllustration type={currentEntry.illustrationType} isDark={isDark} />

            {/* Explanation / Definition Text */}
            <Text style={[styles.explanationText, { color: descColor }]}>
              {currentEntry.explanation}
            </Text>

            {/* Bangla Audio Explanation Player Bar */}
            <View style={[styles.audioPlayerCard, { backgroundColor: audioBarBg }]}>
              <TouchableOpacity
                style={[styles.audioPlayBtn, { backgroundColor: audioPlayBtnBg }]}
                onPress={handleToggleAudio}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={audioPlaying ? 'Pause explanation' : 'Play explanation'}
              >
                <Ionicons
                  name={audioPlaying ? 'pause' : 'play'}
                  size={18}
                  color="#FFFFFF"
                  style={audioPlaying ? undefined : { marginLeft: 2 }}
                />
              </TouchableOpacity>

              <Waveform
                progress={audioProgress}
                isPlaying={audioPlaying}
                isDark={isDark}
              />

              <Text style={[styles.audioDurationText, { color: audioTextColor }]}>
                {timeString}
              </Text>
            </View>

            {/* Related Words Section */}
            {!!currentEntry.related && currentEntry.related.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={[styles.relatedTitle, { color: relatedTitleColor }]}>
                  RELATED WORDS
                </Text>
                <View style={styles.chipsRow}>
                  {currentEntry.related.map((item) => (
                    <TouchableOpacity
                      key={item.word}
                      style={[styles.chip, { backgroundColor: chipBg }]}
                      onPress={() => handleSelectRelated(item.word)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`Open word ${item.word}`}
                    >
                      <Text style={[styles.chipText, { color: chipText }]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Got It Button */}
            <TouchableOpacity
              style={[styles.gotItButton, { backgroundColor: gotItBtnBg }]}
              onPress={handleClose}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Got it, dismiss word sheet"
            >
              <Text style={styles.gotItText}>Got it</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Styles (100% Calibrated with Figma C2 Word sheet @2x)               */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '88%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  dragZone: {
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  sheetContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  wordTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  translationText: {
    fontSize: 15,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    width: 40,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    width: '100%',
    height: 135,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: 16,
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 10,
    marginBottom: 18,
    gap: 8,
  },
  audioPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  waveformBar: {
    width: 2.5,
    borderRadius: 1.25,
  },
  audioDurationText: {
    fontSize: 13,
    fontWeight: '700',
  },
  relatedSection: {
    marginBottom: 20,
  },
  relatedTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gotItButton: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
