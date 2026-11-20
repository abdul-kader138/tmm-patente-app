import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  LayoutAnimation,
  UIManager,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

const STORAGE_LANG_KEY = '@tmm_patente_selected_lang';
const STORAGE_ITALIAN_SIDE_KEY = '@tmm_patente_italian_side_by_side';

export const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const [selectedLang, setSelectedLang] = useState('en');
  const [italianSideBySide, setItalianSideBySide] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_LANG_KEY).then((lang) => {
      if (lang) setSelectedLang(lang);
    });
    AsyncStorage.getItem(STORAGE_ITALIAN_SIDE_KEY).then((val) => {
      if (val !== null) setItalianSideBySide(val === 'true');
    });
  }, []);

  const handleSelectLang = (code: string) => {
    setSelectedLang(code);
    AsyncStorage.setItem(STORAGE_LANG_KEY, code);
  };

  const handleToggleItalian = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const nextVal = !italianSideBySide;
    setItalianSideBySide(nextVal);
    AsyncStorage.setItem(STORAGE_ITALIAN_SIDE_KEY, String(nextVal));
  };

  const horizontalMargin = 20;
  const contentWidth = Math.min(width - horizontalMargin * 2, 400);

  const translateIcon = isDark
    ? require('../../../assets/mockup-art/translate-icon-dark.png')
    : require('../../../assets/mockup-art/translate-icon-light.png');

  const statusBarOffset =
    Platform.OS === 'android'
      ? Math.max(RNStatusBar.currentHeight || 0, insets.top, 28) + 14
      : Math.max(insets.top, 44) + 10;

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0A0E18' : '#F5F7FB' }]}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: statusBarOffset,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
              borderColor: isDark ? '#1E2740' : '#EAECF0',
            },
          ]}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Welcome');
            }
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={isDark ? '#FFFFFF' : '#0B1220'}
          />
        </TouchableOpacity>

        {/* 3 Progress dashes */}
        <View style={styles.indicatorContainer}>
          <View
            style={[
              styles.dash,
              { backgroundColor: isDark ? '#5B7CFF' : '#2D5BFF' },
            ]}
          />
          <View
            style={[
              styles.dash,
              { backgroundColor: isDark ? '#5B7CFF' : '#2D5BFF' },
            ]}
          />
          <View
            style={[
              styles.dash,
              { backgroundColor: isDark ? '#1E2740' : '#E7EAF0' },
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Skip"
        >
          <Text
            style={[
              styles.skipText,
              { color: isDark ? '#6B7690' : '#8E95A5' },
            ]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContent, { width: contentWidth }]}>
          {/* Title & Subtitle */}
          <View style={styles.textBlock}>
            <Text
              style={[
                styles.title,
                { color: isDark ? '#FFFFFF' : '#0B1220' },
              ]}
            >
              Study in your language
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? '#8E95A5' : '#64748B' },
              ]}
            >
              Every question and explanation is translated. You can change this anytime.
            </Text>
          </View>

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
                      backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                      borderColor: isSelected
                        ? isDark
                          ? '#5B7CFF'
                          : '#2D5BFF'
                        : isDark
                        ? '#1E2740'
                        : '#EAECF0',
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleSelectLang(lang.code)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${lang.name}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.langLeft}>
                    <View
                      style={[
                        styles.codeBadge,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? '#1B2547'
                              : '#EFF4FF'
                            : isDark
                            ? '#161F33'
                            : '#F2F4F7',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color: isSelected
                              ? isDark
                                ? '#5B7CFF'
                                : '#2D5BFF'
                              : isDark
                              ? '#8E95A5'
                              : '#475569',
                          },
                        ]}
                      >
                        {lang.badge}
                      </Text>
                    </View>

                    <View style={styles.langInfo}>
                      <Text
                        style={[
                          styles.langName,
                          { color: isDark ? '#FFFFFF' : '#0B1220' },
                        ]}
                      >
                        {lang.name}
                      </Text>
                      <Text
                        style={[
                          styles.langDesc,
                          { color: isDark ? '#8E95A5' : '#8E95A5' },
                        ]}
                      >
                        {lang.description}
                      </Text>
                    </View>
                  </View>

                  {/* Radio selection circle */}
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected
                        ? {
                            borderWidth: 6,
                            borderColor: isDark ? '#5B7CFF' : '#2D5BFF',
                            backgroundColor: '#FFFFFF',
                          }
                        : {
                            borderWidth: 1.5,
                            borderColor: isDark ? '#26324D' : '#D0D5DD',
                            backgroundColor: 'transparent',
                          },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Italian side-by-side Toggle Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleToggleItalian}
            accessibilityRole="switch"
            accessibilityLabel="Italian side by side toggle"
            accessibilityState={{ checked: italianSideBySide }}
            style={[
              styles.toggleCard,
              {
                backgroundColor: isDark ? '#131A2A' : '#FFFFFF',
                borderColor: isDark ? '#1E2740' : '#EAECF0',
              },
            ]}
          >
            <Image
              source={translateIcon}
              style={styles.translateBadgeImage}
              resizeMode="contain"
            />

            <View style={styles.toggleTextContainer}>
              <Text
                style={[
                  styles.toggleTitle,
                  { color: isDark ? '#FFFFFF' : '#0B1220' },
                ]}
              >
                Italian side by side
              </Text>
              <Text
                style={[
                  styles.toggleDesc,
                  { color: isDark ? '#8E95A5' : '#64748B' },
                ]}
              >
                The exam is in Italian — learn its exact wording
              </Text>
            </View>

            {/* Custom iOS-Grade Smooth Green Toggle */}
            <View
              style={[
                styles.iosSwitchTrack,
                {
                  backgroundColor: italianSideBySide
                    ? '#12B76A'
                    : isDark
                    ? '#26324D'
                    : '#E4E7EC',
                  justifyContent: italianSideBySide ? 'flex-end' : 'flex-start',
                },
              ]}
            >
              <View style={styles.iosSwitchThumb} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Continue CTA */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 12,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              width: contentWidth,
              backgroundColor: isDark ? '#5B7CFF' : '#2D5BFF',
            },
          ]}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.continueIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dash: {
    width: 28,
    height: 4,
    borderRadius: 4,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  mainContent: {
    alignItems: 'center',
  },
  textBlock: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  langList: {
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    borderRadius: 16,
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
    letterSpacing: -0.2,
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  langDesc: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: 8,
  },
  toggleCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  translateBadgeImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 12.5,
    fontWeight: '400',
    lineHeight: 17,
    letterSpacing: -0.1,
  },
  iosSwitchTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iosSwitchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  continueButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  continueIcon: {
    marginLeft: 2,
  },
});
