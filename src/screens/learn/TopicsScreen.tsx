import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TopicItem {
  id: number;
  chapterNumber: number;
  italianTitle: string;
  title: string;
  totalQuizzes: number;
  /** 0-100. `null` means the chapter has not been started yet ("New"). */
  progress: number | null;
}

interface OverallStats {
  answered: number;
  correctPercent: number;
  toReview: number;
}

const TOTAL_CHAPTERS = 25;

// TODO: replace with data from your store / API
const OVERALL_STATS: OverallStats = {
  answered: 1248,
  correctPercent: 86,
  toReview: 34,
};

const TOPICS_DATA: TopicItem[] = [
  {
    id: 1,
    chapterNumber: 1,
    italianTitle: "Definizioni generali e doveri nell'uso della strada",
    title: 'Road definitions & duties',
    totalQuizzes: 204,
    progress: 68,
  },
  {
    id: 2,
    chapterNumber: 2,
    italianTitle: 'Segnali di pericolo',
    title: 'Danger signs',
    totalQuizzes: 312,
    progress: 96,
  },
  {
    id: 3,
    chapterNumber: 3,
    italianTitle: 'Segnali di divieto',
    title: 'Prohibition signs',
    totalQuizzes: 287,
    progress: 81,
  },
  {
    id: 4,
    chapterNumber: 4,
    italianTitle: 'Segnali di obbligo',
    title: 'Mandatory signs',
    totalQuizzes: 196,
    progress: 74,
  },
  {
    id: 5,
    chapterNumber: 5,
    italianTitle: 'Segnali di precedenza',
    title: 'Right-of-way signs',
    totalQuizzes: 168,
    progress: 63,
  },
  {
    id: 6,
    chapterNumber: 6,
    italianTitle: 'Segnaletica orizzontale',
    title: 'Road markings',
    totalQuizzes: 241,
    progress: 42,
  },
  {
    id: 7,
    chapterNumber: 7,
    italianTitle: 'Semafori e agenti del traffico',
    title: 'Traffic lights & officers',
    totalQuizzes: 130,
    progress: null,
  },
];

/* Colors taken straight from the mockup (progress bars + stat numbers) */
const BAR_GREEN = '#12B76A';
const BAR_ORANGE = '#F79009';
const BAR_RED = '#F04438';
const STAT_GREEN = '#0B7A4B';
const STAT_RED = '#B42318';

const getBarColor = (progress: number) =>
  progress >= 90 ? BAR_GREEN : progress >= 50 ? BAR_ORANGE : BAR_RED;

/** Lowercase + strip accents so "perìcolo" still matches "pericolo". */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

const StatItem: React.FC<{ value: string; label: string; color: string; muted: string }> = ({
  value,
  label,
  color,
  muted,
}) => (
  <View style={styles.statItem}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
  </View>
);

interface TopicRowProps {
  item: TopicItem;
  onPress: (item: TopicItem) => void;
}

const TopicRow = React.memo(({ item, onPress }: TopicRowProps) => {
  const { colors } = useTheme();
  const isNew = item.progress === null;
  const progress = item.progress ?? 0;

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Chapter ${item.chapterNumber}, ${item.title}, ${
        isNew ? 'not started' : `${progress} percent complete`
      }`}
      android_ripple={{ color: colors.chipBackground }}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && Platform.OS === 'ios' && { backgroundColor: colors.chipBackground },
      ]}
    >
      <View style={[styles.numberTile, { backgroundColor: colors.chipBackground }]}>
        <Text style={[styles.numberText, { color: colors.textPrimary }]}>{item.chapterNumber}</Text>
      </View>

      <View style={styles.rowContent}>
        <Text style={[styles.italianTitle, { color: colors.textPrimary }]}>{item.italianTitle}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
          {item.title} · {item.totalQuizzes} quizzes
        </Text>

        <View style={[styles.track, { backgroundColor: colors.chipBackground }]}>
          {!isNew && (
            <View
              style={[styles.fill, { width: `${progress}%`, backgroundColor: getBarColor(progress) }]}
            />
          )}
        </View>
      </View>

      <View style={styles.trailing}>
        {isNew ? (
          <Text style={[styles.newText, { color: colors.primary }]}>New</Text>
        ) : (
          <Text style={[styles.percentText, { color: colors.textPrimary }]}>{progress}%</Text>
        )}
      </View>
    </Pressable>
  );
});

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const TopicsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredTopics = useMemo(() => {
    const q = normalize(query);
    if (!q) return TOPICS_DATA;
    return TOPICS_DATA.filter(
      (t) =>
        normalize(t.italianTitle).includes(q) ||
        normalize(t.title).includes(q) ||
        String(t.chapterNumber) === q,
    );
  }, [query]);

  const handleOpenChapter = useCallback(
    (item: TopicItem) => {
      Keyboard.dismiss();
      navigation.navigate('Chapter', { chapterId: item.id, title: item.title });
    },
    [navigation],
  );

  const toggleSearch = useCallback(() => {
    setSearchOpen((open) => {
      if (open) {
        setQuery('');
        Keyboard.dismiss();
      }
      return !open;
    });
  }, []);

  const renderHeader = () => (
    <View>
      {/* Title + search button */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Topics</Text>
          <Text style={[styles.screenSubtitle, { color: colors.textMuted }]}>
            Official ministerial program · {TOTAL_CHAPTERS} chapters
          </Text>
        </View>

        <Pressable
          onPress={toggleSearch}
          accessibilityRole="button"
          accessibilityLabel={searchOpen ? 'Close search' : 'Search topics'}
          style={({ pressed }) => [
            styles.searchButton,
            { backgroundColor: colors.card },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name={searchOpen ? 'close' : 'search'} size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Search field */}
      {searchOpen && (
        <View
          style={[styles.searchField, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            placeholder="Search chapters"
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      )}

      {/* Overall stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <StatItem
          value={OVERALL_STATS.answered.toLocaleString('en-US')}
          label="answered"
          color={colors.textPrimary}
          muted={colors.textMuted}
        />
        <StatItem
          value={`${OVERALL_STATS.correctPercent}%`}
          label="correct"
          color={STAT_GREEN}
          muted={colors.textMuted}
        />
        <StatItem
          value={String(OVERALL_STATS.toReview)}
          label="to review"
          color={STAT_RED}
          muted={colors.textMuted}
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={32} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No chapters found</Text>
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>
        Try a different word or a chapter number.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => <TopicRow item={item} onPress={handleOpenChapter} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
/* includeFontPadding:false removes Android's extra vertical text
   padding so rows have the same height on Android and iOS. */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  screenTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
    includeFontPadding: false,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  /* Search field */
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    includeFontPadding: false,
  },

  /* Stats card */
  statsCard: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 15,
    includeFontPadding: false,
  },

  /* Rows */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  numberTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    includeFontPadding: false,
  },
  rowContent: {
    flex: 1,
  },
  italianTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 15,
    marginTop: 2,
    includeFontPadding: false,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
    marginRight: 28,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  trailing: {
    minWidth: 30,
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  percentText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },
  newText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },

  /* Empty state */
  empty: {
    alignItems: 'center',
    paddingTop: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    includeFontPadding: false,
  },
  emptyText: {
    fontSize: 13,
    includeFontPadding: false,
  },
});