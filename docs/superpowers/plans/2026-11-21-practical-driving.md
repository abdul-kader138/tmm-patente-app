# Practical Driving (Screen F3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a pixel-perfect, fully functional Practical Driving screen (Screen F3 in Light & Dark modes) with custom vector car illustration, interactive lesson booking, phone calling, Foglio Rosa details, and scheduled lessons management.

---

### File Structure & Architecture
- `src/components/illustrations/YellowCarIllustration.tsx`: Pure SVG vector component recreating the yellow sedan driving school car from Figma.
- `src/components/illustrations/index.ts`: Export barrel for custom illustrations.
- `src/screens/practical/components/BookLessonModal.tsx`: Interactive bottom sheet / modal for choosing instructor, topic, date/time slot, and confirming bookings.
- `src/screens/practical/components/LessonDetailModal.tsx`: Interactive modal for viewing, rescheduling, or canceling scheduled lessons.
- `src/screens/practical/components/FoglioRosaModal.tsx`: Official Italian rules modal (companion driver requirements, 6-month validity, 3 exam attempts rule).
- `src/screens/practical/PracticalDrivingScreen.tsx`: Complete Screen F3 matching Figma (Light/Dark themes), fully animated and interactive.
- `src/navigation/MainTabNavigator.tsx`: Register `PracticalDriving` with `isLearnSection` highlighting the `Learn` tab.
- `src/navigation/types.ts`: Update navigation param lists.

---

### Task 1: Vector Graphic Recreation (`YellowCarIllustration.tsx`)
- [ ] Create `src/components/illustrations/YellowCarIllustration.tsx` using `react-native-svg` (`Svg`, `Path`, `Circle`, `Rect`, `G`).
- [ ] Match Figma exact proportions (sleek yellow body `#FDBA2D`, pale blue tinted windows `#BAE6FD`, dark tires `#1E293B`, silver hubcaps `#94A3B8`, door handle and light accents).
- [ ] Export from `src/components/illustrations/index.ts`.
- [ ] Verify TypeScript compilation with `npx tsc --noEmit`.

### Task 2: Modals & Interactive Functionality
- [ ] Create `BookLessonModal.tsx`:
  - City selector: Rome (Roma) / Milan (Milano).
  - Lesson topics: City traffic, Parallel parking, Highway & roundabouts, Night driving.
  - Date & time picker pills.
  - Instructor selector with Karim H. (Bangla-speaking).
  - Submit booking action that triggers success feedback and adds to state.
- [ ] Create `LessonDetailModal.tsx`:
  - Scheduled lesson details (Date, time, location, instructor phone).
  - Action buttons: "Call instructor", "Reschedule", "Cancel lesson".
- [ ] Create `FoglioRosaModal.tsx`:
  - Detailed explanation of Foglio Rosa rights & restrictions under Italian Codice della Strada (Article 122).
- [ ] Add direct phone calling support via `Linking.openURL('tel:+39061234567')` with error fallback.

### Task 3: Screen F3 Practical Driving Implementation
- [ ] Refactor `src/screens/practical/PracticalDrivingScreen.tsx` to match Figma Light & Dark designs.
- [ ] Header: "Practical driving", "After the theory exam", back button support.
- [ ] Hero Card: TMM DRIVING SCHOOL, "Ready for the road?", "Book lesson" and "Call" CTAs, embedded `YellowCarIllustration`.
- [ ] 2x2 Feature Grid:
  - 1. Driving videos -> navigates to `DrivingGuide` (or video lessons).
  - 2. Car parts -> navigates to `CarParts`.
  - 3. Driving guide -> navigates to `DrivingGuide`.
  - 4. Practical exam -> opens Practical Exam checklist sheet.
- [ ] Foglio Rosa Card: Active badge, valid until May 2027, 2 attempts left, tap opens `FoglioRosaModal`.
- [ ] Scheduled Lesson Card: Calendar date block ("THU 24"), city traffic lesson, tap opens `LessonDetailModal`.

### Task 4: Navigation & Tab Bar Integration
- [ ] Update `src/navigation/types.ts`: Ensure `PracticalDriving` is in `MainTabParamList` & `RootStackParamList`.
- [ ] Update `src/navigation/MainTabNavigator.tsx`:
  - Mount `<Tab.Screen name="PracticalDriving" component={PracticalDrivingScreen} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }} />`.
  - Update `isLearnSection` to include `currentRoute === 'PracticalDriving'`.
- [ ] Update `src/screens/learn/VideoLessonsScreen.tsx` and/or `HomeScreen.tsx` to provide easy access to Practical Driving.

### Task 5: Verification & Quality Assurance
- [ ] Run `npx tsc --noEmit` to verify 0 errors.
- [ ] Verify on Android emulator in Light Mode.
- [ ] Verify on Android emulator in Dark Mode.
- [ ] Test booking a lesson, calling instructor, opening sub-features, and tab bar persistence.
- [ ] Commit changes with descriptive git commit message.
