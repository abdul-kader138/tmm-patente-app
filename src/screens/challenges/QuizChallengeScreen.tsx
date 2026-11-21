import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { mockDuelData } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Duel = (typeof mockDuelData.recentDuels)[number];

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

// TODO: replace with the real live-quiz feed.
const LIVE_QUIZ = { startsAt: '20:30', learners: 214, badge: 50 };

const COPIED_RESET_MS = 2000;
const THIN_SPACE = '\u2009';

/* -------------------------------------------------------------------------- */
/* Palette (light + dark)                                                     */
/* -------------------------------------------------------------------------- */

const getPalette = (isDark: boolean) => ({
  screenBg: isDark ? '#0A0E18' : '#F4F6FB',

  title: isDark ? '#FFFFFF' : '#0F172A',
  subtitle: isDark ? '#8F9BB3' : '#98A2B3',
  trophyBg: isDark ? '#372818' : '#FDEFDB',
  trophyFg: isDark ? '#F59E0B' : '#EA8A0A',

  bannerFrom: '#17123B',
  bannerTo: '#3B2090',
  bannerCircle: 'rgba(255,255,255,0.08)',
  liveBg: '#F04438',
  playBg: '#E8E9F0',
  ringRed: '#D92D20',
  ringText: '#111827',

  cardBg: isDark ? '#131A2A' : '#FFFFFF',
  cardBorder: isDark ? '#1E293B' : '#E8EAF1',
  codeLabel: isDark ? '#8F9BB3' : '#98A2B3',
  codeValue: isDark ? '#FFFFFF' : '#0F172A',
  copyBg: isDark ? '#131A2A' : '#FFFFFF',
  copyBorder: isDark ? '#2E3A52' : '#E4E7EE',
  copyText: isDark ? '#FFFFFF' : '#0F172A',
  qrBg: isDark ? '#1B2552' : '#E8EEFF',
  qrIcon: isDark ? '#60A5FA' : '#2D5BFF',

  tone: {
    blue: { bg: isDark ? '#1B2552' : '#E8EEFF', fg: isDark ? '#60A5FA' : '#2D5BFF' },
    purple: { bg: isDark ? '#232042' : '#EEE9FD', fg: isDark ? '#BFA6FE' : '#5B2BD9' },
    orange: { bg: isDark ? '#372818' : '#FDEFDB', fg: isDark ? '#F59E0B' : '#EA8A0A' },
  },
  actionTitle: isDark ? '#FFFFFF' : '#0F172A',
  actionSub: isDark ? '#8F9BB3' : '#98A2B3',
  chevron: isDark ? '#64748B' : '#8B95A8',

  sectionTitle: isDark ? '#8F9BB3' : '#98A2B3',
  initialsBg: isDark ? '#1B2336' : '#ECEEF4',
  initialsText: isDark ? '#CBD5E1' : '#475467',
  opponent: isDark ? '#FFFFFF' : '#0F172A',
  score: isDark ? '#FFFFFF' : '#0F172A',
  wonBg: isDark ? '#0C2B20' : '#E3F6EC',
  wonText: isDark ? '#34D399' : '#067647',
  lostBg: isDark ? '#2D1618' : '#FEECEA',
  lostText: isDark ? '#F97066' : '#B42318',
  drawBg: isDark ? '#1B2336' : '#ECEEF4',
  drawText: isDark ? '#CBD5E1' : '#475467',
  emptyText: isDark ? '#8F9BB3' : '#98A2B3',

  modalCardBg: isDark ? '#131A2A' : '#FFFFFF',
  modalTitle: isDark ? '#FFFFFF' : '#0F172A',
  modalSub: isDark ? '#8F9BB3' : '#98A2B3',
  primary: isDark ? '#4C74FF' : '#2D5BFF',
});

type Palette = ReturnType<typeof getPalette>;

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

