import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ExamResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mock exam #8</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pass Result Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.circularBadge, { borderColor: colors.success }]}>
            <Text style={[styles.scoreValue, { color: colors.textPrimary }]}>28/30</Text>
            <Text style={[styles.scoreLabel, { color: colors.success }]}>PASSED</Text>
          </View>

          <Text style={[styles.resultHeading, { color: colors.textPrimary }]}>You passed!</Text>
          <Text style={[styles.resultSubtext, { color: colors.textMuted }]}>
            2 errors — the limit is 3. You'd pass the real exam today.
          </Text>

          {/* Quick Stats Grid */}
          <View style={[styles.quickStatsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>14:32</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>Time</Text>
            </View>
            <View style={styles.statLine} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.error }]}>2 / 3</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>Errors</Text>
            </View>
            <View style={styles.statLine} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.primary }]}>Top 26%</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>Rank</Text>
            </View>
          </View>
        </View>

        {/* Trend Graph Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Last 8 mock exams</Text>
            <View style={[styles.passThresholdBadge, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.thresholdText, { color: colors.success }]}>Pass ≥ 27</Text>
            </View>
          </View>

          {/* Trend Line Visual Mock */}
          <View style={styles.trendGraphMock}>
            <View style={styles.passLine} />
            <View style={styles.trendDotsRow}>
              {[25, 26, 25, 27, 28, 27, 29, 28].map((score, i) => (
                <View key={i} style={styles.trendPoint}>
                  <View
                    style={[
                      styles.trendDot,
                      {
                        backgroundColor: score >= 27 ? colors.primary : colors.error,
                        marginBottom: (score - 24) * 8,
                      },
                    ]}
                  />
                  <Text style={[styles.trendDotScore, { color: colors.textMuted }]}>{score}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Mistakes Review Preview */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Review your 2 mistakes
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Review')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mistakeSnippet}>
            <View style={[styles.signSquare, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="hand-left" size={24} color="#EF4444" />
            </View>

            <View style={styles.mistakeTextCol}>
              <Text style={[styles.qTag, { color: colors.textMuted }]}>Q17 · RIGHT OF WAY</Text>
              <Text style={[styles.qText, { color: colors.textPrimary }]}>
                Il segnale obbliga a fermarsi solo se arrivano veicoli.
              </Text>
              <Text style={[styles.qTranslation, { color: colors.textMuted }]}>
                The sign requires you to stop only if vehicles are coming.
              </Text>

              <View style={styles.answerComparisonRow}>
                <View style={[styles.ansBadge, { backgroundColor: colors.errorLight }]}>
                  <Text style={[styles.ansBadgeText, { color: colors.error }]}>✕ You: Vero</Text>
                </View>
                <View style={[styles.ansBadge, { backgroundColor: colors.successLight }]}>
                  <Text style={[styles.ansBadgeText, { color: colors.success }]}>
                    ✓ Correct: Falso
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderLight }]}>
        <TouchableOpacity
          style={[styles.retakeBtn, { borderColor: colors.border }]}
          onPress={() => navigation.replace('ExamSimulation')}
        >
          <Ionicons name="reload" size={18} color={colors.textPrimary} />
          <Text style={[styles.retakeBtnText, { color: colors.textPrimary }]}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.reviewBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Review')}
        >
          <Text style={styles.reviewBtnText}>Review mistakes</Text>
        </TouchableOpacity>
      </View>
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
  iconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 16,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  circularBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultHeading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  quickStatsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLbl: {
    fontSize: 11,
    fontWeight: '500',
  },
  statLine: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  passThresholdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  thresholdText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendGraphMock: {
    height: 100,
    justifyContent: 'flex-end',
    position: 'relative',
    paddingTop: 20,
  },
  passLine: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 1,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  trendDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  trendPoint: {
    alignItems: 'center',
    gap: 4,
  },
  trendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendDotScore: {
    fontSize: 10,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  mistakeSnippet: {
    flexDirection: 'row',
    gap: 12,
  },
  signSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mistakeTextCol: {
    flex: 1,
  },
  qTag: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  qText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  qTranslation: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  answerComparisonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ansBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ansBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  retakeBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  reviewBtn: {
    flex: 1.3,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
