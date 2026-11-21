import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface FoglioRosaModalProps {
  visible: boolean;
  onClose: () => void;
  validUntil?: string;
  attemptsLeft?: number;
}

export const FoglioRosaModal: React.FC<FoglioRosaModalProps> = ({
  visible,
  onClose,
  validUntil = 'May 2027',
  attemptsLeft = 2,
}) => {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderColor: isDark ? '#1F2937' : '#E5E7EB',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.iconBox}>
                <Ionicons name="document-text" size={22} color="#D97706" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text
                  style={[
                    styles.title,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Foglio Rosa Status
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Italian Learner's Permit (Art. 122 CdS)
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' },
              ]}
            >
              <Ionicons
                name="close"
                size={18}
                color={isDark ? '#E2E8F0' : '#475569'}
              />
            </TouchableOpacity>
          </View>

          {/* Quick status pills */}
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text style={styles.statLabel}>VALID UNTIL</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {validUntil}
              </Text>
              <View style={styles.activeTag}>
                <Text style={styles.activeTagText}>ACTIVE</Text>
              </View>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text style={styles.statLabel}>EXAM ATTEMPTS</Text>
              <Text style={[styles.statValue, { color: '#2563EB' }]}>
                {attemptsLeft} left
              </Text>
              <Text style={styles.statSub}>of 3 maximum</Text>
            </View>
          </View>

          {/* Rules info */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.rulesList}
          >
            <Text
              style={[
                styles.sectionHeading,
                { color: isDark ? '#E2E8F0' : '#1E293B' },
              ]}
            >
              Italian Legal Requirements:
            </Text>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.ruleTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Accompagnatore (Companion Driver)
                </Text>
                <Text
                  style={[
                    styles.ruleDesc,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Must be seated in front passenger seat, max 65 years old, and
                  held a Cat. B license for at least 10 years (or Cat. C/D).
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.ruleTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Contrassegno 'P' (P Plate)
                </Text>
                <Text
                  style={[
                    styles.ruleDesc,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Mandatory visible white retroreflective plate with black letter
                  'P' on both front and rear of the vehicle.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.ruleTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Practice Speed Limits
                </Text>
                <Text
                  style={[
                    styles.ruleDesc,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Max 100 km/h on Motorways (Autostrade) and 90 km/h on Main Extra-urban roads.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Got it CTA */}
          <TouchableOpacity
            style={styles.gotItBtn}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.gotItBtnText}>Understood</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  activeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
  },
  statSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  rulesList: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  ruleDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  gotItBtn: {
    backgroundColor: '#2D5BFF',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
