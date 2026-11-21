import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'chat' | 'results';
type FeatureKey = 'dictionary' | 'audio' | 'video' | 'live';

/* -------------------------------------------------------------------------- */
/* Data model                                                                 */
/* -------------------------------------------------------------------------- */

type ChatMessage =
  | { id: string; kind: 'text'; from: 'user' | 'support'; text: string; time: string }
  | { id: string; kind: 'image'; from: 'user' | 'support'; uri?: string; filename: string; time: string }
  | {
      id: string;
      kind: 'licence';
      title: string;
      subtitle: string;
      features: FeatureKey[];
      validUntil: string;
    }
  | { id: string; kind: 'event'; label: string; time: string };

const FEATURE_LABELS: Record<FeatureKey, string> = {
  dictionary: 'Dictionary',
  audio: 'Audio explanations',
  video: 'Video lessons',
  live: 'Recorded live classes',
};

// TODO: replace with the real conversation (API / websocket). This is the design snapshot.
const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm1', kind: 'image', from: 'user', filename: 'Payment receipt.jpg', time: '23:10' },
  {
    id: 'm2',
    kind: 'text',
    from: 'user',
    text: 'Hi! I paid by bank transfer, here is the receipt.',
    time: '23:10',
  },
  {
    id: 'm3',
    kind: 'licence',
    title: 'Licence key · Patente B',
    subtitle: '180 days · activated today',
    features: ['dictionary', 'audio', 'video', 'live'],
    validUntil: '25 Jan 2027',
  },
  { id: 'm4', kind: 'event', label: 'Application activated', time: '23:13' },
];

// TODO: derive from the backend. Static counts from the design.
const TAB_COUNTS = { chat: 12, results: 0 };
const SUPPORT_ONLINE = true;
const BOTTOM_STICK_THRESHOLD = 80;

const pad = (n: number) => String(n).padStart(2, '0');
const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/* -------------------------------------------------------------------------- */
/* Palette (light + dark)                                                     */
/* -------------------------------------------------------------------------- */

const getPalette = (isDark: boolean) => ({
  screenBg: isDark ? '#0A0E18' : '#F4F6FB',

  btnBg: isDark ? '#1C253D' : '#FFFFFF',
  btnIcon: isDark ? '#FFFFFF' : '#0F172A',
  headerTitle: isDark ? '#FFFFFF' : '#0F172A',
  headerSub: isDark ? '#8F9BB3' : '#98A2B3',
  avatarBg: '#12B76A',
  dotRing: isDark ? '#0A0E18' : '#FFFFFF',

  tabsBg: isDark ? '#131A2A' : '#ECEEF4',
  tabActiveBg: isDark ? '#1E293B' : '#FFFFFF',
  tabActiveText: isDark ? '#FFFFFF' : '#0F172A',
  tabInactiveText: isDark ? '#8F9BB3' : '#98A2B3',

  imgFrom: '#68788F',
  imgTo: '#93A0B7',
  imgBadgeBg: 'rgba(30,41,59,0.85)',
  timestamp: isDark ? '#8F9BB3' : '#98A2B3',

  userBubble: isDark ? '#4C74FF' : '#2D5BFF',
  supportBubbleBg: isDark ? '#131A2A' : '#FFFFFF',
  supportBubbleBorder: isDark ? '#1E293B' : '#E8EAF1',
  supportBubbleText: isDark ? '#FFFFFF' : '#0F172A',

  cardBg: isDark ? '#131A2A' : '#FFFFFF',
  cardBorder: isDark ? '#1E293B' : '#E8EAF1',
  cardIconBg: isDark ? '#1B2552' : '#E8EEFF',
  cardIcon: isDark ? '#60A5FA' : '#2D5BFF',
  cardTitle: isDark ? '#FFFFFF' : '#0F172A',
  cardSub: isDark ? '#8F9BB3' : '#98A2B3',
  check: '#12B76A',
  featureIcon: isDark ? '#CBD5E1' : '#475467',
  featureText: isDark ? '#FFFFFF' : '#0F172A',
  divider: isDark ? '#1E293B' : '#ECEEF3',
  validLabel: isDark ? '#8F9BB3' : '#98A2B3',
  validDate: isDark ? '#FFFFFF' : '#0F172A',

  eventBg: isDark ? '#0C2B20' : '#E3F6EC',
  eventText: isDark ? '#34D399' : '#067647',

  inputBarBorder: isDark ? '#1E293B' : '#E6E8EF',
  inputBg: isDark ? '#131A2A' : '#ECEEF4',
  inputText: isDark ? '#FFFFFF' : '#0F172A',
  placeholder: isDark ? '#64748B' : '#98A2B3',
  inputIcon: isDark ? '#8F9BB3' : '#8B95A8',
  send: isDark ? '#4C74FF' : '#2D5BFF',

  emptyIcon: isDark ? '#334155' : '#C4CAD6',
  emptyTitle: isDark ? '#FFFFFF' : '#0F172A',
  emptySub: isDark ? '#8F9BB3' : '#98A2B3',
});

