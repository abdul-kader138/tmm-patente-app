# Screen 1 (A1 Welcome) Mockup-Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Screen 1 (`A1 Welcome`) into a pixel-perfect, Duolingo-grade reproduction of `Screens/Light/A1 Welcome.png` and `Screens/Dark/A1 Welcome.png` with edge-to-edge adaptive status/navigation bars, lossless hero artwork, and full iOS/Android responsiveness.

**Architecture:** Layered React Native components wrapped in `useSafeAreaInsets` for flawless aspect-ratio and edge-to-edge system bar adaptation. `ThemeContext` drives dynamic styling between Light (`#FFFFFF`, `#0F172A`, `#E2E8F0`) and Dark (`#0B0F17`, `#FFFFFF`, `#161B26`) modes. Sliced lossless hero graphics are loaded from `assets/mockup-art/`.

**Tech Stack:** React Native 0.88.1, Expo SDK 58, TypeScript, `react-native-safe-area-context`, `expo-status-bar`, Ionicons.

**Spec:** `docs/superpowers/specs/2026-11-20-screen-by-screen-mockup-fidelity-design.md`

## Global Constraints
- Target Expo SDK: 58.
- Pixel-perfect fidelity to `Screens/Light/A1 Welcome.png` and `Screens/Dark/A1 Welcome.png`.
- Dynamic status bar and navigation bar backgrounds matching screen background seamlessly (Duolingo standard).
- Floating `__DEV__` theme switcher for instant one-tap Light/Dark preview.
- Zero TypeScript compiler errors (`npx tsc --noEmit`).

## Review Focus
- Status bar text contrast against light/dark backgrounds (must never be invisible).
- Road sign hero illustration aspect ratio distortion on tall/narrow screens.
- Google & Apple auth button styling in both Light and Dark modes (Apple button reverses colors between themes).
- Android navigation bar / iOS home indicator clipping or white seams.
- QR login footer alignment above safe area bottom margin.

---

### Task 1: Duolingo-Grade Edge-to-Edge System Bars & Floating Theme Switcher

**Files:**
- Modify: `App.tsx`
- Modify: `src/theme/ThemeContext.tsx`
- Modify: `src/theme/colors.ts`

**Interfaces:**
- Consumes: `useTheme` from `src/theme/ThemeContext.tsx`.
- Produces: Edge-to-edge root view with dynamic status bar and bottom nav matching screen background; floating debug pill (`☀️ / 🌙`).

- [ ] **Step 1: Update ThemeContext and Root Container**
Update `App.tsx` so the root container background color matches `colors.background`, and `StatusBar` has `translucent` and `style={isDark ? 'light' : 'dark'}`. Add a floating dev theme toggle pill in `App.tsx` enabled in `__DEV__`.

- [ ] **Step 2: Verify TypeScript Compilation**
Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**
```bash
git commit -am "feat: add edge-to-edge system bars and floating dev theme toggle"
```

---

### Task 2: High-Resolution Hero Asset Extraction for A1 Welcome

**Files:**
- Create: `assets/mockup-art/welcome-hero-light.png`
- Create: `assets/mockup-art/welcome-hero-dark.png`

**Interfaces:**
- Consumes: `Screens/Light/A1 Welcome.png` and `Screens/Dark/A1 Welcome.png`.
- Produces: Lossless, cropped hero artwork matching the exact road sign composition.

- [ ] **Step 1: Extract Hero Road Sign Graphic from Mockups**
Use PowerShell / Node / Python script to slice the exact hero card region from `Screens/Light/A1 Welcome.png` and `Screens/Dark/A1 Welcome.png` into `assets/mockup-art/welcome-hero-light.png` and `welcome-hero-dark.png`.

- [ ] **Step 2: Verify Asset Generation**
Check that files exist and dimensions match the original card proportions.

- [ ] **Step 3: Commit**
```bash
git add assets/mockup-art/
git commit -m "chore: extract high-resolution hero art for Welcome screen"
```

---

### Task 3: Screen 1 (`A1 Welcome`) Pixel-Perfect Overhaul

**Files:**
- Modify: `src/screens/auth/WelcomeScreen.tsx`

**Interfaces:**
- Consumes: `welcome-hero-light.png`, `welcome-hero-dark.png`, `useTheme()`, `useSafeAreaInsets()`.
- Produces: Complete, responsive Welcome Screen matching mockups in Light and Dark modes.

- [ ] **Step 1: Implement Pixel-Perfect Layout in `WelcomeScreen.tsx`**
Rebuild `WelcomeScreen.tsx` with:
- `useSafeAreaInsets()` for notch and home-bar padding.
- Hero card with exact corner radius (24px) and shadow/elevation.
- Title: "Your Italian driving licence, in your language" with exact bold weighting and letter spacing.
- Subtitle: "Official ministerial quizzes, video lessons and audio explanations in Bangla and English."
- Google Auth button (white with gray border in light, dark slate card with border in dark, G icon + text).
- Apple Auth button (black in light, white in dark, Apple icon + text).
- "Use phone number" text action.
- Centered QR code login footer: "Studying on another device? Scan to log in".

- [ ] **Step 2: Run TypeScript Verification**
Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**
```bash
git commit -am "feat: implement pixel-perfect A1 Welcome screen matching mockups"
```

---

### Task 4: Code Review Verification (`requesting-code-review`)

**Files:**
- Review: `src/screens/auth/WelcomeScreen.tsx`, `App.tsx`, `assets/mockup-art/`

- [ ] **Step 1: Get Git SHAs**
```bash
BASE_SHA=$(git rev-parse HEAD~2)
HEAD_SHA=$(git rev-parse HEAD)
```

- [ ] **Step 2: Dispatch Code Reviewer Subagent**
Run code reviewer subagent as required by `requesting-code-review`.

- [ ] **Step 3: Address Any Important/Critical Findings & Commit**

---

### Task 5: Live Device Verification & User Sign-Off

- [ ] **Step 1: Hot Reload Verification on Live Expo Device**
Verify the screen renders on the user's phone in Expo Go.

- [ ] **Step 2: Present Light & Dark Comparisons to User for Sign-Off**
User toggles between Light and Dark mode using the floating pill on their phone and provides feedback or approval.
