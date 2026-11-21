import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Keyboard,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/* Types & seed data                                                          */
/* -------------------------------------------------------------------------- */

interface QuizAttachment {
  meta: string;
  answer: string;
  text: string;
}

interface ChatMessage {
  id: string;
  sender: 'me' | 'teacher';
  text?: string;
  quiz?: QuizAttachment;
  image?: { uri: string; aspectRatio: number };
  voice?: { duration: string; caption?: string };
}

/** TODO: replace with the real conversation source (API / store). */
const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'seed-1',
    sender: 'me',
    quiz: {
      meta: 'QUIZ #4 · CHAPTER 2',
      answer: 'V',
      text: 'Il segnale preannuncia un passaggio a livello con barriere',
    },
    text: 'Why is this true? I thought barriers only appear when a train comes.',
  },
  {
    id: 'seed-2',
    sender: 'teacher',
    text: 'Good question! The fence on the sign means the crossing HAS barriers — they close when a train is coming.',
  },
  {
    id: 'seed-3',
    sender: 'teacher',
    voice: { duration: '0:38', caption: 'I explained it in Bangla too' },
  },
  { id: 'seed-4', sender: 'me', text: 'Clear now, thank you!' },
];

/* Emoji picker content (plain unicode — no extra package needed) */
const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘',
  '😋', '😜', '🤪', '🤔', '🤨', '😐', '😶', '🙄', '😏', '😌', '😔', '😴', '😮', '😲', '😳', '🥺',
  '😢', '😭', '😤', '😡', '🤯', '😱', '😓', '🤗', '🤝', '👍', '👎', '👏', '🙌', '🙏', '💪', '👌',
  '✌️', '🤞', '👋', '❤️', '🧡', '💛', '💚', '💙', '💜', '💔', '🔥', '⭐', '✨', '🎉', '💯', '✅',
  '❌', '⚠️', '🚗', '🚦', '🛑', '🚸', '🚧', '🅿️', '📚', '📝', '💡', '❓', '❗', '🏁', '🎯', '🏆',
];
const EMOJI_COLUMNS = 8;

/* Teacher accent (the mockup uses violet for the instructor, blue for the learner). */
const TEACHER_BG = '#EFE9FD';
const TEACHER_TEXT = '#5B2BD9';
const VOICE_BTN = '#7A4FF3';
const WAVE_COLOR = '#DAD8EE';

/* Quiz "true" tag */
const TAG_BG = '#DDF5E7';
const TAG_TEXT = '#0E7A45';

/* Bar heights (dp) of the voice-note waveform, 38 bars */
const WAVE_HEIGHTS = [
  6, 9, 5, 8, 12, 6, 10, 14, 8, 12, 17, 9, 13, 6, 10, 15, 8, 12, 17, 10, 14, 7, 11, 16, 9, 13, 6,
  12, 17, 8, 11, 15, 7, 10, 13, 6, 9, 5,
];


/** Picks readable status-bar icons for a given background colour (#RGB / #RRGGBB). */
const statusBarStyleFor = (background: string): 'dark' | 'light' | 'auto' => {
  const hex = background.replace('#', '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return 'auto';
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
};

/* -------------------------------------------------------------------------- */
/* Small drawn icons                                                          */
/* -------------------------------------------------------------------------- */

/** "Screen with a play triangle" icon from the header's video button. */
const PlayBoxGlyph: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      width: 15,
      height: 12.5,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        marginLeft: 1,
        width: 0,
        height: 0,
        borderLeftWidth: 4.5,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderLeftColor: color,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      }}
    />
  </View>
);

const PlayTriangle: React.FC = () => (
  <View
    style={{
      marginLeft: 1.5,
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderTopWidth: 4.75,
      borderBottomWidth: 4.75,
      borderLeftColor: '#FFFFFF',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    }}
  />
);

const Waveform: React.FC = () => (
  <View style={styles.waveform}>
    {WAVE_HEIGHTS.map((h, i) => (
      <View key={i} style={[styles.waveBar, { height: h }]} />
    ))}
  </View>
);