type Palette = ReturnType<typeof getPalette>;

/* -------------------------------------------------------------------------- */
/* Header button (40x40 rounded square)                                       */
/* -------------------------------------------------------------------------- */

const HeaderButton = memo(
  ({
    c,
    icon,
    size,
    label,
    onPress,
  }: {
    c: Palette;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    size: number;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.headerBtn, { backgroundColor: c.btnBg }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={size} color={c.btnIcon} />
    </TouchableOpacity>
  ),
);

/* -------------------------------------------------------------------------- */
/* Message renderers                                                          */
/* -------------------------------------------------------------------------- */

const ImageMessage = memo(
  ({ m, c }: { m: Extract<ChatMessage, { kind: 'image' }>; c: Palette }) => (
    <View style={[styles.imageWrap, m.from === 'user' ? styles.alignRight : styles.alignLeft]}>
      <View style={styles.imageBox}>
        {m.uri ? (
          <Image source={{ uri: m.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[c.imgFrom, c.imgTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.imagePlaceholder]}
          >
            <Ionicons name="document-text-outline" size={28} color="rgba(255,255,255,0.85)" />
          </LinearGradient>
        )}
        <View style={[styles.filenameBadge, { backgroundColor: c.imgBadgeBg }]}>
          <Text style={styles.filenameText} numberOfLines={1}>
            {m.filename}
          </Text>
        </View>
      </View>
      <Text style={[styles.timestamp, { color: c.timestamp }]}>{m.time}</Text>
    </View>
  ),
);

const TextMessage = memo(
  ({
    m,
    c,
    showTime,
    onToggleTime,
  }: {
    m: Extract<ChatMessage, { kind: 'text' }>;
    c: Palette;
    showTime: boolean;
    onToggleTime: (id: string) => void;
  }) => {
    const mine = m.from === 'user';
    return (
      <View style={mine ? styles.alignRight : styles.alignLeft}>
        <Pressable
          onPress={() => onToggleTime(m.id)}
          style={[
            styles.bubble,
            mine
              ? { backgroundColor: c.userBubble, maxWidth: '70%', borderBottomRightRadius: 4 }
              : {
                  backgroundColor: c.supportBubbleBg,
                  borderColor: c.supportBubbleBorder,
                  borderWidth: 1,
                  maxWidth: '78%',
                  borderBottomLeftRadius: 4,
                },
          ]}
          accessibilityLabel={`${mine ? 'You' : 'Support'}: ${m.text}`}
        >
          <Text style={[styles.bubbleText, { color: mine ? '#FFFFFF' : c.supportBubbleText }]}>{m.text}</Text>
        </Pressable>
        {showTime && <Text style={[styles.timestamp, { color: c.timestamp }]}>{m.time}</Text>}
      </View>
    );
  },
);

const FEATURE_ICON: Record<
  FeatureKey,
  { set: 'ion'; name: React.ComponentProps<typeof Ionicons>['name'] } | { set: 'mci'; name: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }
> = {
  dictionary: { set: 'ion', name: 'book-outline' },
  audio: { set: 'ion', name: 'volume-high-outline' },
  video: { set: 'mci', name: 'play-box-outline' },
  live: { set: 'ion', name: 'people-outline' },
};

const LicenceCard = memo(
  ({ m, c }: { m: Extract<ChatMessage, { kind: 'licence' }>; c: Palette }) => (
    <View style={[styles.licenceCard, { backgroundColor: c.cardBg, borderColor: c.cardBorder }]}>
      <View style={styles.licenceHeader}>
        <View style={[styles.licenceIconBox, { backgroundColor: c.cardIconBg }]}>
          <Ionicons name="car" size={22} color={c.cardIcon} />
        </View>
        <View style={styles.licenceHeaderText}>
          <Text style={[styles.licenceTitle, { color: c.cardTitle }]} numberOfLines={1}>
            {m.title}
          </Text>
          <Text style={[styles.licenceSub, { color: c.cardSub }]} numberOfLines={1}>
            {m.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.featuresList}>
        {m.features.map((f) => {
          const icon = FEATURE_ICON[f];
          return (
            <View key={f} style={styles.featureRow}>
              <View style={[styles.checkCircle, { backgroundColor: c.check }]}>
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
              <View style={styles.featureIconBox}>
                {icon.set === 'ion' ? (
                  <Ionicons name={icon.name} size={16} color={c.featureIcon} />
                ) : (
                  <MaterialCommunityIcons name={icon.name} size={17} color={c.featureIcon} />
                )}
              </View>
              <Text style={[styles.featureText, { color: c.featureText }]}>{FEATURE_LABELS[f]}</Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.validityRow, { borderTopColor: c.divider }]}>
        <Text style={[styles.validLabel, { color: c.validLabel }]}>Valid until</Text>
        <Text style={[styles.validDate, { color: c.validDate }]}>{m.validUntil}</Text>
      </View>
    </View>
  ),
);

const EventPill = memo(
  ({ m, c }: { m: Extract<ChatMessage, { kind: 'event' }>; c: Palette }) => (
    <View style={[styles.eventPill, { backgroundColor: c.eventBg }]}>
      <Ionicons name="checkmark" size={13} color={c.eventText} />
      <Text style={[styles.eventText, { color: c.eventText }]}>
        {m.label} · {m.time}
      </Text>
    </View>
  ),
);

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const SupportChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const c = getPalette(isDark);

  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [timeShownFor, setTimeShownFor] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const stickToBottomRef = useRef(true);

  /* ---- keyboard: drop the safe-area padding while the keyboard is open ---- */
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, () => setKeyboardVisible(true));
    const h = Keyboard.addListener(hideEvt, () => setKeyboardVisible(false));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  /* ---- scrolling ---- */
  const scrollToEnd = useCallback((animated = true) => {
    listRef.current?.scrollToEnd({ animated });
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    stickToBottomRef.current = distanceFromBottom < BOTTOM_STICK_THRESHOLD;
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (stickToBottomRef.current) scrollToEnd(true);
  }, [scrollToEnd]);

  /* ---- sending ---- */
  const appendMessage = useCallback((msg: ChatMessage) => {
    stickToBottomRef.current = true;
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    // TODO: send through the API / websocket and update status on failure.
    appendMessage({ id: makeId(), kind: 'text', from: 'user', text, time: nowTime() });
    setInputText('');
  }, [inputText, appendMessage]);

  const handlePickImage = useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (res.canceled || !res.assets?.length) return;
      const asset = res.assets[0];
      const filename = asset.fileName ?? asset.uri.split('/').pop() ?? 'Photo.jpg';
      // TODO: upload the file, then replace the local uri with the remote one.
      appendMessage({ id: makeId(), kind: 'image', from: 'user', uri: asset.uri, filename, time: nowTime() });
    } catch {
      Alert.alert('Could not open photos', 'Please try again.');
    }
  }, [appendMessage]);

  const handleMic = useCallback(
    () => Alert.alert('Voice messages', 'Voice messages are coming soon.'),
    [],
  );

  const handleToggleTime = useCallback(
    (id: string) => setTimeShownFor((cur) => (cur === id ? null : id)),
    [],
  );

  /* ---- list ---- */
  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      switch (item.kind) {
        case 'image':
          return <ImageMessage m={item} c={c} />;
        case 'text':
          return (
            <TextMessage m={item} c={c} showTime={timeShownFor === item.id} onToggleTime={handleToggleTime} />
          );
        case 'licence':
          return <LicenceCard m={item} c={c} />;
        case 'event':
          return <EventPill m={item} c={c} />;
      }
    },
    [c, timeShownFor, handleToggleTime],
  );

  const keyExtractor = useCallback((m: ChatMessage) => m.id, []);
  const Separator = useMemo(() => () => <View style={styles.separator} />, []);

  const inputBarBottom = keyboardVisible ? 10 : Math.max(insets.bottom - 7, 10);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderButton c={c} icon="arrow-back" size={20} label="Go back" onPress={navigation.goBack} />

          <View style={[styles.avatar, { backgroundColor: c.avatarBg }]}>
            <Ionicons name="headset-outline" size={21} color="#FFFFFF" />
            {SUPPORT_ONLINE && (
              <View
                style={[styles.onlineDot, { backgroundColor: c.avatarBg, borderColor: c.dotRing }]}
                accessibilityLabel="Online"
              />
            )}
          </View>

          <View style={styles.headerText}>
            <Text style={[styles.supportTitle, { color: c.headerTitle }]} numberOfLines={1}>
              TMM Support
            </Text>
            <Text style={[styles.supportStatus, { color: c.headerSub }]} numberOfLines={1}>
              Usually replies within 1 hour · 24/7
            </Text>
          </View>

          {/* TODO: no spec for this action yet. */}
          <HeaderButton c={c} icon="radio-button-on-outline" size={20} label="Support options" onPress={() => {}} />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsRow, { backgroundColor: c.tabsBg }]} accessibilityRole="tablist">
          {(
            [
              { key: 'chat', label: `Chat · ${TAB_COUNTS.chat}` },
              { key: 'results', label: `Test results · ${TAB_COUNTS.results}` },
            ] as const
          ).map((t) => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tabBtn, active && [styles.tabBtnActive, { backgroundColor: c.tabActiveBg }]]}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.8}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, { color: active ? c.tabActiveText : c.tabInactiveText }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'chat' ? (
          <>
            <FlatList
              ref={listRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={Separator}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              onScroll={handleScroll}
              scrollEventThrottle={100}
              onContentSizeChange={handleContentSizeChange}
              onLayout={() => stickToBottomRef.current && scrollToEnd(false)}
              extraData={timeShownFor}
            />

            {/* Input bar */}
            <View
              style={[
                styles.inputBar,
                { borderTopColor: c.inputBarBorder, paddingBottom: inputBarBottom },
              ]}
            >
              <View style={[styles.inputContainer, { backgroundColor: c.inputBg }]}>
                <TextInput
                  placeholder="Type a message…"
                  placeholderTextColor={c.placeholder}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                  blurOnSubmit={false}
                  maxLength={2000}
                  style={[styles.textInput, { color: c.inputText }]}
                  accessibilityLabel="Message"
                />
                <TouchableOpacity
                  style={styles.inputInnerBtn}
                  onPress={handleMic}
                  accessibilityRole="button"
                  accessibilityLabel="Record voice message"
                >
                  <Ionicons name="mic-outline" size={20} color={c.inputIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.inputInnerBtn}
                  onPress={handlePickImage}
                  accessibilityRole="button"
                  accessibilityLabel="Attach photo"
                >
                  <Ionicons name="image-outline" size={20} color={c.inputIcon} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: c.send }]}
                onPress={handleSend}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Send message"
                accessibilityState={{ disabled: !inputText.trim() }}
              >
                <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Empty state: no spec in the design yet.
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={40} color={c.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: c.emptyTitle }]}>No test results yet</Text>
            <Text style={[styles.emptySub, { color: c.emptySub }]}>
              Results you share with support will appear here.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles (measured from the 780x1688 @2x design E4, values in pt)            */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },

  // Header (buttons y 49-89)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 1.5,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  headerText: { flex: 1, marginLeft: 12, marginRight: 8 },
  supportTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
  supportStatus: {
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
  },

  // Tabs: 358 x 38, padding 3, active pill 32 tall
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 13,
    height: 38,
    padding: 3,
    borderRadius: 14,
  },
  tabBtn: {
    flex: 1,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    includeFontPadding: false,
  },

  // Messages
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexGrow: 1,
  },
  separator: { height: 12 },
  alignRight: { alignItems: 'flex-end' },
  alignLeft: { alignItems: 'flex-start' },

  imageWrap: {},
  imageBox: {
    width: 200,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  filenameBadge: {
    position: 'absolute',
    left: 8,
    bottom: 6,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 11,
    justifyContent: 'center',
    maxWidth: 184,
  },
  filenameText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    includeFontPadding: false,
  },
  timestamp: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    includeFontPadding: false,
  },

  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleText: {
    fontSize: 14.5,
    lineHeight: 19,
    includeFontPadding: false,
  },

  // Licence card (78% wide, 200.5 tall)
  licenceCard: {
    width: '78%',
    borderRadius: 22,
    borderWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  licenceHeader: { flexDirection: 'row', alignItems: 'center' },
  licenceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenceHeaderText: { flex: 1, marginLeft: 10 },
  licenceTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    includeFontPadding: false,
  },
  licenceSub: {
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
  },
  featuresList: { marginTop: 8, rowGap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', height: 18 },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconBox: {
    width: 16,
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  featureText: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '500',
    includeFontPadding: false,
  },
  validityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
    paddingTop: 4.5,
    borderTopWidth: 1,
  },
  validLabel: { fontSize: 12, lineHeight: 20, includeFontPadding: false },
  validDate: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
    includeFontPadding: false,
  },

  eventPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 23,
    paddingHorizontal: 10,
    borderRadius: 11.5,
    gap: 6,
  },
  eventText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    includeFontPadding: false,
  },

  // Input bar (hairline at y 767, controls 40 tall)
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 9.5,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 11,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 14.5,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  inputInnerBtn: {
    width: 24,
    height: 24,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Results tab (empty)
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: { fontSize: 15, lineHeight: 20, fontWeight: '700', marginTop: 4 },
  emptySub: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
});