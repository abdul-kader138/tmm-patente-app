import React, { useState, useCallback } from 'react';
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

/**
 * Road-sign pictograms drawn with plain React Native Views.
 * No images, no cropped screenshots and no extra packages.
 * Sizes are in dp and were measured from the 780px-wide (2x) mockup.
 */

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

/* -------------------------------------------------------------------------- */
/* Triangle (red frame + white fill), built with the CSS border technique      */
/* -------------------------------------------------------------------------- */

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
      {children && (
        <View
          style={[
            styles.abs,
            styles.center,
            { left: innerLeft, top: innerTop, width: innerW, height: innerH },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* Individual Sign Glyphs                                                      */
/* -------------------------------------------------------------------------- */

const BARRIER_W = 28;
const BARRIER_H = 16;
const POST_DIST = (BARRIER_W - 2) / 4;

const LevelCrossing = () => (
  <Triangle direction="up">
    <View style={{ width: BARRIER_W, height: BARRIER_H, marginTop: 7 }}>
      <View style={[styles.barrierRail, { top: 3.5, height: 2.2 }]} />
      <View style={[styles.barrierRail, { bottom: 3.5, height: 2.2 }]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={[styles.barrierPost, { left: i * POST_DIST }]} />
      ))}
    </View>
  </Triangle>
);

const GiveWay = () => <Triangle direction="down" />;

const Stop = () => (
  <View style={[styles.circle, { backgroundColor: RED, width: STOP_SIZE, height: STOP_SIZE }]}>
    <Text style={styles.stopText}>STOP</Text>
  </View>
);

const NoEntry = () => (
  <View style={[styles.circle, { backgroundColor: RED }]}>
    <View style={styles.noEntryBar} />
  </View>
);

const SpeedLimit: React.FC<{ value: number }> = ({ value }) => (
  <View style={[styles.circle, { backgroundColor: RED }]}>
    <View style={styles.speedInner}>
      <Text style={styles.speedText}>{value}</Text>
    </View>
  </View>
);

const ARROW_W = 22;
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

/* -------------------------------------------------------------------------- */
/* Public RoadSignGlyph component                                              */
/* -------------------------------------------------------------------------- */

export interface RoadSignGlyphProps {
  type: RoadSignGlyphType;
}

export const RoadSignGlyph: React.FC<RoadSignGlyphProps> = ({ type }) => {
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
/* RoadSignsScreen                                                            */
/* -------------------------------------------------------------------------- */

interface RoadSignItem {
  id: number;
  name: string;
  category: string;
  masteryPercent: number;
  glyph: RoadSignGlyphType;
}

const ROAD_SIGNS: RoadSignItem[] = [
  {
    id: 1,
    name: 'Level crossing with barriers',
    category: 'Danger',
    masteryPercent: 96,
    glyph: 'levelCrossing',
  },
  {
    id: 2,
    name: 'Give way',
    category: 'Right of way',
    masteryPercent: 100,
    glyph: 'giveWay',
  },
  {
    id: 3,
    name: 'Stop',
    category: 'Right of way',
    masteryPercent: 90,
    glyph: 'stop',
  },
  {
    id: 4,
    name: 'No entry',
    category: 'Prohibition',
    masteryPercent: 82,
    glyph: 'noEntry',
  },
  {
    id: 5,
    name: 'Speed limit 50',
    category: 'Prohibition',
    masteryPercent: 75,
    glyph: 'speedLimit50',
  },
  {
    id: 6,
    name: 'Go straight only',
    category: 'Mandatory',
    masteryPercent: 60,
    glyph: 'goStraight',
  },
];

export const RoadSignsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Danger', 'Prohibition', 'Mandatory', 'Info'];

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

  const filteredSigns = ROAD_SIGNS.filter((item) => {
    const matchCat =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      search.trim() === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Road signs</Text>
        <TouchableOpacity style={[styles.offlineBtn, { backgroundColor: colors.successLight }]}>
          <Ionicons name="download" size={14} color={colors.success} />
          <Text style={[styles.offlineBtnText, { color: colors.success }]}>Offline</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search 400+ road signs..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          <TouchableOpacity style={[styles.filterBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="warning-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.signCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('QuizQuestion', { topicId: item.id, mode: 'practice' })}
            activeOpacity={0.7}
          >
            {/* Visual Frame with pure vector pictogram */}
            <View style={[styles.visualFrame, { backgroundColor: colors.cardHighlight }]}>
              <RoadSignGlyph type={item.glyph} />
            </View>

            {/* Info */}
            <View style={styles.signInfo}>
              <Text style={[styles.signName, { color: colors.textPrimary }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.signMetaRow}>
                <Text style={[styles.categoryName, { color: colors.textMuted }]}>
                  {item.category}
                </Text>
                <View style={styles.masteryPill}>
                  <View style={[styles.masteryDot, { backgroundColor: colors.success }]} />
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
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  offlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  offlineBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesRow: {
    marginBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  signCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
  },
  visualFrame: {
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signInfo: {
    gap: 4,
  },
  signName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    minHeight: 34,
  },
  signMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 11,
  },
  masteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  masteryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  masteryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  abs: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: ROUND_SIZE,
    height: ROUND_SIZE,
    borderRadius: ROUND_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barrierRail: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: BLACK,
  },
  barrierPost: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: BARRIER_H,
    backgroundColor: BLACK,
  },
  stopText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  noEntryBar: {
    width: 36.5,
    height: 11,
    borderRadius: 4,
    backgroundColor: WHITE,
  },
  speedInner: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    color: BLACK,
    fontSize: 21,
    fontWeight: '800',
  },
  arrowArm: {
    position: 'absolute',
    top: ARROW_W / 4 - ARROW_STROKE / 2,
    width: ARROW_ARM,
    height: ARROW_STROKE,
    borderRadius: ARROW_STROKE / 2,
    backgroundColor: WHITE,
  },
});
