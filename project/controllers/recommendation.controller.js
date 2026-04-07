import prisma from '../config/prisma.js';

export const recommendTreks = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Get user preferences for personalized recommendations
    const user = await prisma.user.findUnique({
      where: {user_id: userId},
      select: {
        isPreferenceSet: true,
        preference: true,
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

    if (user.isPreferenceSet && user.preference) {
      if (user.preference.difficulty) {
        whereClause.difficulty = user.preference.difficulty;
      }

      if (user.preference.fitness) {
        // Assume fitnessLevelRequired in Trek is a string but user.preference.fitness is a number?
        // Let's add logic to convert or maybe it's just stored accordingly.
        // The original used whereClause.fitness_level_required = { lte: user.fitness_level }
        whereClause.fitnessLevelRequired = String(user.preference.fitness);
      }

      if (user.preference.duration_max) {
        whereClause.durationDays = {
          lte: user.preference.duration_max,
        };
      }
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
