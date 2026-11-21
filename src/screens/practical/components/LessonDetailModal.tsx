import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface LessonDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onCancelLesson?: () => void;
  lesson?: {
    dateTitle: string;
    dayNum: string;
    dayName: string;
    title: string;
    time: string;
    instructor: string;
    duration: string;
    phone: string;
  };
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  visible,
  onClose,
  onCancelLesson,
  lesson = {
    dateTitle: 'Thursday, 24 October',
    dayNum: '24',
    dayName: 'THU',
    title: 'Driving lesson · city traffic',
    time: '18:00',
    instructor: 'Karim H.',
    duration: '45 min',
    phone: '+39061234567',
  },
}) => {
  const { isDark } = useTheme();

  const handleCall = async () => {
    const url = `tel:${lesson.phone}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        'Call Instructor',
        `Dialing Karim H. at ${lesson.phone}\n(In simulator/device without SIM, call simulation is shown)`
      );
    }
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Lesson',
      'Please contact TMM Driving School support or your instructor to pick an alternative slot.',
      [{ text: 'OK' }]
    );
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      Alert.alert(
        'Cancel Lesson?',
        'Are you sure you want to cancel your scheduled driving lesson with Karim H.?',
        [
          { text: 'Keep Lesson', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              if (onCancelLesson) onCancelLesson();
            },
          },
        ]
      );
    }, 150);
  };

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
            <View style={styles.titleRow}>
              <View style={styles.calendarBadge}>
                <Text style={styles.calDayName}>{lesson.dayName}</Text>
                <Text style={styles.calDayNum}>{lesson.dayNum}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.title,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  {lesson.title}
                </Text>
                <Text
                  style={[
                    styles.dateSubtitle,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  {lesson.dateTitle} · {lesson.time}
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

          {/* Details list */}
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color="#2D5BFF" />
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Instructor:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {lesson.instructor} (Bangla & Italian)
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color="#2D5BFF" />
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Duration:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {lesson.duration}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#2D5BFF" />
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Pickup:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                TMM Center / Agreed pickup point
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.callInstructorBtn}
              onPress={handleCall}
              activeOpacity={0.88}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.callInstructorText}>Call Instructor</Text>
            </TouchableOpacity>

            <View style={styles.secondaryRow}>
              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                  },
                ]}
                onPress={handleReschedule}
              >
                <Text
                  style={[
                    styles.secondaryBtnText,
                    { color: isDark ? '#CBD5E1' : '#334155' },
                  ]}
                >
                  Reschedule
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  {
                    backgroundColor: isDark ? '#2D1B1B' : '#FEE2E2',
                    borderColor: isDark ? '#592020' : '#FECACA',
                  },
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.secondaryBtnText, { color: '#EF4444' }]}>
                  Cancel Lesson
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarBadge: {
    width: 46,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  calDayNum: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 6,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  actionsContainer: {
    gap: 10,
  },
  callInstructorBtn: {
    backgroundColor: '#2D5BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
  },
  callInstructorText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
