const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTodayProgress,
  updateTodayProgress,
  logMeal,
  logWater,
  completeExercise,
  getProgressHistory,
  getUserStats
} = require('../controllers/progressController');

// Middleware to protect all progress routes
router.use(protect);

/**
 * @route   GET /api/progress/today
 * @desc    Get today's progress for the authenticated user
 * @access  Private
 */
router.get('/today', getTodayProgress);

/**
 * @route   PUT /api/progress/today
 * @desc    Update today's progress
 * @access  Private
 */
router.put('/today', updateTodayProgress);

/**
 * @route   POST /api/progress/meal
 * @desc    Log a meal for today
 * @access  Private
 */
router.post('/meal', logMeal);

/**
 * @route   POST /api/progress/water
 * @desc    Log water intake for today
 * @access  Private
 */
router.post('/water', logWater);

/**
 * @route   POST /api/progress/exercise
 * @desc    Complete an exercise for today
 * @access  Private
 */
router.post('/exercise', completeExercise);

/**
 * @route   GET /api/progress/history
 * @desc    Get progress history with pagination
 * @access  Private
 * @query   days - Number of days to look back (default: 7)
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 */
router.get('/history', getProgressHistory);

/**
 * @route   GET /api/progress/stats
 * @desc    Get user statistics (streak, weekly/monthly averages)
 * @access  Private
 */
router.get('/stats', getUserStats);

module.exports = router;
