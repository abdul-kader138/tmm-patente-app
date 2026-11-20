import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockPracticalData } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PracticalDrivingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const handleBook = () => {
    Alert.alert(
      'Book a Driving Lesson',
      'Choose your preferred time slot with our Bangla-speaking instructors in Rome / Milan.',
      [{ text: 'OK' }]
    );
  };

  const handleCall = () => {
    Alert.alert('Call Instructor', 'Dialing TMM Driving School hotline: +39 06 1234567');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Practical driving</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>After the theory exam</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Driving School Banner */}
        <View style={[styles.heroCard, { backgroundColor: '#2563EB' }]}>
          <Text style={styles.schoolTag}>TMM DRIVING SCHOOL</Text>
          <Text style={styles.heroTitle}>Ready for the road?</Text>
          <Text style={styles.heroSub}>
            Book a driving lesson with a Bangla-speaking instructor
          </Text>

          <View style={styles.heroActionsRow}>
            <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
              <Text style={styles.bookBtnText}>Book lesson</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Feature Tiles Grid */}
        <View style={styles.tilesGrid}>
          {/* 1. Driving videos */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DrivingGuide')}
            activeOpacity={0.7}
          >
            <View style={[styles.tileIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="play" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.tileTitle, { color: colors.textPrimary }]}>Driving videos</Text>
            <Text style={[styles.tileSub, { color: colors.textMuted }]}>
              Manoeuvres filmed in-car
            </Text>
          </TouchableOpacity>

          {/* 2. Car parts */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('CarParts')}
            activeOpacity={0.7}
          >
            <View style={[styles.tileIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="car" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.tileTitle, { color: colors.textPrimary }]}>Car parts</Text>
            <Text style={[styles.tileSub, { color: colors.textMuted }]}>
              Controls & parts, with audio
            </Text>
          </TouchableOpacity>

          {/* 3. Driving guide */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DrivingGuide')}
            activeOpacity={0.7}
          >
            <View style={[styles.tileIconBox, { backgroundColor: colors.successLight }]}>
              <Ionicons name="warning" size={20} color={colors.success} />
            </View>
            <Text style={[styles.tileTitle, { color: colors.textPrimary }]}>Driving guide</Text>
            <Text style={[styles.tileSub, { color: colors.textMuted }]}>
              Step-by-step manoeuvres
            </Text>
          </TouchableOpacity>

          {/* 4. Practical exam */}
          <TouchableOpacity
            style={[styles.tileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DrivingGuide')}
            activeOpacity={0.7}
          >
            <View style={[styles.tileIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="checkbox" size={20} color="#7E22CE" />
            </View>
            <Text style={[styles.tileTitle, { color: colors.textPrimary }]}>Practical exam</Text>
            <Text style={[styles.tileSub, { color: colors.textMuted }]}>
              What the examiner checks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Foglio Rosa Card */}
        <View style={[styles.foglioRosaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.docIconBox, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="document-text" size={24} color={colors.warning} />
          </View>
          <View style={styles.foglioInfo}>
            <Text style={[styles.foglioTitle, { color: colors.textPrimary }]}>Foglio rosa</Text>
            <Text style={[styles.foglioSub, { color: colors.textMuted }]}>
              Valid until {mockPracticalData.foglioRosa.validUntil} ·{' '}
              {mockPracticalData.foglioRosa.attemptsLeft} exam attempts
            </Text>
          </View>
          <View style={[styles.activePill, { backgroundColor: colors.successLight }]}>
            <Text style={[styles.activePillText, { color: colors.success }]}>Active</Text>
          </View>
        </View>

        {/* Scheduled Driving Lesson Card */}
        <TouchableOpacity
          style={[styles.lessonCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <View style={[styles.dateBox, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.dayText, { color: colors.primary }]}>
              {mockPracticalData.upcomingLesson.day}
            </Text>
            <Text style={[styles.dateDigit, { color: colors.primary }]}>
              {mockPracticalData.upcomingLesson.date}
            </Text>
          </View>

          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>
              {mockPracticalData.upcomingLesson.title}
            </Text>
            <Text style={[styles.lessonDetails, { color: colors.textMuted }]}>
              {mockPracticalData.upcomingLesson.time} · Instructor{' '}
              {mockPracticalData.upcomingLesson.instructor} ·{' '}
              {mockPracticalData.upcomingLesson.duration}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  schoolTag: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bookBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  tileCard: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  tileIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  tileSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  foglioRosaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foglioInfo: {
    flex: 1,
  },
  foglioTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  foglioSub: {
    fontSize: 12,
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateDigit: {
    fontSize: 16,
    fontWeight: '900',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  lessonDetails: {
    fontSize: 12,
  },
});
