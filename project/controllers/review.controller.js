import prisma from '../config/prisma.js';

export const createReview = async (req, res) => {
  try {
    const {userId, trekId, rating, review} = req.body;

    if (!userId || !trekId || rating === undefined || !review) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, trekId, rating, review',
      });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        trekId,
        rating: parseInt(rating),
        review,
      },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            username: true,
            profile_picture: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: [newReview],
    });
  } catch (error) {
    console.error('createReview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getReviewsByTrekId = async (req, res) => {
  try {
    const {trekId} = req.params;

    const reviews = await prisma.review.findMany({
      where: {trekId},
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            username: true,
            profile_picture: true,
          },
        },
      },
      orderBy: {createdAt: 'desc'},
    });

    return res.status(200).json({success: true, data: reviews});
  } catch (error) {
    console.error('getReviewsByTrekId error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const getReviewById = async (req, res) => {
  try {
    const {id} = req.params;

    const reviewStr = await prisma.review.findUnique({
      where: {reviewId: parseInt(id)},
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            username: true,
            profile_picture: true,
          },
        },
      },
    });

    if (!reviewStr) {
      return res.status(404).json({success: false, message: 'Review not found'});
    }

    return res.status(200).json({success: true, data: reviewStr});
  } catch (error) {
    console.error('getReviewById error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const updateReview = async (req, res) => {
  try {
    const {id} = req.params;
    const {rating, review} = req.body;

    const existing = await prisma.review.findUnique({
      where: {reviewId: parseInt(id)},
    });

    if (!existing) {
      return res.status(404).json({success: false, message: 'Review not found'});
    }

    const updatedReview = await prisma.review.update({
      where: {reviewId: parseInt(id)},
      data: {
        ...(rating !== undefined && {rating: parseInt(rating)}),
        ...(review && {review}),
      },
    });

    return res.status(200).json({success: true, data: [updatedReview]});
  } catch (error) {
    console.error('updateReview error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const deleteReview = async (req, res) => {
  try {
    const {id} = req.params;

    const existing = await prisma.review.findUnique({
      where: {reviewId: parseInt(id)},
    });

    if (!existing) {
      return res.status(404).json({success: false, message: 'Review not found'});
    }

    await prisma.review.delete({
      where: {reviewId: parseInt(id)},
    });

    return res.status(200).json({success: true, message: 'Review deleted successfully'});
  } catch (error) {
    console.error('deleteReview error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};
