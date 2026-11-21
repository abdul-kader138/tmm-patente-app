# C3 Quiz Question Screen Design Spec

## Intent & Overview
Make `src/screens/quiz/QuizQuestionScreen.tsx` 100% pixel-perfect and fully functional against the Figma mockups `Screens/Light/C3 Quiz question.png` and `Screens/Dark/C3 Quiz question.png`, adhering strictly to Senior Front-end Developer and Senior Architect standards.

## Target Screen
- **Figma Reference:** `Screens/Light/C3 Quiz question.png` and `Screens/Dark/C3 Quiz question.png`
- **File:** `src/screens/quiz/QuizQuestionScreen.tsx`
- **Screen Baseline:** 390x844 (@1x), Figma @2x (780x1688).

---

## Visual Design & Architecture Tokens

### 1. Header & Navigation
- **Close Button:** 40x40 squircle / circular hit area with `X` icon (`strokeWidth: 2.2`), dismisses via `navigation.goBack()`.
- **Center Header Text:**
  - Topic subtitle: `Danger signs · Practice` (Light: `#64748B`, Dark: `#8F9BB3`, `fontSize: 13, fontWeight: '500'`).
  - Question index: `Question 12 of 30` (Light: `#0F172A`, Dark: `#FFFFFF`, `fontSize: 17, fontWeight: '800'`).
- **Timer Badge:**
  - Active countdown timer formatted as `MM:SS` (starts from `08:42`).
  - Light mode: bg `#FEF3C7`, text `#B45309`.
  - Dark mode: bg `#372818`, text `#F59E0B`.

### 2. 30-Dots Progress Indicator
- Array of exactly 30 dots in a single horizontal row (`gap: 4` or `5`, height 4dp, `borderRadius: 2dp`).
- Dots 1 to 6: Completed correct (`#10B981` / `#12B76A`).
- Dot 7: Completed error (`#EF4444`).
- Dots 8 to 11: Completed correct (`#10B981`).
- Dot 12 (active current question): `#2563EB` (pulsing or bold indicator).
- Dots 13 to 30: Unattempted (`#E2E8F0` in light, `#1E293B` in dark).

### 3. Road Sign Card (Pure SVG Vector)
- Height: 160dp, `borderRadius: 20dp`.
- Light bg: `#F8FAFC`, Dark bg: `#161E2E`.
- Inside: Exact ministerial warning sign (`LevelCrossingSign`, 128x112dp):
  - Red equilateral triangle border (`#D82D20`), white inner triangle.
  - Black fence gate: 5 vertical pickets and 2 horizontal rails.
  - Pure SVG vector graphics, 0 PNG crops.

### 4. Meta Badge & Actions
- **Badge:** `ITALIAN · OFFICIAL` (`fontSize: 11, fontWeight: '700', letterSpacing: 0.5`).
- **Speaker Audio Button:**
  - 40x38 squircle (`borderRadius: 14`).
  - Light bg: `#EFF6FF`, icon `#2563EB`. Dark bg: `#1B2552`, icon `#60A5FA`.
  - Uses `expo-speech` (`it-IT`) with active playing state.
- **Bookmark Button:**
  - 40x38 squircle (`borderRadius: 14`).
  - Light bg: `#F8FAFC`, icon `#475569`. Dark bg: `#1B2336`, icon `#94A3B8`.
  - Toggles and persists to `AsyncStorage` (`@patente_bookmarked_quizzes`).

### 5. Question Text
- `Il segnale raffigurato preannuncia un passaggio a livello con barriere o semibarriere.`
- Light: `#0F172A`, Dark: `#FFFFFF`.
- `fontSize: 18`, `lineHeight: 25`, `fontWeight: '800'`.

### 6. English Translation / Caption Card
- Soft blue card (`borderRadius: 14`, padding: 14).
- Light bg: `#EFF6FF`, Dark bg: `#172033`.
- Top-left vertical blue line indicator (3dp x 12dp) + `ENGLISH` tag (`fontSize: 11, fontWeight: '800'`).
- Content: `The sign shown warns of a level crossing with barriers or half-barriers.`
- Font style matches Lesson player caption typography: `fontSize: 14, lineHeight: 20, includeFontPadding: false`.

### 7. Glossary Chips & WordSheetModal Integration
- Chips: `passaggio a livello = level crossing` and `preannuncia = warns ahead`.
- Light bg: `#F3E8FF`, text `#6D28D9`. Dark bg: `#241838`, text `#C084FC`.
- Tapping any chip opens `WordSheetModal` for instant detailed theory explanation!

### 8. VERO / FALSO Choice Buttons
- Row of two cards, height: ~72dp, `borderRadius: 18dp`.
- **VERO:**
  - Selected state: border 2px `#10B981`, bg `#ECFDF5` (light) / `#0D2B22` (dark).
  - Radio: filled green with white checkmark.
  - Title: `VERO` (bold 18), Subtitle: `True` (bold 12).
- **FALSO:**
  - Unselected state: border 1px `#E2E8F0` (light) / `#1E293B` (dark), bg `#FFFFFF` / `#121826`.
  - Radio: transparent circle with border.
  - Title: `FALSO` (bold 18), Subtitle: `False` (medium 12).

### 9. Feedback / Explanation Sheet
- Rounded card (`borderRadius: 20`, padding: 16).
- Sparkle badge + `Correct! Here's why` + `+10 XP` badge.
- Detailed explanation text (`fontSize: 14, lineHeight: 20`).
- Bottom buttons:
  - `Ask tutor` (icon + text, outline button).
  - `Next question ->` (primary blue `#2563EB`, full button).
