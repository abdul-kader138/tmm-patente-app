import React, { useState } from 'react';
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

// --- PURE VECTOR SVG ROAD SIGNS ---

/** Railway Level Crossing Danger Sign (passaggio a livello con barriere) */
const LevelCrossingSign: React.FC<{ width?: number; height?: number }> = ({
  width = 100,
  height = 87.5,
}) => (
  <Svg width={width} height={height} viewBox="0 0 200 175">
    {/* Outer Red Danger Triangle with rounded corners */}
    <Polygon
      points="100,4 196,172 4,172"
      fill="#D82D20"
      stroke="#D82D20"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Inner White Triangle */}
    <Polygon points="100,43 163,152 37,152" fill="#FFFFFF" />
    {/* Top horizontal fence rail */}
    <Rect x={58} y={105} width={84} height={9} fill="#111827" />
    {/* Bottom horizontal fence rail */}
    <Rect x={58} y={128} width={84} height={9} fill="#111827" />
    {/* 5 vertical fence pickets */}
    <Rect x={62} y={94} width={7} height={49} fill="#111827" />
    <Rect x={81} y={94} width={7} height={49} fill="#111827" />
    <Rect x={100} y={94} width={7} height={49} fill="#111827" />
    <Rect x={120} y={94} width={7} height={49} fill="#111827" />
    <Rect x={135} y={94} width={7} height={49} fill="#111827" />
  </Svg>
);

