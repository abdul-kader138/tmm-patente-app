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
import { mockCarParts } from '../../api/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CarPartsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<'exterior' | 'dashboard' | 'engine'>('exterior');
  const [selectedPartId, setSelectedPartId] = useState<number>(1);

  const parts = mockCarParts[activeTab];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Car parts</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            42 parts · Italian + English
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="search" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: colors.chipBackground }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'exterior' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('exterior')}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'exterior' ? colors.textPrimary : colors.textMuted },
            ]}
          >
            Exterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'dashboard' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'dashboard' ? colors.textPrimary : colors.textMuted },
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'engine' && { backgroundColor: colors.card }]}
          onPress={() => setActiveTab('engine')}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'engine' ? colors.textPrimary : colors.textMuted },
            ]}
          >
            Engine
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Interactive Diagram Area */}
        <View style={[styles.diagramCard, { backgroundColor: colors.cardHighlight }]}>
          <View style={styles.carBodyMock}>
            <Ionicons name="car-sport" size={120} color={colors.primary} />

            {/* Hotspots */}
            <TouchableOpacity
              style={[styles.hotspot, { top: 20, right: 30, backgroundColor: colors.primary }]}
              onPress={() => setSelectedPartId(1)}
            >
              <Text style={styles.hotspotDigit}>1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hotspot, { top: 25, left: 100, backgroundColor: colors.primary }]}
              onPress={() => setSelectedPartId(2)}
            >
              <Text style={styles.hotspotDigit}>2</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hotspot, { bottom: 10, left: 70, backgroundColor: colors.primary }]}
              onPress={() => setSelectedPartId(3)}
            >
              <Text style={styles.hotspotDigit}>3</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hotspot, { top: 10, left: 140, backgroundColor: colors.primary }]}
              onPress={() => setSelectedPartId(4)}
            >
              <Text style={styles.hotspotDigit}>4</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hotspot, { top: 40, left: 20, backgroundColor: colors.primary }]}
              onPress={() => setSelectedPartId(5)}
            >
              <Text style={styles.hotspotDigit}>5</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.hintText, { color: colors.textMuted }]}>
          Tap a number to hear the Italian name and its explanation.
        </Text>

        {/* Numbered Parts List */}
        <View style={styles.partsList}>
          {parts.map((item) => {
            const isSelected = selectedPartId === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.partRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
                onPress={() => setSelectedPartId(item.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.numberBadge,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.chipBackground,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.numberText,
                      { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    {item.id}
                  </Text>
                </View>

                <View style={styles.partInfo}>
                  <Text style={[styles.partItalian, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.partEnglish, { color: colors.textMuted }]}>
                    {item.translation}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.audioIconBtn, { backgroundColor: colors.primaryLight }]}
                >
                  <Ionicons name="volume-high" size={18} color={colors.primary} />
                </TouchableOpacity>
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
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  diagramCard: {
    height: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  carBodyMock: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hotspot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hotspotDigit: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  hintText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  partsList: {
    gap: 10,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 13,
    fontWeight: '800',
  },
  partInfo: {
    flex: 1,
  },
  partItalian: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  partEnglish: {
    fontSize: 12,
  },
  audioIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