interface ActionCardProps {
  c: Palette;
  icon: IoniconName;
  tone: keyof Palette['tone'];
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ActionCard = memo(({ c, icon, tone, title, subtitle, onPress }: ActionCardProps) => (
  <TouchableOpacity
    style={[styles.actionCard, { backgroundColor: c.cardBg, borderColor: c.cardBorder }]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={`${title}. ${subtitle}`}
  >
    <View style={[styles.actionIconBox, { backgroundColor: c.tone[tone].bg }]}>
      <Ionicons name={icon} size={20} color={c.tone[tone].fg} />
    </View>
    <View style={styles.actionInfo}>
      <Text style={[styles.actionTitle, { color: c.actionTitle }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.actionSub, { color: c.actionSub }]} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color={c.chevron} />
  </TouchableOpacity>
));

const DuelRow = memo(({ duel, c }: { duel: Duel; c: Palette }) => {
  const badge =
    duel.result === 'Won'
      ? { bg: c.wonBg, fg: c.wonText }
      : duel.result === 'Lost'
        ? { bg: c.lostBg, fg: c.lostText }
        : { bg: c.drawBg, fg: c.drawText };

  return (
    <View
      style={styles.duelRow}
      accessible
      accessibilityLabel={`${duel.result} against ${duel.opponent}, ${duel.userScore} to ${duel.opponentScore}`}
    >
      <View style={[styles.initialsBox, { backgroundColor: c.initialsBg }]}>
        <Text style={[styles.initialsText, { color: c.initialsText }]}>{duel.opponentInitials}</Text>
      </View>

      <Text style={[styles.opponentText, { color: c.opponent }]} numberOfLines={1}>
        vs {duel.opponent}
      </Text>

      <Text style={[styles.scoreText, { color: c.score }]}>
        {duel.userScore}
        {THIN_SPACE}–{THIN_SPACE}
        {duel.opponentScore}
      </Text>

      <View style={[styles.resultBadge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.resultText, { color: badge.fg }]}>{duel.result}</Text>
      </View>
    </View>
  );
});

interface QrModalProps {
  visible: boolean;
  code: string;
  onClose: () => void;
  c: Palette;
}

const QrModal = memo(({ visible, code, onClose, c }: QrModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.qrBackdrop} onPress={onClose} accessibilityLabel="Close QR code">
      {/* Inner Pressable swallows taps so the card itself does not close the modal. */}
      <Pressable style={[styles.qrCard, { backgroundColor: c.modalCardBg }]} onPress={() => {}}>
        <Text style={[styles.qrTitle, { color: c.modalTitle }]}>Scan to challenge me</Text>
        <Text style={[styles.qrSub, { color: c.modalSub }]}>Your friend can scan this to find you.</Text>

        <View style={styles.qrBox}>
          {/* TODO: encode a deep link (e.g. app://duel/CODE) once the scanner side exists. */}
          <QRCode value={code} size={176} color="#0F172A" backgroundColor="#FFFFFF" />
        </View>

        <Text style={[styles.qrCode, { color: c.modalTitle }]}>{code}</Text>

        <TouchableOpacity
          style={[styles.qrDone, { backgroundColor: c.primary }]}
          onPress={onClose}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.qrDoneText}>Done</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
));

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const QuizChallengeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();
  const c = getPalette(isDark);

  const [copied, setCopied] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const handleCopyCode = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(mockDuelData.playerCode);
      setCopied(true);
      AccessibilityInfo.announceForAccessibility('Player code copied');
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      Alert.alert('Could not copy', 'Please try again.');
    }
  }, []);

  const handleLivePress = useCallback(() => {
    // TODO: navigate to the live quiz lobby once the route exists.
    Alert.alert('Live quiz', `The live quiz starts at ${LIVE_QUIZ.startsAt}. You can join from here when it begins.`);
  }, []);

  const handleLeaderboard = useCallback(() => {
    // TODO: navigate to the leaderboard.
    Alert.alert('Leaderboard', 'The leaderboard is coming soon.');
  }, []);

  const duels = mockDuelData.recentDuels;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      {/* Header */}
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={c.title} />
          </TouchableOpacity>
        )}
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: c.title }]}>Quiz challenge</Text>
          <Text style={[styles.subtitle, { color: c.subtitle }]}>Play 1-vs-1 with real exam quizzes</Text>
        </View>

        <TouchableOpacity
          style={[styles.trophyBtn, { backgroundColor: c.trophyBg }]}
          onPress={handleLeaderboard}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Leaderboard"
        >
          <Ionicons name="trophy-outline" size={20} color={c.trophyFg} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live quiz banner */}
        <Pressable
          onPress={handleLivePress}
          accessibilityRole="button"
          accessibilityLabel={`Live quiz at ${LIVE_QUIZ.startsAt}, ${LIVE_QUIZ.learners} learners joined`}
        >
          <LinearGradient
            colors={[c.bannerFrom, c.bannerTo]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
            style={styles.banner}
          >
            <View style={[styles.bannerCircle, { backgroundColor: c.bannerCircle }]} />

            <View style={[styles.livePill, { backgroundColor: c.liveBg }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE QUIZ · {LIVE_QUIZ.startsAt}</Text>
            </View>

            <View style={[styles.playBtn, { backgroundColor: c.playBg }]}>
              <Ionicons name="play" size={14} color="#111827" style={styles.playIcon} />
            </View>

            <Text style={styles.learners}>{LIVE_QUIZ.learners} learners joined</Text>

            <View style={[styles.signRing, { borderColor: c.ringRed }]}>
              <Text style={[styles.signRingText, { color: c.ringText }]}>{LIVE_QUIZ.badge}</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Player code */}
        <View style={[styles.codeCard, { backgroundColor: c.cardBg, borderColor: c.cardBorder }]}>
          <View>
            <Text style={[styles.codeLabel, { color: c.codeLabel }]}>Your player code</Text>
            <Text style={[styles.codeValue, { color: c.codeValue }]} accessibilityLabel={`Player code ${mockDuelData.playerCode.split('').join(' ')}`}>
              {mockDuelData.playerCode}
            </Text>
          </View>

          <View style={styles.codeActions}>
            <TouchableOpacity
              style={[styles.copyBtn, { backgroundColor: c.copyBg, borderColor: c.copyBorder }]}
              onPress={handleCopyCode}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={copied ? 'Player code copied' : 'Copy player code'}
            >
              <Ionicons name={copied ? 'checkmark' : 'document-text'} size={16} color={c.copyText} />
              <Text style={[styles.copyText, { color: c.copyText }]}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.qrBtn, { backgroundColor: c.qrBg }]}
              onPress={() => setQrVisible(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Show QR code"
            >
              <Ionicons name="qr-code" size={18} color={c.qrIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Challenge options */}
        <View style={styles.optionsList}>
          <ActionCard
            c={c}
            icon="people-outline"
            tone="blue"
            title="Challenge a friend"
            subtitle="Send your code — 10 quizzes, 10 s each"
            onPress={() => navigation.navigate('LiveDuel')}
          />
          <ActionCard
            c={c}
            icon="refresh"
            tone="purple"
            title="Random opponent"
            subtitle="Matched with a learner at your level"
            onPress={() => navigation.navigate('LiveDuel')}
          />
          <ActionCard
            c={c}
            icon="trophy-outline"
            tone="orange"
            title="Challenge your batch"
            subtitle="Weekly ranking with your class"
            onPress={() => navigation.navigate('MainTabs', { screen: 'EClass' })}
          />
        </View>

        {/* Recent duels */}
        <Text style={[styles.sectionTitle, { color: c.sectionTitle }]}>RECENT DUELS</Text>
        {duels.length > 0 ? (
          <View style={styles.duelsList}>
            {duels.map((d) => (
              <DuelRow key={d.id} duel={d} c={c} />
            ))}
          </View>
        ) : (
          // No spec in the design yet.
          <Text style={[styles.emptyText, { color: c.emptyText }]}>No duels yet. Challenge a friend to start.</Text>
        )}
      </ScrollView>

      <QrModal visible={qrVisible} code={mockDuelData.playerCode} onClose={() => setQrVisible(false)} c={c} />
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles (measured from the 780x1688 @2x design F1, values in pt)            */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header (text block y 51-104, trophy 40x40)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4.5,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
    marginLeft: -4,
  },
  headerText: { flex: 1, marginRight: 12 },
  title: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.4,
    includeFontPadding: false,
  },
  subtitle: {
    marginTop: 2.5,
    fontSize: 13.5,
    lineHeight: 18,
    includeFontPadding: false,
  },
  trophyBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },

  // Live banner: 350 x 120, decorations are absolutely positioned like the design
  banner: {
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
  },
  bannerCircle: {
    position: 'absolute',
    left: -8,
    top: 36.5,
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  livePill: {
    position: 'absolute',
    left: 12,
    top: 12,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 11,
    gap: 4,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#FFFFFF' },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  playBtn: {
    position: 'absolute',
    left: 84,
    top: 46.5,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { marginLeft: 1.5 },
  learners: {
    position: 'absolute',
    left: 12.5,
    bottom: 11,
    color: '#FFFFFF',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '600',
    includeFontPadding: false,
  },
  signRing: {
    position: 'absolute',
    left: 182,
    top: 25,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signRingText: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -1,
    includeFontPadding: false,
  },

  // Player code card: 66.5 tall
  codeCard: {
    marginTop: 12.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11.5,
    paddingHorizontal: 13.5,
    borderRadius: 20,
    borderWidth: 1,
  },
  codeLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    includeFontPadding: false,
  },
  codeValue: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: 2.5,
    includeFontPadding: false,
  },
  codeActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  copyBtn: {
    minWidth: 81.5,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 9,
  },
  copyText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    includeFontPadding: false,
  },
  qrBtn: {
    width: 49,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Action cards: 66 tall, pitch 76.5
  optionsList: { marginTop: 13.5, rowGap: 10.5 },
  actionCard: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: { flex: 1, marginRight: 8 },
  actionTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    includeFontPadding: false,
  },
  actionSub: {
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
  },

  // Recent duels: plain rows (no card), 32 tall, gap 10
  sectionTitle: {
    marginTop: 13,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    includeFontPadding: false,
  },
  duelsList: { rowGap: 10 },
  duelRow: { height: 32, flexDirection: 'row', alignItems: 'center' },
  initialsBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
  opponentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '600',
    includeFontPadding: false,
  },
  scoreText: {
    marginHorizontal: 11,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  resultBadge: {
    height: 20,
    paddingHorizontal: 9.5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    includeFontPadding: false,
  },
  emptyText: { fontSize: 13, lineHeight: 18 },

  // QR modal (no design yet)
  qrBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  qrCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  qrTitle: { fontSize: 17, lineHeight: 22, fontWeight: '800' },
  qrSub: { marginTop: 4, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  qrBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  qrCode: { marginTop: 14, fontSize: 20, fontWeight: '800', letterSpacing: 2.5 },
  qrDone: {
    marginTop: 18,
    height: 44,
    alignSelf: 'stretch',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrDoneText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});