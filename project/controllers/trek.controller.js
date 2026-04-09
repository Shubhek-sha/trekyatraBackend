import prisma from '../config/prisma.js';

export const createTrek = async (req, res) => {
  try {
    const {
      trekId,
      name,
      location,
      region,
      country,
      difficulty,
      durationDays,
      distanceKm,
      maxAltitudeM,
      altitudeGainM,
      terrainTypes,
      bestSeasons,
      temperatureMin,
      temperatureMax,
      permitsRequired,
      permitDetails,
      guideMandatory,
      fitnessLevelRequired,
      startingPoint,
      endingPoint,
      baseCampAltitudeM,
      dailyTrekHours,
      accommodationType,
      waterAvailability,
      mobileNetwork,
      riskLevel,
      altitudeSicknessRisk,
      nearestMedicalFacilityKm,
      evacuationPossible,
      estimatedCostMinUsd,
      estimatedCostMaxUsd,
      currency,
      attractions,
      wildlifePossible,
      culturalSignificance,
      averageRating,
      totalReviews,
      popularityScore,
      foodAvailability,
      languageSpoken,
      groupSizeMin,
      groupSizeMax,
      bestFor,
      description,
      shortDescription,
      images,
      province,
      itinerary,
    } = req.body;

    if (!trekId || !name || !location || !region || !country) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: trekId, name, location, region, country',
      });
    }

    const trek = await prisma.trek.create({
      data: {
        trekId,
        name,
        location,
        region,
        country,
        difficulty,
        durationDays,
        distanceKm,
        maxAltitudeM,
        altitudeGainM,
        terrainTypes: terrainTypes ?? [],
        bestSeasons: bestSeasons ?? [],
        temperatureMin,
        temperatureMax,
        permitsRequired,
        permitDetails,
        guideMandatory,
        fitnessLevelRequired,
        startingPoint,
        endingPoint,
        baseCampAltitudeM,
        dailyTrekHours,
        accommodationType: accommodationType ?? [],
        waterAvailability,
        mobileNetwork,
        riskLevel,
        altitudeSicknessRisk,
        nearestMedicalFacilityKm,
        evacuationPossible,
        estimatedCostMinUsd,
        estimatedCostMaxUsd,
        currency: currency ?? 'USD',
        attractions: attractions ?? [],
        wildlifePossible: wildlifePossible ?? [],
        culturalSignificance,
        averageRating: averageRating ?? 0,
        totalReviews: totalReviews ?? 0,
        popularityScore: popularityScore ?? 0,
        foodAvailability,
        languageSpoken: languageSpoken ?? [],
        groupSizeMin,
        groupSizeMax,
        bestFor: bestFor ?? [],
        description,
        province,
        shortDescription,
        images: images ?? [],
        itinerary: itinerary ?? [],
      },
    });

    return res.status(201).json({success: true, message: 'Trek created successfully', data: trek});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({success: false, message: 'A trek with this trekId already exists'});
    }
    console.error('createTrek error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const getAllTreks = async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      difficulty,
      region,
      country,
      search,
      minDays,
      maxDays,
      minAltitude,
      maxAltitude,
      sortBy = 'popularityScore',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(difficulty && {difficulty}),
      ...(region && {region}),
      ...(country && {country}),
      ...(minDays || maxDays
        ? {
            durationDays: {
              ...(minDays && {gte: parseInt(minDays)}),
              ...(maxDays && {lte: parseInt(maxDays)}),
            },
          }
        : {}),
      ...(minAltitude || maxAltitude
        ? {
            maxAltitudeM: {
              ...(minAltitude && {gte: parseInt(minAltitude)}),
              ...(maxAltitude && {lte: parseInt(maxAltitude)}),
            },
          }
        : {}),
      ...(search && {
        OR: [
          {name: {contains: search}},
          {shortDescription: {contains: search}},
          {location: {contains: search}},
        ],
      }),
    };

    const [treks, total] = await Promise.all([
      prisma.trek.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {[sortBy]: sortOrder},
      }),
      prisma.trek.count({where}),
    ]);

    return res.status(200).json({
      success: true,
      data: treks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('getAllTreks error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const getTrendingTreks = async (req, res) => {
  try {
    const {limit = '10'} = req.query;
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // 1. Group reviews by trekId and count them
    const reviewCounts = await prisma.review.groupBy({
      by: ['trekId'],
      _count: {
        trekId: true,
      },
      _avg: {
        rating: true,
      },
      orderBy: [
        {
          _count: {
            trekId: 'desc',
          },
        },
        {
          _avg: {
            rating: 'desc',
          },
        },
      ],
      take: limitNum,
    });

    if (reviewCounts.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No reviews found to determine trending treks',
      });
    }

    // 2. Fetch full trek details for these trekIds
    const trekIds = reviewCounts.map((rc) => rc.trekId);
    const treks = await prisma.trek.findMany({
      where: {
        trekId: {
          in: trekIds,
        },
      },
    });

    // 3. Sort the treks based on the original group-by order
    const sortedTreks = trekIds
      .map((id) => {
        const trek = treks.find((t) => t.trekId === id);
        if (!trek) return null;
        const stats = reviewCounts.find((rc) => rc.trekId === id);
        return {
          ...trek,
          reviewCount: stats._count.trekId,
          averageRatingFromReviews: stats._avg.rating,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      data: sortedTreks,
    });
  } catch (error) {
    console.error('getTrendingTreks error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const getSimilarTreks = async (req, res) => {
  try {
    const {difficulty, excludeId, limit = '5'} = req.query;

    if (!difficulty) {
      return res.status(400).json({success: false, message: 'difficulty parameter is required'});
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const similarTreks = await prisma.trek.findMany({
      where: {
        difficulty: {
          contains: difficulty,
        },
        ...(excludeId && {
          NOT: {
            OR: [{id: excludeId}, {trekId: excludeId}],
          },
        }),
      },
      take: limitNum,
      orderBy: {
        popularityScore: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: similarTreks,
    });
  } catch (error) {
    console.error('getSimilarTreks error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const getTrekById = async (req, res) => {
  try {
    const {id} = req.params;
    const trek = await prisma.trek.findFirst({
      where: {OR: [{id}, {trekId: id}]},
    });

    if (!trek) return res.status(404).json({success: false, message: 'Trek not found'});

    return res.status(200).json({success: true, data: trek});
  } catch (error) {
    console.error('getTrekById error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const updateTrek = async (req, res) => {
  try {
    const {id} = req.params;

    const existing = await prisma.trek.findFirst({
      where: {OR: [{id}, {trekId: id}]},
      select: {id: true},
    });

    if (!existing) return res.status(404).json({success: false, message: 'Trek not found'});

    if (req.body.trekId && req.body.trekId !== id) {
      const conflict = await prisma.trek.findUnique({
        where: {trekId: req.body.trekId},
        select: {id: true},
      });
      if (conflict && conflict.id !== existing.id) {
        return res.status(409).json({success: false, message: 'Another trek already uses this trekId'});
      }
    }

    const updated = await prisma.trek.update({
      where: {id: existing.id},
      data: {...req.body},
    });

    return res.status(200).json({success: true, message: 'Trek updated successfully', data: updated});
  } catch (error) {
    console.error('updateTrek error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const deleteTrek = async (req, res) => {
  try {
    const {id} = req.params;

    const existing = await prisma.trek.findFirst({
      where: {OR: [{id}, {trekId: id}]},
      select: {id: true},
    });

    if (!existing) return res.status(404).json({success: false, message: 'Trek not found'});

    await prisma.trek.delete({where: {id: existing.id}});

    return res.status(200).json({success: true, message: 'Trek deleted successfully'});
  } catch (error) {
    console.error('deleteTrek error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const updateItinerary = async (req, res) => {
  try {
    const {id} = req.params;
    const {itinerary} = req.body;

    if (!Array.isArray(itinerary)) {
      return res.status(400).json({success: false, message: 'itinerary must be an array'});
    }

    const existing = await prisma.trek.findFirst({
      where: {OR: [{id}, {trekId: id}]},
      select: {id: true},
    });

    if (!existing) return res.status(404).json({success: false, message: 'Trek not found'});

    const updated = await prisma.trek.update({
      where: {id: existing.id},
      data: {itinerary},
      select: {id: true, trekId: true, name: true, itinerary: true},
    });

    return res.status(200).json({success: true, message: 'Itinerary updated successfully', data: updated});
  } catch (error) {
    console.error('updateItinerary error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const searchTrekByName = async (req, res) => {
  try {
    const {name} = req.query;

    if (!name) {
      return res.status(400).json({success: false, message: 'Name query parameter is required'});
    }

    const treks = await prisma.trek.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: treks,
    });
  } catch (error) {
    console.error('searchTrekByName error:', error);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};
