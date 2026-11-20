export const mockDuelData = {
  playerCode: 'K7Q2M',
  recentDuels: [
    { id: '1', opponent: 'Karim', opponentInitials: 'KA', userScore: 8, opponentScore: 6, result: 'Won' },
    { id: '2', opponent: 'Priya', opponentInitials: 'PR', userScore: 5, opponentScore: 7, result: 'Lost' },
  ],
  activeDuel: {
    userScore: 7,
    opponentScore: 6,
    opponentName: 'Karim',
    opponentInitials: 'KH',
    opponentAnswered: true,
    currentQuestionIndex: 9,
    totalQuestions: 10,
    timeRemaining: 6,
    question: {
      id: 1042,
      signImage: 'https://v1.tmmbanglapatente.it/signs/divieto_transito.png',
      textItalian: 'Il segnale raffigurato vieta il transito a tutti i veicoli, compresi i velocipedi.',
      translation: 'The sign shown bans entry to all vehicles, bicycles included.',
      correctAnswer: 'V',
    },
  },
};

export const mockSubscriptionPlans = [
  {
    id: 'monthly',
    title: '1 month',
    price: '€4.99',
    subtitle: 'billed monthly',
    isBest: false,
  },
  {
    id: 'six_months',
    title: '6 months',
    price: '€19.99',
    subtitle: '€3.33 / month',
    isBest: true,
  },
  {
    id: 'until_pass',
    title: 'Until you pass',
    price: '€29.99',
    subtitle: 'one-time',
    isBest: false,
  },
];

export const mockPracticalData = {
  foglioRosa: {
    validUntil: '9 May 2027',
    attemptsLeft: 2,
    status: 'Active',
  },
  upcomingLesson: {
    day: 'THU',
    date: '24',
    title: 'Driving lesson · city traffic',
    time: '18:00',
    instructor: 'Karim H.',
    duration: '45 min',
  },
};

export const mockBadges = [
  { id: 'streak', name: '12-day streak', icon: 'flame', unlocked: true },
  { id: 'signs', name: 'Signs master', icon: 'warning', unlocked: true },
  { id: 'passes', name: '3 passes', icon: 'trophy', unlocked: true },
  { id: 'speed', name: 'Speed run', icon: 'lock-closed', unlocked: false },
];

export const mockCarParts = {
  exterior: [
    { id: 1, name: 'Fari anabbaglianti', translation: 'Dipped headlights', audioDuration: '0:14' },
    { id: 2, name: 'Specchietto retrovisore esterno', translation: 'Side mirror', audioDuration: '0:18' },
    { id: 3, name: 'Pneumatici', translation: 'Tyres', audioDuration: '0:22' },
    { id: 4, name: 'Tergicristallo', translation: 'Windscreen wipers', audioDuration: '0:15' },
    { id: 5, name: 'Luci di posizione posteriori', translation: 'Rear position lights', audioDuration: '0:19' },
  ],
  dashboard: [
    { id: 6, name: 'Tachimetro', translation: 'Speedometer', audioDuration: '0:12' },
    { id: 7, name: 'Spia del freno a mano', translation: 'Handbrake warning light', audioDuration: '0:16' },
  ],
  engine: [
    { id: 8, name: 'Liquido di raffreddamento', translation: 'Coolant fluid', audioDuration: '0:20' },
    { id: 9, name: 'Olio motore', translation: 'Engine oil', audioDuration: '0:25' },
  ],
};

export const mockDrivingGuideManeuver = {
  title: 'Parallel parking',
  subtitle: 'Driving guide · Parcheggio in linea',
  stepNumber: 3,
  totalSteps: 8,
  videoDuration: '2:10',
  audioDuration: 'Bangla audio',
  steps: [
    { id: 1, text: 'Signal right and stop beside the front car', done: true },
    { id: 2, text: 'Reverse slowly until the rear wheels pass its bumper', done: true },
    {
      id: 3,
      text: 'Steer fully right, reverse at 45°',
      subtext: "Stop when your left mirror lines up with the rear car's headlights. Keep checking the kerb.",
      active: true,
    },
    { id: 4, text: 'Straighten the wheel and steer left', done: false },
    { id: 5, text: 'Centre the car, leave space front and back', done: false },
  ],
};
