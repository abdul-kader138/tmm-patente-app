import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockSubscriptionPlans } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PaywallScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [selectedPlan, setSelectedPlan] = useState('six_months');

  const selectedTier = mockSubscriptionPlans.find((p) => p.id === selectedPlan);

  const handleContinue = () => {
    Alert.alert(
      'Purchase Confirmation',
      `You selected ${selectedTier?.title} for ${selectedTier?.price}. Proceed to Google Play / App Store checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Your subscription is now active! All lessons unlocked.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert('Restore Purchases', 'Checking your Apple App Store / Google Play account...', [
      { text: 'OK' },
    ]);
  };

  const features = [
    'All 7,000+ ministerial quizzes, translated',
    '124 video lessons in Bangla',
    'Audio explanation for every quiz',
    'Picture dictionary & road signs',
    'Live E-Class and chat with a teacher',
    'Study offline, anywhere',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Close Button */}
      <View style={styles.topBar}>
        <View style={{ width: 36 }} />
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Crown Icon Box */}
        <View style={[styles.crownBox, { backgroundColor: '#F59E0B' }]}>
          <Ionicons name="ribbon" size={32} color="#FFFFFF" />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Unlock the full course</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Everything you need to pass the theory exam the first time.
        </Text>

        {/* Feature Checkpoints */}
        <View style={styles.featuresList}>
          {features.map((item, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* 3 Subscription Cards */}
        <View style={styles.plansContainer}>
          {mockSubscriptionPlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                {plan.isBest && (
                  <View style={[styles.bestPill, { backgroundColor: colors.primary }]}>
                    <Text style={styles.bestPillText}>BEST</Text>
                  </View>
                )}

                <Text style={[styles.planTitle, { color: colors.textMuted }]}>{plan.title}</Text>
                <Text style={[styles.planPrice, { color: colors.textPrimary }]}>{plan.price}</Text>
                <Text style={[styles.planSubtitle, { color: colors.textMuted }]}>
                  {plan.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA & Legal */}
      <View style={[styles.bottomBar, { borderTopColor: colors.borderLight }]}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue · {selectedTier?.price}</Text>
        </TouchableOpacity>

        <View style={styles.legalRow}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={[styles.legalLink, { color: colors.textMuted }]}>Restore purchase</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.textMuted }}>·</Text>
          <TouchableOpacity>
            <Text style={[styles.legalLink, { color: colors.textMuted }]}>Terms</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.textMuted }}>·</Text>
          <TouchableOpacity>
            <Text style={[styles.legalLink, { color: colors.textMuted }]}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  crownBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresList: {
    gap: 14,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  planCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    position: 'relative',
    minHeight: 125,
    justifyContent: 'center',
  },
  bestPill: {
    position: 'absolute',
    top: -10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bestPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  planTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    fontSize: 12,
  },
});
