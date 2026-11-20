import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.userSection}>
            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: colors.primaryLight }]}
              onPress={() => navigation.navigate('MainTabs' as any)}
            >
              <Text style={[styles.avatarText, { color: colors.primary }]}>RU</Text>
            </TouchableOpacity>
            <View>
              <Text style={[styles.greetingText, { color: colors.textMuted }]}>Good evening</Text>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>Rahim</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={[styles.streakPill, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="flame" size={16} color={colors.warning} />
              <Text style={[styles.streakText, { color: colors.warning }]}>12</Text>
            </View>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('SupportChat')}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              <View style={[styles.badgeDot, { backgroundColor: colors.error }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card: Exam Readiness */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroTag}>EXAM READINESS</Text>
            <Text style={styles.heroTitle}>On track to pass</Text>
            <Text style={styles.heroSub}>
              Theory exam in 18 days · 5 of 7 simulations passed
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('ExamSimulation')}
              activeOpacity={0.8}
            >
              <Text style={styles.heroButtonText}>Exam simulation</Text>
            </TouchableOpacity>
          </View>

          {/* Circular Readiness Indicator */}
          <View style={styles.heroRight}>
            <View style={styles.circleOuter}>
              <Text style={styles.circlePercentage}>78%</Text>
            </View>
          </View>
        </View>

        {/* 6-Grid Feature Cards */}
        <View style={styles.gridContainer}>
          {/* 1. Lessons */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('VideoLessons')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="play" size={20} color="#2563EB" />
            </View>
            <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>Lessons</Text>
            <Text style={[styles.gridSubtitle, { color: colors.textMuted }]}>124 videos</Text>
          </TouchableOpacity>

          {/* 2. Topics */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Topics')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconBox, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="grid" size={20} color="#7C3AED" />
            </View>
            <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>Topics</Text>
            <Text style={[styles.gridSubtitle, { color: colors.textMuted }]}>25 chapters</Text>
          </TouchableOpacity>

          {/* 3. Exam Test */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('ExamSimulation')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="time" size={20} color="#10B981" />
            </View>
            <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>Exam test</Text>
            <Text style={[styles.gridSubtitle, { color: colors.textMuted }]}>30 Q · 20 min</Text>
          </TouchableOpacity>

          {/* 4. Dictionary */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('MainTabs' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconBox, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="book" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>Dictionary</Text>
            <Text style={[styles.gridSubtitle, { color: colors.textMuted }]}>1,900 words</Text>
          </TouchableOpacity>

          {/* 5. E-Class */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('EClass')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridHeaderRow]}>
              <View style={[styles.gridIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="people" size={20} color="#EF4444" />
              </View>
              <View style={styles.liveTag}>
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>
            </View>
            <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>E-Class</Text>
            <Text style={[styles.gridSubtitle, { color: colors.textMuted }]}>Live 20:30</Text>
          </TouchableOpacity>

          {/* 6. Road Signs */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('RoadSigns')}
            activeOpacity={0.7}
          >
            <View style={[styles.gridIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="warning" size={20} color="#2563EB" />
            </View>
            <Text style={[styles.gridTitle, { color: colors.textPrimary }]}>Road signs</Text>
            <Text style={[styles.gridSubtitle, { color: colors.textMuted }]}>400+ signs</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Learning Card */}
        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('StudyMode')}
          activeOpacity={0.7}
        >
          <View style={[styles.continuePlayBox, { backgroundColor: colors.primary }]}>
            <Ionicons name="play" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.continueInfo}>
            <Text style={[styles.continueTag, { color: colors.textMuted }]}>
              CONTINUE · STUDY MODE
            </Text>
            <Text style={[styles.continueTitle, { color: colors.textPrimary }]}>
              Definizioni stradali: la strada
            </Text>
            <View style={styles.progressRow}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.chipBackground }]}>
                <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: '60%' }]} />
              </View>
              <Text style={[styles.progressRatio, { color: colors.textMuted }]}>6 / 10</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Bottom Split Cards: Quiz Challenge & Support 24h */}
        <View style={styles.bottomRow}>
          {/* Quiz Challenge */}
          <TouchableOpacity
            style={[styles.bottomCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('QuizChallenge')}
            activeOpacity={0.7}
          >
            <View style={[styles.bottomIconBox, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="trophy" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.bottomCardTitle, { color: colors.textPrimary }]}>Quiz challenge</Text>
            <Text style={[styles.bottomCardSub, { color: colors.textMuted }]}>
              Duel a friend · live 20:30
            </Text>
          </TouchableOpacity>

          {/* Support 24h */}
          <TouchableOpacity
            style={[styles.bottomCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('SupportChat')}
            activeOpacity={0.7}
          >
            <View style={styles.supportHeaderRow}>
              <View style={[styles.bottomIconBox, { backgroundColor: colors.successLight }]}>
                <Ionicons name="headset" size={20} color={colors.success} />
              </View>
              <View style={[styles.badgeNumber, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeNumberText}>2</Text>
              </View>
            </View>
            <Text style={[styles.bottomCardTitle, { color: colors.textPrimary }]}>Support 24h</Text>
            <Text style={[styles.bottomCardSub, { color: colors.textMuted }]}>
              Teacher replied · 2 new
            </Text>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topHeader: {
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
    fontWeight: '700',
  },
  greetingText: {
    fontSize: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroLeft: {
    flex: 1,
  },
  heroTag: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  heroRight: {
    marginLeft: 10,
  },
  circleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercentage: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    width: '31%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  liveTag: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginBottom: 20,
  },
  continuePlayBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueInfo: {
    flex: 1,
  },
  continueTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: '700',
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
    fontSize: 11,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  supportHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bottomCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  bottomCardSub: {
    fontSize: 11,
    lineHeight: 15,
  },
});
