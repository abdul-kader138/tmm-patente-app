export type RootStackParamList = {
  MainTabs: undefined;
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
  RoadSigns: undefined;
  EClass: undefined;
  TeacherChat: undefined;
  SupportChat: undefined;
  Paywall: undefined;
  QuizSettings: undefined;
  QuizChallenge: undefined;
  LiveDuel: undefined;
  PracticalDriving: undefined;
  CarParts: undefined;
  DrivingGuide: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Learn: undefined;
  Practice: undefined;
  Dictionary: undefined;
  Me: undefined;
};
