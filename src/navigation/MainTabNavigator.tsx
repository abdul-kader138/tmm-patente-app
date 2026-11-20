import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/home/HomeScreen';
import { VideoLessonsScreen } from '../screens/learn/VideoLessonsScreen';
import { QuizChallengeScreen } from '../screens/challenges/QuizChallengeScreen';
import { DictionaryScreen } from '../screens/dictionary/DictionaryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Learn"
        component={VideoLessonsScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'play-circle' : 'play-circle-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Practice"
        component={QuizChallengeScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'checkbox' : 'checkbox-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{
          tabBarLabel: 'Dictionary',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Me"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
