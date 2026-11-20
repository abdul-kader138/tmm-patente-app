import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Language'>;

interface LangItem {
  code: string;
  badge: string;
  name: string;
  description: string;
}

const LANGUAGES: LangItem[] = [
  { code: 'en', badge: 'EN', name: 'English', description: 'Full course · audio lessons' },
  { code: 'bn', badge: 'BN', name: 'Bangla', description: 'Full course · audio lessons' },
  { code: 'pa', badge: 'PA', name: 'Punjabi', description: 'Full course · audio lessons' },
  { code: 'hi', badge: 'HI', name: 'Hindi', description: 'Full course' },
  { code: 'ur', badge: 'UR', name: 'Urdu', description: 'Full course' },
  { code: 'it', badge: 'IT', name: 'Italiano', description: 'Original exam wording only' },
];

export const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedLang, setSelectedLang] = useState('bn');
  const [italianSideBySide, setItalianSideBySide] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Progress indicator dashes */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.dash, { backgroundColor: colors.primary }]} />
          <View style={[styles.dash, { backgroundColor: colors.primary }]} />
          <View style={[styles.dash, { backgroundColor: colors.indicatorInactive }]} />
        </View>

        <TouchableOpacity onPress={() => navigation.replace('MainTabs')}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Study in your language</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Every question and explanation is translated. You can change this anytime.
        </Text>

        {/* Language Options List */}
        <View style={styles.langList}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedLang(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.langLeft}>
                  <View
                    style={[
                      styles.codeBadge,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.chipBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isSelected ? colors.primary : colors.textPrimary },
                      ]}
                    >
                      {lang.badge}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.langName, { color: colors.textPrimary }]}>{lang.name}</Text>
                    <Text style={[styles.langDesc, { color: colors.textMuted }]}>
                      {lang.description}
                    </Text>
                  </View>
                </View>

                {/* Radio selection circle */}
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Italian side-by-side Toggle */}
        <View style={[styles.toggleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.toggleIconBox, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="language" size={20} color={colors.primary} />
          </View>
          <View style={styles.toggleTextContainer}>
            <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
              Italian side by side
            </Text>
            <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>
              The exam is in Italian — learn its exact wording
            </Text>
          </View>
          <Switch
            value={italianSideBySide}
            onValueChange={setItalianSideBySide}
            trackColor={{ false: colors.indicatorInactive, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderLight }]}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.continueText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  indicatorContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dash: {
    width: 28,
    height: 4,
    borderRadius: 2,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  langList: {
    gap: 12,
    marginBottom: 24,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  codeBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  langName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  langDesc: {
    fontSize: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  toggleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
