/**
 * Tests for the set/update preference endpoint
 *
 * Covers:
 *  - PUT /api/auth/preference/:userId  → updatePreference
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// ─── Mock prisma BEFORE controller import ─────────────────────────────────────
jest.unstable_mockModule('../project/config/prisma.js', () => ({
  default: {
    user: {
      update: jest.fn(),
    },
  },
}));

const { default: prisma } = await import('../project/config/prisma.js');
const { updatePreference } = await import('../project/controllers/user.controller.js');

// ─── Helper ───────────────────────────────────────────────────────────────────
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const samplePreference = {
  difficulty: 'moderate',
  fitness: 'good',
  duration_max: 10,
  budget_max: 1500,
  ams_concern_level: 2,
};

const updatedUser = {
  user_id: 1,
  email: 'hiker@example.com',
  full_name: 'Jane Hiker',
  username: 'janehiker1234',
  profile_picture: null,
  phone: null,
  bio: null,
  isPreferenceSet: true,
  preference: samplePreference,
  isVerified: true,
};

describe('updatePreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── 1. Missing preference body ─────────────────────────────────────────────
  test('returns 400 when preference field is missing from request body', async () => {
    const req = { params: { userId: '1' }, body: {} }; // no preference key
    const res = mockRes();

    await updatePreference(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Preference data is required' })
    );
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  // ── 2. Valid preference saves and sets isPreferenceSet to true ─────────────
  test('saves preference and marks isPreferenceSet = true', async () => {
    prisma.user.update.mockResolvedValue(updatedUser);

    const req = { params: { userId: '1' }, body: { preference: samplePreference } };
    const res = mockRes();

    await updatePreference(req, res);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { user_id: 1 },
        data: {
          preference: samplePreference,
          isPreferenceSet: true,
        },
      })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Preference updated successfully',
        user: expect.objectContaining({ isPreferenceSet: true }),
      })
    );
  });

  // ── 3. userId is parsed as integer ────────────────────────────────────────
  test('parses userId string param to integer before querying', async () => {
    prisma.user.update.mockResolvedValue({ ...updatedUser, user_id: 42 });

    const req = { params: { userId: '42' }, body: { preference: samplePreference } };
    const res = mockRes();

    await updatePreference(req, res);

    const callArgs = prisma.user.update.mock.calls[0][0];
    expect(callArgs.where.user_id).toBe(42); // number, not '42'
    expect(typeof callArgs.where.user_id).toBe('number');
  });

  // ── 4. Preference object is stored exactly as provided ────────────────────
  test('stores the preference JSON exactly as the client sends it', async () => {
    const customPref = {
      difficulty: 'very easy',
      fitness: 'basic',
      duration_max: 3,
      budget_max: 300,
      ams_concern_level: 1,
      group_size: 'solo',
    };

    prisma.user.update.mockResolvedValue({ ...updatedUser, preference: customPref });

    const req = { params: { userId: '5' }, body: { preference: customPref } };
    const res = mockRes();

    await updatePreference(req, res);

    const callArgs = prisma.user.update.mock.calls[0][0];
    expect(callArgs.data.preference).toEqual(customPref);
  });

  // ── 5. Sensitive fields are not returned in the response ──────────────────
  test('response does not include password_hash or OTP fields', async () => {
    prisma.user.update.mockResolvedValue(updatedUser);

    const req = { params: { userId: '1' }, body: { preference: samplePreference } };
    const res = mockRes();

    await updatePreference(req, res);

    const returnedUser = res.json.mock.calls[0][0].user;
    expect(returnedUser).not.toHaveProperty('password_hash');
    expect(returnedUser).not.toHaveProperty('otp');
    expect(returnedUser).not.toHaveProperty('otp_expires');
  });

  // ── 6. DB error bubbles up as 500 ─────────────────────────────────────────
  test('returns 500 when prisma throws an error', async () => {
    prisma.user.update.mockRejectedValue(new Error('DB connection lost'));

    const req = { params: { userId: '1' }, body: { preference: samplePreference } };
    const res = mockRes();

    await updatePreference(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'DB connection lost' })
    );
  });

  // ── 7. Updating preference a second time overwrites the old one ────────────
  test('overwriting an existing preference replaces the old values', async () => {
    const newPref = { difficulty: 'challenging', fitness: 'excellent', duration_max: 21 };
    prisma.user.update.mockResolvedValue({ ...updatedUser, preference: newPref });

    const req = { params: { userId: '1' }, body: { preference: newPref } };
    const res = mockRes();

    await updatePreference(req, res);

    const callArgs = prisma.user.update.mock.calls[0][0];
    expect(callArgs.data.preference).toEqual(newPref);
    expect(callArgs.data.isPreferenceSet).toBe(true);
  });
});
