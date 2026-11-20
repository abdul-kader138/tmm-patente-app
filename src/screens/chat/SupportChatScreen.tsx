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

export const SupportChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<'chat' | 'results'>('chat');
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={[styles.supportAvatar, { backgroundColor: colors.successLight }]}>
              <Ionicons name="headset" size={20} color={colors.success} />
              <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
            </View>
            <View>
              <Text style={[styles.supportTitle, { color: colors.textPrimary }]}>TMM Support</Text>
              <Text style={[styles.supportStatus, { color: colors.textMuted }]}>
                Usually replies within 1 hour · 24/7
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.targetBtn}>
            <Ionicons name="radio-button-on-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Tab Controls */}
        <View style={[styles.tabsRow, { backgroundColor: colors.chipBackground }]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'chat' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('chat')}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === 'chat' ? colors.textPrimary : colors.textMuted },
              ]}
            >
              Chat · 12
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'results' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('results')}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === 'results' ? colors.textPrimary : colors.textMuted },
              ]}
            >
              Test results · 0
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat History */}
        <ScrollView contentContainerStyle={styles.messagesList} showsVerticalScrollIndicator={false}>
          {/* User Receipt Upload */}
          <View style={styles.userBubbleWrapper}>
            <View style={styles.receiptAttachmentCard}>
              <View style={styles.receiptPlaceholder}>
                <Ionicons name="document-text" size={32} color="#FFFFFF" />
                <View style={styles.receiptFilenameBadge}>
                  <Text style={styles.receiptFilename}>Payment receipt.jpg</Text>
                </View>
              </View>
              <Text style={styles.timestampText}>23:10</Text>
            </View>

            <View style={[styles.userBubble, { backgroundColor: colors.primary }]}>
              <Text style={styles.userMsgText}>
                Hi! I paid by bank transfer, here is the receipt.
              </Text>
            </View>
          </View>

          {/* Support License Key Card Response */}
          <View style={[styles.licenseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.licenseCardHeader}>
              <View style={[styles.licenseIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="car" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.licenseTitle, { color: colors.textPrimary }]}>
                  Licence key · Patente B
                </Text>
                <Text style={[styles.licenseSub, { color: colors.textMuted }]}>
                  180 days · activated today
                </Text>
              </View>
            </View>

            {/* Features Checklist */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Ionicons name="book-outline" size={16} color={colors.textPrimary} />
                <Text style={[styles.featureName, { color: colors.textPrimary }]}>Dictionary</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Ionicons name="volume-high-outline" size={16} color={colors.textPrimary} />
                <Text style={[styles.featureName, { color: colors.textPrimary }]}>
                  Audio explanations
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Ionicons name="play-circle-outline" size={16} color={colors.textPrimary} />
                <Text style={[styles.featureName, { color: colors.textPrimary }]}>Video lessons</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Ionicons name="people-outline" size={16} color={colors.textPrimary} />
                <Text style={[styles.featureName, { color: colors.textPrimary }]}>
                  Recorded live classes
                </Text>
              </View>
            </View>

            <View style={[styles.validityRow, { borderTopColor: colors.borderLight }]}>
              <Text style={[styles.validityLabel, { color: colors.textMuted }]}>Valid until</Text>
              <Text style={[styles.validityDate, { color: colors.textPrimary }]}>25 Jan 2027</Text>
            </View>
          </View>

          {/* Activation pill badge */}
          <View style={[styles.activationPill, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark" size={14} color={colors.success} />
            <Text style={[styles.activationText, { color: colors.success }]}>
              Application activated · 23:13
            </Text>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { borderTopColor: colors.borderLight, backgroundColor: colors.surface }]}>
          <View style={[styles.inputContainer, { backgroundColor: colors.chipBackground }]}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              style={[styles.textInput, { color: colors.textPrimary }]}
            />
            <TouchableOpacity style={styles.inputInnerBtn}>
              <Ionicons name="mic-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputInnerBtn}>
              <Ionicons name="image-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
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
  supportAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  supportStatus: {
    fontSize: 11,
  },
  targetBtn: {
    padding: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
    gap: 6,
  },
  receiptAttachmentCard: {
    alignItems: 'flex-end',
  },
  receiptPlaceholder: {
    width: 200,
    height: 130,
    borderRadius: 16,
    backgroundColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  receiptFilenameBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  receiptFilename: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  timestampText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  userBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: 12,
    borderBottomRightRadius: 4,
  },
  userMsgText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  licenseCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  licenseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  licenseIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  licenseSub: {
    fontSize: 12,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureName: {
    fontSize: 14,
    fontWeight: '600',
  },
  validityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  validityLabel: {
    fontSize: 12,
  },
  validityDate: {
    fontSize: 14,
    fontWeight: '800',
  },
  activationPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  activationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },
  inputInnerBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
