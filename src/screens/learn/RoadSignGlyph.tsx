import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** The mockup has no back arrow. Flip to true if you need a visible one. */
const SHOW_BACK_BUTTON = false;

/* -------------------------------------------------------------------------- */
/* Road-sign pictograms (plain Views; dp measured from the 2x / 780px mockup)  */
/* -------------------------------------------------------------------------- */

export type RoadSignGlyphType =
  | 'levelCrossing'
  | 'giveWay'
  | 'stop'
  | 'noEntry'
  | 'speedLimit50'
  | 'goStraight';

const RED = '#D92B1E';
const BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';
const BLACK = '#111111';

const ROUND_SIZE = 56;
const TRI_W = 58;
const TRI_H = 51;
const TRI_BORDER = 6;
const STOP_SIZE = 53;

interface TriangleProps {
  direction: 'up' | 'down';
  children?: React.ReactNode;
}

const Triangle: React.FC<TriangleProps> = ({ direction, children }) => {
  const w = TRI_W;
  const h = TRI_H;
  const half = w / 2;

  const leg = Math.sqrt(half * half + h * h);
  const inradius = (w * h) / (w + 2 * leg);
  const k = (inradius - TRI_BORDER) / inradius;
  const innerW = w * k;
  const innerH = h * k;
  const innerLeft = (w - innerW) / 2;
  const innerTop =
    direction === 'down'
      ? inradius - k * inradius
      : h - inradius + k * inradius - innerH;

  const build = (tw: number, th: number, color: string) =>
    direction === 'down'
      ? {
          width: 0,
          height: 0,
          borderLeftWidth: tw / 2,
          borderRightWidth: tw / 2,
          borderTopWidth: th,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        }
      : {
          width: 0,
          height: 0,
          borderLeftWidth: tw / 2,
          borderRightWidth: tw / 2,
          borderBottomWidth: th,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        };

  return (
    <View style={{ width: w, height: h }}>
      <View style={[styles.abs, build(w, h, RED)]} />
      <View style={[styles.abs, { left: innerLeft, top: innerTop }, build(innerW, innerH, WHITE)]} />
      {children}
    </View>
  );
};

/** Octagon = upright square ∩ same square rotated 45° (clipped by the container). */
const Octagon: React.FC<{ size: number; color: string; children?: React.ReactNode }> = ({
  size,
  color,
  children,
}) => (
  <View style={[styles.center, { width: size, height: size, overflow: 'hidden' }]}>
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        transform: [{ rotate: '45deg' }],
      }}
    />
    <View style={[styles.abs, styles.center, { width: size, height: size }]}>{children}</View>
  </View>
);

const BARRIER_W = 25;
const BARRIER_H = 13;
const BARRIER_POSTS = 7;

const LevelCrossing = () => (
  <Triangle direction="up">
    <View
      style={[
        styles.abs,
        { width: BARRIER_W, height: BARRIER_H, left: (TRI_W - BARRIER_W) / 2, top: 27.5 },
      ]}
    >
      <View style={[styles.barrierRail, { top: 0, height: 2.5 }]} />
      <View style={[styles.barrierRail, { top: 5.5, height: 2 }]} />
      {Array.from({ length: BARRIER_POSTS }).map((_, i) => (
        <View
          key={i}
          style={[styles.barrierPost, { left: (i * (BARRIER_W - 2)) / (BARRIER_POSTS - 1) }]}
        />
      ))}
    </View>
  </Triangle>
);

const GiveWay = () => <Triangle direction="down" />;

const Stop = () => (
  <Octagon size={STOP_SIZE} color={WHITE}>
    <Octagon size={STOP_SIZE - 4} color={RED}>
      <Text style={styles.stopText} allowFontScaling={false}>
        STOP
      </Text>
    </Octagon>
  </Octagon>
);

const NoEntry = () => (
  <View style={[styles.circle, { backgroundColor: RED }]}>
    <View style={styles.noEntryBar} />
  </View>
);

const SpeedLimit: React.FC<{ value: number }> = ({ value }) => (
  <View style={[styles.circle, { backgroundColor: RED }]}>
    <View style={styles.speedInner}>
      <Text style={styles.speedText} allowFontScaling={false}>
        {value}
      </Text>
    </View>
  </View>
);

const ARROW_W = 28;
const ARROW_H = 33;
const ARROW_STROKE = 3.2;
const ARROW_ARM = 20;

const GoStraight = () => (
  <View style={[styles.circle, { backgroundColor: BLUE }]}>
    <View style={{ width: ARROW_W, height: ARROW_H }}>
      <View
        style={{
          position: 'absolute',
          left: (ARROW_W - ARROW_STROKE) / 2,
          top: 0,
          width: ARROW_STROKE,
          height: ARROW_H,
          borderRadius: ARROW_STROKE / 2,
          backgroundColor: WHITE,
        }}
      />
      <View
        style={[
          styles.arrowArm,
          { left: ARROW_W / 4 - ARROW_ARM / 2, transform: [{ rotate: '-45deg' }] },
        ]}
      />
      <View
        style={[
          styles.arrowArm,
          { left: (ARROW_W * 3) / 4 - ARROW_ARM / 2, transform: [{ rotate: '45deg' }] },
        ]}
      />
    </View>
  </View>
);

