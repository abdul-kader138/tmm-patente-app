# TMM Patente - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This plan details the complete end-to-end implementation of **TMM Bangla Patente**, an Italian Driver's License learning mobile application for Bengali learners, covering 27 mockups (Light & Dark themes) and connecting to the live API (`https://v1.tmmbanglapatente.it`) with clean mock fallbacks for pending endpoints.

---

## Architecture Overview

- **Framework:** React Native + Expo (v58) with TypeScript
- **State Management & Data Layer:** React Context + Custom Hooks + Axios with Bearer token interceptor
- **Theming:** Custom theme engine supporting Dark & Light modes with tokens extracted from mockups:
  - Light: Primary `#2563EB`, Background `#F8FAFC`, Surface `#FFFFFF`, Text `#0F172A`, Muted `#64748B`, Border `#E2E8F0`
  - Dark: Primary `#3B82F6`, Background `#0F172A`, Surface `#1E293B`, Text `#F8FAFC`, Muted `#94A3B8`, Border `#334155`
- **Navigation:**
  - Bottom Tabs: `Home`, `Learn`, `Practice`, `Dictionary`, `Me`
  - Stack Navigation:
    - Auth: `Welcome`, `LanguageSelect`, `Login`, `Register`, `TwoFactor`
    - Learn: `VideoLessons`, `LessonPlayer`, `Topics`, `ChapterDetail`, `RoadSigns`, `EClass`
    - Quiz & Exam: `StudyMode`, `WordSheetModal`, `QuizQuestion`, `ExamSimulation`, `ExamResult`, `Review`
    - Challenges: `QuizChallenge`, `LiveDuel`
    - Practical: `PracticalDriving`, `CarParts`, `DrivingGuide`
    - Profile & Support: `Profile`, `Paywall`, `SupportChat`, `TeacherChat`, `QuizSettings`

---

## Tasks Breakdown

### Task 1: Scaffolding and Core Infrastructure
- [ ] Initialize React Native Expo TypeScript configuration in `D:\Personal\tmm-patente-app` (`package.json`, `app.json`, `tsconfig.json`, `babel.config.js`).
- [ ] Install core dependencies: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-safe-area-context`, `react-native-screens`, `@react-native-async-storage/async-storage`, `expo-status-bar`, `expo-linear-gradient`, `lucide-react-native` (or `@expo/vector-icons`).
- [ ] Set up Theme System: `src/theme/colors.ts`, `src/theme/typography.ts`, `src/theme/ThemeContext.tsx`.
- [ ] Set up API Client: `src/api/client.ts` with Sanctum bearer token handling and base URL `https://v1.tmmbanglapatente.it`.
- [ ] Set up Mock Data Service: `src/api/mockData.ts` for endpoints pending backend implementation.

### Task 2: Navigation & Tab Scaffolding
- [ ] Create Root Navigator (`src/navigation/RootNavigator.tsx`).
- [ ] Create Tab Navigator (`src/navigation/MainTabNavigator.tsx`) with 5 tabs (`Home`, `Learn`, `Practice`, `Dictionary`, `Me`).
- [ ] Verify tab switching and theme toggling.

### Task 3: Auth & Onboarding Module (Screens A1, A2)
- [ ] Implement `WelcomeScreen` (Screen A1) with Hero illustration, feature badges, and CTA buttons.
- [ ] Implement `LanguageSelectScreen` (Screen A2) with language list (English, Bangla, Punjabi, Hindi, Urdu, Italiano) and "Italian side-by-side" toggle.
- [ ] Implement Login / Register / 2FA screens connecting to `/api/v1/auth/*`.

### Task 4: Home Dashboard & Gamification (Screen B1)
- [ ] Implement `HomeScreen` (Screen B1) with:
  - User greeting & 12-day streak header.
  - Exam Readiness circular progress card (78% on track to pass).
  - 6-grid quick access buttons (Lessons, Topics, Exam test, Dictionary, E-Class, Road signs).
  - "Continue Study Mode" card (connected to `/api/v1/learning/latest`).
  - Bottom cards: Quiz challenge & Support 24h status.

### Task 5: Video Lessons & Lesson Player (Screens B2, B3)
- [ ] Implement `VideoLessonsScreen` (Screen B2) listing video lessons with chapter filters and watch progress.
- [ ] Implement `LessonPlayerScreen` (Screen B3) with video player controls, download/share, speed selector, CC subtitles toggle, and tabs ("Chapters", "Notes", "Transcript").
- [ ] Connect with `/api/v1/videos` and `/api/v1/videos/{videoLesson}`.

