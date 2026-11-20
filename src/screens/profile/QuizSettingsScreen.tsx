import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuizSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [category, setCategory] = useState<'AM' | 'A1/A2' | 'B' | 'C/D'>('B');
  const [questionsCount, setQuestionsCount] = useState(30);
  const [timeLimit, setTimeLimit] = useState(20);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showAnswerInstantly, setShowAnswerInstantly] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [readAloud, setReadAloud] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState('1.0x');

  const categories = [
    { code: 'AM', label: 'Moped' },
    { code: 'A1/A2', label: 'Motorbike' },
    { code: 'B', label: 'Car' },
    { code: 'C/D', label: 'Truck · Bus' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Quiz settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* LICENCE CATEGORY */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LICENCE CATEGORY</Text>
          <View style={styles.categoriesRow}>
            {categories.map((item) => {
              const isSelected = category === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.catCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => setCategory(item.code as any)}
                >
                  <Text
                    style={[
                      styles.catCode,
                      { color: isSelected ? colors.primary : colors.textPrimary },
                    ]}
                  >
                    {item.code}
                  </Text>
                  <Text style={[styles.catLabel, { color: colors.textMuted }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* QUIZ SHEETS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>QUIZ SHEETS</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Questions per sheet */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                Questions per sheet
              </Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={[styles.stepperBtn, { backgroundColor: colors.chipBackground }]}
                  onPress={() => setQuestionsCount((prev) => (prev > 10 ? prev - 5 : 10))}
                >
                  <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: colors.textPrimary }]}>
                  {questionsCount}
                </Text>
                <TouchableOpacity
                  style={[styles.stepperBtn, { backgroundColor: colors.chipBackground }]}
                  onPress={() => setQuestionsCount((prev) => (prev < 60 ? prev + 5 : 60))}
                >
                  <Ionicons name="add" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            {/* Time limit */}
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Time limit</Text>
                <Text style={[styles.settingSubtext, { color: colors.textMuted }]}>
                  Ministerial: 20 minutes
                </Text>
              </View>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={[styles.stepperBtn, { backgroundColor: colors.chipBackground }]}
                  onPress={() => setTimeLimit((prev) => (prev > 10 ? prev - 5 : 10))}
                >
                  <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: colors.textPrimary }]}>{timeLimit}</Text>
                <TouchableOpacity
                  style={[styles.stepperBtn, { backgroundColor: colors.chipBackground }]}
                  onPress={() => setTimeLimit((prev) => (prev < 40 ? prev + 5 : 40))}
                >
                  <Ionicons name="add" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            {/* Shuffle questions */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                Shuffle questions
              </Text>
              <Switch
                value={shuffleQuestions}
                onValueChange={setShuffleQuestions}
                trackColor={{ false: colors.indicatorInactive, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            {/* Show answer after each quiz */}
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Show answer after each quiz
                </Text>
                <Text style={[styles.settingSubtext, { color: colors.textMuted }]}>
                  Off in exam simulation
                </Text>
              </View>
              <Switch
                value={showAnswerInstantly}
                onValueChange={setShowAnswerInstantly}
                trackColor={{ false: colors.indicatorInactive, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* LANGUAGE & AUDIO */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LANGUAGE & AUDIO</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Translation under the question */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                Translation under the question
              </Text>
              <Switch
                value={showTranslation}
                onValueChange={setShowTranslation}
                trackColor={{ false: colors.indicatorInactive, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            {/* Read questions aloud */}
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Read questions aloud
                </Text>
                <Text style={[styles.settingSubtext, { color: colors.textMuted }]}>
                  Italian voice
                </Text>
              </View>
              <Switch
                value={readAloud}
                onValueChange={setReadAloud}
                trackColor={{ false: colors.indicatorInactive, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            {/* Audio speed */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() =>
                setAudioSpeed(
                  audioSpeed === '1.0x'
                    ? '1.25x'
                    : audioSpeed === '1.25x'
                    ? '1.5x'
                    : '1.0x'
                )
              }
            >
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Audio speed</Text>
              <View style={styles.speedSelectorRow}>
                <Text style={[styles.speedText, { color: colors.textMuted }]}>{audioSpeed}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login on web app card */}
        <TouchableOpacity
          style={[styles.webQrCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.qrIconBox, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.qrInfo}>
            <Text style={[styles.qrTitle, { color: colors.textPrimary }]}>Login on the web app</Text>
            <Text style={[styles.qrSubtitle, { color: colors.textMuted }]}>
              Scan the QR code from your computer
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  catCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  catCode: {
    fontSize: 16,
    fontWeight: '800',
  },
  catLabel: {
    fontSize: 11,
  },
  groupCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 16,
  },
  speedSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  webQrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  qrIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInfo: {
    flex: 1,
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  qrSubtitle: {
    fontSize: 12,
  },
});
