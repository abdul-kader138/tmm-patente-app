import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ListRenderItem,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type TabKey = 'mistakes' | 'saved' | 'notes';
type SignKind = 'stop' | 'no-entry' | 'quiz';

interface ReviewItem {
  id: string;
  chapter: number;
  /** Shown in the card tag, e.g. "CH. 5 · RIGHT OF WAY" */
  chapterTitle: string;
  /** Filter chip this item belongs to */
  category: string;
  textIt: string;
  sign: SignKind;
  /** Mistakes only */
  wrongCount?: number;
  /** Epoch ms of last wrong answer / save / edit */
  lastActivityAt: number;
}

interface ReviewData {
  /**
   * Totals come from the API so the lists can be paginated
   * (the tab labels / banner must not depend on how many rows are loaded).
   */
  totals: Record<TabKey, number>;
  items: Record<TabKey, ReviewItem[]>;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => Date.now() - n * DAY_MS;

const MASTERY_STREAK = 3; // correct answers needed to clear a mistake
const ALL_CHAPTERS = 'All chapters';
const CHAPTER_FILTERS = [ALL_CHAPTERS, 'Right of way', 'Overtaking', 'Signs'] as const;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'mistakes', label: 'Mistakes' },
  { key: 'saved', label: 'Saved' },
  { key: 'notes', label: 'Notes' },
];

