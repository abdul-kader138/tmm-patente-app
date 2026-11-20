import React, { useState } from 'react';
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

interface Subtopic {
  id: number;
  italianTitle: string;
  englishTitle: string;
  completed: number;
  total: number;
  errors: number;
}

const SUBTOPICS: Subtopic[] = [
  {
    id: 1,
    italianTitle: 'Definizioni stradali: la strada',
    englishTitle: 'The road',
    completed: 7,
    total: 10,
    errors: 1,
  },
  {
    id: 2,
    italianTitle: 'Definizioni stradali: la carreggiata',
    englishTitle: 'The carriageway',
    completed: 6,
    total: 11,
    errors: 2,
  },
  {
    id: 3,
    italianTitle: 'Parti della carreggiata',
    englishTitle: 'Parts of the carriageway',
    completed: 7,
    total: 7,
    errors: 0,
  },
  {
    id: 4,
    italianTitle: 'Definizioni stradali: la corsia',
    englishTitle: 'The lane',
    completed: 0,
    total: 20,
    errors: 0,
  },
  {
    id: 5,
    italianTitle: 'Le intersezioni',
    englishTitle: 'Intersections',
    completed: 12,
    total: 14,
    errors: 1,
  },
];

export const ChapterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 4]);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === SUBTOPICS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(SUBTOPICS.map((s) => s.id));
    }
  };

  const selectedCount = selectedIds.length;
  const selectedQuizzesTotal = SUBTOPICS.filter((s) => selectedIds.includes(s.id)).reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={[styles.headerChapter, { color: colors.textPrimary }]}>Chapter 1</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Road definitions & duties
          </Text>
        </View>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="options-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.success }]}>128</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Correct</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.error }]}>14</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Errors</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.textMuted }]}>62</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Unanswered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>204</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total</Text>
          </View>
        </View>

        {/* Selection Bar */}
        <View style={styles.selectionRow}>
          <Text style={[styles.selectedSummary, { color: colors.textPrimary }]}>
            {selectedCount} selected · {selectedQuizzesTotal} quizzes
          </Text>
          <TouchableOpacity onPress={toggleSelectAll}>
            <Text style={[styles.selectAllBtn, { color: colors.primary }]}>
              {selectedIds.length === SUBTOPICS.length ? 'Deselect all' : 'Select all'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subtopics Checklist */}
        <View style={styles.subtopicsList}>
          {SUBTOPICS.map((subtopic) => {
            const isSelected = selectedIds.includes(subtopic.id);
            const ratioPercent = Math.round((subtopic.completed / subtopic.total) * 100);

            return (
              <TouchableOpacity
                key={subtopic.id}
                style={[
                  styles.subtopicCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
                onPress={() => toggleSelect(subtopic.id)}
                activeOpacity={0.7}
              >
                {/* Custom Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>

                {/* Subtopic Info */}
                <View style={styles.subtopicInfo}>
                  <Text style={[styles.subtopicItalian, { color: colors.textPrimary }]}>
                    {subtopic.italianTitle}
                  </Text>
                  <Text style={[styles.subtopicEnglish, { color: colors.textMuted }]}>
                    {subtopic.englishTitle}
                  </Text>

                  {/* Multi-color progress track */}
                  <View style={styles.progressRow}>
                    <View style={[styles.progressBg, { backgroundColor: colors.chipBackground }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: ratioPercent === 100 ? colors.success : colors.primary,
                            width: `${ratioPercent}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.ratioText, { color: colors.textMuted }]}>
                      {subtopic.completed}/{subtopic.total}
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA Bar */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderLight }]}>
        <TouchableOpacity
          style={[styles.outlineBtn, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('StudyMode', { topicId: 1 })}
        >
          <Ionicons name="book-outline" size={18} color={colors.textPrimary} />
          <Text style={[styles.outlineBtnText, { color: colors.textPrimary }]}>Study mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.solidBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('QuizQuestion', { topicId: 1, mode: 'practice' })}
        >
          <Text style={styles.solidBtnText}>Quiz · {selectedQuizzesTotal} →</Text>
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerChapter: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statColumn: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  selectedSummary: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectAllBtn: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtopicsList: {
    gap: 12,
  },
  subtopicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtopicInfo: {
    flex: 1,
  },
  subtopicItalian: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtopicEnglish: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBg: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  ratioText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  solidBtn: {
    flex: 1.3,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solidBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
