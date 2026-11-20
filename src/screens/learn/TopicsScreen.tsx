import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TopicItem {
  id: number;
  chapterNumber: number;
  title: string;
  italianTitle: string;
  totalQuizzes: number;
  completedQuizzes: number;
  errorCount: number;
}

const TOPICS_DATA: TopicItem[] = [
  {
    id: 1,
    chapterNumber: 1,
    title: 'Road definitions & general duties',
    italianTitle: 'Definizioni stradali e doveri',
    totalQuizzes: 204,
    completedQuizzes: 142,
    errorCount: 14,
  },
  {
    id: 2,
    chapterNumber: 2,
    title: 'Danger signs',
    italianTitle: 'Segnali di pericolo',
    totalQuizzes: 340,
    completedQuizzes: 340,
    errorCount: 8,
  },
  {
    id: 3,
    chapterNumber: 3,
    title: 'Priority & right of way signs',
    italianTitle: 'Segnali di precedenza',
    totalQuizzes: 180,
    completedQuizzes: 120,
    errorCount: 15,
  },
  {
    id: 4,
    chapterNumber: 4,
    title: 'Prohibition signs',
    italianTitle: 'Segnali di divieto',
    totalQuizzes: 410,
    completedQuizzes: 210,
    errorCount: 22,
  },
  {
    id: 5,
    chapterNumber: 5,
    title: 'Mandatory signs',
    italianTitle: 'Segnali di obbligo',
    totalQuizzes: 290,
    completedQuizzes: 95,
    errorCount: 12,
  },
];

export const TopicsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Topics · 25 chapters</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={TOPICS_DATA}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const percent = Math.round((item.completedQuizzes / item.totalQuizzes) * 100);
          return (
            <TouchableOpacity
              style={[styles.topicCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Chapter', { chapterId: item.id, title: item.title })}
              activeOpacity={0.7}
            >
              <View style={styles.topicHeader}>
                <View style={[styles.chapterPill, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.chapterPillText, { color: colors.primary }]}>
                    Chapter {item.chapterNumber}
                  </Text>
                </View>
                <Text style={[styles.percentText, { color: colors.textPrimary }]}>{percent}%</Text>
              </View>

              <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.topicItalian, { color: colors.textMuted }]}>{item.italianTitle}</Text>

              {/* Progress bar */}
              <View style={[styles.progressBarBg, { backgroundColor: colors.chipBackground }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: percent === 100 ? colors.success : colors.primary,
                      width: `${percent}%`,
                    },
                  ]}
                />
              </View>

              {/* Stats Footer */}
              <View style={styles.topicFooter}>
                <Text style={[styles.footerStat, { color: colors.textMuted }]}>
                  {item.completedQuizzes}/{item.totalQuizzes} quizzes
                </Text>
                {item.errorCount > 0 && (
                  <Text style={[styles.errorStat, { color: colors.error }]}>
                    {item.errorCount} mistakes
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 12,
  },
  topicCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chapterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  topicItalian: {
    fontSize: 13,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  topicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerStat: {
    fontSize: 12,
  },
  errorStat: {
    fontSize: 12,
    fontWeight: '600',
  },
});
