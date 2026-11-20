import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Lesson {
  id: number;
  lessonNumber: number;
  title: string;
  chapter: string;
  instructor: string;
  language: string;
  duration: string;
  progressPercent: number;
  completed: boolean;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    lessonNumber: 1,
    title: 'Definizioni generali e doveri',
    chapter: 'Chapter 1',
    instructor: 'Sara M.',
    language: 'Bangla',
    duration: '18:40',
    progressPercent: 100,
    completed: true,
  },
  {
    id: 2,
    lessonNumber: 2,
    title: 'La strada e le sue parti',
    chapter: 'Chapter 1',
    instructor: 'Sara M.',
    language: 'Bangla',
    duration: '22:15',
    progressPercent: 100,
    completed: true,
  },
  {
    id: 3,
    lessonNumber: 12,
    title: 'Level crossings (Passaggi a livello)',
    chapter: 'Chapter 2',
    instructor: 'Sara M.',
    language: 'Bangla',
    duration: '18:40',
    progressPercent: 45,
    completed: false,
  },
  {
    id: 4,
    lessonNumber: 13,
    title: 'Segnali di pericolo: curve e dossi',
    chapter: 'Chapter 2',
    instructor: 'Karim H.',
    language: 'Bangla',
    duration: '25:30',
    progressPercent: 0,
    completed: false,
  },
  {
    id: 5,
    lessonNumber: 14,
    title: 'Segnali di precedenza e incroci',
    chapter: 'Chapter 3',
    instructor: 'Sara M.',
    language: 'Bangla',
    duration: '21:10',
    progressPercent: 0,
    completed: false,
  },
];

export const VideoLessonsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filters = ['All', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Practical'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Video lessons</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search 124 video lessons..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
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

      {/* Lessons List */}
      <FlatList
        data={LESSONS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.lessonCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('LessonPlayer', { lessonId: item.id, title: item.title })}
            activeOpacity={0.7}
          >
            <View style={[styles.thumbnailBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="play" size={24} color={colors.primary} />
              <View style={styles.durationTag}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>

            <View style={styles.lessonInfo}>
              <View style={styles.lessonMetaRow}>
                <Text style={[styles.chapterTag, { color: colors.primary }]}>{item.chapter}</Text>
                {item.completed ? (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={[styles.completedText, { color: colors.success }]}>Completed</Text>
                  </View>
                ) : null}
              </View>

              <Text style={[styles.lessonTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                Lesson {item.lessonNumber} · {item.title}
              </Text>

              <Text style={[styles.instructorText, { color: colors.textMuted }]}>
                {item.instructor} · {item.language}
              </Text>

              {item.progressPercent > 0 && item.progressPercent < 100 && (
                <View style={[styles.progressBar, { backgroundColor: colors.chipBackground }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: colors.primary, width: `${item.progressPercent}%` },
                    ]}
                  />
                </View>
              )}
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
  downloadButton: {
    padding: 6,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  lessonCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 14,
  },
  thumbnailBox: {
    width: 100,
    height: 75,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  durationTag: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  lessonInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lessonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  instructorText: {
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
