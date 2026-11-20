import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { mockDrivingGuideManeuver } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DrivingGuideScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [bookmarked, setBookmarked] = useState(false);
  const [activeStepId, setActiveStepId] = useState(3);

  const data = mockDrivingGuideManeuver;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{data.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{data.subtitle}</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overhead Maneuver Visual Card */}
        <View style={[styles.diagramCard, { backgroundColor: '#334155' }]}>
          {/* Road markings */}
          <View style={styles.dashLineTop}>
            <View style={styles.dashSegment} />
            <View style={styles.dashSegment} />
            <View style={styles.dashSegment} />
            <View style={styles.dashSegment} />
          </View>

          {/* Parked cars & YOU car */}
          <View style={styles.carsRow}>
            <View style={[styles.parkedCar, { backgroundColor: '#64748B' }]} />

            {/* Trajectory dotted curve */}
            <View style={styles.trajectoryArc}>
              <View style={styles.startPointDot} />
            </View>

            <View style={[styles.youCar, { backgroundColor: colors.primary }]}>
              <Text style={styles.youText}>YOU</Text>
            </View>

            <View style={[styles.parkedCar, { backgroundColor: '#64748B' }]} />
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

          <TouchableOpacity style={[styles.mediaPill, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="play" size={14} color={colors.error} />
            <Text style={[styles.mediaPillText, { color: colors.error }]}>Video 2:10</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.mediaPill, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="headset" size={14} color={colors.primary} />
            <Text style={[styles.mediaPillText, { color: colors.primary }]}>Bangla audio</Text>
          </TouchableOpacity>
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
                  {
                    backgroundColor: isActive ? colors.primaryLight : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                    borderWidth: isActive ? 1.5 : 1,
                  },
                ]}
                onPress={() => setActiveStepId(step.id)}
                activeOpacity={0.8}
              >
                {/* Step indicator circle / checkmark */}
                <View
                  style={[
                    styles.stepBadge,
                    {
                      backgroundColor: isDone
                        ? colors.success
                        : isActive
                        ? colors.primary
                        : colors.chipBackground,
                    },
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
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
                    <Text style={[styles.stepSubText, { color: colors.textSecondary }]}>
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
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },
  diagramCard: {
    height: 180,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  dashLineTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dashSegment: {
    width: 40,
    height: 4,
    backgroundColor: '#94A3B8',
    borderRadius: 2,
  },
  carsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  parkedCar: {
    width: 60,
    height: 34,
    borderRadius: 8,
  },
  youCar: {
    width: 65,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  trajectoryArc: {
    position: 'absolute',
    left: 80,
    top: 10,
  },
  startPointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  curbLine: {
    height: 8,
    backgroundColor: '#64748B',
    borderRadius: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mediaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  mediaPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepBody: {
    flex: 1,
  },
  stepMainText: {
    fontSize: 15,
    lineHeight: 22,
  },
  stepSubText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
});
