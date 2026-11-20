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

  // Responsive calculations based on screen dimensions and aspect ratio lock (700:696)
  const horizontalPadding = 20;
  const maxAllowedWidth = Math.min(width - horizontalPadding * 2, 420);
  const maxAllowedHeight = height * 0.44;

  let cardWidth = maxAllowedWidth;
  let cardHeight = cardWidth * (696 / 700);

  if (cardHeight > maxAllowedHeight) {
    cardHeight = maxAllowedHeight;
    cardWidth = cardHeight * (700 / 696);
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
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16) + 12,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Hero Section */}
        <View style={styles.topContainer}>
          {/* Flat Road Sign Graphic Card matching mockup */}
          <View
            style={[
              styles.heroCardContainer,
              {
                width: cardWidth,
                height: cardHeight,
              },
            ]}
          >
            <Image
              source={heroImage}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* Typography Header */}
          <View style={[styles.textBlock, { width: cardWidth }]}>
            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#0B1220' },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Your Italian driving licence,{'\n'}in your language
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: isDark ? '#94A3B8' : '#475569' },
              ]}
            >
              Official ministerial quizzes, video lessons and audio explanations
              in Bangla and English.
            </Text>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={[styles.actionContainer, { width: cardWidth }]}>
          {/* Continue with Google */}
          <TouchableOpacity
            style={[
              styles.authButton,
              {
                backgroundColor: isDark ? '#161B26' : '#FFFFFF',
                borderColor: isDark ? '#262F40' : '#E2E8F0',
                borderWidth: 1,
              },
            ]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            onPress={() => navigation.navigate('Language')}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.authIcon} />
            <Text
              style={[
                styles.authButtonText,
                { color: isDark ? '#FFFFFF' : '#0B1220' },
              ]}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Continue with Apple */}
          <TouchableOpacity
            style={[
              styles.authButton,
              {
                backgroundColor: isDark ? '#FFFFFF' : '#0B1220',
                borderColor: isDark ? '#FFFFFF' : '#0B1220',
                borderWidth: 1,
              },
            ]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
            onPress={() => navigation.navigate('Language')}
          >
            <Ionicons
              name="logo-apple"
              size={22}
              color={isDark ? '#0B1220' : '#FFFFFF'}
              style={styles.authIcon}
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

        {/* Footer / QR code login */}
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
            color={isDark ? '#64748B' : '#94A3B8'}
          />
          <Text
            style={[
              styles.footerText,
              { color: isDark ? '#64748B' : '#94A3B8' },
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topContainer: {
    alignItems: 'center',
    width: '100%',
  },
  heroCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  textBlock: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.2,
    textAlign: 'left',
  },
  actionContainer: {
    width: '100%',
    gap: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  authButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  authIcon: {
    marginRight: 10,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  phoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  phoneButtonText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
