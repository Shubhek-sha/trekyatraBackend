/**
 * Tests for interaction endpoints
 *
 * Covers:
 *  - POST /api/interactions   → createInteraction  (upsert)
 *  - GET  /api/interactions   → getAllInteractions
 *  - GET  /api/interactions/:id → getInteractionById
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ─── Mock prisma BEFORE controller import ─────────────────────────────────────
jest.unstable_mockModule('../project/config/prisma.js', () => ({
  default: {
    interaction: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const { default: prisma } = await import('../project/config/prisma.js');
const { createInteraction, getAllInteractions, getInteractionById } =
  await import('../project/controllers/interaction.controller.js');

// ─── Helper ───────────────────────────────────────────────────────────────────
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const baseInteraction = {
  interactionId: 1,
  userId: 1,
  trekId: 'trek_abc',
  views: 1,
  booked: false,
  favorites: false,
  rating: null,
  timeSpentSeconds: 0,
  weight: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ═════════════════════════════════════════════════════════════════════════════
// createInteraction
// ═════════════════════════════════════════════════════════════════════════════
describe('createInteraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── 1. Missing userId → 400 ────────────────────────────────────────────────
  test('returns 400 when userId is missing', async () => {
    const req = { body: { trekId: 'trek_abc', views: 1 } };
    const res = mockRes();

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'userId and trekId are required' })
    );
    expect(prisma.interaction.upsert).not.toHaveBeenCalled();
  });

  // ── 2. Missing trekId → 400 ───────────────────────────────────────────────
  test('returns 400 when trekId is missing', async () => {
    const req = { body: { userId: 1, views: 1 } };
    const res = mockRes();

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'userId and trekId are required' })
    );
  });

  // ── 3. First-time interaction — creates a new record ─────────────────────
  test('creates a new interaction record when none exists (first view)', async () => {
    prisma.interaction.upsert.mockResolvedValue({ ...baseInteraction, views: 1 });

    const req = {
      body: { userId: 1, trekId: 'trek_abc', views: 1, timeSpentSeconds: 30 },
    };
    const res = mockRes();

    await createInteraction(req, res);

    const callArg = prisma.interaction.upsert.mock.calls[0][0];
    expect(callArg.where).toEqual({ userId_trekId: { userId: 1, trekId: 'trek_abc' } });
    expect(callArg.create).toMatchObject({
      userId: 1,
      trekId: 'trek_abc',
      views: 1,
      timeSpentSeconds: 30,
      booked: false,
      favorites: false,
      weight: 0,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  // ── 4. Subsequent view — increments views and timeSpentSeconds ────────────
  test('increments views and timeSpentSeconds on a subsequent interaction', async () => {
    prisma.interaction.upsert.mockResolvedValue({ ...baseInteraction, views: 4, timeSpentSeconds: 150 });

    const req = {
      body: { userId: 1, trekId: 'trek_abc', views: 1, timeSpentSeconds: 60 },
    };
    const res = mockRes();

    await createInteraction(req, res);

    const callArg = prisma.interaction.upsert.mock.calls[0][0];
    expect(callArg.update.views).toEqual({ increment: 1 });
    expect(callArg.update.timeSpentSeconds).toEqual({ increment: 60 });
  });

  // ── 5. Saving a rating ─────────────────────────────────────────────────────
  test('saves rating correctly when user rates a trek', async () => {
    prisma.interaction.upsert.mockResolvedValue({ ...baseInteraction, rating: 4.5 });

    const req = { body: { userId: 2, trekId: 'trek_xyz', rating: 4.5 } };
    const res = mockRes();

    await createInteraction(req, res);

    const callArg = prisma.interaction.upsert.mock.calls[0][0];
    expect(callArg.update.rating).toBe(4.5);
    expect(callArg.create.rating).toBe(4.5);
  });

  // ── 6. Marking a trek as booked ───────────────────────────────────────────
  test('saves booked = true when user books a trek', async () => {
    prisma.interaction.upsert.mockResolvedValue({ ...baseInteraction, booked: true });

    const req = { body: { userId: 2, trekId: 'trek_xyz', booked: true } };
    const res = mockRes();

    await createInteraction(req, res);

    const callArg = prisma.interaction.upsert.mock.calls[0][0];
    expect(callArg.update.booked).toBe(true);
    expect(callArg.create.booked).toBe(true);
  });

  // ── 7. Marking a trek as favorited ────────────────────────────────────────
  test('saves favorites = true when user favorites a trek', async () => {
    prisma.interaction.upsert.mockResolvedValue({ ...baseInteraction, favorites: true });

    const req = { body: { userId: 3, trekId: 'trek_def', favorites: true } };
    const res = mockRes();

    await createInteraction(req, res);

    const callArg = prisma.interaction.upsert.mock.calls[0][0];
    expect(callArg.update.favorites).toBe(true);
    expect(callArg.create.favorites).toBe(true);
  });

  // ── 8. All fields at once ──────────────────────────────────────────────────
  test('persists all interaction fields correctly in a full-payload save', async () => {
    const fullInteraction = {
      ...baseInteraction,
      views: 5,
      booked: true,
      favorites: true,
      rating: 5,
      timeSpentSeconds: 300,
      weight: 0.9,
    };
    prisma.interaction.upsert.mockResolvedValue(fullInteraction);

    const req = {
      body: {
        userId: 4,
        trekId: 'trek_full',
        views: 5,
        booked: true,
        favorites: true,
        rating: 5,
        timeSpentSeconds: 300,
        weight: 0.9,
      },
    };
    const res = mockRes();

    await createInteraction(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          rating: 5,
          booked: true,
          favorites: true,
          timeSpentSeconds: 300,
        }),
      })
    );
  });

  // ── 9. DB error → 500 ─────────────────────────────────────────────────────
  test('returns 500 when prisma throws an error', async () => {
    prisma.interaction.upsert.mockRejectedValue(new Error('Unique constraint failed'));

    const req = { body: { userId: 1, trekId: 'trek_abc' } };
    const res = mockRes();

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Internal server error' })
    );
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAllInteractions
// ═════════════════════════════════════════════════════════════════════════════
describe('getAllInteractions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── 10. Get all interactions (no filter) ──────────────────────────────────
  test('returns all interactions when no query params are provided', async () => {
    const allInteractions = [
      { ...baseInteraction, interactionId: 1 },
      { ...baseInteraction, interactionId: 2, userId: 2, trekId: 'trek_xyz' },
    ];
    prisma.interaction.findMany.mockResolvedValue(allInteractions);

    const req = { query: {} };
    const res = mockRes();

    await getAllInteractions(req, res);

    expect(prisma.interaction.findMany).toHaveBeenCalledWith({ where: {} });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 2, data: allInteractions })
    );
  });

  // ── 11. Filter by userId ───────────────────────────────────────────────────
  test('filters interactions by userId when userId query param is provided', async () => {
    const userInteractions = [{ ...baseInteraction, userId: 7 }];
    prisma.interaction.findMany.mockResolvedValue(userInteractions);

    const req = { query: { userId: '7' } };
    const res = mockRes();

    await getAllInteractions(req, res);

    expect(prisma.interaction.findMany).toHaveBeenCalledWith({
      where: { userId: 7 },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 1 })
    );
  });

  // ── 12. Filter by trekId ──────────────────────────────────────────────────
  test('filters interactions by trekId when trekId query param is provided', async () => {
    const trekInteractions = [{ ...baseInteraction, trekId: 'trek_ebc' }];
    prisma.interaction.findMany.mockResolvedValue(trekInteractions);

    const req = { query: { trekId: 'trek_ebc' } };
    const res = mockRes();

    await getAllInteractions(req, res);

    expect(prisma.interaction.findMany).toHaveBeenCalledWith({
      where: { trekId: 'trek_ebc' },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 1 })
    );
  });

  // ── 13. Filter by both userId and trekId ─────────────────────────────────
  test('applies both userId and trekId filters simultaneously', async () => {
    prisma.interaction.findMany.mockResolvedValue([baseInteraction]);

    const req = { query: { userId: '1', trekId: 'trek_abc' } };
    const res = mockRes();

    await getAllInteractions(req, res);

    expect(prisma.interaction.findMany).toHaveBeenCalledWith({
      where: { userId: 1, trekId: 'trek_abc' },
    });
  });

  // ── 14. Returns empty list when user has no interactions ──────────────────
  test('returns empty list and total 0 when user has no interactions yet', async () => {
    prisma.interaction.findMany.mockResolvedValue([]);

    const req = { query: { userId: '99' } };
    const res = mockRes();

    await getAllInteractions(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, total: 0, data: [] })
    );
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getInteractionById
// ═════════════════════════════════════════════════════════════════════════════
describe('getInteractionById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── 15. Found by id ───────────────────────────────────────────────────────
  test('returns the interaction when it exists', async () => {
    prisma.interaction.findUnique.mockResolvedValue(baseInteraction);

    const req = { params: { id: '1' } };
    const res = mockRes();

    await getInteractionById(req, res);

    expect(prisma.interaction.findUnique).toHaveBeenCalledWith({
      where: { interactionId: 1 },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: baseInteraction })
    );
  });

  // ── 16. Not found → 404 ───────────────────────────────────────────────────
  test('returns 404 when the interaction id does not exist', async () => {
    prisma.interaction.findUnique.mockResolvedValue(null);

    const req = { params: { id: '9999' } };
    const res = mockRes();

    await getInteractionById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Interaction not found' })
    );
  });
});
