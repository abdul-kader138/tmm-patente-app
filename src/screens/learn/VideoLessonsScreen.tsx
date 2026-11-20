import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon, Rect, Circle } from 'react-native-svg';
import { Search, Check, Download, Lock } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { getHeaderTopInset } from '../../utils/safeArea';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/*  Design tokens (measured from the mockup, 1dp = 2px)                       */
/* -------------------------------------------------------------------------- */

const HORIZONTAL_MARGIN = 20;
const MAX_CONTENT_WIDTH = 420;

const palette = (isDark: boolean) => ({
  bg: isDark ? '#0A0E18' : '#F5F7FB',
  textPrimary: isDark ? '#FFFFFF' : '#101828',
  textMuted: isDark ? '#8E95A5' : '#9AA3B5',
  surface: isDark ? '#141A29' : '#FFFFFF',
  border: isDark ? '#222A3E' : '#E6EAF2',
  searchIcon: isDark ? '#CBD5E1' : '#101828',
  chipText: isDark ? '#94A3B8' : '#475467',
  accent: '#2D5BFF',
  badgeBg: isDark ? 'rgba(45, 91, 255, 0.2)' : '#EAF0FF',
  badgeText: isDark ? '#5B7CFF' : '#2D5BFF',
  actionBg: isDark ? '#1E293B' : '#EDF0F7',
  downloadIcon: isDark ? '#94A3B8' : '#475569',
  lockIcon: isDark ? '#64748B' : '#9AA3B5',
  success: '#10B981',
});

/* -------------------------------------------------------------------------- */
/*  Pure vector road signs                                                    */
/* -------------------------------------------------------------------------- */

/** Railway level crossing danger sign (with barrier) */
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
    {/* rails */}
    <Rect x={58} y={105} width={84} height={9} fill="#111827" />
    <Rect x={58} y={128} width={84} height={9} fill="#111827" />
    {/* 5 evenly spaced pickets: 62 → 135, pitch 18.25 */}
    <Rect x={62} y={94} width={7} height={49} fill="#111827" />
    <Rect x={80.25} y={94} width={7} height={49} fill="#111827" />
    <Rect x={98.5} y={94} width={7} height={49} fill="#111827" />
    <Rect x={116.75} y={94} width={7} height={49} fill="#111827" />
    <Rect x={135} y={94} width={7} height={49} fill="#111827" />
  </Svg>
);

/** General danger sign (!) */
const DangerSign: React.FC<{ width?: number; height?: number }> = ({
  width = 40,
  height = 37.5,
}) => (
  <Svg width={width} height={height} viewBox="0 0 45 42">
    <Path
      d="M 22.5 3 L 42.5 39 A 2 2 0 0 1 40.5 41 L 4.5 41 A 2 2 0 0 1 2.5 39 Z"
      fill="#D82D20"
      stroke="#D82D20"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <Polygon points="22.5,11 37.5,37 7.5,37" fill="#FFFFFF" />
    <Rect x={21.2} y={18} width={2.6} height={10} rx={1.3} fill="#111827" />
    <Circle cx={22.5} cy={32} r={1.5} fill="#111827" />
  </Svg>
);

/** Inverted yield / give way sign */
const YieldSign: React.FC<{ width?: number; height?: number }> = ({
  width = 40,
  height = 37.5,
}) => (
  <Svg width={width} height={height} viewBox="0 0 45 42">
    <Path
      d="M 4.5 3 L 40.5 3 A 2 2 0 0 1 42.5 5 L 24.5 39 A 2 2 0 0 1 20.5 39 L 2.5 5 A 2 2 0 0 1 4.5 3 Z"
      fill="#D82D20"
      stroke="#D82D20"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <Polygon points="22.5,32 37.5,7 7.5,7" fill="#FFFFFF" />
  </Svg>
);

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type LessonStatus = 'watched' | 'downloaded' | 'locked';

