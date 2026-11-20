import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RoadSign {
  id: number;
  name: string;
  category: string;
  masteryPercent: number;
  iconName: any;
  iconColor: string;
}

const ROAD_SIGNS: RoadSign[] = [
  {
    id: 1,
    name: 'Level crossing with barriers',
    category: 'Danger',
    masteryPercent: 96,
    iconName: 'train',
    iconColor: '#EF4444',
  },
  {
    id: 2,
    name: 'Give way',
    category: 'Right of way',
    masteryPercent: 100,
    iconName: 'caret-down',
    iconColor: '#EF4444',
  },
  {
    id: 3,
    name: 'Stop',
    category: 'Right of way',
    masteryPercent: 90,
    iconName: 'hand-left',
    iconColor: '#EF4444',
  },
  {
    id: 4,
    name: 'No entry',
    category: 'Prohibition',
    masteryPercent: 82,
    iconName: 'remove-circle',
    iconColor: '#EF4444',
  },
  {
    id: 5,
    name: 'Speed limit 50',
    category: 'Prohibition',
    masteryPercent: 75,
    iconName: 'speedometer',
    iconColor: '#EF4444',
  },
  {
    id: 6,
    name: 'Go straight only',
    category: 'Mandatory',
    masteryPercent: 60,
    iconName: 'arrow-up-circle',
    iconColor: '#2563EB',
  },
];

export const RoadSignsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Danger', 'Prohibition', 'Mandatory', 'Info'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
        data={ROAD_SIGNS}
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
            {/* Visual Frame */}
            <View style={[styles.visualFrame, { backgroundColor: colors.cardHighlight }]}>
              <Ionicons name={item.iconName} size={48} color={item.iconColor} />
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
});
