import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * The hero card uses a diagonal red gradient. `expo-linear-gradient` gives the exact look
 * (run: npx expo install expo-linear-gradient). Until it is installed the card falls back
 * to a flat red, so the screen never crashes.
 */
let LinearGradient: React.ComponentType<any> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** The mockup has no back arrow. Flip to true if you need a visible one. */
const SHOW_BACK_BUTTON = false;

interface ScheduledClass {
  id: number;
  time: string;
  title: string;
  instructor: string;
  language: string;
}

const SCHEDULE: ScheduledClass[] = [
  { id: 1, time: '18:00 CET', title: 'Speed limits & stopping distance', instructor: 'Karim H.', language: 'Bangla' },
  { id: 2, time: '20:30 CET', title: 'Mock exam together — 30 quizzes', instructor: 'Sara M.', language: 'Bangla' },
  { id: 3, time: '21:30 CET', title: 'Domande difficili: sorpasso', instructor: 'Luca R.', language: 'Italiano' },
];

const DAYS = [
  { day: 'Mon', date: '21' },
  { day: 'Tue', date: '22' },
  { day: 'Wed', date: '23' },
  { day: 'Thu', date: '24' },
  { day: 'Fri', date: '25' },
  { day: 'Sat', date: '26' },
];

const SIGN_RED = '#DA2D20';
const LIVE_RED = '#EF4136';
const HERO_FALLBACK_RED = '#A82420';
const HERO_GRADIENT = ['#8C1C1B', '#A82420', '#D82E22'];

/* -------------------------------------------------------------------------- */
/* Give-way sign (inverted triangle) drawn with Views                          */
/* -------------------------------------------------------------------------- */

const SIGN_W = 67.5;
const SIGN_H = 58.5;
const SIGN_BORDER = 7.2;

const GiveWaySign: React.FC = () => {
  const half = SIGN_W / 2;
  const leg = Math.sqrt(half * half + SIGN_H * SIGN_H);
  const inradius = (SIGN_W * SIGN_H) / (SIGN_W + 2 * leg);
  const k = (inradius - SIGN_BORDER) / inradius;
  const innerW = SIGN_W * k;
  const innerH = SIGN_H * k;

  return (
    <View style={{ width: SIGN_W, height: SIGN_H }}>
      <View
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          borderLeftWidth: half,
          borderRightWidth: half,
          borderTopWidth: SIGN_H,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: SIGN_RED,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: (SIGN_W - innerW) / 2,
          top: SIGN_BORDER,
          width: 0,
          height: 0,
          borderLeftWidth: innerW / 2,
          borderRightWidth: innerW / 2,
          borderTopWidth: innerH,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#FFFFFF',
        }}
      />
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* "Screen with play button" icon used on the Join button                      */
/* -------------------------------------------------------------------------- */

const PlayBoxGlyph: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      width: 13,
      height: 11,
      borderWidth: 1.6,
      borderColor: color,
      borderRadius: 2.5,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        marginLeft: 1,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderTopWidth: 2.5,
        borderBottomWidth: 2.5,
        borderLeftColor: color,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      }}
    />
  </View>
);

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const EClassScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedDay, setSelectedDay] = useState('Tue 22');

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
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
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>E-Class</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Live lessons with a teacher
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live hero card */}
        <View style={[styles.liveCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.liveMedia}>
            {LinearGradient ? (
              <LinearGradient
                colors={HERO_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: HERO_FALLBACK_RED }]} />
            )}
            <View style={styles.liveBlob} />

            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>LIVE</Text>
            </View>

            <View style={styles.liveSign}>
              <GiveWaySign />
            </View>

            <View style={styles.watchingBox}>
              <Text style={styles.watchingText}>128 watching</Text>
            </View>
          </View>

          <View style={styles.liveBottomRow}>
            <View style={styles.liveInfo}>
              <Text style={[styles.liveTopicTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                Give way & intersections — Q&A
              </Text>
              <Text style={[styles.liveInstructor, { color: colors.textMuted }]}>
                Sara M. · Bangla + Italiano
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.joinBtn, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Join live class"
            >
              <PlayBoxGlyph color="#FFFFFF" />
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Day selector */}
        <View style={styles.calendarRow}>
          {DAYS.map((item) => {
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
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: isSelected ? 'rgba(255,255,255,0.85)' : colors.textMuted },
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[styles.dateText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}
                >
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scheduled classes */}
        <View style={styles.scheduleList}>
          {SCHEDULE.map((item) => {
            const [clock, zone] = item.time.split(' ');
            return (
              <View key={item.id} style={styles.scheduleRow}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, { color: colors.textPrimary }]}>{clock}</Text>
                  {!!zone && (
                    <Text style={[styles.zoneText, { color: colors.textMuted }]}>{zone}</Text>
                  )}
                </View>

                <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />

                <View style={styles.scheduleDetails}>
                  <Text style={[styles.classTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.classTeacher, { color: colors.textMuted }]}>
                    {item.instructor} · {item.language}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.bellBtn, { backgroundColor: colors.chipBackground }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Remind me: ${item.title}`}
                >
                  <Ionicons name="notifications-outline" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EClassScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 15,
  },
  backButton: { marginLeft: -6, marginRight: 4, padding: 6 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, lineHeight: 16, marginTop: 2 },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },

  /* Hero card */
  liveCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 12.5,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  liveMedia: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  liveBlob: {
    position: 'absolute',
    left: 23.5 - 72.5,
    top: 108.5 - 72.5,
    width: 145,
    height: 145,
    borderRadius: 72.5,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  livePill: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 9.5,
    borderRadius: 11,
    backgroundColor: LIVE_RED,
    gap: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  livePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  liveSign: {
    position: 'absolute',
    left: 166,
    top: 30.5,
  },
  watchingBox: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 9.5,
    borderRadius: 11,
    backgroundColor: 'rgba(20,0,0,0.6)',
  },
  watchingText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    includeFontPadding: false,
  },
  liveBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  liveInfo: { flex: 1 },
  liveTopicTitle: { fontSize: 16, lineHeight: 20, fontWeight: '700' },
  liveInstructor: { fontSize: 12, lineHeight: 15, marginTop: 2 },
  joinBtn: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: 14,
    gap: 10,
  },
  joinBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  /* Calendar */
  calendarRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dayCard: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 1,
  },
  dayText: { fontSize: 11, lineHeight: 14, fontWeight: '500' },
  dateText: { fontSize: 16, lineHeight: 20, fontWeight: '800' },

  /* Schedule */
  scheduleList: { gap: 15 },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeCol: { width: 58 },
  timeText: { fontSize: 15, lineHeight: 18, fontWeight: '700' },
  zoneText: { fontSize: 10, lineHeight: 12 },
  accentLine: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 1.5,
  },
  scheduleDetails: {
    flex: 1,
    marginLeft: 10,
    marginRight: 12,
  },
  classTitle: { fontSize: 14, lineHeight: 19, fontWeight: '700' },
  classTeacher: { fontSize: 12, lineHeight: 16, marginTop: 1.5 },
  bellBtn: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});