/** General Danger Exclamation Sign (!) */
const DangerSign: React.FC<{ width?: number; height?: number }> = ({
  width = 45,
  height = 42,
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

/** Inverted Yield / Give Way Sign */
const YieldSign: React.FC<{ width?: number; height?: number }> = ({
  width = 45,
  height = 42,
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

interface VideoLessonItem {
  id: number;
  lessonNumber: number;
  title: string;
  duration: string;
  status: 'watched' | 'downloaded' | 'locked';
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
    gradient: ['#90221E', '#C62A20'],
    signType: 'danger',
  },
  {
    id: 11,
    lessonNumber: 11,
    title: 'Intersections and give way',
    duration: '16:22',
    status: 'downloaded',
    gradient: ['#61299F', '#724BDD'],
    signType: 'yield',
  },
  {
    id: 13,
    lessonNumber: 13,
    title: 'Roadworks and slippery road',
    duration: '12:48',
    status: 'locked',
    gradient: ['#8C5406', '#D27B08'],
    signType: 'danger',
  },
];

const CATEGORIES = ['All', 'Signs', 'Right of way', 'Overtaking', 'Speed'];

export const VideoLessonsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const [activeCategory, setActiveCategory] = useState('All');

  const statusBarOffset = getHeaderTopInset(insets, 16);
  const horizontalMargin = 20;
  const contentWidth = Math.min(width - horizontalMargin * 2, 420);

  const handleOpenLesson = (lessonId: number, title: string) => {
    navigation.navigate('LessonPlayer', { lessonId, title });
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0A0E18' : '#F5F7FB' }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: statusBarOffset,
            paddingBottom: 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContent, { width: contentWidth }]}>
          {/* Top Header */}
          <View style={styles.topHeader}>
            <View style={styles.headerTitles}>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#101828' }]}>
                Lessons
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#8E95A5' : '#64748B' }]}>
                124 videos in Bangla · 31 h
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.searchButton,
                {
                  backgroundColor: isDark ? '#141A29' : '#FFFFFF',
                  borderColor: isDark ? '#222A3E' : '#E2E8F0',
                },
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Search video lessons"
            >
              <Search size={20} color={isDark ? '#CBD5E1' : '#1E293B'} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Horizontal Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.categoryChip,
                    isActive
                      ? styles.activeChip
                      : [
                          styles.inactiveChip,
                          {
                            backgroundColor: isDark ? '#141A29' : '#FFFFFF',
                            borderColor: isDark ? '#222A3E' : '#E2E8F0',
                          },
                        ],
                  ]}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive
                        ? styles.activeCategoryText
                        : [
                            styles.inactiveCategoryText,
                            { color: isDark ? '#94A3B8' : '#334155' },
                          ],
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Featured / Continue Watching Hero Card */}
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() =>
              handleOpenLesson(12, 'Lesson 12 · Level crossings and how to approach them')
            }
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Featured lesson 12, Level crossings and how to approach them"
          >
            {/* Thumbnail Banner */}
            <LinearGradient
              colors={['#1F3D95', '#2953E3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredThumbnail}
            >
              {/* Background decorative curve */}
              <View style={styles.decorativeCurve} />

              {/* White Play Button Overlay */}
              <View style={styles.heroPlayButton}>
                <Svg width={10} height={12} viewBox="0 0 10 12" style={{ marginLeft: 2 }}>
                  <Polygon points="1,1 9,6 1,11" fill="#111827" />
                </Svg>
              </View>

              {/* Road Sign Graphic on Right */}
              <View style={styles.heroSignContainer}>
                <LevelCrossingSign width={100} height={87.5} />
              </View>

              {/* Duration Badge */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>18:40</Text>
              </View>

              {/* Progress Bar along bottom edge */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '34%' }]} />
              </View>
            </LinearGradient>

            {/* Content Below Thumbnail */}
            <View style={styles.featuredMeta}>
              <Text
                style={[
                  styles.featuredTitle,
                  { color: isDark ? '#FFFFFF' : '#101828' },
                ]}
              >
                Lesson 12 · Level crossings and how to approach them
              </Text>

              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.langBadge,
                    {
                      backgroundColor: isDark
                        ? 'rgba(45, 91, 255, 0.2)'
                        : '#EFF4FF',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.langBadgeText,
                      { color: isDark ? '#5B7CFF' : '#2D5BFF' },
                    ]}
                  >
                    Bangla
                  </Text>
                </View>
                <Text
                  style={[
                    styles.linkedMetaText,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  6 min left · 24 linked questions
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Chapter Section Header */}
          <Text
            style={[
              styles.sectionHeader,
              { color: isDark ? '#8E95A5' : '#64748B' },
            ]}
          >
            CHAPTER 2 · DANGER SIGNS
          </Text>

          {/* Video List Items */}
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
                  {/* Decorative background circle */}
                  <View style={styles.itemThumbnailCurve} />

                  {/* Play circle */}
                  <View style={styles.itemPlayCircle}>
                    <Svg width={8} height={10} viewBox="0 0 8 10" style={{ marginLeft: 1.5 }}>
                      <Polygon points="1,1 7,5 1,9" fill="#111827" />
                    </Svg>
                  </View>

                  {/* Sign icon */}
                  <View style={styles.itemSignContainer}>
                    {item.signType === 'yield' ? (
                      <YieldSign width={45} height={42} />
                    ) : (
                      <DangerSign width={45} height={42} />
                    )}
                  </View>
                </LinearGradient>

                {/* Text Content */}
                <View style={styles.itemInfo}>
                  <Text
                    style={[
                      styles.itemLessonTag,
                      { color: isDark ? '#8E95A5' : '#64748B' },
                    ]}
                  >
                    Lesson {item.lessonNumber}
                  </Text>
                  <Text
                    style={[
                      styles.itemTitle,
                      { color: isDark ? '#FFFFFF' : '#101828' },
                    ]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.itemMeta,
                      { color: isDark ? '#8E95A5' : '#64748B' },
                    ]}
                  >
                    {item.duration} ·{' '}
                    {item.status === 'watched'
                      ? 'Watched'
                      : item.status === 'downloaded'
                      ? 'Downloaded'
                      : 'Full version'}
                  </Text>
                </View>

                {/* Right Status / Action Icon */}
                <View style={styles.itemActionContainer}>
                  {item.status === 'watched' ? (
                    <View style={styles.watchedIconCircle}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : item.status === 'downloaded' ? (
                    <View
                      style={[
                        styles.actionIconCircle,
                        { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                      ]}
                    >
                      <Download
                        size={15}
                        color={isDark ? '#94A3B8' : '#64748B'}
                        strokeWidth={2.2}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.actionIconCircle,
                        { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                      ]}
                    >
                      <Lock
                        size={14}
                        color={isDark ? '#64748B' : '#94A3B8'}
                        strokeWidth={2.2}
                      />
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  mainContent: {
    width: '100%',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    marginTop: 3,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
    marginBottom: 18,
  },
  categoryChip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: '#2555FF',
  },
  inactiveChip: {
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactiveCategoryText: {
    fontWeight: '600',
  },
  featuredCard: {
    width: '100%',
    marginBottom: 24,
  },
  featuredThumbnail: {
    width: '100%',
    height: 168,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCurve: {
    position: 'absolute',
    left: -50,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  heroPlayButton: {
    position: 'absolute',
    left: 72,
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  heroSignContainer: {
    position: 'absolute',
    right: 87.5,
    top: 40,
    width: 100,
    height: 87.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 46,
    height: 22,
    borderRadius: 11,
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
    marginTop: 12,
  },
  featuredTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  langBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  langBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  linkedMetaText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  listContainer: {
    gap: 10,
  },
  lessonItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemThumbnail: {
    width: 108,
    height: 66,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  itemThumbnailCurve: {
    position: 'absolute',
    left: -20,
    bottom: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  itemPlayCircle: {
    position: 'absolute',
    left: 18.5,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSignContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -21,
    width: 45,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: 14,
  },
  itemLessonTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
    lineHeight: 18,
  },
  itemMeta: {
    fontSize: 11.5,
    marginTop: 3,
    fontWeight: '500',
  },
  itemActionContainer: {
    paddingRight: 4,
  },
  watchedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
