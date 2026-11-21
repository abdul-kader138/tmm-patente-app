import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { YellowCarIllustration } from '../../components/illustrations/YellowCarIllustration';
import { BookLessonModal } from './components/BookLessonModal';
import { LessonDetailModal } from './components/LessonDetailModal';
import { FoglioRosaModal } from './components/FoglioRosaModal';

/**
 * The hero card uses a diagonal blue gradient. `expo-linear-gradient` gives the exact look
 * (run: npx expo install expo-linear-gradient). Without it the card falls back to flat blue,
 * so the screen never crashes.
 */
let LinearGradient: React.ComponentType<any> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** The mockup has no back arrow (tab-level screen). Flip to true if you need a visible one. */
const SHOW_BACK_BUTTON = false;

const HERO_GRADIENT = ['#2240D9', '#2F55F6', '#5273FF'];
const HERO_FALLBACK = '#2F55F6';

const ACTIVE_BG = '#DDF4E7';
const ACTIVE_TEXT = '#0E7A45';

interface ScheduledLesson {
  dateTitle: string;
  dayNum: string;
  dayName: string;
  title: string;
  time: string;
  instructor: string;
  duration: string;
  phone: string;
}

/** Outlined "screen with play triangle" icon (Driving videos tile). */
const PlayBoxGlyph: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      width: 18,
      height: 13.5,
      borderWidth: 2.2,
      borderColor: color,
      borderRadius: 3.5,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        marginLeft: 1,
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderTopWidth: 3.5,
        borderBottomWidth: 3.5,
        borderLeftColor: color,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      }}
    />
  </View>
);

