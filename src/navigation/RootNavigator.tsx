import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import { MainTabNavigator } from './MainTabNavigator';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LanguageScreen } from '../screens/auth/LanguageScreen';
import { VideoLessonsScreen } from '../screens/learn/VideoLessonsScreen';
import { LessonPlayerScreen } from '../screens/learn/LessonPlayerScreen';
import { TopicsScreen } from '../screens/learn/TopicsScreen';
import { ChapterScreen } from '../screens/learn/ChapterScreen';
import { StudyModeScreen } from '../screens/quiz/StudyModeScreen';
import { QuizQuestionScreen } from '../screens/quiz/QuizQuestionScreen';
import { ExamSimulationScreen } from '../screens/quiz/ExamSimulationScreen';
import { ExamResultScreen } from '../screens/quiz/ExamResultScreen';
import { ReviewScreen } from '../screens/quiz/ReviewScreen';
import { RoadSignsScreen } from '../screens/learn/RoadSignsScreen';
import { EClassScreen } from '../screens/learn/EClassScreen';
import { TeacherChatScreen } from '../screens/chat/TeacherChatScreen';
import { SupportChatScreen } from '../screens/chat/SupportChatScreen';
import { PaywallScreen } from '../screens/profile/PaywallScreen';
import { QuizSettingsScreen } from '../screens/profile/QuizSettingsScreen';
import { QuizChallengeScreen } from '../screens/challenges/QuizChallengeScreen';
import { LiveDuelScreen } from '../screens/challenges/LiveDuelScreen';
import { PracticalDrivingScreen } from '../screens/practical/PracticalDrivingScreen';
import { CarPartsScreen } from '../screens/practical/CarPartsScreen';
import { DrivingGuideScreen } from '../screens/practical/DrivingGuideScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="QuizQuestion"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      
      {/* Learn & Content */}
      <Stack.Screen name="VideoLessons" component={VideoLessonsScreen} />
      <Stack.Screen name="LessonPlayer" component={LessonPlayerScreen} />
      <Stack.Screen name="Topics" component={TopicsScreen} />
      <Stack.Screen name="Chapter" component={ChapterScreen} />
      <Stack.Screen name="RoadSigns" component={RoadSignsScreen} />
      <Stack.Screen name="EClass" component={EClassScreen} />

      {/* Quiz & Exam */}
      <Stack.Screen name="StudyMode" component={StudyModeScreen} />
      <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen} />
      <Stack.Screen name="ExamSimulation" component={ExamSimulationScreen} />
      <Stack.Screen name="ExamResult" component={ExamResultScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />

      {/* Challenges */}
      <Stack.Screen name="QuizChallenge" component={QuizChallengeScreen} />
      <Stack.Screen name="LiveDuel" component={LiveDuelScreen} />

      {/* Practical Driving */}
      <Stack.Screen name="PracticalDriving" component={PracticalDrivingScreen} />
      <Stack.Screen name="CarParts" component={CarPartsScreen} />
      <Stack.Screen name="DrivingGuide" component={DrivingGuideScreen} />

      {/* Chat & Support */}
      <Stack.Screen name="TeacherChat" component={TeacherChatScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />

      {/* Profile & Settings */}
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="QuizSettings" component={QuizSettingsScreen} />
    </Stack.Navigator>
  );
};
