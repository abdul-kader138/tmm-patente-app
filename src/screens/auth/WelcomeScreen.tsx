import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  // Mockup is 780×1688px at 2x = 390×844pt (iPhone 14 frame)
  // All measurements below are derived from pixel analysis of the mockup
  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2; // ~350pt on iPhone 14

  // Hero card: 696px tall / 700px wide at 2x = 348pt / 350pt
  const cardWidth = Math.min(contentWidth, 350);
  const cardAspect = 696 / 700; // almost square
  let cardHeight = cardWidth * cardAspect;

  // On very short screens, cap and re-derive width
  const maxCardHeight = height * 0.42;
  if (cardHeight > maxCardHeight) {
    cardHeight = maxCardHeight;
  }

  const heroImage = isDark
    ? require('../../../assets/mockup-art/welcome-hero-dark.png')
    : require('../../../assets/mockup-art/welcome-hero-light.png');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 16) + 4,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Card (road signs illustration) */}
        <View style={styles.topContainer}>
          <View
            style={[
              styles.heroCardContainer,
              { width: cardWidth, height: cardHeight },
            ]}
          >
            <Image
              source={heroImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Title + Subtitle */}
          <View style={[styles.textBlock, { maxWidth: cardWidth }]}>
            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#0B1220' },
              ]}
            >
              Your Italian driving licence,{'\n'}in your language
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? '#94A3B8' : '#475569' },
              ]}
            >
              Official ministerial quizzes, video lessons and{'\n'}audio
              explanations in Bangla and English.
            </Text>
          </View>
        </View>

        {/* Auth Buttons + Phone Link */}
        <View style={[styles.actionContainer, { maxWidth: cardWidth }]}>
          {/* Continue with Google — 43pt height */}
          <TouchableOpacity
            style={[
              styles.googleButton,
              {
                backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                borderColor: isDark ? '#1E2740' : '#E2E8F0',
              },
            ]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            onPress={() => navigation.navigate('Language')}
          >
            <Text style={[styles.googleG, { color: '#4285F4' }]}>G</Text>
            <Text
              style={[
                styles.authButtonText,
                { color: isDark ? '#F2F4F8' : '#0B1220' },
              ]}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Continue with Apple — 47pt height */}
          <TouchableOpacity
            style={[
              styles.appleButton,
              {
                backgroundColor: isDark ? '#F2F4F8' : '#0B1220',
              },
            ]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
            onPress={() => navigation.navigate('Language')}
          >
            <Ionicons
              name="logo-apple"
              size={20}
              color={isDark ? '#0B1220' : '#FFFFFF'}
              style={styles.appleIcon}
            />
            <Text
              style={[
                styles.authButtonText,
                { color: isDark ? '#0B1220' : '#FFFFFF' },
              ]}
            >
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Use phone number */}
          <TouchableOpacity
            style={styles.phoneButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Use phone number"
            onPress={() => navigation.navigate('Language')}
          >
            <Text style={styles.phoneButtonText}>Use phone number</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer to push footer down */}
        <View style={styles.spacer} />

        {/* Footer — QR code login */}
        <TouchableOpacity
          style={styles.footerContainer}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Scan QR code to log in"
          onPress={() => navigation.replace('MainTabs')}
        >
          <Ionicons
            name="qr-code-outline"
            size={16}
            color={isDark ? '#475569' : '#94A3B8'}
          />
          <Text
            style={[
              styles.footerText,
              { color: isDark ? '#475569' : '#94A3B8' },
            ]}
          >
            Studying on another device? Scan to log in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topContainer: {
    alignItems: 'center',
    width: '100%',
  },
  heroCardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignSelf: 'center',
    width: '100%',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 33,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  actionContainer: {
    width: '100%',
    alignSelf: 'center',
    gap: 12,
  },
  googleButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '700',
  },
  appleButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appleIcon: {
    marginTop: -1,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  phoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  phoneButtonText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
