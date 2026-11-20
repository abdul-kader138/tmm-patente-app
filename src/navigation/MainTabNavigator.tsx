import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { useTheme } from '../theme/ThemeContext';
import Svg, { Rect, Polygon } from 'react-native-svg';
import { Home, CheckSquare, BookOpen, User } from 'lucide-react-native';

const TabVideoIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="3.5" width="20" height="17" rx="2.5" stroke={color} strokeWidth="2" />
    <Polygon
      points="10,8 16.5,12 10,16"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

import { HomeScreen } from '../screens/home/HomeScreen';
import { VideoLessonsScreen } from '../screens/learn/VideoLessonsScreen';
import { QuizChallengeScreen } from '../screens/challenges/QuizChallengeScreen';
import { DictionaryScreen } from '../screens/dictionary/DictionaryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const activeColor = isDark ? '#5B7CFF' : '#2D5BFF';
  const inactiveColor = isDark ? '#667085' : '#8E95A5';
  const activePillBg = isDark ? '#1B2547' : '#EFF4FF';

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);
  const tabHeight = 60 + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#0A0E18' : '#FFFFFF',
          borderTopColor: isDark ? '#1E2740' : '#EAECF0',
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: activePillBg },
              ]}
            >
              <Home
                size={22}
                color={focused ? activeColor : inactiveColor}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Learn"
        component={VideoLessonsScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: activePillBg },
              ]}
            >
              <TabVideoIcon
                color={focused ? activeColor : inactiveColor}
                size={22}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Practice"
        component={QuizChallengeScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: activePillBg },
              ]}
            >
              <CheckSquare
                size={22}
                color={focused ? activeColor : inactiveColor}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{
          tabBarLabel: 'Dictionary',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: activePillBg },
              ]}
            >
              <BookOpen
                size={22}
                color={focused ? activeColor : inactiveColor}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Me"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: activePillBg },
              ]}
            >
              <User
                size={22}
                color={focused ? activeColor : inactiveColor}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});
