import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MistakeItem {
  id: number;
  chapter: string;
  topic: string;
  question: string;
  wrongCount: number;
  timeAgo: string;
  signType: 'stop' | 'note' | 'prohibition';
}

const MISTAKES_DATA: MistakeItem[] = [
  {
    id: 1,
    chapter: 'CH. 5',
    topic: 'RIGHT OF WAY',
    question: 'Il segnale obbliga a fermarsi solo se arrivano veicoli',
    wrongCount: 3,
    timeAgo: '2 days ago',
    signType: 'stop',
  },
  {
    id: 2,
    chapter: 'CH. 12',
    topic: 'OVERTAKING',
    question: 'È consentito sorpassare a destra chi svolta a sinistra',
    wrongCount: 2,
    timeAgo: 'Yesterday',
    signType: 'note',
  },
  {
    id: 3,
    chapter: 'CH. 3',
    topic: 'PROHIBITION',
    question: "Il segnale vieta l'accesso ai soli autocarri",
    wrongCount: 1,
    timeAgo: 'Today',
    signType: 'prohibition',
  },
];

export const ReviewScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<'mistakes' | 'saved' | 'notes'>('mistakes');
  const [selectedFilter, setSelectedFilter] = useState('All chapters');

  const filters = ['All chapters', 'Right of way', 'Overtaking', 'Signs'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My review</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Segmented Control Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: colors.chipBackground }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'mistakes' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('mistakes')}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'mistakes' ? colors.textPrimary : colors.textMuted },
            ]}
          >
            Mistakes 34
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'saved' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('saved')}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'saved' ? colors.textPrimary : colors.textMuted },
            ]}
          >
            Saved 52
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'notes' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('notes')}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'notes' ? colors.textPrimary : colors.textMuted },
            ]}
          >
            Notes 9
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MISTAKES_DATA}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* Smart Review Banner */}
            <View style={[styles.bannerCard, { backgroundColor: colors.primary }]}>
              <View style={styles.bannerLeft}>
                <Text style={styles.bannerTitle}>34 mistakes to clear</Text>
                <Text style={styles.bannerSubtitle}>
                  Smart review brings each one back until you get it right 3 times.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.bannerBtn}
                onPress={() => navigation.navigate('QuizQuestion', { topicId: 1, mode: 'study' })}
              >
                <Text style={styles.bannerBtnText}>Start</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filtersList}>
              {filters.map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.mistakeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('QuizQuestion', { topicId: item.id, mode: 'study' })}
            activeOpacity={0.7}
          >
            <View style={[styles.signSquare, { backgroundColor: colors.primaryLight }]}>
              {item.signType === 'stop' && (
                <Ionicons name="hand-left" size={24} color="#EF4444" />
              )}
              {item.signType === 'note' && (
                <Ionicons name="document-text" size={24} color={colors.primary} />
              )}
              {item.signType === 'prohibition' && (
                <Ionicons name="remove-circle" size={24} color="#EF4444" />
              )}
            </View>

            <View style={styles.mistakeBody}>
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {item.chapter} · {item.topic}
              </Text>
              <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>
                {item.question}
              </Text>

              <View style={styles.metaRow}>
                <View style={[styles.wrongCountBadge, { backgroundColor: colors.errorLight }]}>
                  <Text style={[styles.wrongCountText, { color: colors.error }]}>
                    Wrong {item.wrongCount}×
                  </Text>
                </View>
                <Text style={[styles.timeAgoText, { color: colors.textMuted }]}>{item.timeAgo}</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  bannerCard: {
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    lineHeight: 16,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bannerBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  filtersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mistakeCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  signSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mistakeBody: {
    flex: 1,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wrongCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  wrongCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeAgoText: {
    fontSize: 12,
  },
});
