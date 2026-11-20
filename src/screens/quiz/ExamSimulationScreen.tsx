import React, { useState, useEffect } from 'react';
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ExamSimulationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState(14);
  const [answers, setAnswers] = useState<Record<number, 'V' | 'F'>>({
    1: 'V', 2: 'F', 3: 'V', 4: 'V', 5: 'F', 6: 'V', 7: 'F',
    8: 'V', 9: 'V', 10: 'F', 11: 'V', 12: 'V', 13: 'F',
  });
  const [secondsRemaining, setSecondsRemaining] = useState(1062); // 17:42

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

  const answeredCount = Object.keys(answers).length;
  const remainingCount = 30 - answeredCount;

  const handleSelectAnswer = (ans: 'V' | 'F') => {
    setAnswers({ ...answers, [currentQuestion]: ans });
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submit Exam',
      `You have answered ${answeredCount} of 30 questions. Are you sure you want to finish?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => navigation.replace('ExamResult', { score: 28, passed: true }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Exam simulation · Patente B
          </Text>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Question {currentQuestion} of 30
          </Text>
        </View>

        <View style={[styles.timerBadge, { backgroundColor: colors.errorLight }]}>
          <Ionicons name="time-outline" size={14} color={colors.error} />
          <Text style={[styles.timerText, { color: colors.error }]}>
            {formatTimer(secondsRemaining)}
          </Text>
        </View>
      </View>

      {/* 30-Question Grid Badges */}
      <View style={styles.gridContainer}>
        {Array.from({ length: 30 }).map((_, i) => {
          const qNum = i + 1;
          const isAnswered = answers[qNum] !== undefined;
          const isCurrent = qNum === currentQuestion;

          return (
            <TouchableOpacity
              key={qNum}
              style={[
                styles.gridNumBox,
                {
                  backgroundColor: isCurrent
                    ? colors.card
                    : isAnswered
                    ? '#334155'
                    : colors.card,
                  borderColor: isCurrent ? colors.primary : colors.border,
                  borderWidth: isCurrent ? 2 : 1,
                },
              ]}
              onPress={() => setCurrentQuestion(qNum)}
            >
              <Text
                style={[
                  styles.gridNumText,
                  {
                    color: isCurrent
                      ? colors.primary
                      : isAnswered
                      ? '#FFFFFF'
                      : colors.textMuted,
                  },
                ]}
              >
                {qNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Road Sign / Graphic Card */}
        <View style={[styles.signCard, { backgroundColor: colors.cardHighlight }]}>
          <View style={styles.speedCircle}>
            <Text style={styles.speedText}>50</Text>
          </View>
        </View>

        {/* Question Text */}
        <Text style={[styles.questionText, { color: colors.textPrimary }]}>
          Il segnale raffigurato indica che non si deve superare la velocità di 50 km/h.
        </Text>

        {/* Exam Rules Lock Note */}
        <View style={styles.rulesLockRow}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.rulesLockText, { color: colors.textMuted }]}>
            Exam rules: no translation, no feedback until you submit
          </Text>
        </View>

        {/* VERO / FALSO Buttons */}
        <View style={styles.answerButtonsRow}>
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              {
                backgroundColor:
                  answers[currentQuestion] === 'V' ? colors.primaryLight : colors.card,
                borderColor: answers[currentQuestion] === 'V' ? colors.primary : colors.border,
                borderWidth: answers[currentQuestion] === 'V' ? 2 : 1,
              },
            ]}
            onPress={() => handleSelectAnswer('V')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.choiceLetter,
                {
                  color: answers[currentQuestion] === 'V' ? colors.primary : colors.textPrimary,
                },
              ]}
            >
              V
            </Text>
            <Text style={[styles.choiceSub, { color: colors.textMuted }]}>VERO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              {
                backgroundColor:
                  answers[currentQuestion] === 'F' ? colors.primaryLight : colors.card,
                borderColor: answers[currentQuestion] === 'F' ? colors.primary : colors.border,
                borderWidth: answers[currentQuestion] === 'F' ? 2 : 1,
              },
            ]}
            onPress={() => handleSelectAnswer('F')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.choiceLetter,
                {
                  color: answers[currentQuestion] === 'F' ? colors.primary : colors.textPrimary,
                },
              ]}
            >
              F
            </Text>
            <Text style={[styles.choiceSub, { color: colors.textMuted }]}>FALSO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation & Submit Bar */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderLight }]}>
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.arrowBtn, { borderColor: colors.border }]}
            onPress={() => setCurrentQuestion((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={[styles.statusSummary, { color: colors.textPrimary }]}>
            {answeredCount} answered · {remainingCount} left
          </Text>

          <TouchableOpacity
            style={[styles.arrowBtn, { borderColor: colors.border }]}
            onPress={() => setCurrentQuestion((prev) => (prev < 30 ? prev + 1 : 30))}
          >
            <Ionicons name="arrow-forward" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Submit exam</Text>
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
  backButton: {
    padding: 6,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  headerTitle: {
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 4,
    justifyContent: 'center',
    marginBottom: 16,
  },
  gridNumBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridNumText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  signCard: {
    height: 160,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  speedCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 10,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 12,
  },
  rulesLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  rulesLockText: {
    fontSize: 12,
  },
  answerButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  choiceLetter: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 2,
  },
  choiceSub: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSummary: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
