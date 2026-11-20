import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface WordSheetModalProps {
  visible: boolean;
  onClose: () => void;
  word?: string;
  translation?: string;
  explanation?: string;
}

export const WordSheetModal: React.FC<WordSheetModalProps> = ({
  visible,
  onClose,
  word = 'SOSTA',
  translation = 'Stopping / parking',
  explanation = 'A "sosta" is when you leave the vehicle stopped for a longer time, and the driver may walk away. A "fermata" is only a brief stop to let people get on or off.',
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={[styles.sheetContainer, { backgroundColor: colors.surface }]}>
          {/* Top Sheet Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: colors.indicatorInactive }]} />

          <ScrollView contentContainerStyle={styles.sheetContent}>
            {/* Header with audio and bookmark */}
            <View style={styles.headerRow}>
              <View>
                <Text style={[styles.wordTitle, { color: colors.textPrimary }]}>{word}</Text>
                <Text style={[styles.translationText, { color: colors.primary }]}>{translation}</Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="volume-high-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.chipBackground }]}>
                  <Ionicons name="bookmark-outline" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Illustration diagram */}
            <View style={[styles.diagramMock, { backgroundColor: '#334155' }]}>
              <View style={styles.parkingSign}>
                <Text style={styles.parkingSignP}>P</Text>
              </View>
              <View style={styles.roadMarkings}>
                <View style={[styles.carMock, { backgroundColor: '#94A3B8' }]} />
                <View style={[styles.carMock, { backgroundColor: '#3B82F6' }]} />
                <View style={[styles.carMock, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.carMock, { backgroundColor: '#10B981' }]} />
                <View style={[styles.carMock, { backgroundColor: '#F59E0B' }]} />
              </View>
            </View>

            {/* Explanation paragraph */}
            <Text style={[styles.explanationText, { color: colors.textPrimary }]}>{explanation}</Text>

            {/* Bangla Audio Explanation Player */}
            <View style={[styles.audioPlayerCard, { backgroundColor: colors.primaryLight }]}>
              <TouchableOpacity style={[styles.audioPlayBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="play" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.waveformContainer}>
                <Ionicons name="stats-chart" size={16} color={colors.primary} />
                <Text style={[styles.audioDurationText, { color: colors.primary }]}>
                  Bangla · 0:24
                </Text>
              </View>
            </View>

            {/* Related Words */}
            <Text style={[styles.relatedTitle, { color: colors.textMuted }]}>RELATED WORDS</Text>
            <View style={styles.chipsRow}>
              <View style={[styles.chip, { backgroundColor: colors.chipBackground }]}>
                <Text style={[styles.chipText, { color: colors.textPrimary }]}>
                  fermata · brief stop
                </Text>
              </View>
              <View style={[styles.chip, { backgroundColor: colors.chipBackground }]}>
                <Text style={[styles.chipText, { color: colors.textPrimary }]}>
                  sosta di emergenza
                </Text>
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={[styles.gotItButton, { backgroundColor: colors.primary }]}
              onPress={onClose}
            >
              <Text style={styles.gotItText}>Got it</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wordTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagramMock: {
    height: 140,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  parkingSign: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkingSignP: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  roadMarkings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carMock: {
    width: 48,
    height: 30,
    borderRadius: 6,
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 12,
    marginBottom: 20,
  },
  audioPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioDurationText: {
    fontSize: 13,
    fontWeight: '700',
  },
  relatedTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gotItButton: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
