import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ChapterRoute = RouteProp<RootStackParamList, 'Chapter'>;

interface Subtopic {
  id: number;
  italianTitle: string;
  englishTitle: string;
  completed: number;
  total: number;
  errors: number;
}

type FilterKey = 'all' | 'errors' | 'todo';

// TODO: replace with data from your store / API
const CHAPTER_STATS = { correct: 128, errors: 14, unanswered: 62, total: 204 };

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
    errors: 3,
  },
];

/* Colors taken straight from the mockup */
const BAR_GREEN = '#12B76A';
const BAR_RED = '#F04438';
const STAT_GREEN = '#0B7A4B';
const STAT_RED = '#B42318';
const STAT_SLATE = '#475467';

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All topics' },
  { key: 'errors', label: 'With mistakes' },
  { key: 'todo', label: 'Not completed' },
];

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

const StatColumn: React.FC<{ value: number; label: string; color: string; muted: string }> = ({
  value,
  label,
  color,
  muted,
}) => (
  <View style={styles.statColumn}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
  </View>
);

interface SubtopicCardProps {
  item: Subtopic;
  selected: boolean;
  onToggle: (id: number) => void;
}

const SubtopicCard = React.memo(({ item, selected, onToggle }: SubtopicCardProps) => {
  const { colors } = useTheme();

  const correct = Math.max(item.completed - item.errors, 0);
  const correctPct = (correct / item.total) * 100;
  const errorPct = (Math.min(item.errors, item.completed) / item.total) * 100;

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${item.englishTitle}, ${item.completed} of ${item.total} answered`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.primary : colors.border,
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: selected ? colors.primary : colors.border,
            backgroundColor: selected ? colors.primary : colors.card,
          },
        ]}
      >
        {selected && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
      </View>

      <View style={styles.cardInfo}>
        <Text style={[styles.cardItalian, { color: colors.textPrimary }]}>{item.italianTitle}</Text>
        <Text style={[styles.cardEnglish, { color: colors.textMuted }]} numberOfLines={1}>
          {item.englishTitle}
        </Text>

        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: colors.chipBackground }]}>
            <View style={[styles.segment, { width: `${correctPct}%`, backgroundColor: BAR_GREEN }]} />
            <View style={[styles.segment, { width: `${errorPct}%`, backgroundColor: BAR_RED }]} />
          </View>
          <Text style={[styles.ratioText, { color: colors.textPrimary }]}>
            {item.completed}/{item.total}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
});

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const ChapterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChapterRoute>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const chapterId = route.params?.chapterId ?? 1;
  const chapterTitle = route.params?.title ?? 'Road definitions & duties';

  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 4]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const visibleSubtopics = useMemo(() => {
    switch (filter) {
      case 'errors':
        return SUBTOPICS.filter((s) => s.errors > 0);
      case 'todo':
        return SUBTOPICS.filter((s) => s.completed < s.total);
      default:
        return SUBTOPICS;
    }
  }, [filter]);

  // Selection summary only counts what the user can currently see
  const selectedVisible = useMemo(
    () => visibleSubtopics.filter((s) => selectedIds.includes(s.id)),
    [visibleSubtopics, selectedIds],
  );
  const selectedCount = selectedVisible.length;
  const selectedQuizzesTotal = selectedVisible.reduce((sum, s) => sum + s.total, 0);
  const allVisibleSelected =
    visibleSubtopics.length > 0 && selectedCount === visibleSubtopics.length;

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    const visibleIds = visibleSubtopics.map((s) => s.id);
    setSelectedIds((prev) =>
      allVisibleSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...prev, ...visibleIds])),
    );
  }, [visibleSubtopics, allVisibleSelected]);

  const openFilter = useCallback(() => {
    // Android Alert supports max 3 buttons, so tapping outside closes it
    Alert.alert(
      'Filter',
      undefined,
      FILTER_OPTIONS.map((o) => ({
        text: o.key === filter ? `${o.label} ✓` : o.label,
        onPress: () => setFilter(o.key),
      })),
      { cancelable: true },
    );
  }, [filter]);

  const canStartQuiz = selectedCount > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.card },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleBox}>
          <Text style={[styles.headerChapter, { color: colors.textPrimary }]} numberOfLines={1}>
            Chapter {chapterId}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {chapterTitle}
          </Text>
        </View>

        <Pressable
          onPress={openFilter}
          accessibilityRole="button"
          accessibilityLabel="Filter topics"
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.card },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="filter" size={20} color={colors.textPrimary} />
          {filter !== 'all' && <View style={[styles.filterDot, { backgroundColor: colors.primary }]} />}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Stats card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <StatColumn
            value={CHAPTER_STATS.correct}
            label="Correct"
            color={STAT_GREEN}
            muted={colors.textMuted}
          />
          <StatColumn
            value={CHAPTER_STATS.errors}
            label="Errors"
            color={STAT_RED}
            muted={colors.textMuted}
          />
          <StatColumn
            value={CHAPTER_STATS.unanswered}
            label="Unanswered"
            color={STAT_SLATE}
            muted={colors.textMuted}
          />
          <StatColumn
            value={CHAPTER_STATS.total}
            label="Total"
            color={colors.textPrimary}
            muted={colors.textMuted}
          />
        </View>

        {/* Selection row */}
        <View style={styles.selectionRow}>
          <Text style={[styles.selectedSummary, { color: colors.textPrimary }]}>
            {selectedCount} selected · {selectedQuizzesTotal} quizzes
          </Text>
          <Pressable onPress={toggleSelectAll} hitSlop={10} accessibilityRole="button">
            <Text style={[styles.selectAllBtn, { color: colors.primary }]}>
              {allVisibleSelected ? 'Deselect all' : 'Select all'}
            </Text>
          </Pressable>
        </View>

        {/* Subtopics */}
        <View style={styles.list}>
          {visibleSubtopics.map((s) => (
            <SubtopicCard
              key={s.id}
              item={s}
              selected={selectedIds.includes(s.id)}
              onToggle={toggleSelect}
            />
          ))}
          {visibleSubtopics.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No topics match this filter.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA bar */}
      <View
        style={[
          styles.bottomBar,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom - 7, 12),
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.navigate('StudyMode', { topicId: chapterId })}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.outlineBtn,
            { borderColor: colors.border, backgroundColor: colors.card },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="book-outline" size={20} color={colors.textPrimary} />
          <Text style={[styles.outlineBtnText, { color: colors.textPrimary }]}>Study mode</Text>
        </Pressable>

        <Pressable
          disabled={!canStartQuiz}
          onPress={() => navigation.navigate('QuizQuestion', { topicId: chapterId, mode: 'practice' })}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canStartQuiz }}
          style={({ pressed }) => [
            styles.solidBtn,
            { backgroundColor: colors.primary },
            !canStartQuiz && { opacity: 0.45 },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.solidBtnText}>Quiz · {selectedQuizzesTotal}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
/* includeFontPadding:false removes Android's extra vertical text
   padding so heights match iOS and the mockup. */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 2,
    marginBottom: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerChapter: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
  },

  /* Content */
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  /* Stats card */
  statsCard: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 3,
    marginBottom: 12,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 14,
    includeFontPadding: false,
  },

  /* Selection row */
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  selectedSummary: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  selectAllBtn: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },

  /* Subtopic cards */
  list: {
    gap: 9,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.5, // same width selected / unselected -> no layout shift
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardItalian: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    includeFontPadding: false,
  },
  cardEnglish: {
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2,
    includeFontPadding: false,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    marginTop: 2,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  ratioText: {
    width: 50,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 40,
    includeFontPadding: false,
  },

  /* Bottom bar */
  bottomBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 11,
    borderTopWidth: 1,
  },
  outlineBtn: {
    flex: 1,
    height: 45,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
  solidBtn: {
    flex: 1.35,
    height: 45,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  solidBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
});