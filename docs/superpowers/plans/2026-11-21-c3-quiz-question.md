# C3 Quiz Question Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul `QuizQuestionScreen.tsx` to be 100% pixel-perfect and fully functional matching Figma `C3 Quiz question.png` in Light and Dark modes.

**Architecture:** Pure React Native with `react-native-svg` for ministerial warning sign graphics, `expo-speech` for Italian TTS, `AsyncStorage` for bookmark persistence, dynamic 30-dot progress indicator, interactive `WordSheetModal` for glossary keyword lookup, and matching Lesson player typography and positioning.

**Tech Stack:** React Native, TypeScript, `react-native-svg`, `expo-speech`, `@react-native-async-storage/async-storage`, `lucide-react-native` / `@expo/vector-icons`.

**Spec:** `docs/superpowers/specs/2026-11-21-c3-quiz-question-design.md`

## Global Constraints
- Zero image crop / PNG slice hacks; 100% pure SVG vector illustrations.
- Full Light and Dark theme support calibrated to exact Figma colors.
- Strict TypeScript: zero errors with `npx tsc --noEmit`.
- Accessible touch targets (minimum 40x40dp) with proper accessibility labels.

---

### Task 1: Level Crossing Vector Sign Component & Pure SVG Graphics
**Files:**
- Modify: `src/screens/quiz/QuizQuestionScreen.tsx`

**Interfaces:**
- Produces: `LevelCrossingDangerSign` vector SVG component rendering the equilateral red border and white triangle with 5 pickets and 2 horizontal rails.

- [ ] **Step 1: Define `LevelCrossingDangerSign` vector component in `QuizQuestionScreen.tsx`**
- [ ] **Step 2: Replace placeholder generic warning icon with `LevelCrossingDangerSign` inside a 160dp card**
- [ ] **Step 3: Run `npx tsc --noEmit` to verify type safety**

---

### Task 2: Header, Timer & 30-Dots Progress Indicator
**Files:**
- Modify: `src/screens/quiz/QuizQuestionScreen.tsx`

**Interfaces:**
- Produces: 30-dot progress bar, live countdown timer `formatTimer(seconds)`, and dismiss action.

- [ ] **Step 1: Implement 30 dots matching the mockup color states (dots 1-6 green, 7 red, 8-11 green, 12 blue, 13-30 inactive)**
- [ ] **Step 2: Calibrate close button, topic subtext, question title, and amber timer badge**
- [ ] **Step 3: Run `npx tsc --noEmit` to verify**

---

### Task 3: Official Tag, Italian TTS Audio & Bookmark Persistence
**Files:**
- Modify: `src/screens/quiz/QuizQuestionScreen.tsx`

**Interfaces:**
- Consumes: `expo-speech`, `AsyncStorage`
- Produces: `handleSpeakQuestion` (speaks Italian with active button state) and `handleToggleBookmark` (persists to `@patente_bookmarked_quizzes`).

- [ ] **Step 1: Wire up `Speech.speak` with `it-IT` language and animated/active button style**
- [ ] **Step 2: Wire up `AsyncStorage` bookmark loading and toggling**
- [ ] **Step 3: Run `npx tsc --noEmit` to verify**

---

### Task 4: English Caption Card & Glossary Chips with WordSheetModal
**Files:**
- Modify: `src/screens/quiz/QuizQuestionScreen.tsx`

**Interfaces:**
- Consumes: `WordSheetModal` from `./WordSheetModal`
- Produces: Lesson-player-styled caption box and interactive glossary chips that trigger `WordSheetModal`.

- [ ] **Step 1: Build the English translation box with `includeFontPadding: false` matching Lesson player typography**
- [ ] **Step 2: Implement glossary chips (`passaggio a livello`, `preannuncia`) with `onPress` opening `WordSheetModal`**
- [ ] **Step 3: Embed `WordSheetModal` component with state handling**

---

### Task 5: VERO / FALSO Cards & Instant Feedback Sheet
**Files:**
- Modify: `src/screens/quiz/QuizQuestionScreen.tsx`

**Interfaces:**
- Produces: Selection state for VERO / FALSO and feedback card with `+10 XP` badge, tutor button, and next question action.

- [ ] **Step 1: Style VERO and FALSO cards with exact borders, radio circles, and active checkmarks**
- [ ] **Step 2: Implement feedback card with sparkle icon, XP badge, explanation text, and CTA buttons**
- [ ] **Step 3: Run `npx tsc --noEmit` to verify clean build**

---

### Task 6: Visual Verification & Code Review
**Files:**
- Verify on live emulator: `emulator-5554`
- Compare with: `Screens/Light/C3 Quiz question.png` and `Screens/Dark/C3 Quiz question.png`

- [ ] **Step 1: Test on Android emulator in Light Mode, capture screencap and side-by-side comparison**
- [ ] **Step 2: Test on Android emulator in Dark Mode, capture screencap and side-by-side comparison**
- [ ] **Step 3: Invoke Senior Code Reviewer subagent (`/requesting-code-review`)**
- [ ] **Step 4: Commit and push to `origin main`**
