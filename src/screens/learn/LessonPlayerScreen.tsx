import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon, Rect } from 'react-native-svg';
import { ArrowLeft, Download, Share2, RotateCw, Check } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { getHeaderTopInset } from '../../utils/safeArea';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/*  Design tokens (measured from the mockup, 1dp = 2px)                       */
/* -------------------------------------------------------------------------- */

const HORIZONTAL_MARGIN = 20;
const MAX_CONTENT_WIDTH = 420;

// Video block (below the status bar inset)
const VIDEO_BODY_HEIGHT = 229;
const CURRENT_SECONDS = 6 * 60 + 12; // 06:12
const TOTAL_SECONDS = 18 * 60 + 40; // 18:40
const PROGRESS = CURRENT_SECONDS / TOTAL_SECONDS; // ≈ 0.332

const SPEEDS = ['1.0×', '1.25×', '1.5×'];

const palette = (isDark: boolean) => ({
  bg: isDark ? '#0A0E18' : '#F5F7FB',
  textPrimary: isDark ? '#FFFFFF' : '#101828',
  textMuted: isDark ? '#8E95A5' : '#9AA3B5',
  tabsBg: isDark ? '#141A29' : '#ECEFF6',
  tabActiveBg: isDark ? '#222A3E' : '#FFFFFF',
  activeRowBg: isDark ? 'rgba(45, 91, 255, 0.18)' : '#E8EEFD',
  accent: isDark ? '#5B7CFF' : '#2D5BFF',
  accentSolid: '#2D5BFF',
  success: isDark ? '#34D399' : '#12B76A',
  successBg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E4F6EC',
  card: isDark ? '#141A29' : '#FFFFFF',
  cardBorder: isDark ? '#222A3E' : '#EDF0F6',
  avatarBg: isDark ? 'rgba(124, 58, 237, 0.2)' : '#F1E9FF',
  avatarText: isDark ? '#A78BFA' : '#6D28D9',
});

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'chapters' | 'notes' | 'transcript';

interface ChapterTimestamp {
  time: string;
  title: string;
  passed: boolean;
  active: boolean;
}

const CHAPTERS: ChapterTimestamp[] = [
  { time: '00:00', title: 'What a level crossing is', passed: true, active: false },
  { time: '03:40', title: 'With barriers vs. without', passed: true, active: false },
  { time: '06:10', title: 'Approaching: speed and distance', passed: false, active: true },
  { time: '11:25', title: 'Stopping at the crossing', passed: false, active: false },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: 'chapters', label: 'Chapters' },
  { key: 'notes', label: 'Notes' },
  { key: 'transcript', label: 'Transcript' },
];

/* -------------------------------------------------------------------------- */
/*  Pure vector graphics                                                      */
/*  (LevelCrossingSign is shared with VideoLessonsScreen: extract it to a     */
/*   common components file when convenient)                                  */
/* -------------------------------------------------------------------------- */

