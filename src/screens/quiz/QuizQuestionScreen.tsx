import React, { useState, useEffect } from 'react';
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

export const QuizQuestionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedAnswer, setSelectedAnswer] = useState<'V' | 'F' | null>('V');
  const [secondsRemaining, setSecondsRemaining] = useState(522); // 08:42
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCorrect = selectedAnswer === 'V';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.topicSub, { color: colors.textMuted }]}>
            Danger signs · Practice
          </Text>
          <Text style={[styles.questionIndex, { color: colors.textPrimary }]}>
            Question 12 of 30
          </Text>
        </View>

        <View style={[styles.timerBadge, { backgroundColor: colors.warningLight }]}>
          <Ionicons name="time-outline" size={14} color={colors.warning} />
          <Text style={[styles.timerText, { color: colors.warning }]}>
            {formatTimer(secondsRemaining)}
          </Text>
        </View>
      </View>

      {/* 30-Dots Progress Indicator */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: 24 }).map((_, index) => {
          let dotColor = colors.indicatorInactive;
          if (index < 6) dotColor = colors.success;
          else if (index === 6) dotColor = colors.error;
          else if (index < 11) dotColor = colors.success;
          else if (index === 11) dotColor = colors.primary;

          return <View key={index} style={[styles.dot, { backgroundColor: dotColor }]} />;
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Road Sign Graphic Card */}
        <View style={[styles.signCard, { backgroundColor: colors.cardHighlight }]}>
          <View style={styles.signFrame}>
            <Ionicons name="warning" size={90} color="#EF4444" />
          </View>
        </View>

        {/* Official Tag, Audio & Bookmark */}
        <View style={styles.metaRow}>
          <View style={[styles.officialBadge, { backgroundColor: colors.chipBackground }]}>
            <Text style={[styles.officialText, { color: colors.textMuted }]}>
              ITALIAN · OFFICIAL
            </Text>
          </View>

          <View style={styles.metaActions}>
            <TouchableOpacity style={[styles.metaActionBtn, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="volume-high" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.metaActionBtn, { backgroundColor: colors.chipBackground }]}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Text */}
        <Text style={[styles.questionText, { color: colors.textPrimary }]}>
          Il segnale raffigurato preannuncia un passaggio a livello con barriere o semibarriere.
        </Text>

        {/* Translation Card */}
        <View style={[styles.translationCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.transTag, { color: colors.primary }]}>ENGLISH</Text>
          <Text style={[styles.transContent, { color: colors.textPrimary }]}>
            The sign shown warns of a level crossing with barriers or half-barriers.
          </Text>
        </View>

        {/* Glossary Keyword Pills */}
        <View style={styles.glossaryPillsRow}>
          <View style={[styles.glossaryPill, { backgroundColor: '#F3E8FF' }]}>
            <Text style={[styles.glossaryPillText, { color: '#7E22CE' }]}>
              passaggio a livello = level crossing
            </Text>
          </View>
          <View style={[styles.glossaryPill, { backgroundColor: '#F3E8FF' }]}>
            <Text style={[styles.glossaryPillText, { color: '#7E22CE' }]}>
              preannuncia = warns ahead
            </Text>
          </View>
        </View>

        {/* Big VERO / FALSO Buttons */}
        <View style={styles.answerButtonsRow}>
          {/* VERO Button */}
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              {
                backgroundColor:
                  selectedAnswer === 'V' ? colors.successLight : colors.card,
                borderColor: selectedAnswer === 'V' ? colors.success : colors.border,
                borderWidth: selectedAnswer === 'V' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedAnswer('V')}
            activeOpacity={0.8}
          >
            <View style={styles.choiceHeader}>
              <View
                style={[
                  styles.choiceRadio,
                  {
                    borderColor: selectedAnswer === 'V' ? colors.success : colors.border,
                    backgroundColor: selectedAnswer === 'V' ? colors.success : 'transparent',
                  },
                ]}
              >
                {selectedAnswer === 'V' && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={[
                  styles.choiceLetter,
                  { color: selectedAnswer === 'V' ? colors.success : colors.textPrimary },
                ]}
              >
                VERO
              </Text>
            </View>
            <Text style={[styles.choiceSub, { color: colors.textMuted }]}>True</Text>
          </TouchableOpacity>

          {/* FALSO Button */}
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              {
                backgroundColor:
                  selectedAnswer === 'F' ? colors.errorLight : colors.card,
                borderColor: selectedAnswer === 'F' ? colors.error : colors.border,
                borderWidth: selectedAnswer === 'F' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedAnswer('F')}
            activeOpacity={0.8}
          >
            <View style={styles.choiceHeader}>
              <View
                style={[
                  styles.choiceRadio,
                  {
                    borderColor: selectedAnswer === 'F' ? colors.error : colors.border,
                    backgroundColor: selectedAnswer === 'F' ? colors.error : 'transparent',
                  },
                ]}
              />
              <Text
                style={[
                  styles.choiceLetter,
                  { color: selectedAnswer === 'F' ? colors.error : colors.textPrimary },
                ]}
              >
                FALSO
              </Text>
            </View>
            <Text style={[styles.choiceSub, { color: colors.textMuted }]}>False</Text>
          </TouchableOpacity>
        </View>

        {/* Instant Explanation Feedback Sheet */}
        {selectedAnswer !== null && (
          <View style={[styles.feedbackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackTitleRow}>
                <View style={[styles.sparkleIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="sparkles" size={16} color={colors.primary} />
                </View>
                <Text style={[styles.feedbackTitle, { color: colors.textPrimary }]}>
                  {isCorrect ? "Correct! Here's why" : "Incorrect! Here's why"}
                </Text>
              </View>
              <View style={[styles.xpBadge, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.xpText, { color: colors.success }]}>+10 XP</Text>
              </View>
            </View>

            <Text style={[styles.feedbackExplanation, { color: colors.textSecondary }]}>
              The fence (gate) symbol means the crossing is protected by barriers. A crossing
              without barriers shows a steam locomotive instead.
            </Text>

            <View style={styles.feedbackActionsRow}>
              <TouchableOpacity
                style={[styles.tutorBtn, { borderColor: colors.border }]}
                onPress={() => navigation.navigate('TeacherChat')}
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.textPrimary} />
                <Text style={[styles.tutorBtnText, { color: colors.textPrimary }]}>Ask tutor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                onPress={() => setSelectedAnswer(null)}
              >
                <Text style={styles.nextBtnText}>Next question</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  closeBtn: {
    padding: 6,
  },
  headerCenter: {
    alignItems: 'center',
  },
  topicSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionIndex: {
    fontSize: 16,
    fontWeight: '800',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dotsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 5,
    marginBottom: 16,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signCard: {
    height: 160,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  signFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  officialBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  officialText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  metaActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 14,
  },
  translationCard: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  transTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  transContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  glossaryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  glossaryPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  glossaryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  answerButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  choiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  choiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: {
    fontSize: 20,
    fontWeight: '800',
  },
  choiceSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  feedbackCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
  },
  feedbackExplanation: {
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  tutorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  tutorBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
