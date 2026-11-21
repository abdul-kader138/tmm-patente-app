import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Learn: undefined;
  RoadSigns: undefined;
  EClass: undefined;
  Topics: undefined;
  Chapter: { chapterId?: number; title?: string } | undefined;
  PracticalDriving: undefined;
  Practice: undefined;
  Dictionary: undefined;
  Progress: undefined;
  Me: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Welcome: undefined;
  Language: undefined;
  VideoLessons: undefined;
  LessonPlayer: { lessonId?: number; title?: string } | undefined;
  Topics: undefined;
  Chapter: { chapterId?: number; title?: string } | undefined;
  StudyMode: { topicId?: number; title?: string } | undefined;
  QuizQuestion: { topicId?: number; mode?: 'study' | 'practice' } | undefined;
  ExamSimulation: undefined;
  ExamResult: { examId?: number; score?: number; passed?: boolean } | undefined;
  Review: undefined;
  TeacherChat: undefined;
  SupportChat: undefined;
  Paywall: undefined;
  Progress: undefined;
  QuizSettings: undefined;
  QuizChallenge: undefined;
  LiveDuel: undefined;
  PracticalDriving: undefined;
  CarParts: undefined;
  DrivingGuide: undefined;
};
