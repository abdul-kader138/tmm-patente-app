import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TeacherChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [messageText, setMessageText] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={[styles.avatarBox, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>SM</Text>
              <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
            </View>
            <View>
              <Text style={[styles.teacherName, { color: colors.textPrimary }]}>Sara M.</Text>
              <Text style={[styles.teacherStatus, { color: colors.textMuted }]}>
                Instructor · usually replies in 2h
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.videoCallBtn}>
            <Ionicons name="videocam-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Messages Stream */}
        <ScrollView contentContainerStyle={styles.messagesList} showsVerticalScrollIndicator={false}>
          {/* Date stamp */}
          <View style={[styles.dateStamp, { backgroundColor: colors.chipBackground }]}>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>Today</Text>
          </View>

          {/* User message with Attached Quiz Snippet */}
          <View style={styles.userBubbleWrapper}>
            <View style={[styles.userBubble, { backgroundColor: colors.primary }]}>
              {/* Attached Quiz Card */}
              <View style={styles.attachedQuizCard}>
                <View style={styles.attachedQuizHeader}>
                  <Text style={styles.quizMetaText}>QUIZ #4 · CHAPTER 2</Text>
                  <View style={styles.quizAnswerTag}>
                    <Text style={styles.quizAnswerTagText}>V</Text>
                  </View>
                </View>
                <Text style={styles.attachedQuizText}>
                  Il segnale preannuncia un passaggio a livello con barriere
                </Text>
              </View>

              <Text style={styles.userMsgText}>
                Why is this true? I thought barriers only appear when a train comes.
              </Text>
            </View>
          </View>

          {/* Teacher Text Reply */}
          <View style={styles.teacherBubbleWrapper}>
            <View style={[styles.teacherAvatarMini, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.teacherMiniText, { color: colors.primary }]}>SM</Text>
            </View>
            <View style={[styles.teacherBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.teacherMsgText, { color: colors.textPrimary }]}>
                Good question! The fence on the sign means the crossing HAS barriers — they close
                when a train is coming.
              </Text>
            </View>
          </View>

          {/* Teacher Voice Note */}
          <View style={styles.teacherBubbleWrapper}>
            <View style={[styles.teacherAvatarMini, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.teacherMiniText, { color: colors.primary }]}>SM</Text>
            </View>
            <View style={[styles.teacherVoiceBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.voicePlayRow}>
                <TouchableOpacity style={[styles.voicePlayBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.waveformMock}>
                  <Ionicons name="stats-chart" size={18} color={colors.primary} />
                </View>
                <Text style={[styles.voiceDuration, { color: colors.textMuted }]}>0:38</Text>
              </View>
              <Text style={[styles.voiceSubtext, { color: colors.textMuted }]}>
                I explained it in Bangla too
              </Text>
            </View>
          </View>

          {/* User Confirmation Reply */}
          <View style={styles.userBubbleWrapper}>
            <View style={[styles.userBubble, { backgroundColor: colors.primary }]}>
              <Text style={styles.userMsgText}>Clear now, thank you!</Text>
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { borderTopColor: colors.borderLight, backgroundColor: colors.surface }]}>
          <TouchableOpacity style={[styles.plusBtn, { backgroundColor: colors.chipBackground }]}>
            <Ionicons name="add" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.inputContainer, { backgroundColor: colors.chipBackground }]}>
            <TextInput
              placeholder="Write a message..."
              placeholderTextColor={colors.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              style={[styles.textInput, { color: colors.textPrimary }]}
            />
            <TouchableOpacity style={styles.inputInnerBtn}>
              <Ionicons name="image-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.micBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="mic" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  teacherName: {
    fontSize: 15,
    fontWeight: '700',
  },
  teacherStatus: {
    fontSize: 11,
  },
  videoCallBtn: {
    padding: 6,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 14,
  },
  dateStamp: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
  },
  userBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: 12,
    borderBottomRightRadius: 4,
  },
  attachedQuizCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  attachedQuizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quizMetaText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  quizAnswerTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quizAnswerTagText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
  },
  attachedQuizText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  userMsgText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  teacherBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  teacherAvatarMini: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherMiniText: {
    fontSize: 10,
    fontWeight: '700',
  },
  teacherBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    borderBottomLeftRadius: 4,
  },
  teacherMsgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  teacherVoiceBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    borderBottomLeftRadius: 4,
    gap: 4,
  },
  voicePlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voicePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformMock: {
    flex: 1,
  },
  voiceDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  voiceSubtext: {
    fontSize: 11,
    marginLeft: 42,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },
  inputInnerBtn: {
    padding: 4,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
