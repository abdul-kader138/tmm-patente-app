# Design Specification: Screen-by-Screen Mockup-Fidelity Overhaul

**Date:** 2026-11-20  
**Status:** In Review  
**Project:** TMM Patente Mobile App (React Native / Expo SDK 58)  
**Approaches Evaluated:**
- **Approach 1 (Selected):** Screen-by-Screen Live Interactive Iteration. Inspect individual mockup pairs (`Screens/Light` & `Screens/Dark`), re-engineer the screen to match pixel-perfect details, verify live on device, execute code review, obtain user approval, and proceed sequentially.
- **Approach 2:** Flow-by-flow batching (Rejected: violates user requirement to verify each screen individually on their live phone).
- **Approach 3:** Design system abstraction first (Rejected: delays visual screen verification on device).

---

## 1. Intent & Purpose
The user has their physical phone connected to Expo Go and requires the TMM Bangla Patente mobile application to match the exact visual fidelity of the provided 27 mockups in `Screens/Light` and `Screens/Dark`. The previous scaffolding used generic placeholders; this overhaul replaces every screen with pixel-perfect layouts, responsive typography, precise color tokens, accurate SVG/vector graphics, and robust aspect ratio handling across Android and iOS devices.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **100% Mockup Match:** Recreate every UI component, font size, margin, padding, border radius, icon, and illustration exactly as shown in `Screens/Light` and `Screens/Dark`.
2. **Screen-by-Screen Cadence:** Complete one screen at a time starting from Screen 1 (`A1 Welcome`). Do not proceed to the next screen until the user has checked and approved the current screen on their live phone.
3. **Platform Responsiveness (iOS & Android):** Utilize `react-native-safe-area-context` (`useSafeAreaInsets`), responsive sizing, and platform-specific styling to ensure identical aspect ratios and no content clipping on notched screens, dynamic islands, or Android navigation bars.
4. **Adaptive Dark & Light Modes:** Seamless transition matching exact hex codes from light and dark mockups.
5. **Code Review Discipline:** Run automated validation (`npx tsc --noEmit`) and dispatch a code reviewer subagent after each screen implementation before seeking user sign-off.

### Non-Goals
- Modifying backend REST endpoints or database structures.
- Altering the original reference files in `Screens/`.

### Anti-Goals
- Using generic stock icons or approximate layouts that don't match the mockups.
- Batching multiple screens together without individual live device verification.

---

## 3. Screen 1 Focus: `A1 Welcome` (First Iteration)

### Visual Elements (Light & Dark)
1. **Top Road Sign Hero Card:**
   - Deep royal blue card container (`#2563EB` to `#1D4ED8`) with 24px corner radius.
   - Road signs composite:
     - Octagonal STOP sign (red `#DC2626` with white border & text).
     - No-entry circle (red with horizontal white bar).
     - Inverted Yield triangle (white with thick red border).
     - Railway level crossing warning triangle (red border, white field, black crossing tracks).
     - Blue directional circle (solid blue `#2563EB` with bold white arrow pointing up).
     - Speed limit 50 circle (white disc, bold red border, black "50").
     - VERO/True verification pill (white/light green container `#E6F4EA`, green bold "VERO", subtle subtext "True").
2. **Typography & Content:**
   - Title: **"Your Italian driving licence, in your language"** (Bold, ~28-30px, tight line height).
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

## 4. Execution Workflow per Screen
```
[Inspect Light & Dark Mockup]
       │
       ▼
[Build Vector Graphics & Pixel-Perfect Screen Component]
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

---

## 5. Next Screens in Queue
- **Screen 1:** `A1 Welcome` (Current)
- **Screen 2:** `A2 Language`
- **Screen 3:** `B1 Home`
- **Subsequent:** `B2`-`B5`, `C1`-`C6`, `D1`-`D4`, `E1`-`E5`, `F1`-`F5`.
