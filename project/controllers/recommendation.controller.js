import prisma from '../config/prisma.js';

export const recommendTreks = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Get user preferences
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
        //map the user preference to number (model lai number chaincha)
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

const difficultyMapping = {
  'very easy': 1,
  easy: 2,
  moderate: 3,
  'moderate to strenuous': 4,
  challenging: 5,
  'very challenging': 6,
};

const fitnessMapping = {
  basic: 1,
  moderate: 2,
  good: 3,
  excellent: 4,
};

export const recommendForUserUsingModel = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // 1. Fetch user preference
    const user = await prisma.user.findUnique({
      where: {user_id: userId},
      select: {
        preference: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 2. Fetch user interactions
    const interactionsData = await prisma.interaction.findMany({
      where: {userId: userId},
    });

    // 3. Format interactions for the model
    const interactions = interactionsData.map((inter) => ({
      trek_id: inter.trekId,
      rating: inter.rating,
      view_count: inter.views,
      booked: inter.booked,
      favorited: inter.favorites,
      time_spent_seconds: inter.timeSpentSeconds,
    }));

    // 4. Map string preferences to integers if necessary
    const rawPrefs = user.preference || {};
    const preferences = {
      ...rawPrefs,
      difficulty: difficultyMapping[String(rawPrefs.difficulty).toLowerCase()] || rawPrefs.difficulty,
      fitness: fitnessMapping[String(rawPrefs.fitness).toLowerCase()] || rawPrefs.fitness,
      budget_max: parseInt(rawPrefs.budget_max) || rawPrefs.budget_max,
      duration_max: parseInt(rawPrefs.duration_max) || rawPrefs.duration_max,
      ams_concern_level: parseInt(rawPrefs.ams_concern_level) || rawPrefs.ams_concern_level,
    };

    // 5. Prepare payload for Flask API
    const payload = {
      user_id: String(userId),
      preferences: preferences,
      interactions: interactions,
      top_n: 10,
    };

    // 6. Trigger the Flask API
    const flaskResponse = await fetch('https://trekyatramodel.onrender.com/recommend/hybrid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json().catch(() => ({}));
      return res.status(flaskResponse.status).json({
        success: false,
        message: 'Error from recommendation model',
        error: errorData,
      });
    }

    const modelResponse = await flaskResponse.json();
    const recommendedIds = modelResponse.recommendations || [];

    // 7. Get full trek details for each recommended ID
    const trekIds = recommendedIds.map((rec) => (typeof rec === 'string' ? rec : rec.trek_id));

    const treks = await prisma.trek.findMany({
      where: {
        trekId: {in: trekIds},
      },
      include: {
        trek_images: {
          where: {is_cover: 1},
          take: 1,
        },
      },
    });

    // 8. Restore the order provided by the recommendation model
    const sortedTreks = trekIds.map((id) => treks.find((t) => t.trekId === id)).filter(Boolean);

    res.json({
      success: true,
      recommendations: sortedTreks,
    });
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//what the payload looks like(mathi ko controller call huda k pathaucha bhanera herna)
export const previewRecommendationPayload = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // 1. Fetch user preference
    const user = await prisma.user.findUnique({
      where: {user_id: userId},
      select: {
        preference: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 2. Fetch user interactions
    const interactionsData = await prisma.interaction.findMany({
      where: {userId: userId},
    });

    // 3. Format interactions
    const interactions = interactionsData.map((inter) => ({
      trek_id: inter.trekId,
      rating: inter.rating,
      view_count: inter.views,
      booked: inter.booked,
      favorited: inter.favorites,
      time_spent_seconds: inter.timeSpentSeconds,
    }));

    // 4. Map preferences
    const rawPrefs = user.preference || {};
    const preferences = {
      ...rawPrefs,
      difficulty: difficultyMapping[String(rawPrefs.difficulty).toLowerCase()] || rawPrefs.difficulty,
      fitness: fitnessMapping[String(rawPrefs.fitness).toLowerCase()] || rawPrefs.fitness,
      budget_max: parseInt(rawPrefs.budget_max) || rawPrefs.budget_max,
      duration_max: parseInt(rawPrefs.duration_max) || rawPrefs.duration_max,
      ams_concern_level: parseInt(rawPrefs.ams_concern_level) || rawPrefs.ams_concern_level,
    };

    // 5. Build payload
    const payload = {
      user_id: String(userId),
      preferences: preferences,
      interactions: interactions,
      top_n: 10,
    };

    res.json({
      success: true,
      payload: payload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
