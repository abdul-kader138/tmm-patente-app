# TMM Patente - Backend Missing API Specification
Generated on: 2026-11-20
Target Backend: Laravel REST API (v1.tmmbanglapatente.it)

This document specifies the missing or incomplete endpoints identified during the screen-by-screen audit of the 27 UI mockups against the Swagger documentation (`v1.tmmbanglapatente.it/docs?api-docs.json`).

---

## 1. Live Quiz Duel & Matchmaking (Screens F1, F2)

### 1.1 Get / Generate Player Code
- **Method:** `GET /api/v1/duel/player-code`
- **Auth:** `Bearer Token`
- **Response:**
```json
{
  "player_code": "K7Q2M",
  "qr_url": "https://v1.tmmbanglapatente.it/storage/qr/player_k7q2m.png",
  "share_url": "https://tmmbanglapatente.it/duel/join?code=K7Q2M"
}
```

### 1.2 Start / Challenge Friend by Code
- **Method:** `POST /api/v1/duel/challenge-friend`
- **Auth:** `Bearer Token`
- **Payload:**
```json
{
  "friend_player_code": "K7Q2M",
  "total_questions": 10,
  "time_per_question_sec": 10
}
```
- **Response:**
```json
{
  "duel_id": "duel_9831",
  "status": "waiting_for_opponent",
  "questions": [
    {
      "id": 1042,
      "text": "Il segnale raffigurato vieta il transito a tutti i veicoli, compresi i velocipedi.",
      "image": "https://v1.tmmbanglapatente.it/signs/divieto_transito.png",
      "translation": "The sign shown bans entry to all vehicles, bicycles included.",
      "time_limit": 10
    }
  ]
}
```

### 1.3 Random Opponent Matchmaking
- **Method:** `POST /api/v1/duel/find-random-opponent`
- **Auth:** `Bearer Token`
- **Response:**
```json
{
  "duel_id": "duel_9832",
  "opponent": {
    "id": 109,
    "name": "Karim",
    "avatar": "KH",
    "score": 0
  },
  "questions": [...]
}
```

### 1.4 Submit Duel Question Answer
- **Method:** `POST /api/v1/duel/{duel_id}/answer`
- **Auth:** `Bearer Token`
- **Payload:**
```json
{
  "question_id": 1042,
  "selected_answer": "V",
  "time_taken_ms": 4200
}
```
- **Response:**
```json
{
  "is_correct": true,
  "current_score_user": 7,
  "current_score_opponent": 6,
  "opponent_answered": true,
  "next_question_index": 9
}
```

### 1.5 Recent Duels History
- **Method:** `GET /api/v1/duel/recent`
- **Auth:** `Bearer Token`
- **Response:**
```json
{
  "data": [
    {
      "opponent_name": "Karim",
      "opponent_initials": "KA",
      "user_score": 8,
      "opponent_score": 6,
      "result": "won",
      "played_at": "2026-11-19T20:45:00Z"
    },
    {
      "opponent_name": "Priya",
      "opponent_initials": "PR",
      "user_score": 5,
      "opponent_score": 7,
      "result": "lost",
      "played_at": "2026-11-18T18:30:00Z"
    }
  ]
}
```

---

## 2. Paywall, Subscriptions & Store Receipts (Screen E3)

### 2.1 Available Subscription Plans
- **Method:** `GET /api/v1/subscriptions/plans`
- **Auth:** `Bearer Token` (optional for guests)
- **Response:**
```json
{
  "plans": [
    {
      "id": "plan_monthly",
      "product_id": "it.tmmbanglapatente.monthly",
      "title": "1 month",
      "price": 4.99,
      "currency": "EUR",
      "billing_period": "monthly",
      "is_best": false
    },
    {
      "id": "plan_6months",
      "product_id": "it.tmmbanglapatente.6months",
      "title": "6 months",
      "price": 19.99,
      "per_month": 3.33,
      "currency": "EUR",
      "billing_period": "6_months",
      "is_best": true
    },
    {
      "id": "plan_lifetime",
      "product_id": "it.tmmbanglapatente.lifetime",
      "title": "Until you pass",
      "price": 29.99,
      "currency": "EUR",
      "billing_period": "one_time",
      "is_best": false
    }
  ]
}
```

