const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateNutritionPlan,
  generateWorkoutPlan,
  generateWellnessPlan,
  generateComprehensivePlan,
  getRecommendations,
  getRecommendation,
  addFeedback
} = require('../controllers/aiController');

// Middleware to protect all AI routes
router.use(protect);

/**
 * @route   POST /api/ai/nutrition
 * @desc    Generate personalized nutrition plan
 * @access  Private
 */
router.post('/nutrition', generateNutritionPlan);

/**
 * @route   POST /api/ai/workout
 * @desc    Generate personalized workout plan
 * @access  Private
 */
router.post('/workout', generateWorkoutPlan);

/**
 * @route   POST /api/ai/wellness
 * @desc    Generate personalized wellness plan
 * @access  Private
 */
router.post('/wellness', generateWellnessPlan);

/**
 * @route   POST /api/ai/comprehensive
 * @desc    Generate comprehensive health plan (nutrition + workout + wellness)
 * @access  Private
 */
router.post('/comprehensive', generateComprehensivePlan);

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get user's recommendations with optional filtering
 * @access  Private
 * @query   type (optional) - Filter by recommendation type
 * @query   limit (optional) - Number of results per page (default: 10)
 * @query   page (optional) - Page number (default: 1)
 */
router.get('/recommendations', getRecommendations);

/**
 * @route   GET /api/ai/recommendations/:id
 * @desc    Get specific recommendation by ID
 * @access  Private
 */
router.get('/recommendations/:id', getRecommendation);

/**
 * @route   POST /api/ai/recommendations/:id/feedback
 * @desc    Add feedback to a recommendation
 * @access  Private
 * @body    rating (1-5), helpful (boolean), comments (string)
 */
router.post('/recommendations/:id/feedback', addFeedback);

/**
 * @route   PUT /api/ai/recommendations/:id/follow
 * @desc    Mark recommendation as followed
 * @access  Private
 */
router.put('/recommendations/:id/follow', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const Recommendation = require('../models/Recommendation');
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

    await recommendation.markAsFollowed();

    res.json({
      success: true,
      message: 'Recommendation marked as followed',
      data: recommendation
    });

  } catch (error) {
    console.error('Error marking recommendation as followed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recommendation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/ai/recommendations/:id
 * @desc    Archive (soft delete) a recommendation
 * @access  Private
 */
router.delete('/recommendations/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const Recommendation = require('../models/Recommendation');
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

    await recommendation.archive();

    res.json({
      success: true,
      message: 'Recommendation archived successfully'
    });

  } catch (error) {
    console.error('Error archiving recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive recommendation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/ai/stats
 * @desc    Get user's AI recommendation statistics
 * @access  Private
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const Recommendation = require('../models/Recommendation');

    const stats = await Recommendation.getUserStats(userId);
    
    // Get total counts
    const totalRecommendations = await Recommendation.countDocuments({ userId });
    const activeRecommendations = await Recommendation.countDocuments({ 
      userId, 
      isActive: true, 
      status: 'active' 
    });

    // Get recent activity
    const recentRecommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type title createdAt userFeedback.rating');

    res.json({
      success: true,
      data: {
        overview: {
          total: totalRecommendations,
          active: activeRecommendations,
          archived: totalRecommendations - activeRecommendations
        },
        byType: stats,
        recent: recentRecommendations
      }
    });

  } catch (error) {
    console.error('Error fetching AI stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/ai/health
 * @desc    Health check for AI service
 * @access  Private
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI service is healthy',
    timestamp: new Date().toISOString(),
    services: {
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      database: 'connected'
    }
  });
});

module.exports = router;
