# TMM Bangla Patente Mobile App

An all-in-one Italian Driver's License (**Patente di Guida B**) preparation and learning mobile application designed specifically for Bengali and South Asian learners residing in Italy.

---

## 📱 Features & Screen Coverage (27 Screens in Light & Dark Mode)

1. **Onboarding & Multilingual Support (A1, A2)**
   - Welcome Screen with course overview and feature highlights.
   - Multilingual study selector (English, Bangla, Punjabi, Hindi, Urdu, Italiano) with dual-language toggle (*Italian side-by-side*).

2. **Dashboard & Video Lessons (B1 - B5)**
   - Home Dashboard with study streak counter, exam readiness circular gauge (78%), quick-access 6-grid tiles, and study mode continuation.
   - Video Lessons catalog with chapter filters and watch progress.
   - Video Player with scrubber, speed changer, Bangla subtitles (`CC Bangla`), and interactive chapters/notes/transcript tabs.
   - 25 Patente Chapters list with progress bars and error rates.
   - Chapter view with multi-subtopic selection to generate custom quizzes.

3. **Quiz & Exam Simulation Engine (C1 - C6)**
   - Study Mode with highlighted clickable terms opening the Picture Dictionary sheet.
   - Word Sheet Modal with illustrated diagrams, native Bangla audio explanation, and related terminology.
   - Interactive Vero/Falso Quiz Question with ministerial countdown timer, audio readout, and instant explanation sheet (+10 XP).
   - Official 30-Question Exam Simulation with 20-minute countdown timer, jump-to-question grid, and submit verification.
   - Exam Results breakdown with pass/fail gauge (Pass ≥ 27), historical trend chart of last 8 exams, and error review.
   - Smart Mistakes Review queue with spaced-repetition tracking (`Wrong 3x`, `Wrong 2x`).

4. **Patente Dictionary & Road Signs (D1 - D2)**
   - 1,900+ Word Dictionary with audio pronunciation, saved bookmarks, and official Italian exam tricks (*Always True* / *Always False*).
   - 400+ Road Signs visual catalog categorized into Danger, Prohibition, Mandatory, and Info signs with mastery percentages.

5. **Live E-Class & Support (D3, D4, E4)**
   - Live E-Class schedule with live room banner, viewer count, and daily calendar selector.
   - Teacher Chat with instructors (Sara M.), attaching specific quiz question cards, voice memos, and video calls.
   - 24/7 TMM Support chat with bank transfer receipt image verification and instant digital license key cards.

6. **Gamification & Profile Settings (E1, E2, E3, E5)**
   - Weekly learning analytics bar chart, topic mastery gauges, Gold League leaderboard, and achievement badges.
   - Profile management with license validity, offline download storage meter, and TT2112 official exam form PDF viewer.
   - In-App Paywall with monthly (€4.99), 6-month (€19.99), and lifetime (€29.99) tiers.
   - Quiz Settings with vehicle license category selector (AM, A1/A2, B, C/D), time limit, question count, and Web App QR code login.

7. **Challenges & Practical Driving (F1 - F5)**
   - 1-vs-1 Quiz Challenge with custom player code sharing (`K7Q2M`) and friend / random opponent matchmaking.
   - Live Duel head-to-head battle with real-time score counters, opponent answer indicator, and fast question timer.
   - Practical Driving School portal for booking driving lessons with Bangla-speaking instructors and Foglio Rosa validity tracking.
   - Interactive Car Parts diagram with exterior, dashboard, and engine hotspots.
   - Driving Guide with step-by-step parallel parking maneuvers.

---

## 🛠️ Tech Stack

- **Framework:** React Native + Expo (TypeScript)
- **Navigation:** React Navigation (Native Stack + Bottom Tabs)
- **Theme:** Dynamic Theme Context (Light Mode & Dark Mode with mockup color fidelity)
- **Backend API:** Laravel REST API (`https://v1.tmmbanglapatente.it`) with Bearer token authentication
- **Icons:** Expo Vector Icons (`Ionicons`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
git clone https://github.com/abdul-kader138/tmm-patente-app.git
cd tmm-patente-app
npm install
```

### Running the App
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in Web browser
npm run web
```

---

## 📄 Backend Documentation & Missing Endpoints

For the complete API gap analysis and specifications for the backend team, see [docs/BACKEND_MISSING_API_SPEC.md](docs/BACKEND_MISSING_API_SPEC.md).

---

## 👥 Engineering & Credits

- **Product:** TMM Bangla Patente
- **Project Lead & Architect:** **Abdul Kader**
- **Lead Mobile Application Engineer:** **Tasnikur Sifat**
- **Architecture:** React Native · Expo 58 · TypeScript · React Navigation 7

