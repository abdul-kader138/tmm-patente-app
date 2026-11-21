import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockBadges } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProgressScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [period, setPeriod] = useState<'Week' | 'Month'>('Week');

  const weeklyData = [
    { day: 'M', height: 40, active: false },
    { day: 'T', height: 65, active: false },
    { day: 'W', height: 35, active: false },
    { day: 'T', height: 75, active: false },
    { day: 'F', height: 95, active: true },
    { day: 'S', height: 80, active: false },
    { day: 'S', height: 30, active: false },
  ];

  const topics = [
    { name: 'Overtaking', percent: 54, color: '#EF4444' },
    { name: 'Right of way', percent: 63, color: '#F97316' },
    { name: 'Speed & distances', percent: 71, color: '#F59E0B' },
    { name: 'Danger signs', percent: 96, color: '#10B981' },
  ];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.textPrimary }]}>Progress</Text>
        </View>
        <View style={[styles.readinessPill, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.readinessText, { color: colors.primary }]}>Readiness 78%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Questions Bar Chart Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={[styles.bigStatNumber, { color: colors.textPrimary }]}>
                389 questions
              </Text>
              <Text style={[styles.cardSubText, { color: colors.textMuted }]}>
                This week · avg 56 a day
              </Text>
            </View>

            <View style={[styles.periodPill, { backgroundColor: colors.chipBackground }]}>
              <TouchableOpacity
                style={[styles.periodOption, period === 'Week' && { backgroundColor: colors.card }]}
                onPress={() => setPeriod('Week')}
              >
                <Text style={[styles.periodText, { color: colors.textPrimary }]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodOption, period === 'Month' && { backgroundColor: colors.card }]}
                onPress={() => setPeriod('Month')}
              >
                <Text style={[styles.periodText, { color: colors.textMuted }]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bar Chart Bars */}
          <View style={styles.chartArea}>
            {weeklyData.map((d, index) => (
              <View key={index} style={styles.barCol}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: d.height,
                      backgroundColor: d.active ? colors.primary : colors.chipBackground,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.barDayText,
                    {
                      color: d.active ? colors.textPrimary : colors.textMuted,
                      fontWeight: d.active ? '700' : '500',
                    },
                  ]}
                >
                  {d.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Topic Mastery Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Topic mastery</Text>
            <Text style={[styles.linkSubtext, { color: colors.primary }]}>25 topics</Text>
          </View>

          <View style={styles.topicsProgressList}>
            {topics.map((t, idx) => (
              <View key={idx} style={styles.topicRow}>
                <View style={styles.topicTextRow}>
                  <Text style={[styles.topicLabel, { color: colors.textPrimary }]}>{t.name}</Text>
                  <Text style={[styles.topicPercent, { color: colors.textPrimary }]}>
                    {t.percent}%
                  </Text>
                </View>

                <View style={[styles.progressBarTrack, { backgroundColor: colors.chipBackground }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { backgroundColor: t.color, width: `${t.percent}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Gold League Leaderboard Banner */}
        <TouchableOpacity
          style={[styles.card, styles.leagueCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <View style={[styles.leagueIconBox, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
          </View>
          <View style={styles.leagueInfo}>
            <Text style={[styles.leagueTitle, { color: colors.textPrimary }]}>
              Gold league · #4 of 30
            </Text>
            <Text style={[styles.leagueSub, { color: colors.textMuted }]}>
              Top 5 move up on Sunday
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Badges Section */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Badges</Text>
            <Text style={[styles.cardSubText, { color: colors.textMuted }]}>3 of 24 earned</Text>
          </View>

          <View style={styles.badgesRow}>
            {mockBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View
                  style={[
                    styles.badgeCircle,
                    {
                      backgroundColor: badge.unlocked ? colors.primaryLight : colors.chipBackground,
                    },
                  ]}
                >
                  <Ionicons
                    name={badge.icon as any}
                    size={24}
                    color={badge.unlocked ? colors.primary : colors.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    { color: badge.unlocked ? colors.textPrimary : colors.textMuted },
                  ]}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  readinessPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  readinessText: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardSubText: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  linkSubtext: {
    fontSize: 13,
    fontWeight: '700',
  },
  periodPill: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
  },
  periodOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  barFill: {
    width: 28,
    borderRadius: 8,
  },
  barDayText: {
    fontSize: 12,
  },
  topicsProgressList: {
    gap: 14,
  },
  topicRow: {
    gap: 6,
  },
  topicTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  topicPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  leagueIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueInfo: {
    flex: 1,
  },
  leagueTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  leagueSub: {
    fontSize: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    alignItems: 'center',
    width: '23%',
    gap: 6,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14,
  },
});
