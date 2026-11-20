import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

export const LessonPlayerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'chapters' | 'notes' | 'transcript'>('chapters');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('1.25x');
  const [ccBangla, setCcBangla] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Video Player Section */}
      <View style={styles.videoPlayerContainer}>
        {/* Top Control Overlay */}
        <View style={styles.videoTopBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.videoTopRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Visual Frame (Sign graphic mockup) */}
        <View style={styles.videoGraphic}>
          <View style={styles.signMockTriangle}>
            <Ionicons name="train" size={64} color="#EF4444" />
          </View>
        </View>

        {/* Video Scrubber & Playback Controls */}
        <View style={styles.videoControls}>
          <View style={styles.scrubberRow}>
            <Text style={styles.timeText}>06:12</Text>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: '35%' }]} />
              <View style={styles.scrubThumb} />
            </View>
            <Text style={styles.timeText}>18:40</Text>
          </View>

          <View style={styles.playbackButtonsRow}>
            <View style={styles.playbackLeft}>
              <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} style={styles.playPauseBtn}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.replayBtn}>
                <Ionicons name="reload" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.playbackRight}>
              <TouchableOpacity
                style={styles.speedPill}
                onPress={() => setSpeed(speed === '1.0x' ? '1.25x' : speed === '1.25x' ? '1.5x' : '1.0x')}
              >
                <Text style={styles.controlPillText}>{speed}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ccPill, { backgroundColor: ccBangla ? '#2563EB' : 'rgba(255,255,255,0.2)' }]}
                onPress={() => setCcBangla(!ccBangla)}
              >
                <Ionicons name="chatbox-ellipses-outline" size={14} color="#FFFFFF" />
                <Text style={styles.controlPillText}>CC Bangla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Lesson Details & Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lessonHeading, { color: colors.textPrimary }]}>
          Lesson 12 · Level crossings
        </Text>

        <View style={styles.instructorRow}>
          <View style={[styles.instructorAvatar, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.instructorAvatarText, { color: colors.primary }]}>SM</Text>
          </View>
          <Text style={[styles.instructorSubtext, { color: colors.textMuted }]}>
            Instructor Sara M. · Bangla · Chapter 2
          </Text>
        </View>

        {/* Tab Selectors */}
        <View style={[styles.tabsWrapper, { backgroundColor: colors.chipBackground }]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'chapters' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('chapters')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'chapters' ? colors.textPrimary : colors.textMuted },
              ]}
            >
              Chapters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'notes' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('notes')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'notes' ? colors.textPrimary : colors.textMuted },
              ]}
            >
              Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'transcript' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('transcript')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'transcript' ? colors.textPrimary : colors.textMuted },
              ]}
            >
              Transcript
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timestamps List */}
        {activeTab === 'chapters' && (
          <View style={styles.chaptersList}>
            {CHAPTERS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chapterRow,
                  item.active && { backgroundColor: colors.primaryLight, borderRadius: 12 },
                ]}
              >
                <Text style={[styles.timestampText, { color: item.active ? colors.primary : colors.textMuted }]}>
                  {item.time}
                </Text>
                <Text
                  style={[
                    styles.chapterTitle,
                    {
                      color: item.active ? colors.primary : colors.textPrimary,
                      fontWeight: item.active ? '700' : '500',
                    },
                  ]}
                >
                  {item.title}
                </Text>
                {item.passed ? (
                  <Ionicons name="checkmark" size={18} color={colors.success} />
                ) : item.active ? (
                  <View style={[styles.nowBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.nowBadgeText}>Now</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom Practice CTA Card */}
        <View style={[styles.practiceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.practiceIconBox, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkbox-outline" size={22} color={colors.success} />
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
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('QuizQuestion', { topicId: 2, mode: 'practice' })}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoPlayerContainer: {
    backgroundColor: '#0F172A',
    height: 260,
    justifyContent: 'space-between',
    padding: 12,
  },
  videoTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTopRight: {
    flexDirection: 'row',
    gap: 10,
  },
  videoGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signMockTriangle: {
    width: 90,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoControls: {
    gap: 8,
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  scrubThumb: {
    position: 'absolute',
    left: '35%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  playbackButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playbackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playPauseBtn: {
    padding: 4,
  },
  replayBtn: {
    padding: 4,
  },
  playbackRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ccPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  controlPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lessonHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  instructorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorAvatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  instructorSubtext: {
    fontSize: 13,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chaptersList: {
    gap: 8,
    marginBottom: 24,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  timestampText: {
    fontSize: 13,
    fontWeight: '600',
    width: 44,
  },
  chapterTitle: {
    flex: 1,
    fontSize: 14,
  },
  nowBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  nowBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  practiceIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  practiceSubtitle: {
    fontSize: 12,
  },
  startButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
