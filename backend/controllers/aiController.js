const aiService = require('../services/aiService');
const Recommendation = require('../models/Recommendation');
const Profile = require('../models/Profile');

/**
 * Generate nutrition plan for user
 */
const generateNutritionPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const startTime = Date.now();

    // Get user's profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    // Generate AI recommendation
    const nutritionPlan = await aiService.generateNutritionPlan(profile);
    const generationTime = Date.now() - startTime;

    // Save recommendation to database
    const recommendation = new Recommendation({
      userId,
      type: 'nutrition',
      content: {
        structured: nutritionPlan.structured || false,
        rawContent: typeof nutritionPlan === 'string' ? nutritionPlan : JSON.stringify(nutritionPlan),
        parsedData: nutritionPlan.structured ? nutritionPlan : null
      },
      metadata: {
        generationTime,
        aiModel: 'gpt-3.5-turbo',
        promptVersion: '1.0'
      },
      profileSnapshot: {
        age: profile.personalInfo.age,
        goals: profile.healthGoals.primary,
        activityLevel: profile.activityLevel,
        weight: profile.personalInfo.weight,
        height: profile.personalInfo.height
      }
    });

    // Extract structured nutrition data if available
    if (nutritionPlan.structured && nutritionPlan.nutrition) {
      recommendation.nutrition = nutritionPlan.nutrition;
    }

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Nutrition plan generated successfully',
      data: {
        recommendation,
        generationTime
      }
    });

  } catch (error) {
    console.error('Error generating nutrition plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate nutrition plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Generate workout plan for user
 */
const generateWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const startTime = Date.now();

    // Get user's profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    // Generate AI recommendation
    const workoutPlan = await aiService.generateWorkoutPlan(profile);
    const generationTime = Date.now() - startTime;

    // Save recommendation to database
    const recommendation = new Recommendation({
      userId,
      type: 'workout',
      content: {
        structured: workoutPlan.structured || false,
        rawContent: typeof workoutPlan === 'string' ? workoutPlan : JSON.stringify(workoutPlan),
        parsedData: workoutPlan.structured ? workoutPlan : null
      },
      metadata: {
        generationTime,
        aiModel: 'gpt-3.5-turbo',
        promptVersion: '1.0'
      },
      profileSnapshot: {
        age: profile.personalInfo.age,
        goals: profile.healthGoals.primary,
        activityLevel: profile.activityLevel,
        weight: profile.personalInfo.weight,
        height: profile.personalInfo.height
      }
    });

    // Extract structured workout data if available
    if (workoutPlan.structured && workoutPlan.workout) {
      recommendation.workout = workoutPlan.workout;
    }

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Workout plan generated successfully',
      data: {
        recommendation,
        generationTime
      }
    });

  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate workout plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Generate wellness plan for user
 */
const generateWellnessPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const startTime = Date.now();

    // Get user's profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    // Generate AI recommendation
    const wellnessPlan = await aiService.generateWellnessPlan(profile);
    const generationTime = Date.now() - startTime;

    // Save recommendation to database
    const recommendation = new Recommendation({
      userId,
      type: 'wellness',
      content: {
        structured: wellnessPlan.structured || false,
        rawContent: typeof wellnessPlan === 'string' ? wellnessPlan : JSON.stringify(wellnessPlan),
        parsedData: wellnessPlan.structured ? wellnessPlan : null
      },
      metadata: {
        generationTime,
        aiModel: 'gpt-3.5-turbo',
        promptVersion: '1.0'
      },
      profileSnapshot: {
        age: profile.personalInfo.age,
        goals: profile.healthGoals.primary,
        activityLevel: profile.activityLevel,
        weight: profile.personalInfo.weight,
        height: profile.personalInfo.height
      }
    });

    // Extract structured wellness data if available
    if (wellnessPlan.structured && wellnessPlan.wellness) {
      recommendation.wellness = wellnessPlan.wellness;
    }

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Wellness plan generated successfully',
      data: {
        recommendation,
        generationTime
      }
    });

  } catch (error) {
    console.error('Error generating wellness plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate wellness plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Generate comprehensive health plan (all three types)
 */
const generateComprehensivePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const startTime = Date.now();

    // Get user's profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your health profile first'
      });
    }

    // Generate comprehensive AI recommendation
    const comprehensivePlan = await aiService.generateComprehensivePlan(profile);
    const generationTime = Date.now() - startTime;

    // Save comprehensive recommendation
    const recommendation = new Recommendation({
      userId,
      type: 'comprehensive',
      content: {
        structured: true,
        rawContent: JSON.stringify(comprehensivePlan),
        parsedData: comprehensivePlan
      },
      nutrition: comprehensivePlan.nutrition?.nutrition || {},
      workout: comprehensivePlan.workout?.workout || {},
      wellness: comprehensivePlan.wellness?.wellness || {},
      metadata: {
        generationTime,
        aiModel: 'gpt-3.5-turbo',
        promptVersion: '1.0'
      },
      profileSnapshot: comprehensivePlan.profileSnapshot
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Comprehensive health plan generated successfully',
      data: {
        recommendation,
        generationTime,
        breakdown: {
          nutrition: comprehensivePlan.nutrition,
          workout: comprehensivePlan.workout,
          wellness: comprehensivePlan.wellness
        }
      }
    });

  } catch (error) {
    console.error('Error generating comprehensive plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate comprehensive plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get user's recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, limit = 10, page = 1 } = req.query;

    const query = { userId, isActive: true, status: 'active' };
    if (type) query.type = type;

    const recommendations = await Recommendation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content.rawContent'); // Exclude large raw content for list view

    const total = await Recommendation.countDocuments(query);

    res.json({
      success: true,
      data: {
        recommendations,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: recommendations.length,
          totalRecords: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get specific recommendation by ID
 */
const getRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const recommendation = await Recommendation.findOne({
      _id: id,
      userId,
      isActive: true
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    res.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Error fetching recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Add feedback to recommendation
 */
const addFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, helpful, comments } = req.body;

    const recommendation = await Recommendation.findOne({
      _id: id,
      userId,
      isActive: true
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    await recommendation.addFeedback(rating, helpful, comments);

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: recommendation
    });

  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  generateNutritionPlan,
  generateWorkoutPlan,
  generateWellnessPlan,
  generateComprehensivePlan,
  getRecommendations,
  getRecommendation,
  addFeedback
};