/* -------------------------------------------------------------------------- */
/* Message bubbles                                                            */
/* -------------------------------------------------------------------------- */

const MessageBubble: React.FC<{ message: ChatMessage }> = React.memo(({ message }) => {
  const { colors } = useTheme();
  const { sender, text, quiz, image, voice } = message;

  if (sender === 'me') {
    const imageOnly = !!image && !text && !quiz;
    return (
      <View style={styles.userBubbleWrapper}>
        <View
          style={[
            styles.userBubble,
            { backgroundColor: colors.primary },
            image && styles.userBubbleImage,
            imageOnly && styles.userBubbleImageOnly,
          ]}
        >
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={[styles.bubbleImage, { aspectRatio: image.aspectRatio }, !!text && styles.bubbleImageWithText]}
              resizeMode="cover"
              accessibilityLabel="Sent photo"
            />
          ) : null}

          {quiz ? (
            <View style={styles.attachedQuizCard}>
              <View style={styles.attachedQuizHeader}>
                <Text style={styles.quizMetaText}>{quiz.meta}</Text>
                <View style={styles.quizAnswerTag}>
                  <Text style={styles.quizAnswerTagText}>{quiz.answer}</Text>
                </View>
              </View>
              <Text style={styles.attachedQuizText}>{quiz.text}</Text>
            </View>
          ) : null}

          {text ? (
            <Text style={[styles.userMsgText, image && styles.captionText]}>{text}</Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.teacherRow}>
      <View style={styles.teacherAvatarMini}>
        <Text style={styles.teacherMiniText}>SM</Text>
      </View>
      {voice ? (
        <View
          style={[styles.teacherVoiceBubble, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.voicePlayRow}>
            <TouchableOpacity
              style={styles.voicePlayBtn}
              accessibilityRole="button"
              accessibilityLabel="Play voice note"
            >
              <PlayTriangle />
            </TouchableOpacity>
            <Waveform />
            <Text style={[styles.voiceDuration, { color: colors.textPrimary }]}>{voice.duration}</Text>
          </View>
          {voice.caption ? (
            <Text style={[styles.voiceSubtext, { color: colors.textMuted }]}>{voice.caption}</Text>
          ) : null}
        </View>
      ) : (
        <View style={[styles.teacherBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.teacherMsgText, { color: colors.textPrimary }]}>{text}</Text>
        </View>
      )}
    </View>
  );
});

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export const TeacherChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [messageText, setMessageText] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [pendingImage, setPendingImage] = useState<ChatMessage['image'] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const idCounter = useRef(0);

  const canSend = messageText.trim().length > 0 || !!pendingImage;

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  }, [navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menuOpen) {
        setMenuOpen(false);
        return true;
      }
      if (emojiOpen) {
        setEmojiOpen(false);
        return true;
      }
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, [handleBack, menuOpen, emojiOpen]);

  /* ---------------------------- attachments ---------------------------- */

  const pickFromGallery = useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.8,
      });
      if (res.canceled || !res.assets?.length) return;
      const asset = res.assets[0];
      const ratio = asset.width && asset.height ? asset.width / asset.height : 4 / 3;
      // Keep the bubble sensible for very tall / very wide photos.
      setPendingImage({ uri: asset.uri, aspectRatio: Math.min(1.8, Math.max(0.6, ratio)) });
    } catch {
      Alert.alert('Gallery', "Couldn't open your photo library. Please try again.");
    }
  }, []);

  const openMenu = useCallback(() => {
    Keyboard.dismiss();
    setEmojiOpen(false);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handlePickPhotoOption = useCallback(() => {
    setMenuOpen(false);
    // iOS cannot present the picker while the Modal is still dismissing.
    setTimeout(pickFromGallery, Platform.OS === 'ios' ? 400 : 0);
  }, [pickFromGallery]);

  const handleEmojiOption = useCallback(() => {
    setMenuOpen(false);
    Keyboard.dismiss();
    setEmojiOpen(true);
  }, []);

  const backToKeyboard = useCallback(() => {
    setEmojiOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const insertEmoji = useCallback(
    (emoji: string) => {
      const { start, end } = selection;
      const next = messageText.slice(0, start) + emoji + messageText.slice(end);
      const pos = start + emoji.length;
      setMessageText(next);
      setSelection({ start: pos, end: pos });
    },
    [messageText, selection],
  );

  const onSelectionChange = useCallback((e: any) => {
    if (e?.nativeEvent?.selection) {
      setSelection(e.nativeEvent.selection);
    }
  }, []);

  /* ------------------------------- sending ------------------------------ */

  const handleSend = useCallback(() => {
    const text = messageText.trim();
    if (!text && !pendingImage) return;

    idCounter.current += 1;
    const outgoing: ChatMessage = {
      id: `local-${Date.now()}-${idCounter.current}`,
      sender: 'me',
      text: text || undefined,
      image: pendingImage ?? undefined,
    };

    // TODO: call the chat API here and reconcile the id / delivery state from the response.
    setMessages((prev) => [...prev, outgoing]);
    setMessageText('');
    setSelection({ start: 0, end: 0 });
    setPendingImage(null);
  }, [messageText, pendingImage]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.avatarBox, { backgroundColor: TEACHER_BG }]}>
            <Text style={[styles.avatarText, { color: TEACHER_TEXT }]}>SM</Text>
            <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
          </View>

          <View style={styles.headerText}>
            <Text style={[styles.teacherName, { color: colors.textPrimary }]}>Sara M.</Text>
            <Text style={[styles.teacherStatus, { color: colors.textMuted }]} numberOfLines={1}>
              Instructor · usually replies in 2h
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel="Start video call"
          >
            <PlayBoxGlyph color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={listRef}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Date stamp */}
          <View style={[styles.dateStamp, { backgroundColor: colors.chipBackground }]}>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>Today</Text>
          </View>

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </ScrollView>

        {/* Pending photo preview */}
        {pendingImage ? (
          <View style={[styles.pendingBar, { backgroundColor: colors.background, borderTopColor: colors.borderLight }]}>
            <View>
              <Image source={{ uri: pendingImage.uri }} style={styles.pendingThumb} />
              <TouchableOpacity
                style={[styles.pendingRemove, { backgroundColor: colors.textPrimary }]}
                onPress={() => setPendingImage(null)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <Ionicons name="close" size={12} color={colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            { borderTopColor: colors.borderLight, backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity
            style={[styles.plusBtn, { backgroundColor: colors.chipBackground }]}
            onPress={openMenu}
            accessibilityRole="button"
            accessibilityLabel="Attach"
          >
            <Ionicons name="add" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.inputContainer, { backgroundColor: colors.chipBackground }]}>
            <TextInput
              ref={inputRef}
              placeholder="Write a message..."
              placeholderTextColor={colors.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              selection={selection}
              onSelectionChange={onSelectionChange}
              onFocus={() => setEmojiOpen(false)}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSend}
              style={[styles.textInput, { color: colors.textPrimary }]}
            />
            <TouchableOpacity
              style={styles.inputInnerBtn}
              onPress={pickFromGallery}
              accessibilityRole="button"
              accessibilityLabel="Add image"
            >
              <Ionicons name="image-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {canSend ? (
            <TouchableOpacity
              style={[styles.micBtn, { backgroundColor: colors.primary }]}
              onPress={handleSend}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.micBtn, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Record voice message"
            >
              <Ionicons name="mic-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Emoji panel (replaces the keyboard) */}
        {emojiOpen ? (
          <View style={[styles.emojiPanel, { backgroundColor: colors.background, borderTopColor: colors.borderLight }]}>
            <View style={styles.emojiHeader}>
              <Text style={[styles.emojiTitle, { color: colors.textPrimary }]}>Emoji</Text>
              <TouchableOpacity
                onPress={backToKeyboard}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Back to keyboard"
              >
                <Ionicons name="keypad-outline" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.emojiGrid} showsVerticalScrollIndicator={false}>
              {EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={styles.emojiCell}
                  onPress={() => insertEmoji(e)}
                  accessibilityRole="button"
                  accessibilityLabel={`Insert ${e}`}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </KeyboardAvoidingView>

      {/* Attachment menu */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu} statusBarTranslucent>
        <Pressable style={styles.backdrop} onPress={closeMenu} accessibilityLabel="Close menu">
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: 16 + insets.bottom }]}
            onPress={() => {}}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.sheetRow}
              onPress={handlePickPhotoOption}
              accessibilityRole="button"
              accessibilityLabel="Photo from gallery"
            >
              <View style={[styles.sheetIcon, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="images-outline" size={22} color={colors.textPrimary} />
              </View>
              <View style={styles.sheetTextCol}>
                <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Photo</Text>
                <Text style={[styles.sheetSub, { color: colors.textMuted }]}>Choose from your gallery</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetRow}
              onPress={handleEmojiOption}
              accessibilityRole="button"
              accessibilityLabel="Emoji"
            >
              <View style={[styles.sheetIcon, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="happy-outline" size={22} color={colors.textPrimary} />
              </View>
              <View style={styles.sheetTextCol}>
                <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Emoji</Text>
                <Text style={[styles.sheetSub, { color: colors.textMuted }]}>Add an emoji to your message</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default TeacherChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', includeFontPadding: false },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerText: { flex: 1, marginLeft: 12, marginRight: 8 },
  teacherName: { fontSize: 15, lineHeight: 19, fontWeight: '700' },
  teacherStatus: { fontSize: 11, lineHeight: 14, marginTop: 2 },

  /* Messages */
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
    gap: 11,
  },
  dateStamp: {
    alignSelf: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
  },
  dateText: { fontSize: 10.5, lineHeight: 13.5, fontWeight: '600' },

  userBubbleWrapper: { alignItems: 'flex-end' },
  userBubble: {
    width: '75%',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubbleImage: { paddingHorizontal: 4, paddingTop: 4, paddingBottom: 4 },
  userBubbleImageOnly: { width: '60%' },
  bubbleImage: { width: '100%', borderRadius: 16, borderBottomRightRadius: 4 },
  bubbleImageWithText: { marginBottom: 6 },
  captionText: { paddingHorizontal: 10, paddingBottom: 6 },
  attachedQuizCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 9,
  },
  attachedQuizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quizMetaText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quizAnswerTag: {
    height: 21,
    minWidth: 26,
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: TAG_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizAnswerTagText: { color: TAG_TEXT, fontSize: 12, fontWeight: '700', includeFontPadding: false },
  attachedQuizText: { color: '#FFFFFF', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  userMsgText: { color: '#FFFFFF', fontSize: 14, lineHeight: 19 },

  teacherRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  teacherAvatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEACHER_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherMiniText: { color: TEACHER_TEXT, fontSize: 10, fontWeight: '700', includeFontPadding: false },
  teacherBubble: {
    width: '75%',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8.5,
  },
  teacherMsgText: { fontSize: 14, lineHeight: 19 },
  teacherVoiceBubble: {
    width: '70%',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8.5,
  },
  voicePlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voicePlayBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: VOICE_BTN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    width: 115,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveBar: {
    width: 1.5,
    borderRadius: 1,
    backgroundColor: WAVE_COLOR,
  },
  voiceDuration: { fontSize: 12, fontWeight: '600', opacity: 0.7 },
  voiceSubtext: { fontSize: 12, lineHeight: 15, marginTop: 9 },

  /* Pending photo */
  pendingBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  pendingThumb: { width: 56, height: 56, borderRadius: 12 },
  pendingRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Input bar */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
  },
  textInput: { flex: 1, fontSize: 14, padding: 0 },
  inputInnerBtn: { padding: 3 },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Emoji panel */
  emojiPanel: {
    height: 252,
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  emojiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  emojiTitle: { fontSize: 14, fontWeight: '700' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 12 },
  emojiCell: {
    width: `${100 / EMOJI_COLUMNS}%`,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 26 },

  /* Attachment sheet */
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.35)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetHandle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, marginBottom: 12 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTextCol: { flex: 1 },
  sheetTitle: { fontSize: 15, lineHeight: 20, fontWeight: '700' },
  sheetSub: { fontSize: 12, lineHeight: 16, marginTop: 1 },
});