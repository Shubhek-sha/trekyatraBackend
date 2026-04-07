// project/controllers/interaction.controller.js
import prisma from '../config/prisma.js';

export const createInteraction = async (req, res) => {
  try {
    const { userId, trekId, views, booked, favorites, rating, timeSpentSeconds, weight } = req.body;
    
    // Check required fields
    if (!userId || !trekId) {
      return res.status(400).json({ success: false, message: 'userId and trekId are required' });
    }

    const interaction = await prisma.interaction.create({
      data: {
        userId: Number(userId),
        trekId,
        views: views ? Number(views) : undefined,
        booked: booked === undefined ? undefined : Boolean(booked),
        favorites: favorites === undefined ? undefined : Boolean(favorites),
        rating: rating ? Number(rating) : undefined,
        timeSpentSeconds: timeSpentSeconds ? Number(timeSpentSeconds) : undefined,
        weight: weight ? Number(weight) : undefined
      }
    });

    return res.status(201).json({ success: true, data: interaction });
  } catch (error) {
    console.error('Error creating interaction:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getAllInteractions = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, trekId } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
        ...(userId && { userId: Number(userId) }),
        ...(trekId && { trekId })
    };

    const [interactions, total] = await Promise.all([
      prisma.interaction.findMany({
        where,
        skip,
        take: limitNum,
        include: { user: true, trek: true }
      }),
      prisma.interaction.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      data: interactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      }
    });
  } catch (error) {
    console.error('Error getting interactions:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getInteractionById = async (req, res) => {
  try {
    const { id } = req.params;
    const interaction = await prisma.interaction.findUnique({
      where: { interactionId: Number(id) },
      include: { user: true, trek: true }
    });

    if (!interaction) {
      return res.status(404).json({ success: false, message: 'Interaction not found' });
    }
    
    return res.status(200).json({ success: true, data: interaction });
  } catch (error) {
    console.error('Error getting interaction:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const updateInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, trekId, views, booked, favorites, rating, timeSpentSeconds, weight } = req.body;

    const interaction = await prisma.interaction.update({
      where: { interactionId: Number(id) },
      data: {
        userId: userId ? Number(userId) : undefined,
        trekId,
        views: views !== undefined ? Number(views) : undefined,
        booked: booked !== undefined ? Boolean(booked) : undefined,
        favorites: favorites !== undefined ? Boolean(favorites) : undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
        timeSpentSeconds: timeSpentSeconds !== undefined ? Number(timeSpentSeconds) : undefined,
        weight: weight !== undefined ? Number(weight) : undefined
      }
    });

    return res.status(200).json({ success: true, data: interaction });
  } catch (error) {
    console.error('Error updating interaction:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const deleteInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.interaction.delete({
      where: { interactionId: Number(id) }
    });

    return res.status(200).json({ success: true, message: 'Interaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting interaction:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
