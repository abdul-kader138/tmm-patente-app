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
import { mockDuelData } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LiveDuelScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [userScore, setUserScore] = useState(mockDuelData.activeDuel.userScore);
  const [opponentScore, setOpponentScore] = useState(mockDuelData.activeDuel.opponentScore);
  const [timer, setTimer] = useState(6);
  const [selectedAns, setSelectedAns] = useState<'V' | 'F' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (choice: 'V' | 'F') => {
    setSelectedAns(choice);
    if (choice === 'F') {
      setUserScore((prev) => prev + 1);
    }
    setTimeout(() => {
      navigation.navigate('ExamResult', { score: userScore + 1, passed: true });
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top 1-vs-1 Score Bar */}
      <View style={styles.topScoreHeader}>
        {/* User Score (Left) */}
        <View style={styles.scoreSideLeft}>
          <View style={[styles.playerAvatar, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>RU</Text>
          </View>
          <View>
            <Text style={[styles.playerNameText, { color: colors.textMuted }]}>You</Text>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>{userScore}</Text>
          </View>
        </View>

        {/* Center Countdown Ring */}
        <View style={styles.centerTimerBox}>
          <Text style={[styles.qIndexText, { color: colors.textMuted }]}>Q 9 / 10</Text>
          <View style={[styles.timerCircle, { borderColor: colors.warning }]}>
            <Text style={[styles.timerDigit, { color: colors.textPrimary }]}>{timer}</Text>
          </View>
        </View>

        {/* Opponent Score (Right) */}
        <View style={styles.scoreSideRight}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.playerNameText, { color: colors.textMuted }]}>
              {mockDuelData.activeDuel.opponentName}
            </Text>
            <Text style={[styles.scoreValue, { color: colors.error }]}>{opponentScore}</Text>
          </View>
          <View style={[styles.playerAvatar, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.avatarText, { color: colors.error }]}>
              {mockDuelData.activeDuel.opponentInitials}
            </Text>
          </View>
        </View>
      </View>

      {/* 10-Question Progress Segmented Bar */}
      <View style={styles.progressBarRow}>
        {[
          'green',
          'green',
          'red',
          'green',
          'green',
          'green',
          'green',
          'green',
          'blue',
          'grey',
        ].map((status, index) => {
          let bg = colors.indicatorInactive;
          if (status === 'green') bg = colors.success;
          if (status === 'red') bg = colors.error;
          if (status === 'blue') bg = colors.primary;

          return <View key={index} style={[styles.barSegment, { backgroundColor: bg }]} />;
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Road Sign Graphic Card (No entry) */}
        <View style={[styles.signCard, { backgroundColor: colors.cardHighlight }]}>
          <View style={styles.noEntrySign}>
            <View style={styles.whiteDash} />
          </View>
        </View>

        {/* Question Text */}
        <Text style={[styles.questionText, { color: colors.textPrimary }]}>
          {mockDuelData.activeDuel.question.textItalian}
        </Text>

        {/* Translation Banner */}
        <View style={[styles.transCard, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="language" size={16} color={colors.primary} />
          <Text style={[styles.transText, { color: colors.textPrimary }]}>
            {mockDuelData.activeDuel.question.translation}
          </Text>
        </View>

        {/* Large V / F Choice Buttons */}
        <View style={styles.choiceRow}>
          {/* V (Vero) */}
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              {
                backgroundColor:
                  selectedAns === 'V' ? colors.errorLight : colors.card,
                borderColor: selectedAns === 'V' ? colors.error : colors.border,
                borderWidth: selectedAns === 'V' ? 2 : 1,
              },
            ]}
            onPress={() => handleAnswer('V')}
            activeOpacity={0.8}
          >
            <Text style={[styles.choiceLetter, { color: colors.textPrimary }]}>V</Text>
            <Text style={[styles.choiceLabel, { color: colors.textMuted }]}>VERO</Text>
          </TouchableOpacity>

          {/* F (Falso) */}
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              {
                backgroundColor:
                  selectedAns === 'F' ? colors.successLight : colors.card,
                borderColor: selectedAns === 'F' ? colors.success : colors.border,
                borderWidth: selectedAns === 'F' ? 2 : 1,
              },
            ]}
            onPress={() => handleAnswer('F')}
            activeOpacity={0.8}
          >
            <Text style={[styles.choiceLetter, { color: colors.textPrimary }]}>F</Text>
            <Text style={[styles.choiceLabel, { color: colors.textMuted }]}>FALSO</Text>
          </TouchableOpacity>
        </View>

        {/* Opponent Status Indicator */}
        <View style={styles.opponentStatusRow}>
          <View style={[styles.miniBadge, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.miniBadgeText, { color: colors.error }]}>KH</Text>
          </View>
          <Text style={[styles.opponentStatusText, { color: colors.textMuted }]}>
            Karim has already answered
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  scoreSideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '30%',
  },
  scoreSideRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    width: '30%',
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  playerNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  centerTimerBox: {
    alignItems: 'center',
    gap: 4,
  },
  qIndexText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDigit: {
    fontSize: 18,
    fontWeight: '900',
  },
  progressBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 6,
    marginVertical: 10,
  },
  barSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  signCard: {
    height: 200,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noEntrySign: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteDash: {
    width: 60,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 16,
  },
  transCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 10,
    marginBottom: 24,
  },
  transText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 18,
    alignItems: 'center',
  },
  choiceLetter: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 2,
  },
  choiceLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  opponentStatusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  miniBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  opponentStatusText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
