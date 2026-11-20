import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polygon, Rect, Circle } from 'react-native-svg';
import {
  Search,
  Mic,
  Volume2,
  Bookmark,
  X,
  BookOpen,
  ShieldCheck,
  XCircle,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { getHeaderTopInset } from '../../utils/safeArea';
import { WordSheetModal } from '../quiz/WordSheetModal';

/* -------------------------------------------------------------------------- */
/*  Design tokens (aligned with LessonPlayerScreen)                           */
/* -------------------------------------------------------------------------- */

const HORIZONTAL_MARGIN = 20;
const MAX_CONTENT_WIDTH = 420;

const palette = (isDark: boolean) => ({
  bg: isDark ? '#0A0E18' : '#F5F7FB',
  textPrimary: isDark ? '#FFFFFF' : '#101828',
  textSecondary: isDark ? '#CBD5E1' : '#475467',
  textMuted: isDark ? '#8E95A5' : '#8A94A6',
  card: isDark ? '#141A29' : '#FFFFFF',
  cardBorder: isDark ? '#222A3E' : '#EDF0F6',
  thumbBg: isDark ? '#1B2336' : '#F0F3F8',
  accent: isDark ? '#5B7CFF' : '#2D5BFF',
  accentSolid: '#2D5BFF',
  accentSoft: isDark ? 'rgba(45, 91, 255, 0.18)' : '#EBF0FF',
  chipNeutralBg: isDark ? '#1D2538' : '#F2F4F7',
  success: isDark ? '#34D399' : '#12804A',
  error: isDark ? '#F87171' : '#D92D20',
  shadow: isDark ? '#000000' : '#1E2A4A',
});

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type ThumbnailType =
  | 'car'
  | 'parking'
  | 'carriageway'
  | 'level-crossing'
  | 'always-false'
  | 'always-true';

interface DictionaryWord {
  id: number;
  wordItalian: string;
  wordEnglish: string;
  totalQuizzes: number;
  trueCount: number;
  falseCount: number;
  thumbnailType: ThumbnailType;
  isAlwaysTrue?: boolean;
  isAlwaysFalse?: boolean;
}

const DICTIONARY_WORDS: DictionaryWord[] = [
  {
    id: 1,
    wordItalian: 'SEDILE DEL CONDUCENTE',
    wordEnglish: "Driver's seat",
    totalQuizzes: 12,
    trueCount: 9,
    falseCount: 3,
    thumbnailType: 'car',
  },
  {
    id: 2,
    wordItalian: 'SOSTA',
    wordEnglish: 'Stopping / parking',
    totalQuizzes: 48,
    trueCount: 30,
    falseCount: 18,
    thumbnailType: 'parking',
  },
  {
    id: 3,
    wordItalian: 'CARREGGIATA',
    wordEnglish: 'Carriageway',
    totalQuizzes: 96,
    trueCount: 61,
    falseCount: 35,
    thumbnailType: 'carriageway',
  },
  {
    id: 4,
    wordItalian: 'PASSAGGIO A LIVELLO',
    wordEnglish: 'Level crossing',
    totalQuizzes: 37,
    trueCount: 22,
    falseCount: 15,
    thumbnailType: 'level-crossing',
  },
  {
    id: 5,
    wordItalian: 'IMPASTICCIARE',
    wordEnglish: 'To tamper / mess up',
    totalQuizzes: 8,
    trueCount: 0,
    falseCount: 8,
    thumbnailType: 'always-false',
    isAlwaysFalse: true,
  },
  {
    id: 6,
    wordItalian: 'PRUDENZA',
    wordEnglish: 'Caution / Prudence',
    totalQuizzes: 54,
    trueCount: 54,
    falseCount: 0,
    thumbnailType: 'always-true',
    isAlwaysTrue: true,
  },
];

type TabKey = 'All' | 'Saved' | 'Always true' | 'Always false';
const TABS: TabKey[] = ['All', 'Saved', 'Always true', 'Always false'];

/* -------------------------------------------------------------------------- */
/*  Pure Vector Thumbnails (matching mockup & LessonPlayerScreen)             */
/* -------------------------------------------------------------------------- */

const CarGraphic: React.FC = () => (
  <Svg width={34} height={28} viewBox="0 0 36 28">
    <Path
      d="M7 13L10.2 6.5C10.8 5.3 12 4.5 13.4 4.5H22.6C24 4.5 25.2 5.3 25.8 6.5L29 13"
      stroke="#344054"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Rect
      x={4}
      y={12.5}
      width={28}
      height={9}
      rx={3}
      stroke="#344054"
      strokeWidth={2.4}
      fill="none"
    />
    <Circle cx={10.5} cy={17} r={1.8} fill="#344054" />
    <Circle cx={25.5} cy={17} r={1.8} fill="#344054" />
    <Rect x={7} y={21.5} width={4.5} height={3.5} rx={1.2} fill="#344054" />
    <Rect x={24.5} y={21.5} width={4.5} height={3.5} rx={1.2} fill="#344054" />
  </Svg>
);

const LevelCrossingSign: React.FC<{ width?: number; height?: number }> = ({
  width = 52,
  height = 45.5,
}) => (
  <Svg width={width} height={height} viewBox="0 0 200 175">
    <Polygon
      points="100,4 196,172 4,172"
      fill="#D82D20"
      stroke="#D82D20"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Polygon points="100,43 163,152 37,152" fill="#FFFFFF" />
    <Rect x={58} y={105} width={84} height={9} fill="#111827" />
    <Rect x={58} y={128} width={84} height={9} fill="#111827" />
    <Rect x={62} y={94} width={7} height={49} fill="#111827" />
    <Rect x={80.25} y={94} width={7} height={49} fill="#111827" />
    <Rect x={98.5} y={94} width={7} height={49} fill="#111827" />
    <Rect x={116.75} y={94} width={7} height={49} fill="#111827" />
    <Rect x={135} y={94} width={7} height={49} fill="#111827" />
  </Svg>
);

const WordThumbnail: React.FC<{ type: ThumbnailType; bg: string }> = ({
  type,
  bg,
}) => {
  switch (type) {
    case 'car':
      return (
        <View style={[styles.thumbBox, { backgroundColor: bg }]}>
          <CarGraphic />
        </View>
      );

    case 'parking':
      return (
        <View style={[styles.thumbBox, { backgroundColor: bg }]}>
          <View style={styles.parkingSign}>
            <Text style={styles.parkingLetter}>P</Text>
          </View>
        </View>
      );

    case 'carriageway':
      return (
        <View style={styles.carriagewayBox}>
          <View style={styles.roadShoulder} />
          <View style={styles.roadLane} />
          <View style={styles.roadCenterLine} />
          <View style={styles.roadLane} />
          <View style={styles.roadShoulder} />
        </View>
      );

    case 'level-crossing':
      return (
        <View style={[styles.thumbBox, { backgroundColor: bg }]}>
          <LevelCrossingSign width={52} height={45.5} />
        </View>
      );

    case 'always-false':
      return (
        <View style={[styles.thumbBox, { backgroundColor: '#FEF2F2' }]}>
          <XCircle size={30} color="#D92D20" strokeWidth={2.2} />
        </View>
      );

    case 'always-true':
      return (
        <View style={[styles.thumbBox, { backgroundColor: '#ECFDF3' }]}>
          <ShieldCheck size={30} color="#12804A" strokeWidth={2.2} />
        </View>
      );
  }
};

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export const DictionaryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);

  const colors = useMemo(() => palette(isDark), [isDark]);

  // Same safe-area utility & content width constraint as LessonPlayerScreen
  const topInset = getHeaderTopInset(insets, 12);
  const contentWidth = Math.min(width - HORIZONTAL_MARGIN * 2, MAX_CONTENT_WIDTH);

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSpeak = (word: string) => {
    // Speech.speak(word, { language: 'it-IT' });
    console.log('Pronounce:', word);
  };

  const filteredWords = useMemo(() => {
    return DICTIONARY_WORDS.filter((item) => {
      if (activeTab === 'Saved' && !savedIds.includes(item.id)) return false;
      if (activeTab === 'Always true' && !item.isAlwaysTrue) return false;
      if (activeTab === 'Always false' && !item.isAlwaysFalse) return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          item.wordItalian.toLowerCase().includes(q) ||
          item.wordEnglish.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, savedIds, search]);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.bg, paddingTop: topInset },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Centered Content Container */}
      <View style={styles.centerWrap}>
        <View style={{ width: contentWidth }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Dictionary
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              1,900 exam words with pictures
            </Text>
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Search size={19} color={colors.textMuted} strokeWidth={2.2} />
            <TextInput
              placeholder="Search Italian or English..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <X size={17} color={colors.textMuted} strokeWidth={2.2} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.micButton, { backgroundColor: colors.accentSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Voice search"
            >
              <Mic size={17} color={colors.accent} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Category Pills */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TABS}
            keyExtractor={(item) => item}
            style={styles.tabsList}
            contentContainerStyle={styles.tabsContent}
            renderItem={({ item }) => {
              const isSelected = activeTab === item;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.tabChip,
                    isSelected
                      ? {
                          backgroundColor: colors.accentSolid,
                          borderColor: colors.accentSolid,
                        }
                      : {
                          backgroundColor: colors.card,
                          borderColor: colors.cardBorder,
                        },
                  ]}
                  onPress={() => setActiveTab(item)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.tabChipText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      },
                    ]}
                  >
                    {item === 'All' ? 'Dictionary' : item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/* Dictionary Words List */}
      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 32 + insets.bottom },
        ]}
        ListEmptyComponent={
          <View style={[styles.emptyState, { width: contentWidth }]}>
            <BookOpen size={34} color={colors.textMuted} strokeWidth={1.8} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No words found
            </Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              {activeTab === 'Saved'
                ? 'Tap the bookmark icon on any word to save it here.'
                : 'Try a different Italian or English search term.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSaved = savedIds.includes(item.id);

          return (
            <TouchableOpacity
              style={[
                styles.wordCard,
                {
                  width: contentWidth,
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() => {
                setSelectedWord(item);
                setModalVisible(true);
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`${item.wordItalian}, ${item.wordEnglish}`}
            >
              {/* Left Thumbnail */}
              <WordThumbnail type={item.thumbnailType} bg={colors.thumbBg} />

              {/* Center Details */}
              <View style={styles.wordBody}>
                <Text
                  style={[styles.wordItalian, { color: colors.textPrimary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.84}
                >
                  {item.wordItalian}
                </Text>

                <Text
                  style={[styles.wordEnglish, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.wordEnglish}
                </Text>

                <View style={styles.statsRow}>
                  <Text style={[styles.quizCountText, { color: colors.textMuted }]}>
                    In {item.totalQuizzes} quizzes
                  </Text>
                  <Text style={[styles.trueCountText, { color: colors.success }]}>
                    {item.trueCount} true
                  </Text>
                  <Text style={[styles.falseCountText, { color: colors.error }]}>
                    {item.falseCount} false
                  </Text>
                </View>
              </View>

              {/* Right Action Stack */}
              <View style={styles.cardActionsRight}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleSpeak(item.wordItalian)}
                  style={[styles.actionBtn, { backgroundColor: colors.accentSoft }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Pronounce ${item.wordItalian}`}
                >
                  <Volume2 size={17} color={colors.accent} strokeWidth={2.2} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => toggleSave(item.id)}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isSaved
                        ? colors.accentSoft
                        : colors.chipNeutralBg,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSaved }}
                  accessibilityLabel={isSaved ? 'Remove bookmark' : 'Save word'}
                >
                  <Bookmark
                    size={16}
                    color={isSaved ? colors.accent : colors.textSecondary}
                    fill={isSaved ? colors.accent : 'none'}
                    strokeWidth={2.2}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Word Sheet Modal */}
      <WordSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        word={selectedWord?.wordItalian}
        translation={selectedWord?.wordEnglish}
      />
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerWrap: {
    alignItems: 'center',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 2,
  },

  /* Search */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 6,
    gap: 10,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 0,
  },
  micButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Category Pills */
  tabsList: {
    marginBottom: 14,
  },
  tabsContent: {
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },

  /* List & Cards */
  listContent: {
    alignItems: 'center',
    gap: 12,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  /* 64x64 Thumbnails (proportional to 14/13/11 typography) */
  thumbBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  parkingSign: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkingLetter: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    includeFontPadding: false,
  },
  carriagewayBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#464B53',
  },
  roadShoulder: {
    width: 6,
    height: '100%',
    backgroundColor: '#8E95A0',
  },
  roadLane: {
    flex: 1,
    backgroundColor: '#464B53',
  },
  roadCenterLine: {
    width: 3,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },

  /* Card Body */
  wordBody: {
    flex: 1,
    justifyContent: 'center',
  },
  wordItalian: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    letterSpacing: 0.1,
    marginBottom: 2,
  },
  wordEnglish: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '400',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },
  quizCountText: {
    fontSize: 11,
    fontWeight: '400',
  },
  trueCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  falseCountText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Right Action Stack */
  cardActionsRight: {
    justifyContent: 'space-between',
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Empty State */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});