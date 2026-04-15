/**
 * Tests for recommendation endpoints
 *
 * Covers:
 *  - GET /api/recommend/:userId        → recommendTreks (filter-based)
 *  - GET /api/recommend/model/:userId  → recommendForUserUsingModel (Flask ML model)
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ─── Mock prisma BEFORE any controller imports ───────────────────────────────
jest.unstable_mockModule('../project/config/prisma.js', () => ({
  default: {
    user: { findUnique: jest.fn() },
    trek: { findMany: jest.fn() },
    interaction: { findMany: jest.fn() },
  },
}));

// ─── Resolve modules after mock is registered ────────────────────────────────
const { default: prisma } = await import('../project/config/prisma.js');
const { recommendTreks, recommendForUserUsingModel } =
  await import('../project/controllers/recommendation.controller.js');

// ─── Helper: build a lightweight mock res object ─────────────────────────────
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// ─── Shared trek fixture ──────────────────────────────────────────────────────
const makeTrek = (overrides = {}) => ({
  trekId: 'trek_001',
  name: 'Everest Base Camp',
  difficulty: 'challenging',
  fitnessLevelRequired: '4',
  durationDays: 14,
  popularity_score: 95,
  is_active: 1,
  trek_images: [],
  ...overrides,
});

// ═════════════════════════════════════════════════════════════════════════════
// recommendTreks  (filter-based, no ML)
// ═════════════════════════════════════════════════════════════════════════════
describe('recommendTreks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── 1. User not found ──────────────────────────────────────────────────────
  test('returns 404 when user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = { params: { userId: '999' } };
    const res = mockRes();

    await recommendTreks(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'User not found' })
    );
  });

  // ── 2. New user — no preferences set ──────────────────────────────────────
  test('returns popular treks without any filters for a new user (isPreferenceSet = false)', async () => {
    prisma.user.findUnique.mockResolvedValue({
      isPreferenceSet: false,
      preference: null,
    });
    const popularTreks = [makeTrek({ popularity_score: 90 }), makeTrek({ trekId: 'trek_002', popularity_score: 80 })];
    prisma.trek.findMany.mockResolvedValue(popularTreks);

    const req = { params: { userId: '1' } };
    const res = mockRes();

    await recommendTreks(req, res);

    // Should call findMany with only is_active filter — no difficulty / fitness / duration
    expect(prisma.trek.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { is_active: 1 }, // no extra filters
        orderBy: { popularity_score: 'desc' },
        take: 10,
      })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, recommendations: popularTreks })
    );
  });

  // ── 3. Returning user — full preferences set ───────────────────────────────
  test('filters treks by difficulty, fitness and duration for a user whose preferences are set', async () => {
    prisma.user.findUnique.mockResolvedValue({
      isPreferenceSet: true,
      preference: {
        difficulty: 'easy',
        fitness: '2',
        duration_max: 7,
      },
    });
    const filteredTreks = [makeTrek({ difficulty: 'easy', durationDays: 5 })];
    prisma.trek.findMany.mockResolvedValue(filteredTreks);

    const req = { params: { userId: '2' } };
    const res = mockRes();

    await recommendTreks(req, res);

    expect(prisma.trek.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          is_active: 1,
          difficulty: 'easy',
          fitnessLevelRequired: '2',
          durationDays: { lte: 7 },
        },
      })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, recommendations: filteredTreks })
    );
  });

  // ── 4. User with partial preferences (only difficulty set) ─────────────────
  test('applies only the preference fields that are actually set', async () => {
    prisma.user.findUnique.mockResolvedValue({
      isPreferenceSet: true,
      preference: { difficulty: 'moderate' }, // no fitness or duration_max
    });
    prisma.trek.findMany.mockResolvedValue([]);

    const req = { params: { userId: '3' } };
    const res = mockRes();

    await recommendTreks(req, res);

    const callArg = prisma.trek.findMany.mock.calls[0][0];
    expect(callArg.where).toEqual({ is_active: 1, difficulty: 'moderate' });
    expect(callArg.where).not.toHaveProperty('fitnessLevelRequired');
    expect(callArg.where).not.toHaveProperty('durationDays');
  });

  // ── 5. Two users receive different recommendations ─────────────────────────
  test('returns different trek sets for two users with different preferences', async () => {
    // User A: easy treks
    prisma.user.findUnique.mockResolvedValueOnce({
      isPreferenceSet: true,
      preference: { difficulty: 'easy', duration_max: 5 },
    });
    const easyTreks = [makeTrek({ trekId: 'easy_001', difficulty: 'easy', durationDays: 4 })];
    prisma.trek.findMany.mockResolvedValueOnce(easyTreks);

    const reqA = { params: { userId: '10' } };
    const resA = mockRes();
    await recommendTreks(reqA, resA);

    // User B: challenging treks
    prisma.user.findUnique.mockResolvedValueOnce({
      isPreferenceSet: true,
      preference: { difficulty: 'challenging', duration_max: 21 },
    });
    const hardTreks = [makeTrek({ trekId: 'hard_001', difficulty: 'challenging', durationDays: 18 })];
    prisma.trek.findMany.mockResolvedValueOnce(hardTreks);

    const reqB = { params: { userId: '11' } };
    const resB = mockRes();
    await recommendTreks(reqB, resB);

    const [callA, callB] = prisma.trek.findMany.mock.calls;
    expect(callA[0].where.difficulty).toBe('easy');
    expect(callB[0].where.difficulty).toBe('challenging');

    const recA = resA.json.mock.calls[0][0].recommendations;
    const recB = resB.json.mock.calls[0][0].recommendations;
    expect(recA[0].trekId).not.toBe(recB[0].trekId);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// recommendForUserUsingModel  (Flask ML model)
// ═════════════════════════════════════════════════════════════════════════════
describe('recommendForUserUsingModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restore / reset global fetch mock
    global.fetch = jest.fn();
  });

  const makeFetchOk = (recommendedIds) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ recommendations: recommendedIds }),
    });

  const makeFetchError = (status = 500, body = { detail: 'model error' }) =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve(body),
    });

  // ── 6. User not found ──────────────────────────────────────────────────────
  test('returns 404 when user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = { params: { userId: '999' } };
    const res = mockRes();

    await recommendForUserUsingModel(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'User not found' })
    );
  });

  // ── 7. New user — no interactions ─────────────────────────────────────────
  test('sends an empty interactions array to Flask for a brand-new user', async () => {
    prisma.user.findUnique.mockResolvedValue({ preference: {} });
    prisma.interaction.findMany.mockResolvedValue([]); // no history
    prisma.trek.findMany.mockResolvedValue([]);
    global.fetch.mockImplementation(() => makeFetchOk([]));

    const req = { params: { userId: '5' } };
    const res = mockRes();

    await recommendForUserUsingModel(req, res);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.interactions).toEqual([]);
    expect(body.user_id).toBe('5');
  });

  // ── 8. Returning user — interactions forwarded correctly ──────────────────
  test('maps DB interaction fields to the model payload format', async () => {
    prisma.user.findUnique.mockResolvedValue({ preference: { difficulty: 'moderate', fitness: 'good' } });
    prisma.interaction.findMany.mockResolvedValue([
      {
        trekId: 'trek_abc',
        rating: 4.5,
        views: 3,
        booked: true,
        favorites: false,
        timeSpentSeconds: 120,
      },
    ]);
    prisma.trek.findMany.mockResolvedValue([]);
    global.fetch.mockImplementation(() => makeFetchOk(['trek_abc']));

    const req = { params: { userId: '6' } };
    const res = mockRes();

    await recommendForUserUsingModel(req, res);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.interactions[0]).toEqual({
      trek_id: 'trek_abc',
      rating: 4.5,
      view_count: 3,
      booked: true,
      favorited: false,
      time_spent_seconds: 120,
    });
  });

  // ── 9. Flask API returns an error ─────────────────────────────────────────
  test('forwards the Flask error status and message when the model API fails', async () => {
    prisma.user.findUnique.mockResolvedValue({ preference: {} });
    prisma.interaction.findMany.mockResolvedValue([]);
    global.fetch.mockImplementation(() => makeFetchError(503, { detail: 'service unavailable' }));

    const req = { params: { userId: '7' } };
    const res = mockRes();

    await recommendForUserUsingModel(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Error from recommendation model' })
    );
  });

  // ── 10. Result is sorted in the order the model returns IDs ───────────────
  test('returns treks sorted by the model-provided order, not DB order', async () => {
    prisma.user.findUnique.mockResolvedValue({ preference: {} });
    prisma.interaction.findMany.mockResolvedValue([]);

    // Model says: trek_B first, trek_A second
    global.fetch.mockImplementation(() => makeFetchOk(['trek_B', 'trek_A']));

    // DB returns them in the opposite order
    prisma.trek.findMany.mockResolvedValue([
      makeTrek({ trekId: 'trek_A', name: 'Trek A' }),
      makeTrek({ trekId: 'trek_B', name: 'Trek B' }),
    ]);

    const req = { params: { userId: '8' } };
    const res = mockRes();

    await recommendForUserUsingModel(req, res);

    const recs = res.json.mock.calls[0][0].recommendations;
    expect(recs[0].trekId).toBe('trek_B');
    expect(recs[1].trekId).toBe('trek_A');
  });

  // ── 11. Two users get different ML recommendations ─────────────────────────
  test('two users with different preferences receive different model recommendations', async () => {
    // User X: beginner preferences, no interactions
    prisma.user.findUnique.mockResolvedValueOnce({ preference: { difficulty: 'easy', fitness: 'basic' } });
    prisma.interaction.findMany.mockResolvedValueOnce([]);
    global.fetch.mockImplementationOnce(() => makeFetchOk(['trek_easy_01', 'trek_easy_02']));
    prisma.trek.findMany.mockResolvedValueOnce([
      makeTrek({ trekId: 'trek_easy_01' }),
      makeTrek({ trekId: 'trek_easy_02' }),
    ]);

    const reqX = { params: { userId: '20' } };
    const resX = mockRes();
    await recommendForUserUsingModel(reqX, resX);

    // User Y: expert preferences, rich interactions
    prisma.user.findUnique.mockResolvedValueOnce({ preference: { difficulty: 'very challenging', fitness: 'excellent' } });
    prisma.interaction.findMany.mockResolvedValueOnce([
      { trekId: 'trek_hard_99', rating: 5, views: 10, booked: true, favorites: true, timeSpentSeconds: 600 },
    ]);
    global.fetch.mockImplementationOnce(() => makeFetchOk(['trek_hard_01', 'trek_hard_02']));
    prisma.trek.findMany.mockResolvedValueOnce([
      makeTrek({ trekId: 'trek_hard_01', difficulty: 'very challenging' }),
      makeTrek({ trekId: 'trek_hard_02', difficulty: 'very challenging' }),
    ]);

    const reqY = { params: { userId: '21' } };
    const resY = mockRes();
    await recommendForUserUsingModel(reqY, resY);

    const recsX = resX.json.mock.calls[0][0].recommendations.map((t) => t.trekId);
    const recsY = resY.json.mock.calls[0][0].recommendations.map((t) => t.trekId);

    expect(recsX).toEqual(['trek_easy_01', 'trek_easy_02']);
    expect(recsY).toEqual(['trek_hard_01', 'trek_hard_02']);
    expect(recsX).not.toEqual(recsY);

    // Verify the payloads sent to Flask were different too
    const payloadX = JSON.parse(global.fetch.mock.calls[0][1].body);
    const payloadY = JSON.parse(global.fetch.mock.calls[1][1].body);
    expect(payloadX.preferences.difficulty).not.toBe(payloadY.preferences.difficulty);
    expect(payloadX.interactions.length).toBe(0);
    expect(payloadY.interactions.length).toBe(1);
  });
});
