const express = require('express');
const {
  getProfile,
  createOrUpdateProfile,
  updateProfileSection,
  deleteProfile,
  getProfileStatus
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/profile/status
// @desc    Get profile completion status
// @access  Private
router.get('/status', getProfileStatus);

// @route   GET /api/profile
// @desc    Get user's health profile
// @access  Private
router.get('/', getProfile);

// @route   POST /api/profile
// @desc    Create or update user's health profile
// @access  Private
router.post('/', createOrUpdateProfile);

// @route   PATCH /api/profile/:section
// @desc    Update specific section of profile
// @access  Private
router.patch('/:section', updateProfileSection);

// @route   DELETE /api/profile
// @desc    Delete user's health profile
// @access  Private
router.delete('/', deleteProfile);

module.exports = router;