interface VideoLessonItem {
  id: number;
  lessonNumber: number;
  title: string;
  duration: string;
  status: LessonStatus;
  gradient: [string, string];
  signType: 'danger' | 'yield';
}

const LESSON_ITEMS: VideoLessonItem[] = [
  {
    id: 10,
    lessonNumber: 10,
    title: 'Curves, slopes and narrow roads',
    duration: '14:05',
    status: 'watched',
    gradient: ['#8E1F1C', '#CB2C20'],
    signType: 'danger',
  },
  {
    id: 11,
    lessonNumber: 11,
    title: 'Intersections and give way',
    duration: '16:22',
    status: 'downloaded',
    gradient: ['#5E2A9E', '#7650DE'],
    signType: 'yield',
  },
  {
    id: 13,
    lessonNumber: 13,
    title: 'Roadworks and slippery road',
    duration: '12:48',
    status: 'locked',
    gradient: ['#8A5006', '#E58C0A'],
    signType: 'danger',
  },
];

const STATUS_LABEL: Record<LessonStatus, string> = {
  watched: 'Watched',
  downloaded: 'Downloaded',
  locked: 'Full version',
};

const CATEGORIES = ['All', 'Signs', 'Right of way', 'Overtaking', 'Speed'];

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export const VideoLessonsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const [activeCategory, setActiveCategory] = useState('All');

  const colors = useMemo(() => palette(isDark), [isDark]);

  // Mockup: title block starts ~4dp below the status bar
  const statusBarOffset = getHeaderTopInset(insets, 4);
  const contentWidth = Math.min(width - HORIZONTAL_MARGIN * 2, MAX_CONTENT_WIDTH);

  const handleOpenLesson = (lessonId: number, title: string) => {
    navigation.navigate('LessonPlayer', { lessonId, title });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: statusBarOffset, paddingBottom: 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: contentWidth }}>
          {/* ------------------------------ Header ------------------------------ */}
          <View style={styles.topHeader}>
            <View style={styles.headerTitles}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Lessons</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                124 videos in Bangla · 31 h
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.searchButton,
                { backgroundColor: colors.surface, borderColor: isDark ? colors.border : '#EEF1F7' },
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Search video lessons"
            >
              <Search size={18} color={colors.searchIcon} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* --------------------------- Category chips ------------------------- */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  hitSlop={{ top: 10, bottom: 10, left: 2, right: 2 }}
                  style={[
                    styles.categoryChip,
                    isActive
                      ? { backgroundColor: colors.accent }
                      : {
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.border,
                        },
                  ]}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive
                        ? styles.categoryTextActive
                        : { color: colors.chipText, fontWeight: '600' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ------------------------- Featured / hero card --------------------- */}
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() =>
              handleOpenLesson(12, 'Lesson 12 · Level crossings and how to approach them')
            }
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Featured lesson 12, Level crossings and how to approach them"
          >
            <LinearGradient
              colors={['#1E3A8F', '#2B55E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredThumbnail}
            >
              {/* Perfect circle, clipped by the card (overflow: hidden) */}
              <View style={styles.heroBackdropCircle} />

              {/* Play button */}
              <View style={styles.heroPlayButton}>
                <Svg width={10} height={12} viewBox="0 0 10 12" style={{ marginLeft: 2 }}>
                  <Polygon points="1,1 9,6 1,11" fill="#111827" />
                </Svg>
              </View>

              {/* Level crossing sign */}
              <View style={styles.heroSignContainer}>
                <LevelCrossingSign width={100} height={87.5} />
              </View>

              {/* Duration */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>18:40</Text>
              </View>

              {/* Progress */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '34%' }]} />
              </View>
            </LinearGradient>

            <View style={styles.featuredMeta}>
              <Text style={[styles.featuredTitle, { color: colors.textPrimary }]}>
                Lesson 12 · Level crossings and how to approach them
              </Text>

              <View style={styles.badgeRow}>
                <View style={[styles.langBadge, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.langBadgeText, { color: colors.badgeText }]}>
                    Bangla
                  </Text>
                </View>
                <Text style={[styles.linkedMetaText, { color: colors.textMuted }]}>
                  6 min left · 24 linked questions
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* ------------------------------ Chapter ----------------------------- */}
          <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
            CHAPTER 2 · DANGER SIGNS
          </Text>

          <View style={styles.listContainer}>
            {LESSON_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.lessonItemRow}
                onPress={() =>
                  handleOpenLesson(item.id, `Lesson ${item.lessonNumber} · ${item.title}`)
                }
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Lesson ${item.lessonNumber}, ${item.title}`}
              >
                {/* Thumbnail */}
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.itemThumbnail}
                >
                  <View style={styles.itemThumbnailCurve} />

                  <View style={styles.itemPlayCircle}>
                    <Svg width={8} height={10} viewBox="0 0 8 10" style={{ marginLeft: 1.5 }}>
                      <Polygon points="1,1 7,5 1,9" fill="#111827" />
                    </Svg>
                  </View>

                  <View style={styles.itemSignContainer}>
                    {item.signType === 'yield' ? <YieldSign /> : <DangerSign />}
                  </View>
                </LinearGradient>

                {/* Text */}
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemLessonTag, { color: colors.textMuted }]}>
                    Lesson {item.lessonNumber}
                  </Text>
                  <Text
                    style={[styles.itemTitle, { color: colors.textPrimary }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                    {item.duration} · {STATUS_LABEL[item.status]}
                  </Text>
                </View>

                {/* Status icon */}
                <View style={styles.itemActionContainer}>
                  {item.status === 'watched' && (
                    <View style={[styles.watchedIconCircle, { backgroundColor: colors.success }]}>
                      <Check size={13} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  {item.status === 'downloaded' && (
                    <View style={[styles.actionIconCircle, { backgroundColor: colors.actionBg }]}>
                      <Download size={14} color={colors.downloadIcon} strokeWidth={2.2} />
                    </View>
                  )}
                  {item.status === 'locked' && (
                    <View style={[styles.actionIconCircle, { backgroundColor: colors.actionBg }]}>
                      <Lock size={13} color={colors.lockIcon} strokeWidth={2.2} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
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
  },

  /* Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  /* Chips */
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Hero */
  featuredCard: {
    width: '100%',
    marginBottom: 16,
  },
  featuredThumbnail: {
    width: '100%',
    height: 168,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBackdropCircle: {
    position: 'absolute',
    left: -72,
    top: 50,
    width: 206,
    height: 206,
    borderRadius: 103,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroPlayButton: {
    position: 'absolute',
    left: 76,
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  heroSignContainer: {
    position: 'absolute',
    right: 84,
    top: 39,
    width: 100,
    height: 87.5,
  },
  durationBadge: {
    position: 'absolute',
    right: 6,
    bottom: 7,
    width: 46,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: '#101E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  progressBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#6A87EA',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#FF4D4F',
  },
  featuredMeta: {
    marginTop: 10,
  },
  featuredTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  langBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  langBadgeText: {
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: '700',
  },
  linkedMetaText: {
    fontSize: 12.5,
    fontWeight: '500',
  },

  /* Chapter list */
  sectionHeader: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  listContainer: {
    gap: 14,
  },
  lessonItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumbnail: {
    width: 108,
    height: 66,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  itemThumbnailCurve: {
    position: 'absolute',
    left: -44,
    top: 38,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  itemPlayCircle: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSignContainer: {
    position: 'absolute',
    right: 21,
    top: '50%',
    marginTop: -18.75,
    width: 40,
    height: 37.5,
  },
  itemInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 14,
  },
  itemLessonTag: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  itemActionContainer: {
    width: 28,
    alignItems: 'flex-end',
  },
  watchedIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});