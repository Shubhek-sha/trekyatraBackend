# Test Case Registry

All 34 test cases across recommendation, preference, and interaction modules.

---

## 1. Recommendation — Filter-based (`recommendTreks`)

| # | Name | Module | Input | Expected Output | Status |
|---|------|--------|-------|-----------------|--------|
| 1 | User not found returns 404 | `recommendTreks` | `userId: 999`, prisma returns `null` | `{ success: false, message: "User not found" }` — HTTP 404 | PASS |
| 2 | New user gets popular treks with no filters | `recommendTreks` | `userId: 1`, `isPreferenceSet: false`, `preference: null` | `findMany` called with only `{ is_active: 1 }`, `orderBy: popularity_score desc`, `take: 10` — HTTP 200 | PASS |
| 3 | Returning user gets filtered treks | `recommendTreks` | `userId: 2`, `isPreferenceSet: true`, `preference: { difficulty: "easy", fitness: "2", duration_max: 7 }` | `findMany` where clause `{ is_active: 1, difficulty: "easy", fitnessLevelRequired: "2", durationDays: { lte: 7 } }` — HTTP 200 | PASS |
| 4 | Partial preferences apply only set fields | `recommendTreks` | `userId: 3`, `preference: { difficulty: "moderate" }` (no fitness or duration_max) | `where` has `difficulty: "moderate"` but no `fitnessLevelRequired` or `durationDays` keys | PASS |
| 5 | Two users receive different recommendations | `recommendTreks` | User A: `{ difficulty: "easy", duration_max: 5 }` / User B: `{ difficulty: "challenging", duration_max: 21 }` | Call A where has `difficulty: "easy"`, Call B where has `difficulty: "challenging"` — returned trek IDs differ | PASS |

---

## 2. Recommendation — ML Model (`recommendForUserUsingModel`)

| # | Name | Module | Input | Expected Output | Status |
|---|------|--------|-------|-----------------|--------|
| 6 | User not found returns 404 | `recommendForUserUsingModel` | `userId: 999`, prisma returns `null` | `{ success: false, message: "User not found" }` — HTTP 404 | PASS |
| 7 | New user sends empty interactions to Flask | `recommendForUserUsingModel` | `userId: 5`, `preference: {}`, no interaction records | Fetch payload `interactions: []`, `user_id: "5"` | PASS |
| 8 | Interaction fields mapped to model payload format | `recommendForUserUsingModel` | Interaction: `{ trekId, rating: 4.5, views: 3, booked: true, favorites: false, timeSpentSeconds: 120 }` | Payload interaction: `{ trek_id, rating: 4.5, view_count: 3, booked: true, favorited: false, time_spent_seconds: 120 }` | PASS |
| 9 | Flask API error is forwarded to client | `recommendForUserUsingModel` | Flask returns HTTP 503 `{ detail: "service unavailable" }` | `{ success: false, message: "Error from recommendation model" }` — HTTP 503 | PASS |
| 10 | Results sorted by model order, not DB order | `recommendForUserUsingModel` | Flask returns `["trek_B", "trek_A"]`, DB returns them as `[trek_A, trek_B]` | Response `recommendations[0].trekId === "trek_B"`, `recommendations[1].trekId === "trek_A"` | PASS |
| 11 | Two users get different model recommendations | `recommendForUserUsingModel` | User X: beginner prefs, 0 interactions / User Y: expert prefs, 1 interaction with rating 5 | User X recs: `["trek_easy_01", "trek_easy_02"]` / User Y recs: `["trek_hard_01", "trek_hard_02"]` — Flask payloads differ | PASS |

---

## 3. Preference (`updatePreference`)

| # | Name | Module | Input | Expected Output | Status |
|---|------|--------|-------|-----------------|--------|
| 12 | Missing preference body returns 400 | `updatePreference` | `userId: 1`, `body: {}` (no `preference` key) | `{ message: "Preference data is required" }` — HTTP 400, `prisma.user.update` NOT called | PASS |
| 13 | Valid preference saves and sets isPreferenceSet | `updatePreference` | `userId: 1`, `preference: { difficulty, fitness, duration_max, budget_max, ams_concern_level }` | `prisma.user.update` called with `{ preference, isPreferenceSet: true }`, response `{ message: "Preference updated successfully", user }` | PASS |
| 14 | userId string param parsed to integer | `updatePreference` | `userId: "42"` (string from URL param) | `prisma.user.update` where clause `{ user_id: 42 }` — type is `number`, not `"42"` | PASS |
| 15 | Preference JSON stored exactly as provided | `updatePreference` | Custom preference with extra field `group_size: "solo"` | `prisma.user.update` `data.preference` deep-equals the input object | PASS |
| 16 | Response excludes sensitive fields | `updatePreference` | `userId: 1`, valid preference | Returned `user` object has no `password_hash`, `otp`, or `otp_expires` properties | PASS |
| 17 | DB error bubbles up as 500 | `updatePreference` | `userId: 1`, valid preference, prisma throws `Error("DB connection lost")` | `{ error: "DB connection lost" }` — HTTP 500 | PASS |
| 18 | Overwriting preference replaces old values | `updatePreference` | New preference `{ difficulty: "challenging", fitness: "excellent", duration_max: 21 }` | `prisma.user.update` `data.preference` equals the new values, `isPreferenceSet: true` | PASS |

