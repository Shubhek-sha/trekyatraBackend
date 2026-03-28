import prisma from "../config/prisma.js";

export const getRecommendedTreks = async (userId) => {
  try {
    // 1️⃣ Get user preferences
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(userId) },
      select: {
        fitness_level: true,
        preferred_difficulty: true,
        preferred_max_duration: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2️⃣ Get matching treks
    const treks = await prisma.trek.findMany({
      where: {
        difficulty: user.preferred_difficulty,
        duration_days: {
          lte: user.preferred_max_duration,
        },
        fitness_level_required: {
          lte: user.fitness_level,
        },
      },
      orderBy: {
        popularity_score: "desc",
      },
      take: 5,
    });

    return treks;
  } catch (error) {
    throw error;
  }
};
