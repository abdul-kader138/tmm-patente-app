import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ScheduledClass {
  id: number;
  time: string;
  title: string;
  instructor: string;
  language: string;
}

const SCHEDULE: ScheduledClass[] = [
  {
    id: 1,
    time: '18:00 CET',
    title: 'Speed limits & stopping distance',
    instructor: 'Karim H.',
    language: 'Bangla',
  },
  {
    id: 2,
    time: '20:30 CET',
    title: 'Mock exam together — 30 quizzes',
    instructor: 'Sara M.',
    language: 'Bangla',
  },
  {
    id: 3,
    time: '21:30 CET',
    title: 'Domande difficili: sorpasso',
    instructor: 'Luca R.',
    language: 'Italiano',
  },
];

export const EClassScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedDay, setSelectedDay] = useState('Tue 22');

  const days = [
    { day: 'Mon', date: '21' },
    { day: 'Tue', date: '22' },
    { day: 'Wed', date: '23' },
    { day: 'Thu', date: '24' },
    { day: 'Fri', date: '25' },
    { day: 'Sat', date: '26' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>E-Class</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Live lessons with a teacher
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Big Live Hero Card */}
        <View style={[styles.liveCard, { backgroundColor: '#B91C1C' }]}>
          <View style={styles.liveBadgeRow}>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>LIVE</Text>
            </View>
            <View style={styles.watchingBox}>
              <Text style={styles.watchingText}>128 watching</Text>
            </View>
          </View>

          {/* Road sign illustration in live room */}
          <View style={styles.liveGraphicArea}>
            <View style={styles.yieldSign}>
              <Ionicons name="caret-down" size={54} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.liveBottomRow}>
            <View style={styles.liveInfo}>
              <Text style={styles.liveTopicTitle}>Give way & intersections — Q&A</Text>
              <Text style={styles.liveInstructor}>Sara M. · Bangla + Italiano</Text>
            </View>

            <TouchableOpacity style={styles.joinBtn}>
              <Ionicons name="play" size={16} color="#2563EB" />
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Calendar Day Selector */}
        <View style={styles.calendarRow}>
          {days.map((item) => {
            const label = `${item.day} ${item.date}`;
            const isSelected = selectedDay === label;

            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.dayCard,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedDay(label)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textMuted },
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Scheduled Classes List */}
        <View style={styles.scheduleList}>
          {SCHEDULE.map((item) => (
            <View
              key={item.id}
              style={[
                styles.scheduleCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.timeCol}>
                <Text style={[styles.timeText, { color: colors.textPrimary }]}>{item.time}</Text>
              </View>

              <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />

              <View style={styles.scheduleDetails}>
                <Text style={[styles.classTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.classTeacher, { color: colors.textMuted }]}>
                  {item.instructor} · {item.language}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.bellBtn, { backgroundColor: colors.chipBackground }]}
              >
                <Ionicons name="notifications-outline" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
  headerTitleBox: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 20,
  },
  liveCard: {
    borderRadius: 20,
    padding: 16,
    height: 200,
    justifyContent: 'space-between',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  livePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  watchingBox: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  watchingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  liveGraphicArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  yieldSign: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveInfo: {
    flex: 1,
  },
  liveTopicTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  liveInstructor: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  joinBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  joinBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    width: '15%',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scheduleList: {
    gap: 12,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  timeCol: {
    width: 65,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  accentLine: {
    width: 3,
    height: 36,
    borderRadius: 1.5,
  },
  scheduleDetails: {
    flex: 1,
  },
  classTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  classTeacher: {
    fontSize: 12,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