---

## 4. Interaction — Create / Upsert (`createInteraction`)

| # | Name | Module | Input | Expected Output | Status |
|---|------|--------|-------|-----------------|--------|
| 19 | Missing userId returns 400 | `createInteraction` | `body: { trekId: "trek_abc", views: 1 }` (no userId) | `{ success: false, message: "userId and trekId are required" }` — HTTP 400, upsert NOT called | PASS |
| 20 | Missing trekId returns 400 | `createInteraction` | `body: { userId: 1, views: 1 }` (no trekId) | `{ success: false, message: "userId and trekId are required" }` — HTTP 400, upsert NOT called | PASS |
| 21 | First-time interaction creates new record | `createInteraction` | `{ userId: 1, trekId: "trek_abc", views: 1, timeSpentSeconds: 30 }` | Upsert `create` block has `userId: 1, trekId: "trek_abc", views: 1, timeSpentSeconds: 30, booked: false, favorites: false, weight: 0` — HTTP 200 | PASS |
| 22 | Subsequent view increments views and timeSpentSeconds | `createInteraction` | `{ userId: 1, trekId: "trek_abc", views: 1, timeSpentSeconds: 60 }` (record exists) | Upsert `update.views = { increment: 1 }`, `update.timeSpentSeconds = { increment: 60 }` | PASS |
| 23 | Rating saved correctly | `createInteraction` | `{ userId: 2, trekId: "trek_xyz", rating: 4.5 }` | Upsert `update.rating === 4.5`, `create.rating === 4.5` | PASS |
| 24 | Booked flag saved correctly | `createInteraction` | `{ userId: 2, trekId: "trek_xyz", booked: true }` | Upsert `update.booked === true`, `create.booked === true` | PASS |
| 25 | Favorites flag saved correctly | `createInteraction` | `{ userId: 3, trekId: "trek_def", favorites: true }` | Upsert `update.favorites === true`, `create.favorites === true` | PASS |
| 26 | Full payload persists all fields | `createInteraction` | `{ userId: 4, trekId: "trek_full", views: 5, booked: true, favorites: true, rating: 5, timeSpentSeconds: 300, weight: 0.9 }` | Response `{ success: true, data: { rating: 5, booked: true, favorites: true, timeSpentSeconds: 300 } }` — HTTP 200 | PASS |
| 27 | DB error returns 500 | `createInteraction` | Valid body, prisma throws `Error("Unique constraint failed")` | `{ success: false, message: "Internal server error" }` — HTTP 500 | PASS |

---

## 5. Interaction — Read (`getAllInteractions`, `getInteractionById`)

| # | Name | Module | Input | Expected Output | Status |
|---|------|--------|-------|-----------------|--------|
| 28 | Get all interactions with no filter | `getAllInteractions` | `query: {}` | `findMany` called with `{ where: {} }`, response `{ success: true, total: 2, data: [...] }` | PASS |
| 29 | Filter interactions by userId | `getAllInteractions` | `query: { userId: "7" }` | `findMany` where `{ userId: 7 }`, response `{ success: true, total: 1 }` | PASS |
| 30 | Filter interactions by trekId | `getAllInteractions` | `query: { trekId: "trek_ebc" }` | `findMany` where `{ trekId: "trek_ebc" }`, response `{ success: true, total: 1 }` | PASS |
| 31 | Filter by both userId and trekId | `getAllInteractions` | `query: { userId: "1", trekId: "trek_abc" }` | `findMany` where `{ userId: 1, trekId: "trek_abc" }` | PASS |
| 32 | Empty list when user has no interactions | `getAllInteractions` | `query: { userId: "99" }`, prisma returns `[]` | `{ success: true, total: 0, data: [] }` | PASS |
| 33 | Get interaction by ID — found | `getInteractionById` | `params: { id: "1" }`, prisma returns the record | `findUnique` called with `{ interactionId: 1 }`, response `{ success: true, data: { interactionId: 1, ... } }` | PASS |
| 34 | Get interaction by ID — not found | `getInteractionById` | `params: { id: "9999" }`, prisma returns `null` | `{ success: false, message: "Interaction not found" }` — HTTP 404 | PASS |

---

## Summary

| Module | Tests | Passed | Failed |
|--------|-------|--------|--------|
| `recommendTreks` | 5 | 5 | 0 |
| `recommendForUserUsingModel` | 6 | 6 | 0 |
| `updatePreference` | 7 | 7 | 0 |
| `createInteraction` | 9 | 9 | 0 |
| `getAllInteractions` | 5 | 5 | 0 |
| `getInteractionById` | 2 | 2 | 0 |
| **Total** | **34** | **34** | **0** |