### Task 6: Topics & Chapters (Screens B4, B5)
- [ ] Implement `TopicsScreen` (Screen B4) with 25 Patente chapters progress breakdown.
- [ ] Implement `ChapterDetailScreen` (Screen B5) with stats bar (Correct, Errors, Unanswered), multi-select subtopic checkboxes, and "Study mode" / "Quiz" actions.
- [ ] Connect with `/api/v1/topics` and `/api/v1/topics/{topic}/questions`.

### Task 7: Study Mode, Word Sheet & Quiz Engine (Screens C1, C2, C3)
- [ ] Implement `StudyModeScreen` (Screen C1) with card-by-card question cards, Italian/Bangla audio listen, and glossary keyword tapping.
- [ ] Implement `WordSheetModal` (Screen C2) showing term definition, diagram illustration, audio explanation, and related keywords.
- [ ] Implement `QuizQuestionScreen` (Screen C3) with countdown timer, Vero/Falso buttons, instant explanation card, and "Ask tutor" link.

### Task 8: Official Exam Simulation & Result (Screens C4, C5, C6)
- [ ] Implement `ExamSimulationScreen` (Screen C4) with official 30-question grid selector, 20-minute countdown, answer toggles, and submit confirmation.
- [ ] Implement `ExamResultScreen` (Screen C5) with circular 28/30 pass badge, time & rank stats, trend line chart of last 8 exams, and error review CTA.
- [ ] Implement `ReviewMistakesScreen` (Screen C6) with tabs ("Mistakes", "Saved", "Notes"), smart spaced-repetition cards, and retry quiz flow.
- [ ] Connect with `/api/v1/exams/*` and `/api/v1/errors/review`.

### Task 9: Dictionary & Road Signs (Screens D1, D2)
- [ ] Implement `DictionaryScreen` (Screen D1) with search bar, audio pronunciation, "Always true" / "Always false" (Trucchi Patente) filters, and bookmarking.
- [ ] Implement `RoadSignsScreen` (Screen D2) with search, offline download button, category chips (All, Danger, Prohibition, Mandatory, Info), and percentage mastery.
- [ ] Connect with `/api/v1/dictionary` and `/api/v1/signs`.

### Task 10: E-Class & Teacher / Support Chat (Screens D3, D4, E4)
- [ ] Implement `EClassScreen` (Screen D3) with Live stream banner, calendar date picker, and daily scheduled class cards.
- [ ] Implement `TeacherChatScreen` (Screen D4) with instructor status, quiz card attachment, voice notes, and video call trigger.
- [ ] Implement `SupportScreen` (Screen E4) with 24/7 support chat, bank transfer receipt attachment, and license key card.

### Task 11: Progress, Profile & Quiz Settings (Screens E1, E2, E5)
- [ ] Implement `ProgressScreen` (Screen E1) with weekly bar chart, topic mastery bars, leaderboard league, and earned badges.
- [ ] Implement `ProfileScreen` (Screen E2) with license validity, offline storage meter, TT2112 PDF viewer, and web app QR login.
- [ ] Implement `QuizSettingsScreen` (Screen E5) with license category selector (AM, A1/A2, B, C/D), question count, time limit, shuffle, and audio speed settings.

### Task 12: Quiz Challenge & Practical Driving (Screens F1, F2, F3, F4, F5)
- [ ] Implement `QuizChallengeScreen` (Screen F1) with live challenge countdown, player code copy/QR, and recent duels list.
- [ ] Implement `LiveDuelScreen` (Screen F2) with real-time head-to-head score bar, opponent answer indicator, and fast-paced question timer.
- [ ] Implement `PracticalDrivingScreen` (Screen F3) with driving lesson booking banner, Foglio Rosa card, and scheduled drive card.
- [ ] Implement `CarPartsScreen` (Screen F4) with interactive car hotspot diagram (Exterior, Dashboard, Engine) and audio pronunciation.
- [ ] Implement `DrivingGuideScreen` (Screen F5) with step-by-step maneuver guide, diagram, and audio explanation.

### Task 13: Final Polish, Verification & Git Push
- [ ] Verify light and dark mode across all 27 screens.
- [ ] Commit all code cleanly with atomic commits.
- [ ] Push to `https://github.com/abdul-kader138/tmm-patente-app` (`main` branch).