export const PracticalDrivingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Modals state
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [foglioModalVisible, setFoglioModalVisible] = useState(false);

  // Scheduled lesson state
  const [scheduledLesson, setScheduledLesson] = useState<ScheduledLesson | null>({
    dateTitle: 'Thursday, 24 October',
    dayNum: '24',
    dayName: 'THU',
    title: 'Driving lesson · city traffic',
    time: '18:00',
    instructor: 'Karim H.',
    duration: '45 min',
    phone: '+39061234567',
  });

  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const validUntil = '9 May 2027';

  // Palette (theme tokens, same as the other screens)
  const bg = colors.background;
  const cardBg = colors.card;
  const cardBorder = colors.border;
  const textPrimary = colors.textPrimary;
  const textMuted = colors.textMuted;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleCallSchool = async () => {
    const phone = '+39061234567';
    const url = `tel:${phone}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        'Call TMM Driving School',
        `Calling hotline at ${phone}\n\nOur Bangla and Italian-speaking instructors are available Mon-Sat, 9:00 - 19:00.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleExamChecklist = () => {
    Alert.alert(
      'Practical Exam Checklist (Esame Pratico)',
      'The Italian Cat. B practical driving exam consists of 3 phases:\n\n1. Pre-drive safety checks & car parts (lights, fluids, tires, mirrors).\n2. Maneuvers (reverse parking, turn in road, emergency stop).\n3. Driving in traffic (city, roundabout, overtaking, motorway entry/exit).',
      [
        { text: 'View Car Parts', onPress: () => navigation.navigate('CarParts') },
        { text: 'View Guide', onPress: () => navigation.navigate('DrivingGuide') },
        { text: 'Got it', style: 'cancel' },
      ]
    );
  };

  const handleNewBooking = (data: {
    city: string;
    topic: string;
    date: string;
    time: string;
    instructor: string;
  }) => {
    // Extract day number and name from "Thursday, 24 Oct"
    const parts = data.date.split(' ');
    const dayName = parts[0]?.substring(0, 3).toUpperCase() || 'THU';
    const dayNum = parts[1]?.replace(',', '') || '24';

    setScheduledLesson({
      dateTitle: data.date,
      dayNum,
      dayName,
      title: `Driving lesson · ${data.topic.toLowerCase()}`,
      time: data.time,
      instructor: data.instructor,
      duration: '45 min',
      phone: '+39061234567',
    });
  };

  const handleCancelLesson = () => {
    setScheduledLesson(null);
    Alert.alert('Lesson Canceled', 'Your scheduled lesson has been canceled.');
  };

  const tiles = [
    {
      key: 'videos',
      title: 'Driving videos',
      sub: 'Manoeuvres filmed in-car',
      tint: isDark ? '#3B1D22' : '#FDECEB',
      icon: <PlayBoxGlyph color="#E5372B" />,
      onPress: () => navigation.navigate('DrivingGuide'),
    },
    {
      key: 'parts',
      title: 'Car parts',
      sub: 'Controls & parts, with audio',
      tint: isDark ? '#1E2A54' : '#EAEFFF',
      icon: <Ionicons name="car" size={22} color={colors.primary} />,
      onPress: () => navigation.navigate('CarParts'),
    },
    {
      key: 'guide',
      title: 'Driving guide',
      sub: 'Step-by-step manoeuvres',
      tint: isDark ? '#133524' : '#E6F6EE',
      icon: <Ionicons name="warning-outline" size={22} color="#16A34A" />,
      onPress: () => navigation.navigate('DrivingGuide'),
    },
    {
      key: 'exam',
      title: 'Practical exam',
      sub: 'What the examiner checks',
      tint: isDark ? '#2E1A47' : '#EFEAFD',
      icon: <Ionicons name="checkbox-outline" size={22} color="#6D4AF0" />,
      onPress: handleExamChecklist,
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        {SHOW_BACK_BUTTON && (
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={textPrimary} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: textPrimary }]}>Practical driving</Text>
          <Text style={[styles.subtitle, { color: textMuted }]}>After the theory exam</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Driving School Hero Banner */}
        <View style={styles.heroCard}>
          {LinearGradient ? (
            <LinearGradient
              colors={HERO_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: HERO_FALLBACK }]} />
          )}

          <View style={styles.heroLeft}>
            <Text style={styles.schoolTagText}>TMM DRIVING SCHOOL</Text>
            <Text style={styles.heroTitle}>Ready for the road?</Text>
            <Text style={styles.heroSub}>
              {'Book a driving lesson with a\nBangla-speaking instructor'}
            </Text>

            <View style={styles.heroActionsRow}>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => setBookModalVisible(true)}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Book lesson"
              >
                <Text style={styles.bookBtnText}>Book lesson</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callBtn}
                onPress={handleCallSchool}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Call driving school"
              >
                <Ionicons name="phone-portrait-outline" size={18} color="#FFFFFF" />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Yellow Sedan Illustration */}
          <View style={styles.heroCarWrapper}>
            <YellowCarIllustration width={115} height={40} />
          </View>
        </View>

        {/* 2x2 Feature Grid */}
        <View style={styles.tilesGrid}>
          {tiles.map((tile) => (
            <TouchableOpacity
              key={tile.key}
              style={[styles.tileCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={tile.onPress}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={tile.title}
            >
              <View style={[styles.tileIconBox, { backgroundColor: tile.tint }]}>{tile.icon}</View>
              <Text style={[styles.tileTitle, { color: textPrimary }]}>{tile.title}</Text>
              <Text style={[styles.tileSub, { color: textMuted }]}>{tile.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Foglio Rosa Card */}
        <TouchableOpacity
          style={[styles.foglioRosaCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
          onPress={() => setFoglioModalVisible(true)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Foglio Rosa details"
        >
          <View style={[styles.docIconBox, { backgroundColor: isDark ? '#332712' : '#FDF0E1' }]}>
            <Ionicons name="document-text-outline" size={22} color="#C2500B" />
          </View>
          <View style={styles.foglioInfo}>
            <Text style={[styles.foglioTitle, { color: textPrimary }]}>Foglio rosa</Text>
            <Text style={[styles.foglioSub, { color: textMuted }]}>
              Valid until {validUntil} · {attemptsLeft} exam attempts
            </Text>
          </View>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>Active</Text>
          </View>
        </TouchableOpacity>

        {/* Scheduled Driving Lesson Card */}
        {scheduledLesson ? (
          <TouchableOpacity
            style={[styles.lessonCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setDetailModalVisible(true)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Scheduled lesson details"
          >
            <View style={[styles.calendarBadge, { backgroundColor: isDark ? '#1E2A54' : '#EAF0FF' }]}>
              <Text style={[styles.calDayName, { color: colors.primary }]}>
                {scheduledLesson.dayName}
              </Text>
              <Text style={[styles.calDayNum, { color: textPrimary }]}>{scheduledLesson.dayNum}</Text>
            </View>

            <View style={styles.lessonInfo}>
              <Text style={[styles.lessonTitle, { color: textPrimary }]}>
                {scheduledLesson.title}
              </Text>
              <Text style={[styles.lessonMeta, { color: textMuted }]}>
                {scheduledLesson.time} · Instructor {scheduledLesson.instructor} ·{' '}
                {scheduledLesson.duration}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color={textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.emptyLessonCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setBookModalVisible(true)}
            activeOpacity={0.75}
          >
            <View style={[styles.emptyIconBox, { backgroundColor: isDark ? '#1E2A54' : '#EAF0FF' }]}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.lessonTitle, { color: textPrimary }]}>No upcoming lessons</Text>
              <Text style={[styles.lessonMeta, { color: textMuted }]}>
                Tap here to book your next session with Karim H.
              </Text>
            </View>
            <Ionicons name="add-circle" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Interactive Modals */}
      <BookLessonModal
        visible={bookModalVisible}
        onClose={() => setBookModalVisible(false)}
        onBookSuccess={handleNewBooking}
      />

      <LessonDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        onCancelLesson={handleCancelLesson}
        lesson={scheduledLesson || undefined}
      />

      <FoglioRosaModal
        visible={foglioModalVisible}
        onClose={() => setFoglioModalVisible(false)}
        validUntil={validUntil}
        attemptsLeft={attemptsLeft}
      />
    </SafeAreaView>
  );
};

export default PracticalDrivingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },

  /* Hero card */
  heroCard: {
    borderRadius: 26,
    padding: 16,
    overflow: 'hidden',
  },
  heroLeft: {
    maxWidth: '65%',
    zIndex: 2,
  },
  schoolTagText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 5.5,
  },
  heroSub: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5.5,
  },
  bookBtn: {
    height: 35,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  callBtn: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 11,
    paddingRight: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.18)',
    gap: 7,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroCarWrapper: {
    position: 'absolute',
    right: 17,
    top: 57,
    zIndex: 1,
  },

  /* 2x2 feature grid */
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // tiles keep their own height (row 1: second tile wraps to 2 lines)
    rowGap: 14,
  },
  tileCard: {
    width: '48%',
    padding: 12.5,
    borderRadius: 18,
    borderWidth: 1,
  },
  tileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  tileSub: {
    fontSize: 11.5,
    lineHeight: 14,
    marginTop: 1,
  },

  /* Foglio rosa */
  foglioRosaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12.5,
    borderRadius: 18,
    borderWidth: 1,
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
    marginLeft: 12,
    marginRight: 12,
  },
  foglioTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  foglioSub: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1.5,
  },
  activePill: {
    height: 22.5,
    paddingHorizontal: 9.5,
    borderRadius: 11.25,
    backgroundColor: ACTIVE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: ACTIVE_TEXT,
    includeFontPadding: false,
  },

  /* Scheduled lesson */
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10.5,
    borderRadius: 18,
    borderWidth: 1,
  },
  calendarBadge: {
    width: 44,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayName: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  calDayNum: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  lessonInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  lessonMeta: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  emptyLessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10.5,
    borderRadius: 18,
    borderWidth: 1,
  },
  emptyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});