export const RoadSignGlyph: React.FC<{ type: RoadSignGlyphType }> = ({ type }) => {
  switch (type) {
    case 'levelCrossing':
      return <LevelCrossing />;
    case 'giveWay':
      return <GiveWay />;
    case 'stop':
      return <Stop />;
    case 'noEntry':
      return <NoEntry />;
    case 'speedLimit50':
      return <SpeedLimit value={50} />;
    case 'goStraight':
      return <GoStraight />;
    default:
      return null;
  }
};

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

interface RoadSignItem {
  id: number;
  name: string;
  category: string;
  masteryPercent: number;
  glyph: RoadSignGlyphType;
}

const ROAD_SIGNS: RoadSignItem[] = [
  { id: 1, name: 'Level crossing with barriers', category: 'Danger', masteryPercent: 96, glyph: 'levelCrossing' },
  { id: 2, name: 'Give way', category: 'Right of way', masteryPercent: 100, glyph: 'giveWay' },
  { id: 3, name: 'Stop', category: 'Right of way', masteryPercent: 90, glyph: 'stop' },
  { id: 4, name: 'No entry', category: 'Prohibition', masteryPercent: 82, glyph: 'noEntry' },
  { id: 5, name: 'Speed limit 50', category: 'Prohibition', masteryPercent: 75, glyph: 'speedLimit50' },
  { id: 6, name: 'Go straight only', category: 'Mandatory', masteryPercent: 60, glyph: 'goStraight' },
];

const CATEGORIES = ['All', 'Danger', 'Prohibition', 'Mandatory', 'Info'];
const MASTERY_GOOD_THRESHOLD = 90;
const MASTERY_WARNING_COLOR = '#F59E0B';

export const RoadSignsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  }, [navigation]);

  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, [handleBack]);

  const filteredSigns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ROAD_SIGNS.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        q === '' || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          {SHOW_BACK_BUTTON && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.textPrimary }]}>Road signs</Text>
        </View>
        <TouchableOpacity style={[styles.offlineBtn, { backgroundColor: colors.successLight }]}>
          <Ionicons name="download" size={14} color={colors.success} />
          <Text style={[styles.offlineBtnText, { color: colors.success }]}>Offline</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Search 400+ road signs"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          <TouchableOpacity style={[styles.filterBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="warning-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.textPrimary : colors.card,
                    borderColor: isSelected ? colors.textPrimary : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? colors.background : colors.textPrimary },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 2-Column Signs Grid */}
      <FlatList
        data={filteredSigns}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No signs found</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.signCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('QuizQuestion', { topicId: item.id, mode: 'practice' })}
            activeOpacity={0.7}
          >
            <View style={[styles.visualFrame, { backgroundColor: colors.cardHighlight }]}>
              <RoadSignGlyph type={item.glyph} />
            </View>

            <View style={styles.signInfo}>
              <Text style={[styles.signName, { color: colors.textPrimary }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.signMetaRow}>
                <Text style={[styles.categoryName, { color: colors.textMuted }]}>
                  {item.category}
                </Text>
                <View style={styles.masteryPill}>
                  <View
                    style={[
                      styles.masteryDot,
                      {
                        backgroundColor:
                          item.masteryPercent >= MASTERY_GOOD_THRESHOLD
                            ? colors.success
                            : MASTERY_WARNING_COLOR,
                      },
                    ]}
                  />
                  <Text style={[styles.masteryText, { color: colors.textPrimary }]}>
                    {item.masteryPercent}%
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default RoadSignsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  backButton: { marginLeft: -6, marginRight: 4, padding: 6 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.5 },
  offlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 23,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  offlineBtnText: { fontSize: 11, fontWeight: '700' },

  /* Search */
  searchSection: { paddingHorizontal: 20, marginBottom: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 13,
    paddingRight: 7,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  filterBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Chips */
  categoriesRow: { marginBottom: 15 },
  categoriesContent: { paddingHorizontal: 20, gap: 8 },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 13, lineHeight: 15, fontWeight: '600' },

  /* Grid */
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  columnWrapper: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  emptyText: { textAlign: 'center', fontSize: 14, paddingTop: 40 },
  signCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 9,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  visualFrame: {
    height: 75,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  signInfo: { gap: 8 },
  signName: { fontSize: 13, lineHeight: 17, fontWeight: '600' },
  signMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 14,
  },
  categoryName: { fontSize: 11 },
  masteryPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  masteryDot: { width: 6, height: 6, borderRadius: 3 },
  masteryText: { fontSize: 12, fontWeight: '600' },

  /* Glyph helpers */
  abs: { position: 'absolute' },
  center: { alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: ROUND_SIZE,
    height: ROUND_SIZE,
    borderRadius: ROUND_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barrierRail: { position: 'absolute', left: 0, right: 0, backgroundColor: BLACK },
  barrierPost: { position: 'absolute', top: 0, width: 2, height: BARRIER_H, backgroundColor: BLACK },
  stopText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  noEntryBar: { width: 36.5, height: 11, borderRadius: 4, backgroundColor: WHITE },
  speedInner: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: { color: BLACK, fontSize: 21, fontWeight: '800', includeFontPadding: false },
  arrowArm: {
    position: 'absolute',
    top: ARROW_W / 4 - ARROW_STROKE / 2,
    width: ARROW_ARM,
    height: ARROW_STROKE,
    borderRadius: ARROW_STROKE / 2,
    backgroundColor: WHITE,
  },
});