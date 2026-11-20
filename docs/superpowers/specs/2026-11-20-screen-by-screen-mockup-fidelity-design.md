# Design Specification: Screen-by-Screen Mockup-Fidelity Overhaul

**Date:** 2026-11-20  
**Status:** Approved by Engineering / Builder Review Incorporated  
**Project:** TMM Patente Mobile App (React Native / Expo SDK 58)  
**Approaches Evaluated:**
- **Approach 1 (Selected):** Screen-by-Screen Live Interactive Iteration. Inspect individual mockup pairs (`Screens/Light` & `Screens/Dark`), re-engineer the screen to match pixel-perfect details, verify live on device, execute code review, obtain user approval, and proceed sequentially.
- **Approach 2:** Flow-by-flow batching (Rejected: violates user requirement to verify each screen individually on their live phone).
- **Approach 3:** Design system abstraction first (Rejected: delays visual screen verification on device).

---

## 1. Intent & Purpose
The user has their physical phone connected to Expo Go and requires the TMM Bangla Patente mobile application to match the exact visual fidelity of the provided 27 mockups in `Screens/Light` and `Screens/Dark`. The previous scaffolding used generic placeholders; this overhaul replaces every screen with pixel-perfect layouts, responsive typography, precise color tokens, accurate graphics, and robust aspect ratio handling across Android and iOS devices.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **100% Mockup Match:** Recreate every UI component, font size, margin, padding, border radius, icon, and illustration exactly as shown in `Screens/Light` and `Screens/Dark`.
2. **Screen-by-Screen Cadence:** Complete one screen at a time starting from Screen 1 (`A1 Welcome`). Do not proceed to the next screen until the user has checked and approved the current screen on their live phone.
3. **Platform Responsiveness (iOS & Android):** Utilize `react-native-safe-area-context` (`useSafeAreaInsets`), responsive sizing, and platform-specific styling to ensure identical aspect ratios and no content clipping on notched screens, dynamic islands, or Android navigation bars.
4. **Adaptive Dark & Light Modes:** Seamless transition matching exact hex codes from light and dark mockups.
5. **Developer Verification Tools (`__DEV__`):**
   - Floating theme switcher pill (`☀️ / 🌙`) visible only in `__DEV__` to test Light & Dark instantly without changing OS settings.
   - Route switcher / dev selector to jump to any screen instantly for isolated inspection.
6. **Code Review Discipline:** Run automated validation (`npx tsc --noEmit`) and dispatch a code reviewer subagent after each screen implementation before seeking user sign-off.

### Non-Goals
- Modifying backend REST endpoints or database structures.
- Altering the original reference files in `Screens/`.

### Anti-Goals
- Using generic stock icons or approximate layouts that don't match the mockups.
- Batching multiple screens together without individual live device verification.

---

## 3. Builder Review Decisions
1. **Asset Sourcing Strategy:**
   - For complex artwork/hero illustrations (like the A1 Welcome road sign card, D2 road signs, F4 car parts), we extract/slice high-resolution lossless PNG assets directly from the official mockups into `assets/mockup-art/` ensuring 100% artwork precision matching the Figma designer's exact curves and shadows.
2. **Interactivity Level:**
   - Every screen is fully interactive (buttons trigger navigation, inputs accept text, tabs switch, theme toggles work) backed by the rich mock/live API data already configured.
3. **Live Device Preview Navigation:**
   - In `RootNavigator`, we can point `initialRouteName` directly to the active screen under development (or provide a floating Dev Route Launcher button), so the user's phone immediately reloads to the exact screen being perfected.
4. **Floating Theme Switcher:**
   - A floating pill in `App.tsx` (only in `__DEV__`) lets the user tap once to toggle between Light and Dark mode instantly on their phone.

---

## 4. Screen 1 Focus: `A1 Welcome` (Current Task)

### Visual Elements (Light & Dark)
1. **Top Road Sign Hero Card:**
   - Extracted high-resolution hero asset for Light and Dark modes.
   - Rounded corners (`borderRadius: 24`), clean margin and aspect ratio handling.
2. **Typography & Content:**
   - Title: **"Your Italian driving licence, in your language"** (Bold, ~28-30px, tight line height, proper font weight).
   - Subtitle: **"Official ministerial quizzes, video lessons and audio explanations in Bangla and English."** (Medium gray, 15px, comfortable line height).
3. **Auth Actions:**
   - **Continue with Google:**
     - Light: White background, subtle border `#E2E8F0`, Google multi-color G icon, dark text `#0F172A`.
     - Dark: Dark slate card `#161B26`, border `#2A3447`, Google G icon, white text `#FFFFFF`.
   - **Continue with Apple:**
     - Light: Solid black `#0F172A`, Apple icon, white text `#FFFFFF`.
     - Dark: Solid white `#FFFFFF`, Apple icon, black text `#0F172A`.
   - **Phone Auth Link:**
     - Clean text button: "Use phone number", primary blue color (`#3B82F6`).
4. **Footer:**
   - QR scanner login icon + text: *"Studying on another device? Scan to log in"*.
   - Centered above safe area bottom inset.

---

## 5. Execution Workflow per Screen
```
[Inspect Light & Dark Mockup]
       │
       ▼
[Extract Assets & Build Pixel-Perfect Screen Component]
       │
       ▼
[Verify TypeScript Compilation & Hot Reload on Device]
       │
       ▼
[Dispatch Code Reviewer Subagent (/requesting-code-review)]
       │
       ▼
[Present to User for Live Device Inspection & Approval]
       │
       ▼
[Upon Approval -> Proceed to Next Screen]
```
