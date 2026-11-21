import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type McIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

// TODO: replace with the real user / settings stores.
const PROFILE = {
  name: 'Rahim Uddin',
  userId: '48213',
  email: 'rahim@example.com',
  premiumUntil: '2027-03-12' as string | null, // null => not premium
  readinessPercent: 78,
  licenceCategory: 'Patente B',
  studyLanguage: 'English',
  quizSummary: '30 Q · 20 min',
  offlineSize: '1.2 GB',
  licenceDaysLabel: '180 days',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Manual formatting (no Intl dependency): "2027-03-12" -> "12 Mar 2027"
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

/* -------------------------------------------------------------------------- */
/* Palette (light + dark)                                                     */
/* -------------------------------------------------------------------------- */

const getPalette = (isDark: boolean) => ({
  screenBg: isDark ? '#0A0E18' : '#F4F6FB',

  avatarBg: isDark ? '#1B2552' : '#E8EEFF',
  avatarText: isDark ? '#60A5FA' : '#2D5BFF',
  name: isDark ? '#FFFFFF' : '#0F172A',
  meta: isDark ? '#8F9BB3' : '#98A2B3',
  badgeBg: isDark ? '#372818' : '#FDEFDB',
  badgeText: isDark ? '#F59E0B' : '#B54708',

  sectionTitle: isDark ? '#8F9BB3' : '#98A2B3',
  cardBg: isDark ? '#131A2A' : '#FFFFFF',
  cardBorder: isDark ? '#1E293B' : '#E8EAF1',
  divider: isDark ? '#1E293B' : '#ECEEF3',
  rowPressed: isDark ? '#1A2236' : '#F7F8FB',
  label: isDark ? '#FFFFFF' : '#0F172A',
  value: isDark ? '#8F9BB3' : '#98A2B3',
  chevron: isDark ? '#64748B' : '#667085',

  tone: {
    blue: { bg: isDark ? '#1B2552' : '#E8EEFF', fg: isDark ? '#60A5FA' : '#2D5BFF' },
    purple: { bg: isDark ? '#232042' : '#EEE9FD', fg: isDark ? '#BFA6FE' : '#5B2BD9' },
    gray: { bg: isDark ? '#1B2336' : '#EEF0F6', fg: isDark ? '#CBD5E1' : '#344054' },
    orange: { bg: isDark ? '#372818' : '#FDEFDB', fg: isDark ? '#F59E0B' : '#EA6A0A' },
    red: { bg: isDark ? '#2D1618' : '#FEECEA', fg: isDark ? '#F97066' : '#B42318' },
    green: { bg: isDark ? '#0C2B20' : '#E3F6EC', fg: isDark ? '#34D399' : '#12B76A' },
  },
});

type Palette = ReturnType<typeof getPalette>;
type Tone = keyof Palette['tone'];

/* -------------------------------------------------------------------------- */
/* Menu model                                                                 */
/* -------------------------------------------------------------------------- */

type IconSpec =
  | { set: 'ion'; name: IoniconName; tone: Tone }
  | { set: 'mci'; name: McIconName; tone: Tone };

interface MenuItem {
  key: string;
  icon: IconSpec;
  label: string;
  value?: string;
  onPress: () => void;
}

interface MenuSection {
  key: string;
  title: string;
  items: MenuItem[];
}

/* -------------------------------------------------------------------------- */
/* Row                                                                        */
/* -------------------------------------------------------------------------- */

interface MenuRowProps {
  item: MenuItem;
  isLast: boolean;
  c: Palette;
}

const MenuRow = memo(({ item, isLast, c }: MenuRowProps) => {
  const tone = c.tone[item.icon.tone];
  return (
    <>
      <Pressable
        onPress={item.onPress}
        style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.rowPressed }]}
        accessibilityRole="button"
        accessibilityLabel={item.value ? `${item.label}, ${item.value}` : item.label}
      >
        <View style={[styles.iconBox, { backgroundColor: tone.bg }]}>
          {item.icon.set === 'ion' ? (
            <Ionicons name={item.icon.name} size={18} color={tone.fg} />
          ) : (
            <MaterialCommunityIcons name={item.icon.name} size={19} color={tone.fg} />
          )}
        </View>

        <Text style={[styles.label, { color: c.label }]} numberOfLines={1}>
          {item.label}
        </Text>

        {!!item.value && (
          <Text style={[styles.value, { color: c.value }]} numberOfLines={1}>
            {item.value}
          </Text>
        )}

        <Ionicons name="chevron-forward" size={16} color={c.chevron} />
      </Pressable>
      {!isLast && <View style={[styles.divider, { backgroundColor: c.divider }]} />}
    </>
  );
});

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark, mode, toggleTheme } = useTheme();
  const c = getPalette(isDark);

  const [devModalVisible, setDevModalVisible] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);

  const handleVersionTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 1600) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;

    if (tapCountRef.current >= 13) {
      tapCountRef.current = 0;
      setDevModalVisible(true);
    }
  }, []);

  const comingSoon = useCallback(
    (title: string) => Alert.alert(title, 'This feature is coming soon.'),
    [],
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Log out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          // TODO: await authStore.signOut() / clear tokens before navigating.
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  }, [navigation]);

  const sections = useMemo<MenuSection[]>(
    () => [
      {
        key: 'learning',
        title: 'LEARNING',
        items: [
          // Not in the mockup, kept on purpose.
          {
            key: 'progress',
            icon: { set: 'ion', name: 'stats-chart', tone: 'green' },
            label: 'Learning progress',
            value: `${PROFILE.readinessPercent}% ready`,
            onPress: () => navigation.navigate('MainTabs', { screen: 'Progress' }),
          },
          {
            key: 'category',
            icon: { set: 'ion', name: 'car', tone: 'blue' },
            label: 'Licence category',
            value: PROFILE.licenceCategory,
            onPress: () => navigation.navigate('QuizSettings'),
          },
          {
            key: 'language',
            icon: { set: 'ion', name: 'language', tone: 'purple' },
            label: 'Study language',
            value: PROFILE.studyLanguage,
            onPress: () => navigation.navigate('Language'),
          },
          {
            key: 'quiz',
            icon: { set: 'mci', name: 'target', tone: 'gray' },
            label: 'Quiz settings',
            value: PROFILE.quizSummary,
            onPress: () => navigation.navigate('QuizSettings'),
          },
          // Not in the mockup, kept on purpose.
          {
            key: 'driving',
            icon: { set: 'ion', name: 'car-sport', tone: 'blue' },
            label: 'Practical driving',
            value: 'Foglio rosa & lessons',
            onPress: () => navigation.navigate('MainTabs', { screen: 'PracticalDriving' }),
          },
        ],
      },
      {
        key: 'app',
        title: 'APP',
        items: [
          {
            key: 'appearance',
            icon: { set: 'ion', name: 'moon-outline', tone: 'gray' },
            label: 'Appearance',
            value: mode.charAt(0).toUpperCase() + mode.slice(1),
            onPress: toggleTheme,
          },
          {
            key: 'offline',
            icon: { set: 'ion', name: 'download-outline', tone: 'gray' },
            label: 'Offline downloads',
            value: PROFILE.offlineSize,
            // TODO: navigate to the downloads manager.
            onPress: () => comingSoon('Offline downloads'),
          },
        ],
      },
      {
        key: 'account',
        title: 'ACCOUNT',
        items: [
          {
            key: 'store',
            icon: { set: 'mci', name: 'crown-outline', tone: 'orange' },
            label: 'Store & licence key',
            value: PROFILE.licenceDaysLabel,
            onPress: () => navigation.navigate('Paywall'),
          },
          {
            key: 'web',
            icon: { set: 'ion', name: 'qr-code-outline', tone: 'gray' },
            label: 'Login on web app',
            // TODO: open the QR scanner / web login flow.
            onPress: () => comingSoon('Login on web app'),
          },
          {
            key: 'form',
            icon: { set: 'ion', name: 'document-text-outline', tone: 'gray' },
            label: 'TT2112 form (PDF)',
            // TODO: open / download the PDF (Linking.openURL or expo-file-system + sharing).
            onPress: () => comingSoon('TT2112 form'),
          },
          {
            key: 'support',
            icon: { set: 'ion', name: 'help-circle-outline', tone: 'gray' },
            label: 'Support 24h',
            onPress: () => navigation.navigate('SupportChat'),
          },
          {
            key: 'logout',
            icon: { set: 'ion', name: 'log-out-outline', tone: 'red' },
            label: 'Log out',
            onPress: handleLogout,
          },
        ],
      },
    ],
    [navigation, mode, toggleTheme, comingSoon, handleLogout],
  );

  const premiumLabel = PROFILE.premiumUntil
    ? `Full version · until ${formatDate(PROFILE.premiumUntil)}`
    : 'Get the full version';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: c.avatarBg }]} accessibilityElementsHidden>
            <Text style={[styles.avatarText, { color: c.avatarText }]}>{getInitials(PROFILE.name)}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: c.name }]} numberOfLines={1}>
              {PROFILE.name}
            </Text>
            <Text style={[styles.userMeta, { color: c.meta }]} numberOfLines={1}>
              ID {PROFILE.userId} · {PROFILE.email}
            </Text>

            <Pressable
              style={[styles.premiumBadge, { backgroundColor: c.badgeBg }]}
              onPress={() => navigation.navigate('Paywall')}
              accessibilityRole="button"
              accessibilityLabel={premiumLabel}
            >
              <MaterialCommunityIcons name="crown-outline" size={13} color={c.badgeText} />
              <Text style={[styles.premiumText, { color: c.badgeText }]} numberOfLines={1}>
                {premiumLabel}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.sectionTitle }]}>{section.title}</Text>
            <View style={[styles.card, { backgroundColor: c.cardBg, borderColor: c.cardBorder }]}>
              {section.items.map((item, i) => (
                <MenuRow key={item.key} item={item} isLast={i === section.items.length - 1} c={c} />
              ))}
            </View>
          </View>
        ))}

        {/* Professional subtle footer with secret 5-tap developer credits */}
        <TouchableOpacity
          style={styles.versionFooter}
          onPress={handleVersionTap}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="App version 1.0.0"
        >
          <Text style={[styles.versionText, { color: c.meta }]}>
            TMM Bangla Patente · Version 1.0.0
          </Text>
          <Text style={[styles.copyrightText, { color: isDark ? '#4B5563' : '#94A3B8' }]}>
            © 2026 TMM Driving School. All rights reserved.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Secret Developer Easter Egg Modal (activated by 5 quick taps) */}
      <Modal
        visible={devModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDevModalVisible(false)}
      >
        <View style={styles.devBackdrop}>
          <View
            style={[
              styles.devCard,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? '#1F2937' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.devBadgeRow}>
              <View style={styles.devIconBox}>
                <Ionicons name="code-slash" size={20} color="#2D5BFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.devHeaderTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  System & Engineering Info
                </Text>
                <Text style={[styles.devHeaderSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Build v1.0.0 (Release)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDevModalVisible(false)}
                style={[
                  styles.devCloseBtn,
                  { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' },
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={18} color={isDark ? '#E2E8F0' : '#475569'} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.devBodyBox,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.devRow}>
                <Text style={[styles.devLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Project Lead:
                </Text>
                <Text style={[styles.devValue, { color: '#2563EB', fontWeight: '800' }]}>
                  Abdul Kader
                </Text>
              </View>

              <View style={styles.devRow}>
                <Text style={[styles.devLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Lead Developer:
                </Text>
                <Text style={[styles.devValue, { color: '#0284C7', fontWeight: '800' }]}>
                  Tasnikur Sifat
                </Text>
              </View>

              <View style={styles.devRow}>
                <Text style={[styles.devLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Role:
                </Text>
                <Text style={[styles.devValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Lead Mobile Application Engineer
                </Text>
              </View>

              <View style={styles.devRow}>
                <Text style={[styles.devLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Framework:
                </Text>
                <Text style={[styles.devValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  React Native · Expo · TypeScript
                </Text>
              </View>

              <View style={styles.devRow}>
                <Text style={[styles.devLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Design Coverage:
                </Text>
                <Text style={[styles.devValue, { color: '#10B981', fontWeight: '700' }]}>
                  Figma Screens Verified
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.devFooterNote,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}
            >
              Engineered with precision & dedication for Bengali and South Asian learners in Italy.
            </Text>

            <TouchableOpacity
              style={styles.devDoneBtn}
              onPress={() => setDevModalVisible(false)}
              activeOpacity={0.88}
            >
              <Text style={styles.devDoneText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles (measured from the 780x1688 @2x design E2, values in pt)            */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 7.5, // header block starts at y 54.5 (safe area 47 + 7.5)
    paddingBottom: 24,
  },

  // Profile header
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  userInfo: { flex: 1, marginLeft: 14 },
  userName: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3.5,
    includeFontPadding: false,
  },
  userMeta: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 3.5,
    includeFontPadding: false,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 21,
    paddingHorizontal: 10,
    borderRadius: 10.5,
    gap: 5,
  },
  premiumText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    includeFontPadding: false,
  },

  // Sections
  section: { marginTop: 15 },
  sectionTitle: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 7,
    includeFontPadding: false,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Rows: pitch 50 = 48.5 row + 1 full-width divider (+ card border)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48.5,
    paddingLeft: 13,
    paddingRight: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12.5,
  },
  label: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '500',
    includeFontPadding: false,
  },
  value: {
    flexShrink: 1,
    marginLeft: 8,
    marginRight: 5,
    fontSize: 13,
    lineHeight: 18,
    includeFontPadding: false,
  },
  divider: { height: 1 },

  // Footer & Easter egg styles
  versionFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  copyrightText: {
    fontSize: 10.5,
    fontWeight: '400',
  },

  // Developer Easter Egg Modal
  devBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  devCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  devBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  devIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 91, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  devHeaderSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  devCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devBodyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  devLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  devValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  devFooterNote: {
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  devDoneBtn: {
    backgroundColor: '#2D5BFF',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devDoneText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});