/** TODO: replace with the real review store / API response. */
const MOCK_REVIEW: ReviewData = {
  totals: { mistakes: 34, saved: 52, notes: 9 },
  items: {
    mistakes: [
      {
        id: 'm1',
        chapter: 5,
        chapterTitle: 'Right of way',
        category: 'Right of way',
        textIt: 'Il segnale obbliga a fermarsi solo se arrivano veicoli',
        sign: 'stop',
        wrongCount: 3,
        lastActivityAt: daysAgo(2),
      },
      {
        id: 'm2',
        chapter: 12,
        chapterTitle: 'Overtaking',
        category: 'Overtaking',
        textIt: 'È consentito sorpassare a destra chi svolta a sinistra',
        sign: 'quiz',
        wrongCount: 2,
        lastActivityAt: daysAgo(1),
      },
      {
        id: 'm3',
        chapter: 3,
        chapterTitle: 'Prohibition',
        category: 'Signs',
        textIt: "Il segnale vieta l'accesso ai soli autocarri",
        sign: 'no-entry',
        wrongCount: 1,
        lastActivityAt: daysAgo(0),
      },
    ],
    saved: [
      {
        id: 's1',
        chapter: 5,
        chapterTitle: 'Right of way',
        category: 'Right of way',
        textIt: 'Ai passaggi a livello bisogna sempre fermarsi',
        sign: 'stop',
        lastActivityAt: daysAgo(4),
      },
    ],
    notes: [
      {
        id: 'n1',
        chapter: 12,
        chapterTitle: 'Overtaking',
        category: 'Overtaking',
        textIt: 'Il sorpasso è vietato in prossimità delle curve',
        sign: 'quiz',
        lastActivityAt: daysAgo(6),
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Design tokens that are not in the theme yet                         */
/* ------------------------------------------------------------------ */

const TOKENS = {
  // Sampled from the mockup (top-left → centre → bottom-right of the banner)
  bannerGradient: ['#1D3ED5', '#2E5CFF', '#5C7CFF'],
  startText: '#14267A', // "Start" label on the white button
  signRed: '#DC2626',
};

const SOFT_SHADOW = {
  shadowColor: '#1B2A4E',
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const startOfDay = (ts: number) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const formatRelativeDay = (ts: number): string => {
  const days = Math.max(0, Math.round((startOfDay(Date.now()) - startOfDay(ts)) / DAY_MS));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/* ------------------------------------------------------------------ */
/* Sign icons (real SVG, no raster assets)                             */
/* ------------------------------------------------------------------ */

const octagonPoints = (size: number, inset: number) => {
  const s = size - inset * 2;
  const k = s * 0.2929;
  return [
    [inset + k, inset],
    [inset + s - k, inset],
    [inset + s, inset + k],
    [inset + s, inset + s - k],
    [inset + s - k, inset + s],
    [inset + k, inset + s],
    [inset, inset + s - k],
    [inset, inset + k],
  ]
    .map((p) => p.join(','))
    .join(' ');
};

const StopSign = memo(({ size = 32 }: { size?: number }) => (
  <Svg width={size} height={size}>
    <Polygon points={octagonPoints(size, 0)} fill={TOKENS.signRed} />
    <Polygon points={octagonPoints(size, 2)} fill="none" stroke="#FFFFFF" strokeWidth={1} />
    <SvgText
      x={size / 2}
      y={size / 2 + 3}
      fontSize={8.5}
      fontWeight="800"
      fill="#FFFFFF"
      textAnchor="middle"
    >
      STOP
    </SvgText>
  </Svg>
));

const NoEntrySign = memo(({ size = 34 }: { size?: number }) => (
  <Svg width={size} height={size}>
    <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={TOKENS.signRed} />
    <Rect
      x={size * 0.18}
      y={size / 2 - 3.5}
      width={size * 0.64}
      height={7}
      rx={3.5}
      fill="#FFFFFF"
    />
  </Svg>
));

const SignIcon = memo(({ kind }: { kind: SignKind }) => {
  const { colors } = useTheme();
  switch (kind) {
    case 'stop':
      return <StopSign />;
    case 'no-entry':
      return <NoEntrySign />;
    default:
      return <Ionicons name="checkbox-outline" size={26} color={colors.textPrimary} />;
  }
});

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

interface SegmentedTabsProps {
  active: TabKey;
  totals: Record<TabKey, number>;
  onChange: (tab: TabKey) => void;
}

const SegmentedTabs = memo(({ active, totals, onChange }: SegmentedTabsProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.segmented, { backgroundColor: colors.chipBackground }]}
      accessibilityRole="tablist"
    >
      {TABS.map(({ key, label }) => {
        const selected = key === active;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.segment,
              selected && [{ backgroundColor: colors.card }, SOFT_SHADOW],
            ]}
            onPress={() => onChange(key)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${label}, ${totals[key]}`}
          >
            <Text
              style={[styles.segmentText, { color: selected ? colors.textPrimary : colors.textMuted }]}
            >
              {label} {totals[key]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

interface BannerProps {
  count: number;
  onStart: () => void;
}

const ClearBanner = memo(({ count, onStart }: BannerProps) => {
  // react-native-svg percentage sizing is unreliable inside absoluteFill on Android
  // (the gradient rendered smaller than the banner), so use measured pixel sizes.
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
  }, []);

  return (
    <View style={styles.banner} onLayout={onLayout}>
      {size.w > 0 && (
        <Svg
          style={StyleSheet.absoluteFill}
          width={size.w}
          height={size.h}
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id="reviewBannerGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={TOKENS.bannerGradient[0]} />
              <Stop offset="0.5" stopColor={TOKENS.bannerGradient[1]} />
              <Stop offset="1" stopColor={TOKENS.bannerGradient[2]} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={size.w} height={size.h} fill="url(#reviewBannerGradient)" />
        </Svg>
      )}

      <View style={styles.bannerTextCol}>
        <Text style={styles.bannerTitle}>
          {count} {plural(count, 'mistake', 'mistakes')} to clear
        </Text>
        <Text style={styles.bannerSub}>
          Smart review brings each one back until you get it right {MASTERY_STREAK} times.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={onStart}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Start smart review"
      >
        <Text style={styles.startBtnText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
});

interface ChapterChipsProps {
  active: string;
  onChange: (chapter: string) => void;
}

const ChapterChips = memo(({ active, onChange }: ChapterChipsProps) => {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipsScroll}
      contentContainerStyle={styles.chipsContent}
    >
      {CHAPTER_FILTERS.map((chapter) => {
        const selected = chapter === active;
        return (
          <TouchableOpacity
            key={chapter}
            style={[
              styles.chip,
              selected
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => onChange(chapter)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : colors.textPrimary }]}>
              {chapter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

interface ReviewCardProps {
  item: ReviewItem;
  tab: TabKey;
  onPress: (item: ReviewItem) => void;
}

const ReviewCard = memo(({ item, tab, onPress }: ReviewCardProps) => {
  const { colors } = useTheme();

  const badge = useMemo(() => {
    if (tab === 'mistakes') {
      return {
        label: `Wrong ${item.wrongCount ?? 1}×`,
        bg: colors.errorLight,
        fg: colors.error,
      };
    }
    return {
      label: tab === 'saved' ? 'Saved' : 'Note',
      bg: colors.primaryLight,
      fg: colors.primary,
    };
  }, [tab, item.wrongCount, colors]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${item.textIt}. ${badge.label}. ${formatRelativeDay(item.lastActivityAt)}`}
    >
      <View style={[styles.signTile, { backgroundColor: colors.chipBackground }]}>
        <SignIcon kind={item.sign} />
      </View>

      <View style={styles.cardTextCol}>
        <Text style={[styles.cardTag, { color: colors.textMuted }]} numberOfLines={1}>
          CH. {item.chapter} · {item.chapterTitle.toUpperCase()}
        </Text>
        <Text style={[styles.cardQuestion, { color: colors.textPrimary }]}>{item.textIt}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
          </View>
          <Text style={[styles.metaTime, { color: colors.textMuted }]}>
            {formatRelativeDay(item.lastActivityAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const ReviewScreen: React.FC = () => {
  const { colors } = useTheme();

  // TODO: replace MOCK_REVIEW with the real data source.
  const data = MOCK_REVIEW;

  const [tab, setTab] = useState<TabKey>('mistakes');
  const [chapter, setChapter] = useState<string>(ALL_CHAPTERS);

  const visibleItems = useMemo(
    () =>
      data.items[tab].filter((it) => chapter === ALL_CHAPTERS || it.category === chapter),
    [data, tab, chapter],
  );

  const handleStart = useCallback(() => {
    // TODO: navigate to the smart-review session (route name not in the shared code).
  }, []);

  const handleOpenItem = useCallback((_item: ReviewItem) => {
    // TODO: open the question detail for this item.
  }, []);

  const renderItem: ListRenderItem<ReviewItem> = useCallback(
    ({ item }) => <ReviewCard item={item} tab={tab} onPress={handleOpenItem} />,
    [tab, handleOpenItem],
  );

  const ListHeader = (
    <View>
      {tab === 'mistakes' && data.totals.mistakes > 0 ? (
        <View style={styles.bannerWrap}>
          <ClearBanner count={data.totals.mistakes} onStart={handleStart} />
        </View>
      ) : null}
      <ChapterChips active={chapter} onChange={setChapter} />
    </View>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Nothing here yet</Text>
      <Text style={[styles.emptySub, { color: colors.textMuted }]}>
        {chapter === ALL_CHAPTERS
          ? 'Items will show up here as you practice.'
          : 'No items in this chapter.'}
      </Text>
    </View>
  );

  return (
    // Bottom edge is owned by the tab bar.
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]} accessibilityRole="header">
          My review
        </Text>
        <SegmentedTabs active={tab} totals={data.totals} onChange={setTab} />
      </View>

      <FlatList
        data={visibleItems}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const Separator = () => <View style={styles.separator} />;

export default ReviewScreen;

/* ------------------------------------------------------------------ */
/* Styles (measured from the 2x mockup: px / 2 = pt)                   */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Title + tabs
  header: { paddingHorizontal: 20, paddingTop: 3 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.5, marginBottom: 12 },

  segmented: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
  },
  segment: {
    flex: 1,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: { fontSize: 15, lineHeight: 20, fontWeight: '600' },

  // List
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  separator: { height: 9 },

  // Banner
  bannerWrap: { marginBottom: 12 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 16,
  },
  bannerTextCol: { flex: 1 },
  bannerTitle: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: '#FFFFFF' },
  bannerSub: {
    fontSize: 13,
    lineHeight: 17,
    marginTop: 2,
    color: 'rgba(255,255,255,0.82)',
  },
  startBtn: {
    height: 35,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  startBtnText: { fontSize: 16, fontWeight: '700', color: TOKENS.startText },

  // Chips
  chipsScroll: { marginHorizontal: -20, flexGrow: 0, marginBottom: 12 },
  chipsContent: { paddingHorizontal: 20, gap: 8 },
  chip: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, lineHeight: 16, fontWeight: '600' },

  // Card
  card: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  signTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: { flex: 1 },
  cardTag: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.6, marginBottom: 2 },
  cardQuestion: { fontSize: 15, lineHeight: 18, fontWeight: '600', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    height: 21,
    paddingHorizontal: 9,
    borderRadius: 11,
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
  metaTime: { fontSize: 13, lineHeight: 16 },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13, lineHeight: 18 },
});