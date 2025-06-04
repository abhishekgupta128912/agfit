const Progress = require('../models/Progress');
const User = require('../models/User');

/**
 * @desc    Get today's progress for user
 * @route   GET /api/progress/today
 * @access  Private
 */
const getTodayProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({
      userId,
      date: today
    });

    // If no progress entry exists for today, create one
    if (!progress) {
      progress = new Progress({
        userId,
        date: today,
        nutrition: {
          meals: [],
          waterIntake: { glasses: 0, target: 8 },
          supplements: [],
          totalCalories: 0,
          adherenceScore: 0
        },
        workout: {
          exercises: [],
          totalDuration: 0,
          caloriesBurned: 0,
          completed: false,
          adherenceScore: 0
        },
        wellness: {
          sleep: {},
          meditation: { minutes: 0, completed: false }
        },
        metrics: {
          overallAdherence: 0,
          goalsCompleted: 0,
          totalGoals: 0,
          streakDay: false
        }
      });
      await progress.save();
    }

    res.status(200).json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error getting today\'s progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get today\'s progress',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Update today's progress
 * @route   PUT /api/progress/today
 * @access  Private
 */
const updateTodayProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateData = req.body;

    let progress = await Progress.findOneAndUpdate(
      { userId, date: today },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Progress updated successfully'
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Log a meal
 * @route   POST /api/progress/meal
 * @access  Private
 */
const logMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, foods, calories, notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meal = {
      name,
      foods: foods || [],
      calories: calories || 0,
      completed: true,
      notes: notes || '',
      timestamp: new Date()
    };

    let progress = await Progress.findOne({ userId, date: today });
    
    if (!progress) {
      progress = new Progress({
        userId,
        date: today,
        nutrition: { meals: [meal] }
      });
    } else {
      progress.nutrition.meals.push(meal);
      progress.nutrition.totalCalories = progress.nutrition.meals.reduce(
        (total, meal) => total + (meal.calories || 0), 0
      );
    }

    await progress.save();

    res.status(201).json({
      success: true,
      data: progress,
      message: 'Meal logged successfully'
    });

  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log meal',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Log water intake
 * @route   POST /api/progress/water
 * @access  Private
 */
const logWater = async (req, res) => {
  try {
    const userId = req.user.id;
    const { glasses } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({ userId, date: today });
    
    if (!progress) {
      progress = new Progress({
        userId,
        date: today,
        nutrition: {
          waterIntake: { glasses: glasses || 1, target: 8 }
        }
      });
    } else {
      progress.nutrition.waterIntake.glasses = Math.max(0, 
        (progress.nutrition.waterIntake.glasses || 0) + (glasses || 1)
      );
    }

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Water intake updated'
    });

  } catch (error) {
    console.error('Error logging water:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log water intake',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Complete workout exercise
 * @route   POST /api/progress/exercise
 * @access  Private
 */
const completeExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, sets, reps, weight, duration, notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exercise = {
      name,
      sets: sets || 0,
      reps: reps || '',
      weight: weight || 0,
      duration: duration || 0,
      completed: true,
      notes: notes || ''
    };

    let progress = await Progress.findOne({ userId, date: today });
    
    if (!progress) {
      progress = new Progress({
        userId,
        date: today,
        workout: { exercises: [exercise] }
      });
    } else {
      progress.workout.exercises.push(exercise);
      progress.workout.totalDuration = progress.workout.exercises.reduce(
        (total, ex) => total + (ex.duration || 0), 0
      );
    }

    await progress.save();

    res.status(201).json({
      success: true,
      data: progress,
      message: 'Exercise completed successfully'
    });

  } catch (error) {
    console.error('Error completing exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete exercise',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get progress history
 * @route   GET /api/progress/history
 * @access  Private
 */
const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7, page = 1, limit = 10 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    const progress = await Progress.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    })
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Progress.countDocuments({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({
      success: true,
      data: progress,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error getting progress history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/progress/stats
 * @access  Private
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current streak
    const currentStreak = await Progress.getCurrentStreak(userId);

    // Get this week's stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyStats = await Progress.getWeeklyStats(userId, weekStart);

    // Get total progress entries
    const totalDays = await Progress.countDocuments({ userId });

    // Get average adherence over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyStats = await Progress.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          avgAdherence: { $avg: '$metrics.overallAdherence' },
          totalGoalsCompleted: { $sum: '$metrics.goalsCompleted' },
          streakDays: { $sum: { $cond: ['$metrics.streakDay', 1, 0] } }
        }
      }
    ]);

    const stats = {
      currentStreak,
      weeklyStats,
      monthlyStats: monthlyStats[0] || { avgAdherence: 0, totalGoalsCompleted: 0, streakDays: 0 },
      totalDaysTracked: totalDays
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getTodayProgress,
  updateTodayProgress,
  logMeal,
  logWater,
  completeExercise,
  getProgressHistory,
  getUserStats
};
