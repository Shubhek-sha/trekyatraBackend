// project/controllers/interaction.controller.js
import prisma from '../config/prisma.js';

export const createInteraction = async (req, res) => {
  try {
    const {userId, trekId, views, booked, favorites, rating, timeSpentSeconds, weight} = req.body;

    // Check required fields
    if (!userId || !trekId) {
      return res.status(400).json({success: false, message: 'userId and trekId are required'});
    }

    const interaction = await prisma.interaction.upsert({
      where: {
        userId_trekId: {
          userId: Number(userId),
          trekId: trekId,
        },
      },
      update: {
        views: views !== undefined ? {increment: Number(views)} : undefined,
        booked: booked !== undefined ? Boolean(booked) : undefined,
        favorites: favorites !== undefined ? Boolean(favorites) : undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
        timeSpentSeconds: timeSpentSeconds !== undefined ? {increment: Number(timeSpentSeconds)} : undefined,
        weight: weight !== undefined ? Number(weight) : undefined,
      },
      create: {
        userId: Number(userId),
        trekId,
        views: views ? Number(views) : 0,
        booked: booked !== undefined ? Boolean(booked) : false,
        favorites: favorites !== undefined ? Boolean(favorites) : false,
        rating: rating ? Number(rating) : undefined,
        timeSpentSeconds: timeSpentSeconds ? Number(timeSpentSeconds) : 0,
        weight: weight ? Number(weight) : 0,
      },
    });

    return res.status(200).json({success: true, data: interaction});
  } catch (error) {
    console.error('Error creating/updating interaction:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};

export const getAllInteractions = async (req, res) => {
  try {
    const {userId, trekId} = req.query;

    const where = {
      ...(userId && {userId: Number(userId)}),
      ...(trekId && {trekId}),
    };

    const interactions = await prisma.interaction.findMany({
      where,
    });

    return res.status(200).json({
      success: true,
      data: interactions,
      total: interactions.length,
    });
  } catch (error) {
    console.error('Error getting interactions:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};

export const getInteractionById = async (req, res) => {
  try {
    const {id} = req.params;
    const interaction = await prisma.interaction.findUnique({
      where: {interactionId: Number(id)},
    });

    if (!interaction) {
      return res.status(404).json({success: false, message: 'Interaction not found'});
    }

    return res.status(200).json({success: true, data: interaction});
  } catch (error) {
    console.error('Error getting interaction:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};

export const updateInteraction = async (req, res) => {
  try {
    const {id} = req.params;
    const {userId, trekId, views, booked, favorites, rating, timeSpentSeconds, weight} = req.body;

    const interaction = await prisma.interaction.update({
      where: {interactionId: Number(id)},
      data: {
        userId: userId ? Number(userId) : undefined,
        trekId,
        views: views !== undefined ? Number(views) : undefined,
        booked: booked !== undefined ? Boolean(booked) : undefined,
        favorites: favorites !== undefined ? Boolean(favorites) : undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
        timeSpentSeconds: timeSpentSeconds !== undefined ? Number(timeSpentSeconds) : undefined,
        weight: weight !== undefined ? Number(weight) : undefined,
      },
    });

    return res.status(200).json({success: true, data: interaction});
  } catch (error) {
    console.error('Error updating interaction:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};

export const deleteInteraction = async (req, res) => {
  try {
    const {id} = req.params;
    await prisma.interaction.delete({
      where: {interactionId: Number(id)},
    });

    return res.status(200).json({success: true, message: 'Interaction deleted successfully'});
  } catch (error) {
    console.error('Error deleting interaction:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};
