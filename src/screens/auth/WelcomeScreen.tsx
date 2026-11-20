import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Platform,
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

  // Mockup reference frame: 390 x 844 pt (780 x 1688 px @2x)
  // Card is exactly 700 x 600 px -> 350 x 300 pt (Aspect ratio: 7 / 6 = 1.1667)
  const horizontalMargin = 20;
  const contentWidth = Math.min(width - horizontalMargin * 2, 360);
  const cardWidth = contentWidth;
  const cardHeight = cardWidth * (600 / 700);

  const heroImage = isDark
    ? require('../../../assets/mockup-art/welcome-hero-dark.png')
    : require('../../../assets/mockup-art/welcome-hero-light.png');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 24) + 16,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainContent}>
          {/* Hero Road Signs Card */}
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

          {/* Title & Subtitle */}
          <View style={[styles.textBlock, { width: contentWidth }]}>
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
              Official ministerial quizzes, video lessons and audio explanations in Bangla and English.
            </Text>
          </View>

          {/* Auth Action Buttons */}
          <View style={[styles.actionContainer, { width: contentWidth }]}>
            {/* Continue with Google */}
            <TouchableOpacity
              style={[
                styles.authButton,
                {
                  backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                  borderColor: isDark ? '#1E2740' : '#E2E8F0',
                  borderWidth: 1,
                },
              ]}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={() => navigation.navigate('Language')}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#4285F4"
                style={styles.googleIcon}
              />
              <Text
                style={[
                  styles.authButtonText,
                  { color: isDark ? '#F2F4F8' : '#0B1220' },
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
                  backgroundColor: isDark ? '#F2F4F8' : '#0B1220',
                  borderColor: isDark ? '#F2F4F8' : '#0B1220',
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
        </View>

        {/* Footer / QR code login */}
        <TouchableOpacity
          style={styles.footerContainer}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Scan QR code to log in"
          onPress={() => navigation.replace('MainTabs')}
        >
          <Image
            source={require('../../../assets/mockup-art/qr-icon.png')}
            style={[
              styles.qrIcon,
              { tintColor: isDark ? '#6B7690' : '#98A2B3' },
            ]}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.footerText,
              { color: isDark ? '#6B7690' : '#98A2B3' },
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
  },
  heroCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 24,
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
    gap: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  authButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  googleIcon: {
    marginRight: 10,
  },
  appleIcon: {
    marginRight: 8,
    marginTop: -2,
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
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  qrIcon: {
    width: 15,
    height: 15,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