### 2.2 Verify Mobile Store Purchase (In-App Purchase)
- **Method:** `POST /api/v1/subscriptions/verify-purchase`
- **Auth:** `Bearer Token`
- **Payload:**
```json
{
  "platform": "ios", 
  "product_id": "it.tmmbanglapatente.6months",
  "purchase_token": "receipt_or_token_string",
  "order_id": "GPA.3321-..."
}
```
- **Response:**
```json
{
  "success": true,
  "entitlement": {
    "is_active": true,
    "plan": "6 months",
    "expires_at": "2027-05-20T00:00:00Z",
    "days_remaining": 180
  }
}
```

---

## 3. Practical Driving & Driving Lessons (Screen F3)

### 3.1 Get Practical Driving Dashboard (Foglio Rosa & Upcoming Lessons)
- **Method:** `GET /api/v1/practical/dashboard`
- **Auth:** `Bearer Token`
- **Response:**
```json
{
  "foglio_rosa": {
    "status": "active",
    "expires_at": "2027-05-09",
    "exam_attempts_remaining": 2
  },
  "upcoming_lesson": {
    "id": 14,
    "title": "Driving lesson · city traffic",
    "date": "2026-11-24",
    "time": "18:00 CET",
    "duration_minutes": 45,
    "instructor": {
      "name": "Karim H.",
      "phone": "+393001234567"
    }
  }
}
```

### 3.2 Book Driving Lesson
- **Method:** `POST /api/v1/practical/book-lesson`
- **Auth:** `Bearer Token`
- **Payload:**
```json
{
  "instructor_id": 3,
  "preferred_date": "2026-11-28",
  "slot": "18:00",
  "notes": "Parallel parking practice"
}
```

---

## 4. Gamification Badges (Screen E1)

### 4.1 Get User Earned Badges
- **Method:** `GET /api/v1/stats/badges`
- **Auth:** `Bearer Token`
- **Response:**
```json
{
  "total_badges": 24,
  "earned_count": 3,
  "badges": [
    {
      "id": "streak_12",
      "name": "12-day streak",
      "icon": "fire",
      "unlocked": true,
      "unlocked_at": "2026-11-18"
    },
    {
      "id": "signs_master",
      "name": "Signs master",
      "icon": "alert-triangle",
      "unlocked": true,
      "unlocked_at": "2026-11-15"
    },
    {
      "id": "passes_3",
      "name": "3 passes",
      "icon": "award",
      "unlocked": true,
      "unlocked_at": "2026-11-12"
    },
    {
      "id": "speed_run",
      "name": "Speed run",
      "icon": "lock",
      "unlocked": false,
      "unlocked_at": null
    }
  ]
}
```

---

## 5. Web QR Code Login Authorization (Screen E2 & E5)

### 5.1 Authorize Web Session from Mobile
- **Method:** `POST /api/v1/auth/qr-authorize`
- **Auth:** `Bearer Token`
- **Payload:**
```json
{
  "qr_session_token": "scanned_qr_token_from_web"
}
```
- **Response:**
```json
{
  "status": "approved",
  "message": "Web session authorized successfully"
}
```

---

## 6. Multi-Topic Custom Quiz (Screen B5)

### 6.1 Generate Quiz from Multiple Topics
- **Method:** `POST /api/v1/topics/custom-quiz`
- **Auth:** `Bearer Token`
- **Payload:**
```json
{
  "topic_ids": [1, 2, 4],
  "limit": 41,
  "shuffle": true
}
```
- **Response:**
```json
{
  "count": 41,
  "questions": [...]
}
```
