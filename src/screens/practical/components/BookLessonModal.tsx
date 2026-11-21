import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface BookLessonModalProps {
  visible: boolean;
  onClose: () => void;
  onBookSuccess?: (lessonData: {
    city: string;
    topic: string;
    date: string;
    time: string;
    instructor: string;
  }) => void;
}

const CITIES = ['Roma (Rome)', 'Milano (Milan)', 'Bologna'];

const TOPICS = [
  { id: 'city', title: 'City traffic & navigation', duration: '45 min' },
  { id: 'parking', title: 'Parallel & reverse parking', duration: '45 min' },
  { id: 'highway', title: 'Highway & roundabouts (rotatoria)', duration: '60 min' },
  { id: 'exam_prep', title: 'Full practical exam rehearsal', duration: '60 min' },
];

const DATES = [
  { day: 'THU', num: '24', full: 'Thursday, 24 Oct' },
  { day: 'FRI', num: '25', full: 'Friday, 25 Oct' },
  { day: 'SAT', num: '26', full: 'Saturday, 26 Oct' },
  { day: 'MON', num: '28', full: 'Monday, 28 Oct' },
];

const TIMES = ['10:00', '14:30', '16:00', '18:00'];

export const BookLessonModal: React.FC<BookLessonModalProps> = ({
  visible,
  onClose,
  onBookSuccess,
}) => {
  const { colors, isDark } = useTheme();

  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].id);
  const [selectedDate, setSelectedDate] = useState(DATES[0].full);
  const [selectedTime, setSelectedTime] = useState(TIMES[3]); // 18:00

  const handleConfirm = () => {
    const topicObj = TOPICS.find((t) => t.id === selectedTopic);
    const bookingData = {
      city: selectedCity,
      topic: topicObj?.title || 'City driving',
      date: selectedDate,
      time: selectedTime,
      instructor: 'Karim H.',
    };
    onClose();
    setTimeout(() => {
      if (onBookSuccess) {
        onBookSuccess(bookingData);
      }
      Alert.alert(
        'Lesson Booked Successfully! 🎉',
        `Your driving lesson with Karim H. is confirmed for ${selectedDate} at ${selectedTime}.\n\nCity: ${selectedCity}\nTopic: ${topicObj?.title}`,
        [{ text: 'Great' }]
      );
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderColor: isDark ? '#1F2937' : '#E5E7EB',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Book a Driving Lesson
              </Text>
              <Text style={[styles.modalSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                With certified Bangla & Italian instructors
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close"
                size={20}
                color={isDark ? '#E2E8F0' : '#475569'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Instructor card */}
            <View
              style={[
                styles.instructorCard,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.instructorRow}>
                  <Text
                    style={[
                      styles.instructorName,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                  >
                    Karim H.
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.9 (128 lessons)</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.instructorDetails,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Dual controls sedan · Bangla & Italian fluent
                </Text>
              </View>
            </View>

            {/* City Selection */}
            <Text
              style={[
                styles.sectionLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B' },
              ]}
            >
              Select City
            </Text>
            <View style={styles.pillRow}>
              {CITIES.map((city) => {
                const active = selectedCity === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.cityPill,
                      {
                        backgroundColor: active
                          ? '#2D5BFF'
                          : isDark
                          ? '#1E293B'
                          : '#F1F5F9',
                        borderColor: active
                          ? '#2D5BFF'
                          : isDark
                          ? '#334155'
                          : '#CBD5E1',
                      },
                    ]}
                    onPress={() => setSelectedCity(city)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: active ? '#FFFFFF' : isDark ? '#CBD5E1' : '#475569' },
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Lesson Topic */}
            <Text
              style={[
                styles.sectionLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B', marginTop: 18 },
              ]}
            >
              Lesson Focus
            </Text>
            {TOPICS.map((topic) => {
              const active = selectedTopic === topic.id;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicCard,
                    {
                      backgroundColor: active
                        ? isDark
                          ? '#1E2A54'
                          : '#EFF4FF'
                        : isDark
                        ? '#1E293B'
                        : '#FFFFFF',
                      borderColor: active
                        ? '#2D5BFF'
                        : isDark
                        ? '#334155'
                        : '#E2E8F0',
                    },
                  ]}
                  onPress={() => setSelectedTopic(topic.id)}
                >
                  <Ionicons
                    name={active ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={active ? '#2D5BFF' : isDark ? '#64748B' : '#94A3B8'}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={[
                        styles.topicTitle,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                      ]}
                    >
                      {topic.title}
                    </Text>
                    <Text
                      style={[
                        styles.topicDuration,
                        { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      Duration: {topic.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Date Selection */}
            <Text
              style={[
                styles.sectionLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B', marginTop: 18 },
              ]}
            >
              Choose Date
            </Text>
            <View style={styles.pillRow}>
              {DATES.map((d) => {
                const active = selectedDate === d.full;
                return (
                  <TouchableOpacity
                    key={d.num}
                    style={[
                      styles.datePill,
                      {
                        backgroundColor: active
                          ? '#2D5BFF'
                          : isDark
                          ? '#1E293B'
                          : '#F1F5F9',
                        borderColor: active
                          ? '#2D5BFF'
                          : isDark
                          ? '#334155'
                          : '#CBD5E1',
                      },
                    ]}
                    onPress={() => setSelectedDate(d.full)}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        { color: active ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNum,
                        { color: active ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A' },
                      ]}
                    >
                      {d.num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time Slot Selection */}
            <Text
              style={[
                styles.sectionLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B', marginTop: 18 },
              ]}
            >
              Choose Time Slot
            </Text>
            <View style={styles.pillRow}>
              {TIMES.map((time) => {
                const active = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timePill,
                      {
                        backgroundColor: active
                          ? '#2D5BFF'
                          : isDark
                          ? '#1E293B'
                          : '#F1F5F9',
                        borderColor: active
                          ? '#2D5BFF'
                          : isDark
                          ? '#334155'
                          : '#CBD5E1',
                      },
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={active ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.pillText,
                        { color: active ? '#FFFFFF' : isDark ? '#CBD5E1' : '#475569' },
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Total / Summary Banner */}
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: isDark ? '#1E2547' : '#EFF6FF',
                  borderColor: isDark ? '#314482' : '#BFDBFE',
                },
              ]}
            >
              <View>
                <Text style={styles.summaryLabel}>Official Driving Lesson</Text>
                <Text style={styles.summarySub}>Includes fuel & dual control car</Text>
              </View>
              <Text style={styles.summaryPrice}>€45</Text>
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmBtnText}>Confirm Lesson Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSub: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2D5BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  instructorName: {
    fontSize: 15,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  instructorDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  topicDuration: {
    fontSize: 12,
    marginTop: 2,
  },
  datePill: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '800',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  summarySub: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
  },
  summaryPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E40AF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  confirmBtn: {
    backgroundColor: '#2D5BFF',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
