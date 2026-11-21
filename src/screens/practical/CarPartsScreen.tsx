import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockCarParts } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/* Side-view sedan (vector, drawn in a 698 x 358 box = diagram card at 2x)     */
/* -------------------------------------------------------------------------- */

const WINDOW_COLOR = '#BDD0FF';
const WHEEL_COLOR = '#232B3B';
const HUB_COLOR = '#D3D6DE';

const CarSideView: React.FC<{ bodyColor: string }> = ({ bodyColor }) => (
  <Svg width="100%" height="100%" viewBox="0 0 698 358" pointerEvents="none">
    {/* Body */}
    <Path
      d="M40 257 L40 195 Q40 188 48 187 L169 172 L242 116 Q247 110 256 109 L445 109 Q453 109 459 114 L527 177 L627 188 Q651 191 651 205 L651 257 Z"
      fill={bodyColor}
    />
    {/* Windows */}
    <Path d="M199 172 L244 128 Q247 126 252 126 L317 126 L317 172 Z" fill={WINDOW_COLOR} />
    <Path d="M335 126 L424 126 Q428 126 431 129 L476 172 L335 172 Z" fill={WINDOW_COLOR} />
    {/* Door handle */}
    <Rect x={339} y={189} width={30} height={5} rx={2.5} fill={WINDOW_COLOR} />
    {/* Lights */}
    <Rect x={626} y={198} width={22} height={11} rx={3} fill="#FCE58A" />
    <Rect x={40} y={202} width={13} height={17} rx={2} fill="#F0443A" />
    {/* Wheels */}
    <Circle cx={173} cy={262} r={43} fill={WHEEL_COLOR} />
    <Circle cx={173} cy={262} r={21.5} fill={HUB_COLOR} />
    <Circle cx={523} cy={262} r={43} fill={WHEEL_COLOR} />
    <Circle cx={523} cy={262} r={21.5} fill={HUB_COLOR} />
  </Svg>
);

/* Hotspot centres in dp, relative to the diagram card */
const HOTSPOT_SIZE = 21;
const HOTSPOTS: { id: number; x: number; y: number }[] = [
  { id: 1, x: 316.5, y: 90.5 },
  { id: 2, x: 234.5, y: 66.5 },
  { id: 3, x: 246.5, y: 136.5 },
  { id: 4, x: 188.5, y: 44.5 },
  { id: 5, x: 22.5, y: 90.5 },
];

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const CarPartsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'exterior' | 'dashboard' | 'engine'>('exterior');
  const [selectedPartId, setSelectedPartId] = useState<number>(1);

  const parts = mockCarParts[activeTab];

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  }, [navigation]);

  const tabs: { key: 'exterior' | 'dashboard' | 'engine'; label: string }[] = [
    { key: 'exterior', label: 'Exterior' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'engine', label: 'Engine' },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Car parts</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            42 parts · Italian + English
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Search parts"
        >
          <Ionicons name="search" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: colors.chipBackground }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && [styles.tabBtnActive, { backgroundColor: colors.card }]]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: isActive ? colors.textPrimary : colors.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Diagram Area */}
        <View style={[styles.diagramCard, { backgroundColor: colors.cardHighlight }]}>
          <View style={styles.groundLine} />
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <CarSideView bodyColor={colors.primary} />
          </View>

          {/* Hotspots */}
          {HOTSPOTS.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.hotspot,
                {
                  left: spot.x - HOTSPOT_SIZE / 2,
                  top: spot.y - HOTSPOT_SIZE / 2,
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedPartId(spot.id)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityLabel={`Part ${spot.id}`}
            >
              <Text style={styles.hotspotDigit}>{spot.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.hintText, { color: colors.textMuted }]}>
          Tap a number to hear the Italian name and its explanation.
        </Text>

        {/* Numbered Parts List */}
        <View style={styles.partsList}>
          {parts.map((item) => {
            const isSelected = selectedPartId === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.partRow,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : 'transparent',
                    borderColor: isSelected ? colors.primaryLight : colors.border,
                  },
                ]}
                onPress={() => setSelectedPartId(item.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.numberBadge,
                    { backgroundColor: isSelected ? colors.primary : colors.primaryLight },
                  ]}
                >
                  <Text
                    style={[styles.numberText, { color: isSelected ? '#FFFFFF' : colors.primary }]}
                  >
                    {item.id}
                  </Text>
                </View>

                <View style={styles.partInfo}>
                  <Text style={[styles.partItalian, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.partEnglish, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.translation}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.audioIconBtn, { backgroundColor: colors.primaryLight }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Play audio for ${item.name}`}
                >
                  <Ionicons name="volume-high" size={16} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CarPartsScreen;

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
    paddingBottom: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 15,
    marginTop: 1,
  },

  /* Tabs */
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  content: {
    paddingHorizontal: 20,
  },

  /* Diagram */
  diagramCard: {
    height: 179,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 12.5,
  },
  groundLine: {
    position: 'absolute',
    left: 0,
    right: 9.5,
    top: 158,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(15,23,42,0.06)',
  },
  hotspot: {
    position: 'absolute',
    width: HOTSPOT_SIZE,
    height: HOTSPOT_SIZE,
    borderRadius: HOTSPOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  hotspotDigit: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    includeFontPadding: false,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 12.5,
  },

  /* Parts list */
  partsList: {
    gap: 3,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8.5,
    paddingHorizontal: 10.5,
    borderRadius: 18,
    borderWidth: 1,
  },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 13,
    fontWeight: '700',
    includeFontPadding: false,
  },
  partInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  partItalian: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  partEnglish: {
    fontSize: 12.5,
    lineHeight: 16,
    marginTop: 1,
  },
  audioIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});