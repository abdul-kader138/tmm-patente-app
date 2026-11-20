import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Top Language Pill & Skip */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.langPill, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('Language')}
        >
          <Ionicons name="globe-outline" size={16} color={colors.primary} />
          <Text style={[styles.langText, { color: colors.textPrimary }]}>বাংলা / English</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.replace('MainTabs')}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Badge & Illustration */}
      <View style={styles.heroSection}>
        <View style={[styles.badgeContainer, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="car-sport" size={60} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          TMM Bangla Patente
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Pass the Italian driving theory exam in your native language with confidence.
        </Text>
      </View>

      {/* Feature Bullet Points */}
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <View style={[styles.iconBox, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
          <Text style={[styles.featureText, { color: colors.textPrimary }]}>
            7,000+ ministerial quizzes translated
          </Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="play-circle" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.featureText, { color: colors.textPrimary }]}>
            124 video lessons in Bangla with notes
          </Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.iconBox, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="mic" size={20} color={colors.warning} />
          </View>
          <Text style={[styles.featureText, { color: colors.textPrimary }]}>
            Native audio explanation for every quiz
          </Text>
        </View>
      </View>

      {/* Bottom CTA Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Language')}
        >
          <Text style={styles.primaryButtonText}>Get started</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  badgeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  featureList: {
    marginVertical: 20,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomSection: {
    paddingBottom: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
