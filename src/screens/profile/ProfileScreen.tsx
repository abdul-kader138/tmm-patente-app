import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, mode, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => navigation.replace('Welcome') },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Header Card */}
        <View style={styles.profileHeaderRow}>
          <View style={[styles.avatarBox, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>RU</Text>
          </View>

          <View style={styles.userInfoCol}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>Rahim Uddin</Text>
            <Text style={[styles.userMeta, { color: colors.textMuted }]}>
              ID 48213 · rahim@example.com
            </Text>

            {/* Premium Validity Crown Badge */}
            <TouchableOpacity
              style={[styles.premiumBadge, { backgroundColor: colors.warningLight }]}
              onPress={() => navigation.navigate('Paywall')}
            >
              <Ionicons name="ribbon" size={14} color={colors.warning} />
              <Text style={[styles.premiumBadgeText, { color: colors.warning }]}>
                Full version · until 12 Mar 2027
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LEARNING Group */}
        <View style={styles.sectionGroup}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LEARNING</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Progress' })}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="stats-chart" size={18} color="#10B981" />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Learning progress</Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>78% ready</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('QuizSettings')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="car" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Licence category</Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>Patente B</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Language')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="language" size={18} color="#7E22CE" />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Study language</Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>English</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('QuizSettings')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="settings-outline" size={18} color={colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Quiz settings</Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>30 Q · 20 min</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('MainTabs', { screen: 'PracticalDriving' })}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="car-sport" size={18} color="#2563EB" />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Practical driving</Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>Foglio rosa & lessons</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* APP Group */}
        <View style={styles.sectionGroup}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APP</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="moon-outline" size={18} color={colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Appearance</Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="download-outline" size={18} color={colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
                Offline downloads
              </Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>1.2 GB</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ACCOUNT Group */}
        <View style={styles.sectionGroup}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCOUNT</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Paywall')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="ribbon-outline" size={18} color={colors.warning} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
                Store & licence key
              </Text>
              <Text style={[styles.menuValue, { color: colors.textMuted }]}>180 days</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="qr-code-outline" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
                Login on web app
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="document-text-outline" size={18} color={colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
                TT2112 form (PDF)
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('SupportChat')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.chipBackground }]}>
                <Ionicons name="help-circle-outline" size={18} color={colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Support 24h</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.errorLight }]}>
                <Ionicons name="log-out-outline" size={18} color={colors.error} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.error }]}>Log out</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
  },
  userInfoCol: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userMeta: {
    fontSize: 12,
    marginBottom: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionGroup: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  groupCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  menuValue: {
    fontSize: 13,
  },
  menuDivider: {
    height: 1,
    marginLeft: 62,
  },
});
