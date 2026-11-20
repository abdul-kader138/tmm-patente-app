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
import Svg, { Polygon, Line, Circle } from 'react-native-svg';
import { Search, Check, Download, Lock } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { getHeaderTopInset } from '../../utils/safeArea';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- PURE VECTOR SVG ROAD SIGNS ---

/** Railway Level Crossing Danger Sign */
const LevelCrossingSign: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    {/* Outer Red Danger Triangle */}
    <Polygon
      points="32,6 60,56 4,56"
      fill="#FFFFFF"
      stroke="#E11D48"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    {/* Railway Barrier / Fence Graphic */}
    <Line x1="22" y1="38" x2="42" y2="38" stroke="#0F172A" strokeWidth="2.5" />
    <Line x1="22" y1="46" x2="42" y2="46" stroke="#0F172A" strokeWidth="2.5" />
    <Line x1="25" y1="33" x2="25" y2="51" stroke="#0F172A" strokeWidth="2.5" />
    <Line x1="30" y1="33" x2="30" y2="51" stroke="#0F172A" strokeWidth="2.5" />
    <Line x1="34" y1="33" x2="34" y2="51" stroke="#0F172A" strokeWidth="2.5" />
    <Line x1="39" y1="33" x2="39" y2="51" stroke="#0F172A" strokeWidth="2.5" />
  </Svg>
);

/** General Danger Exclamation Sign (!) */
const DangerSign: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Polygon
      points="16,4 30,28 2,28"
      fill="#FFFFFF"
      stroke="#E11D48"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Exclamation Mark */}
    <Line x1="16" y1="14" x2="16" y2="21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="16" cy="24.5" r="1.2" fill="#0F172A" />
  </Svg>
);

/** Inverted Yield / Give Way Sign */
const YieldSign: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Polygon
      points="2,5 30,5 16,29"
      fill="#FFFFFF"
      stroke="#E11D48"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
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
              colors={['#1D3ED6', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredThumbnail}
            >
              {/* Background decorative curve */}
              <View style={styles.decorativeCurve} />

              {/* White Play Button Overlay */}
              <View style={styles.heroPlayButton}>
                <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginLeft: 2 }}>
                  <Polygon points="7,4 20,12 7,20" fill="#0F172A" />
                </Svg>
              </View>

              {/* Road Sign Graphic on Right */}
              <View style={styles.heroSignContainer}>
                <LevelCrossingSign size={86} />
              </View>

              {/* Duration Badge */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>18:40</Text>
              </View>

              {/* Progress Bar along bottom edge */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '42%' }]} />
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
                    <Svg width={11} height={11} viewBox="0 0 24 24" style={{ marginLeft: 1.5 }}>
                      <Polygon points="7,4 20,12 7,20" fill="#0F172A" />
                    </Svg>
                  </View>

                  {/* Sign icon */}
                  <View style={styles.itemSignContainer}>
                    {item.signType === 'yield' ? (
                      <YieldSign size={24} />
                    ) : (
                      <DangerSign size={24} />
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
    height: 175,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  decorativeCurve: {
    position: 'absolute',
    left: -40,
    bottom: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  heroPlayButton: {
    position: 'absolute',
    left: 32,
    width: 50,
    height: 50,
    borderRadius: 25,
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
    right: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
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
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#EF4444',
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
    height: 60,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  itemThumbnailCurve: {
    position: 'absolute',
    left: -15,
    bottom: -20,
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  itemPlayCircle: {
    position: 'absolute',
    left: 14,
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
