import prisma from '../config/prisma.js';

export const recommendTreks = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Get user preferences for personalized recommendations
    const user = await prisma.user.findUnique({
      where: {user_id: userId},
      select: {
        fitness_level: true,
        preferred_difficulty: true,
        preferred_max_duration: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Build recommendation query based on user preferences
    const whereClause = {
      is_active: 1,
    };

    if (user.preferred_difficulty) {
      whereClause.difficulty = user.preferred_difficulty;
    }

    if (user.fitness_level) {
      whereClause.fitness_level_required = {
        lte: user.fitness_level,
      };
    }

    if (user.preferred_max_duration) {
      whereClause.duration_days = {
        lte: user.preferred_max_duration,
      };
    }

    const treks = await prisma.trek.findMany({
      where: whereClause,
      include: {
        trek_images: {
          where: {is_cover: 1},
          take: 1,
        },
      },
      orderBy: {
        popularity_score: 'desc',
      },
      take: 10,
    });

    res.json({
      success: true,
      recommendations: treks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
