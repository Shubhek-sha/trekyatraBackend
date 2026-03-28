import prisma from '../config/prisma.js';

// GET ALL TREKS
export const fetchTreks = async (req, res) => {
  try {
    const treks = await prisma.trek.findMany({
      where: {
        is_active: 1,
      },
      include: {
        trek_images: {
          where: {is_cover: 1},
          take: 1,
        },
      },
      orderBy: {
        popularity_score: 'desc',
      },
    });

    res.json(treks);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SINGLE TREK
export const fetchSingleTrek = async (req, res) => {
  try {
    const trek = await prisma.trek.findUnique({
      where: {
        trek_id: parseInt(req.params.id),
      },
      include: {
        trek_images: {
          orderBy: {
            sort_order: 'asc',
          },
        },
      },
    });

    if (!trek) {
      return res.status(404).json({
        message: 'Trek not found',
      });
    }

    res.json(trek);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ADD TREK
export const addTrek = async (req, res) => {
  try {
    // Generate slug from name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await prisma.trek.create({
      data: {
        name: req.body.name,
        slug: slug,
        location: req.body.location,
        region: req.body.region,
        country: req.body.country,
        difficulty: req.body.difficulty,
        duration_days: req.body.duration_days ? parseInt(req.body.duration_days) : null,
        distance_km: req.body.distance_km ? parseFloat(req.body.distance_km) : null,
        max_altitude: req.body.max_altitude ? parseInt(req.body.max_altitude) : null,
        altitude_gain: req.body.altitude_gain ? parseInt(req.body.altitude_gain) : null,
        starting_point: req.body.starting_point,
        ending_point: req.body.ending_point,
        daily_trek_hours: req.body.daily_trek_hours ? parseInt(req.body.daily_trek_hours) : null,
        temperature_range: req.body.temperature_range,
        permits_required: req.body.permits_required,
        guide_mandatory: req.body.guide_mandatory ? 1 : 0,
        fitness_level_required: req.body.fitness_level_required ? parseInt(req.body.fitness_level_required) : null,
        water_availability: req.body.water_availability ? 1 : 0,
        food_availability: req.body.food_availability ? 1 : 0,
        mobile_network_availability: req.body.mobile_network_availability ? 1 : 0,
        risk_level: req.body.risk_level,
        altitude_sickness_risk: req.body.altitude_sickness_risk,
        nearest_medical_facility_distance: req.body.nearest_medical_facility_distance ? parseFloat(req.body.nearest_medical_facility_distance) : null,
        evacuation_possible: req.body.evacuation_possible ? 1 : 0,
        cost_min_usd: req.body.cost_min_usd ? parseFloat(req.body.cost_min_usd) : null,
        cost_max_usd: req.body.cost_max_usd ? parseFloat(req.body.cost_max_usd) : null,
        cultural_significance: req.body.cultural_significance,
        group_size_min: req.body.group_size_min ? parseInt(req.body.group_size_min) : null,
        group_size_max: req.body.group_size_max ? parseInt(req.body.group_size_max) : null,
        popularity_score: req.body.popularity_score ? parseInt(req.body.popularity_score) : 0,
        is_active: req.body.is_active !== undefined ? req.body.is_active : 1,
      },
    });

    res.status(201).json({
      message: 'Trek added successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
