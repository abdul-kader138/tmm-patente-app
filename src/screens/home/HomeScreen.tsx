import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { getHeaderTopInset } from '../../utils/safeArea';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const statusBarOffset = getHeaderTopInset(insets, 16);

  const horizontalMargin = 20;
  const contentWidth = Math.min(width - horizontalMargin * 2, 420);

  const gaugeImage = isDark
    ? require('../../../assets/mockup-art/gauge-ring-dark.png')
    : require('../../../assets/mockup-art/gauge-ring-light.png');

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0A0E18' : '#F5F7FB' }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: statusBarOffset,
            paddingBottom: 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContent, { width: contentWidth }]}>
          {/* Top Header */}
          <View style={styles.topHeader}>
            <View style={styles.userSection}>
              <TouchableOpacity
                style={[
                  styles.avatar,
                  { backgroundColor: isDark ? '#1B2547' : '#EFF4FF' },
                ]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Me' })}
                accessibilityRole="button"
                accessibilityLabel="Go to profile"
              >
                <Text
                  style={[
                    styles.avatarText,
                    { color: isDark ? '#5B7CFF' : '#2D5BFF' },
                  ]}
                >
                  RU
                </Text>
              </TouchableOpacity>
              <View>
                <Text
                  style={[
                    styles.greetingText,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  Good evening
                </Text>
                <Text
                  style={[
                    styles.userName,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  Rahim
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {/* Streak Pill */}
              <View
                style={[
                  styles.streakPill,
                  { backgroundColor: isDark ? '#261F1A' : '#FFF7ED' },
                ]}
              >
                <Ionicons name="flame" size={17} color="#F97316" />
                <Text
                  style={[
                    styles.streakText,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  12
                </Text>
              </View>

              {/* Notification Bell */}
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('SupportChat')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={isDark ? '#FFFFFF' : '#101828'}
                />
                <View
                  style={[
                    styles.badgeDot,
                    {
                      borderColor: isDark ? '#131A2A' : '#FFFFFF',
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Card: Exam Readiness */}
          <View
            style={[
              styles.heroCard,
              { backgroundColor: isDark ? '#1D3BB8' : '#2D5BFF' },
            ]}
          >
            <View style={styles.heroLeft}>
              <Text style={styles.heroTag}>EXAM READINESS</Text>
              <Text style={styles.heroTitle}>On track to pass</Text>
              <Text style={styles.heroSub}>
                Theory exam in 18 days · 5 of 7 simulations passed
              </Text>

              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => navigation.navigate('ExamSimulation')}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Start exam simulation"
              >
                <Text style={styles.heroButtonText}>Exam simulation</Text>
              </TouchableOpacity>
            </View>

            {/* Circular Readiness Gauge */}
            <View style={styles.heroRight}>
              <Image
                source={gaugeImage}
                style={styles.gaugeImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* 6-Grid Feature Cards (3 columns x 2 rows) */}
          <View style={styles.gridContainer}>
            {/* Row 1 */}
            <View style={styles.gridRow}>
              {/* 1. Lessons */}
              <TouchableOpacity
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('VideoLessons')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Lessons, 124 videos"
              >
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: isDark ? '#1A2544' : '#EFF4FF' },
                  ]}
                >
                  <Ionicons
                    name="play"
                    size={18}
                    color={isDark ? '#5B7CFF' : '#2D5BFF'}
                  />
                </View>
                <Text
                  style={[
                    styles.gridTitle,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  Lessons
                </Text>
                <Text
                  style={[
                    styles.gridSubtitle,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  124 videos
                </Text>
              </TouchableOpacity>

              {/* 2. Topics */}
              <TouchableOpacity
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('Topics')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Topics, 25 chapters"
              >
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: isDark ? '#231C3D' : '#F5F3FF' },
                  ]}
                >
                  <Ionicons name="grid" size={18} color="#8B5CF6" />
                </View>
                <Text
                  style={[
                    styles.gridTitle,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  Topics
                </Text>
                <Text
                  style={[
                    styles.gridSubtitle,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  25 chapters
                </Text>
              </TouchableOpacity>

              {/* 3. Exam test */}
              <TouchableOpacity
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('ExamSimulation')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Exam test, 30 questions, 20 minutes"
              >
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: isDark ? '#142C24' : '#ECFDF5' },
                  ]}
                >
                  <Ionicons name="time" size={18} color="#10B981" />
                </View>
                <Text
                  style={[
                    styles.gridTitle,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  Exam test
                </Text>
                <Text
                  style={[
                    styles.gridSubtitle,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  30 Q · 20 min
                </Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles.gridRow}>
              {/* 4. Dictionary */}
              <TouchableOpacity
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Dictionary' })}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Dictionary, 1900 words"
              >
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: isDark ? '#2E2514' : '#FFFBEB' },
                  ]}
                >
                  <Ionicons name="book" size={18} color="#F59E0B" />
                </View>
                <Text
                  style={[
                    styles.gridTitle,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  Dictionary
                </Text>
                <Text
                  style={[
                    styles.gridSubtitle,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  1,900 words
                </Text>
              </TouchableOpacity>

              {/* 5. E-Class */}
              <TouchableOpacity
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('EClass')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="E-Class, Live 20:30"
              >
                <View style={styles.eClassTopRow}>
                  <View
                    style={[
                      styles.gridIconBox,
                      { backgroundColor: isDark ? '#301B1E' : '#FEF2F2' },
                    ]}
                  >
                    <Ionicons name="people" size={18} color="#EF4444" />
                  </View>
                  <View style={styles.liveTag}>
                    <Text style={styles.liveTagText}>LIVE</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.gridTitle,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  E-Class
                </Text>
                <Text
                  style={[
                    styles.gridSubtitle,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  Live 20:30
                </Text>
              </TouchableOpacity>

              {/* 6. Road signs */}
              <TouchableOpacity
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                    borderColor: isDark ? '#1E2740' : '#EAECF0',
                  },
                ]}
                onPress={() => navigation.navigate('RoadSigns')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Road signs, 400 plus signs"
              >
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: isDark ? '#16223C' : '#EFF6FF' },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={18}
                    color={isDark ? '#5B7CFF' : '#2D5BFF'}
                  />
                </View>
                <Text
                  style={[
                    styles.gridTitle,
                    { color: isDark ? '#FFFFFF' : '#101828' },
                  ]}
                >
                  Road signs
                </Text>
                <Text
                  style={[
                    styles.gridSubtitle,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  400+ signs
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Learning Card */}
          <TouchableOpacity
            style={[
              styles.continueCard,
              {
                backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                borderColor: isDark ? '#1E2740' : '#EAECF0',
              },
            ]}
            onPress={() => navigation.navigate('StudyMode')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue study mode, Definizioni stradali: la strada"
          >
            <View
              style={[
                styles.continuePlayBox,
                { backgroundColor: isDark ? '#5B7CFF' : '#2D5BFF' },
              ]}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
            </View>
            <View style={styles.continueInfo}>
              <Text
                style={[
                  styles.continueTag,
                  { color: isDark ? '#8E95A5' : '#64748B' },
                ]}
              >
                CONTINUE · STUDY MODE
              </Text>
              <Text
                style={[
                  styles.continueTitle,
                  { color: isDark ? '#FFFFFF' : '#101828' },
                ]}
                numberOfLines={1}
              >
                Definizioni stradali: la strada
              </Text>
              <View style={styles.progressRow}>
                <View
                  style={[
                    styles.progressBarBg,
                    { backgroundColor: isDark ? '#1E2740' : '#E7EAF0' },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: isDark ? '#5B7CFF' : '#2D5BFF',
                        width: '60%',
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.progressRatio,
                    { color: isDark ? '#8E95A5' : '#64748B' },
                  ]}
                >
                  6 / 10
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Bottom Split Cards: Quiz Challenge & Support 24h */}
          <View style={styles.bottomRow}>
            {/* Quiz Challenge */}
            <TouchableOpacity
              style={[
                styles.bottomCard,
                {
                  backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                  borderColor: isDark ? '#1E2740' : '#EAECF0',
                },
              ]}
              onPress={() => navigation.navigate('QuizChallenge')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Quiz challenge, duel a friend"
            >
              <View
                style={[
                  styles.bottomIconBox,
                  { backgroundColor: isDark ? '#2E2514' : '#FFFBEB' },
                ]}
              >
                <Ionicons name="trophy" size={18} color="#F59E0B" />
              </View>
              <Text
                style={[
                  styles.bottomCardTitle,
                  { color: isDark ? '#FFFFFF' : '#101828' },
                ]}
              >
                Quiz challenge
              </Text>
              <Text
                style={[
                  styles.bottomCardSub,
                  { color: isDark ? '#8E95A5' : '#64748B' },
                ]}
              >
                Duel a friend · live 20:30
              </Text>
            </TouchableOpacity>

            {/* Support 24h */}
            <TouchableOpacity
              style={[
                styles.bottomCard,
                {
                  backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                  borderColor: isDark ? '#1E2740' : '#EAECF0',
                },
              ]}
              onPress={() => navigation.navigate('SupportChat')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Support 24h, 2 new messages"
            >
              <View style={styles.supportHeaderRow}>
                <View
                  style={[
                    styles.bottomIconBox,
                    { backgroundColor: isDark ? '#142C24' : '#ECFDF5' },
                  ]}
                >
                  <Ionicons name="headset" size={18} color="#10B981" />
                </View>
                <View style={styles.badgeNumber}>
                  <Text style={styles.badgeNumberText}>2</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.bottomCardTitle,
                  { color: isDark ? '#FFFFFF' : '#101828' },
                ]}
              >
                Support 24h
              </Text>
              <Text
                style={[
                  styles.bottomCardSub,
                  { color: isDark ? '#8E95A5' : '#64748B' },
                ]}
              >
                Teacher replied · 2 new
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  mainContent: {
    alignItems: 'center',
  },
  topHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    gap: 6,
  },
  streakText: {
    fontSize: 15,
    fontWeight: '800',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
  },
  heroCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },
  heroTag: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 6,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    height: 42,
    borderRadius: 14,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  heroButtonText: {
    color: '#101828',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  heroRight: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeImage: {
    width: 106,
    height: 106,
  },
  gridContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  gridRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  gridCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    minHeight: 118,
    alignItems: 'flex-start',
  },
  gridIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  eClassTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveTag: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  liveTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  continueCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    marginBottom: 16,
  },
  continuePlayBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueInfo: {
    flex: 1,
  },
  continueTag: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressRatio: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  bottomCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  supportHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumberText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  bottomIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bottomCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  bottomCardSub: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
});