const LevelCrossingSign: React.FC<{ width?: number; height?: number }> = ({
  width = 100,
  height = 87.5,
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
    <Rect x={58} y={105} width={84} height={9} fill="#111827" />
    <Rect x={58} y={128} width={84} height={9} fill="#111827" />
    <Rect x={62} y={94} width={7} height={49} fill="#111827" />
    <Rect x={80.25} y={94} width={7} height={49} fill="#111827" />
    <Rect x={98.5} y={94} width={7} height={49} fill="#111827" />
    <Rect x={116.75} y={94} width={7} height={49} fill="#111827" />
    <Rect x={135} y={94} width={7} height={49} fill="#111827" />
  </Svg>
);

/** Small "CC" captions glyph (white plate, dark letters) */
const CaptionsIcon: React.FC = () => (
  <Svg width={12} height={9} viewBox="0 0 12 9">
    <Rect x={0} y={0} width={12} height={9} rx={1.8} fill="#FFFFFF" />
    <Path d="M 4.9 3.5 A 1.5 1.5 0 1 0 4.9 5.5" stroke="#26356F" strokeWidth={1} fill="none" />
    <Path d="M 9.9 3.5 A 1.5 1.5 0 1 0 9.9 5.5" stroke="#26356F" strokeWidth={1} fill="none" />
  </Svg>
);

/** Solid play triangle (shown when paused) */
const PlayGlyph: React.FC = () => (
  <Svg width={12} height={14} viewBox="0 0 12 14">
    <Polygon points="1,1 11,7 1,13" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>
);

/** Square with check, for the practice card */
const PracticeIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={19} height={19} viewBox="0 0 24 24">
    <Rect x={3} y={3} width={18} height={18} rx={3.5} stroke={color} strokeWidth={2.2} fill="none" />
    <Path
      d="M 8 12.5 L 11 15.5 L 16.5 9"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export const LessonPlayerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<TabKey>('chapters');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState('1.25×');
  const [ccBangla, setCcBangla] = useState(true);

  const colors = useMemo(() => palette(isDark), [isDark]);

  const topInset = getHeaderTopInset(insets, 0);
  const contentWidth = Math.min(width - HORIZONTAL_MARGIN * 2, MAX_CONTENT_WIDTH);
  const progressPct = `${(PROGRESS * 100).toFixed(2)}%` as const;

  const cycleSpeed = () => {
    const next = (SPEEDS.indexOf(speed) + 1) % SPEEDS.length;
    setSpeed(SPEEDS[next]);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* =============================== Video =============================== */}
      <LinearGradient
        colors={['#0A0F1E', '#1C2B66']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingTop: topInset }}
      >
        <View style={{ height: VIDEO_BODY_HEIGHT }}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.topBarRight}>
              <TouchableOpacity
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel="Download lesson"
              >
                <Download size={18} color="#FFFFFF" strokeWidth={2.2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel="Share lesson"
              >
                <Share2 size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Video frame graphic */}
          <View style={styles.videoGraphic} pointerEvents="none">
            <LevelCrossingSign width={128} height={112} />
          </View>

          {/* Time labels */}
          <View style={styles.timeRow}>
            <Text style={styles.timeCurrent}>06:12</Text>
            <Text style={styles.timeTotal}>18:40</Text>
          </View>

          {/* Scrubber */}
          <View style={styles.trackWrap}>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: progressPct }]} />
            </View>
            <View style={[styles.scrubThumb, { left: progressPct }]} />
          </View>

          {/* Playback controls */}
          <View style={styles.controlsRow}>
            <View style={styles.controlsLeft}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsPlaying((p) => !p)}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <View style={styles.pauseGlyph}>
                    <View style={styles.pauseBar} />
                    <View style={styles.pauseBar} />
                  </View>
                ) : (
                  <PlayGlyph />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel="Replay"
              >
                <RotateCw size={18} color="#FFFFFF" strokeWidth={2.25} />
              </TouchableOpacity>
            </View>

            <View style={styles.controlsRight}>
              <TouchableOpacity
                style={styles.pill}
                onPress={cycleSpeed}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Playback speed ${speed}`}
              >
                <Text style={styles.pillText}>{speed}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pill, styles.ccPill, !ccBangla && { opacity: 0.55 }]}
                onPress={() => setCcBangla((v) => !v)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: ccBangla }}
                accessibilityLabel="Bangla captions"
              >
                <CaptionsIcon />
                <Text style={styles.pillText}>CC Bangla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ============================== Content ============================== */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: contentWidth }}>
          <Text style={[styles.lessonHeading, { color: colors.textPrimary }]}>
            Lesson 12 · Level crossings
          </Text>

          <View style={styles.instructorRow}>
            <View style={[styles.instructorAvatar, { backgroundColor: colors.avatarBg }]}>
              <Text style={[styles.instructorAvatarText, { color: colors.avatarText }]}>SM</Text>
            </View>
            <Text style={[styles.instructorSubtext, { color: colors.textMuted }]}>
              Instructor Sara M. · Bangla · Chapter 2
            </Text>
          </View>

          {/* Segmented tabs */}
          <View style={[styles.tabsWrapper, { backgroundColor: colors.tabsBg }]}>
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    isActive && [styles.tabButtonActive, { backgroundColor: colors.tabActiveBg }],
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isActive ? colors.textPrimary : colors.textMuted },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Chapters */}
          {activeTab === 'chapters' && (
            <View style={styles.chaptersList}>
              {CHAPTERS.map((item) => (
                <TouchableOpacity
                  key={item.time}
                  style={[
                    styles.chapterRow,
                    item.active && { backgroundColor: colors.activeRowBg },
                  ]}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.time}, ${item.title}`}
                >
                  <Text
                    style={[
                      styles.timestampText,
                      { color: item.active ? colors.accent : colors.textMuted },
                    ]}
                  >
                    {item.time}
                  </Text>

                  <Text
                    style={[
                      styles.chapterTitle,
                      {
                        color: colors.textPrimary,
                        fontWeight: item.active ? '700' : '400',
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  {item.passed && (
                    <Check size={16} color={colors.success} strokeWidth={2.5} />
                  )}
                  {item.active && (
                    <View style={styles.nowBadge}>
                      <Text style={[styles.nowBadgeText, { color: colors.accent }]}>Now</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'notes' && (
            <Text style={[styles.emptyState, { color: colors.textMuted }]}>
              No notes for this lesson yet.
            </Text>
          )}

          {activeTab === 'transcript' && (
            <Text style={[styles.emptyState, { color: colors.textMuted }]}>
              Transcript is not available yet.
            </Text>
          )}

          {/* Practice CTA */}
          <View
            style={[
              styles.practiceCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View style={[styles.practiceIconBox, { backgroundColor: colors.successBg }]}>
              <PracticeIcon color={colors.success} />
            </View>

            <View style={styles.practiceInfo}>
              <Text style={[styles.practiceTitle, { color: colors.textPrimary }]}>
                Practice this lesson
              </Text>
              <Text style={[styles.practiceSubtitle, { color: colors.textMuted }]}>
                24 linked quizzes · ~6 min
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.accentSolid }]}
              onPress={() => navigation.navigate('QuizQuestion', { topicId: 2, mode: 'practice' })}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Start practice"
            >
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 16,
  },

  /* ------------------------------- Video ---------------------------------- */
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoGraphic: {
    position: 'absolute',
    top: 35.5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timeRow: {
    position: 'absolute',
    top: 146,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeCurrent: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  timeTotal: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  trackWrap: {
    position: 'absolute',
    top: 169,
    left: 20,
    right: 20,
    height: 12,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    overflow: 'hidden',
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF4D4F',
  },
  scrubThumb: {
    position: 'absolute',
    top: 0,
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  controlsRow: {
    position: 'absolute',
    top: 182.5,
    left: 0,
    right: 0,
    height: 36,
    paddingLeft: 13,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pauseGlyph: {
    flexDirection: 'row',
    gap: 3,
  },
  pauseBar: {
    width: 3.5,
    height: 12,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  pill: {
    height: 23,
    paddingHorizontal: 9,
    borderRadius: 11.5,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ccPill: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
  },

  /* ------------------------------ Content --------------------------------- */
  lessonHeading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 14,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorAvatarText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  instructorSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },

  /* ------------------------------- Tabs ----------------------------------- */
  tabsWrapper: {
    flexDirection: 'row',
    height: 38,
    padding: 3,
    borderRadius: 14,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* ----------------------------- Chapters --------------------------------- */
  chaptersList: {
    gap: 2,
    marginBottom: 14,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 14,
    gap: 12,
  },
  timestampText: {
    width: 36,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  chapterTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 19,
  },
  nowBadge: {
    paddingHorizontal: 8,
  },
  nowBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 28,
    marginBottom: 14,
  },

  /* ------------------------------ Practice -------------------------------- */
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12.5,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#1E2A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  practiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  practiceSubtitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  startButton: {
    height: 35,
    paddingHorizontal: 12.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});