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
import { WordSheetModal } from '../quiz/WordSheetModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DictionaryWord {
  id: number;
  wordItalian: string;
  wordEnglish: string;
  totalQuizzes: number;
  trueCount: number;
  falseCount: number;
  iconName: any;
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
    iconName: 'car-sport',
  },
  {
    id: 2,
    wordItalian: 'SOSTA',
    wordEnglish: 'Stopping / parking',
    totalQuizzes: 48,
    trueCount: 30,
    falseCount: 18,
    iconName: 'pause-circle',
  },
  {
    id: 3,
    wordItalian: 'CARREGGIATA',
    wordEnglish: 'Carriageway',
    totalQuizzes: 96,
    trueCount: 61,
    falseCount: 35,
    iconName: 'git-commit',
  },
  {
    id: 4,
    wordItalian: 'PASSAGGIO A LIVELLO',
    wordEnglish: 'Level crossing',
    totalQuizzes: 37,
    trueCount: 22,
    falseCount: 15,
    iconName: 'warning',
  },
  {
    id: 5,
    wordItalian: 'IMPASTICCIARE',
    wordEnglish: 'To tamper / mess up',
    totalQuizzes: 8,
    trueCount: 0,
    falseCount: 8,
    iconName: 'close-circle',
    isAlwaysFalse: true,
  },
  {
    id: 6,
    wordItalian: 'PRUDENZA',
    wordEnglish: 'Caution / Prudence',
    totalQuizzes: 54,
    trueCount: 54,
    falseCount: 0,
    iconName: 'shield-checkmark',
    isAlwaysTrue: true,
  },
];

export const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Saved' | 'Always true' | 'Always false'>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);

  const tabs: ('All' | 'Saved' | 'Always true' | 'Always false')[] = [
    'All',
    'Saved',
    'Always true',
    'Always false',
  ];

  const filteredWords = DICTIONARY_WORDS.filter((item) => {
    if (activeTab === 'Always true' && !item.isAlwaysTrue) return false;
    if (activeTab === 'Always false' && !item.isAlwaysFalse) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.wordItalian.toLowerCase().includes(q) ||
        item.wordEnglish.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Dictionary</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          1,900 exam words with pictures
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search Italian or English..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          <TouchableOpacity>
            <Ionicons name="mic-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.tabsRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = activeTab === item;
            return (
              <TouchableOpacity
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setActiveTab(item)}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {item === 'All' ? 'Dictionary' : item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Dictionary Words List */}
      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.wordCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {
              setSelectedWord(item);
              setModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.wordIconBox, { backgroundColor: colors.chipBackground }]}>
              <Ionicons name={item.iconName} size={24} color={colors.primary} />
            </View>

            <View style={styles.wordBody}>
              <Text style={[styles.wordItalian, { color: colors.textPrimary }]}>
                {item.wordItalian}
              </Text>
              <Text style={[styles.wordEnglish, { color: colors.textMuted }]}>
                {item.wordEnglish}
              </Text>

              <Text style={[styles.quizStats, { color: colors.textMuted }]}>
                In {item.totalQuizzes} quizzes{' '}
                <Text style={{ color: colors.success, fontWeight: '700' }}>
                  {item.trueCount} true
                </Text>{' '}
                <Text style={{ color: colors.error, fontWeight: '700' }}>
                  {item.falseCount} false
                </Text>
              </Text>
            </View>

            <View style={styles.cardActionsRight}>
              <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="volume-high-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="bookmark-outline" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Word Sheet Modal */}
      <WordSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        word={selectedWord?.wordItalian}
        translation={selectedWord?.wordEnglish}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  tabsRow: {
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  wordCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  wordIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBody: {
    flex: 1,
  },
  wordItalian: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  wordEnglish: {
    fontSize: 12,
    marginBottom: 4,
  },
  quizStats: {
    fontSize: 11,
  },
  cardActionsRight: {
    gap: 6,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
