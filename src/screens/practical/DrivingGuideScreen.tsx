import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockDrivingGuideManeuver } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* Diagram palette (same in light and dark, it is an illustration) */
const ROAD = '#3F4654';
const DASH = '#A0A6B2';
const PARKED = '#92A1BA';
const CURB = '#9AA1AF';
const ORANGE = '#FBB024';
const VIDEO_RED = '#C8201A';

const DASH_COUNT = 6;

export const DrivingGuideScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [bookmarked, setBookmarked] = useState(false);
  const [activeStepId, setActiveStepId] = useState(3);

  const data = mockDrivingGuideManeuver;

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  }, [navigation]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {data.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {data.subtitle}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setBookmarked(!bookmarked)}
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Overhead Manoeuvre Visual Card */}
        <View style={styles.diagramCard}>
          {/* Road markings */}
          {Array.from({ length: DASH_COUNT }).map((_, i) => (
            <View key={i} style={[styles.dashSegment, { left: 11.5 + i * 58 }]} />
          ))}

          {/* Trajectory (dashed S-curve + start dot) */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%" viewBox="0 0 698 340">
              <Path
                d="M219 245 C309 235 359 100 481 94"
                stroke={ORANGE}
                strokeWidth={5}
                strokeDasharray="9 12"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx={219} cy={245} r={12} fill={ORANGE} />
            </Svg>
          </View>

          {/* Parked cars & YOU car */}
          <View style={[styles.parkedCar, { left: 23.5 }]} />
          <View style={[styles.parkedCar, { right: 23.5 }]} />

          <View style={[styles.youCar, { backgroundColor: colors.primary }]}>
            <Text style={styles.youText}>YOU</Text>
          </View>

          <View style={styles.curbLine} />
        </View>

        {/* Action Pills Row */}
        <View style={styles.pillsRow}>
          <View style={[styles.metaPill, { backgroundColor: colors.chipBackground }]}>
            <Text style={[styles.metaPillText, { color: colors.textPrimary }]}>
              Manoeuvre {data.stepNumber} of {data.totalSteps}
            </Text>
          </View>

          <View style={styles.mediaPills}>
            <TouchableOpacity
              style={[styles.videoPill, { backgroundColor: colors.errorLight }]}
              accessibilityRole="button"
              accessibilityLabel="Play video"
            >
              <View style={styles.videoTriangle} />
              <Text style={[styles.mediaPillText, { color: VIDEO_RED }]}>Video 2:10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.audioPill, { backgroundColor: colors.primaryLight }]}
              accessibilityRole="button"
              accessibilityLabel="Play Bangla audio"
            >
              <Ionicons name="headset" size={13} color={colors.primary} />
              <Text style={[styles.mediaPillText, { color: colors.primary }]}>Bangla audio</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step-by-Step Checklist */}
        <View style={styles.stepsList}>
          {data.steps.map((step) => {
            const isActive = step.id === activeStepId;
            const isDone = step.done;

            return (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepCard,
                  isActive && styles.stepCardActive,
                  isActive && { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => setActiveStepId(step.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                {/* Step indicator circle / checkmark */}
                <View
                  style={[
                    styles.stepBadge,
                    isDone
                      ? { backgroundColor: colors.success }
                      : isActive
                      ? { backgroundColor: colors.primary }
                      : {
                          backgroundColor: colors.card,
                          borderWidth: 1,
                          borderColor: colors.border,
                        },
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepBadgeText,
                        { color: isActive ? '#FFFFFF' : colors.textMuted },
                      ]}
                    >
                      {step.id}
                    </Text>
                  )}
                </View>

                {/* Step Content */}
                <View style={styles.stepBody}>
                  <Text
                    style={[
                      styles.stepMainText,
                      {
                        color: colors.textPrimary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {step.text}
                  </Text>
                  {isActive && step.subtext ? (
                    <Text style={[styles.stepSubText, { color: colors.textMuted }]}>
                      {step.subtext}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrivingGuideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 15,
    marginTop: 1,
  },

  content: {
    paddingHorizontal: 20,
    gap: 12.5,
  },

  /* Diagram */
  diagramCard: {
    height: 170,
    borderRadius: 22,
    backgroundColor: ROAD,
    overflow: 'hidden',
  },
  dashSegment: {
    position: 'absolute',
    top: 12,
    width: 24,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: DASH,
  },
  parkedCar: {
    position: 'absolute',
    top: 106,
    width: 70,
    height: 34,
    borderRadius: 10,
    backgroundColor: PARKED,
  },
  youCar: {
    position: 'absolute',
    right: 33.5,
    top: 30,
    width: 70,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  curbLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 26,
    backgroundColor: CURB,
  },

  /* Pills */
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaPill: {
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 11,
    justifyContent: 'center',
  },
  metaPillText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    includeFontPadding: false,
  },
  mediaPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  videoPill: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 11,
    gap: 7.5,
  },
  videoTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6.5,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: VIDEO_RED,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  audioPill: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 9.5,
    borderRadius: 11,
    gap: 4,
  },
  mediaPillText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    includeFontPadding: false,
  },

  /* Steps */
  stepsList: {
    gap: 4,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 11.5,
    borderRadius: 20,
    gap: 12,
  },
  stepCardActive: {
    paddingVertical: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    includeFontPadding: false,
  },
  stepBody: {
    flex: 1,
  },
  stepMainText: {
    fontSize: 14.5,
    lineHeight: 19,
  },
  stepSubText: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
});