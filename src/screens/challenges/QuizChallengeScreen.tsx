import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockDuelData } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuizChallengeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied', `Player code ${mockDuelData.playerCode} copied to clipboard! Share it with a friend.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Quiz challenge</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Play 1-vs-1 with real exam quizzes
          </Text>
        </View>

        <TouchableOpacity style={[styles.trophyBtn, { backgroundColor: colors.warningLight }]}>
          <Ionicons name="trophy" size={20} color={colors.warning} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Quiz Countdown Banner */}
        <View style={styles.liveBanner}>
          <View style={styles.liveBannerLeft}>
            <View style={styles.liveTagRow}>
              <View style={styles.redDot} />
              <Text style={styles.liveTagText}>LIVE QUIZ · 20:30</Text>
            </View>

            <View style={styles.playRow}>
              <View style={styles.playCircle}>
                <Ionicons name="play" size={16} color="#2563EB" />
              </View>
              <Text style={styles.learnersCount}>214 learners joined</Text>
            </View>
          </View>

          {/* Countdown Ring */}
          <View style={styles.countdownRing}>
            <Text style={styles.countdownNumber}>50</Text>
          </View>
        </View>

        {/* Player Code Card */}
        <View style={[styles.playerCodeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.playerCodeLabel, { color: colors.textMuted }]}>
              Your player code
            </Text>
            <Text style={[styles.playerCodeValue, { color: colors.textPrimary }]}>
              {mockDuelData.playerCode}
            </Text>
          </View>

          <View style={styles.playerCodeActions}>
            <TouchableOpacity
              style={[styles.copyBtn, { backgroundColor: colors.chipBackground }]}
              onPress={handleCopyCode}
            >
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={16}
                color={colors.textPrimary}
              />
              <Text style={[styles.copyBtnText, { color: colors.textPrimary }]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.qrBtn, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="qr-code-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Challenge Action Options */}
        <View style={styles.optionsList}>
          {/* 1. Challenge a friend */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('LiveDuel')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="people" size={22} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Challenge a friend
              </Text>
              <Text style={[styles.actionSub, { color: colors.textMuted }]}>
                Send your code — 10 quizzes, 10 s each
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* 2. Random opponent */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('LiveDuel')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="shuffle" size={22} color="#7E22CE" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Random opponent
              </Text>
              <Text style={[styles.actionSub, { color: colors.textMuted }]}>
                Matched with a learner at your level
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* 3. Challenge your batch */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('EClass')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="ribbon" size={22} color={colors.warning} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Challenge your batch
              </Text>
              <Text style={[styles.actionSub, { color: colors.textMuted }]}>
                Weekly ranking with your class
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* RECENT DUELS */}
        <View style={styles.recentSection}>
          <Text style={[styles.recentTitle, { color: colors.textMuted }]}>RECENT DUELS</Text>
          <View style={styles.duelsList}>
            {mockDuelData.recentDuels.map((duel) => (
              <View
                key={duel.id}
                style={[styles.duelRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.opponentInitialsBox, { backgroundColor: colors.chipBackground }]}>
                  <Text style={[styles.initialsText, { color: colors.textPrimary }]}>
                    {duel.opponentInitials}
                  </Text>
                </View>

                <Text style={[styles.opponentVsText, { color: colors.textPrimary }]}>
                  vs {duel.opponent}
                </Text>

                <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
                  {duel.userScore} – {duel.opponentScore}
                </Text>

                <View
                  style={[
                    styles.resultBadge,
                    {
                      backgroundColor:
                        duel.result === 'Won' ? colors.successLight : colors.errorLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultText,
                      { color: duel.result === 'Won' ? colors.success : colors.error },
                    ]}
                  >
                    {duel.result}
                  </Text>
                </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  trophyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },
  liveBanner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBannerLeft: {
    gap: 12,
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnersCount: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  countdownRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  playerCodeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  playerCodeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  playerCodeValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  playerCodeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  qrBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 12,
  },
  recentSection: {
    gap: 10,
    marginTop: 6,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  duelsList: {
    gap: 10,
  },
  duelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  opponentInitialsBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  opponentVsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '800',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
