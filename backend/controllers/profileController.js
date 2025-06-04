const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get user's health profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          ...profile.toObject(),
          bmi: profile.bmi,
          bmiCategory: profile.bmiCategory
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create or update user's health profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile already exists
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        userId,
        ...profileData
      });
    }

    // Update user's profileCompleted status
    if (profile.isComplete) {
      await User.findByIdAndUpdate(userId, { profileCompleted: true });
    }

    res.status(profile.isNew ? 201 : 200).json({
      success: true,
      message: profile.isNew ? 'Profile created successfully' : 'Profile updated successfully',
      data: {
        profile: {
          ...profile.toObject(),
          bmi: profile.bmi,
          bmiCategory: profile.bmiCategory
        }
      }
    });

  } catch (error) {
    console.error('Create/Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating/updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update specific section of profile
// @route   PATCH /api/profile/:section
// @access  Private
const updateProfileSection = async (req, res) => {
  try {
    const userId = req.user.id;
    const section = req.params.section;
    const sectionData = req.body;

    // Validate section name
    const validSections = ['personalInfo', 'healthGoals', 'activityLevel', 'dietaryInfo', 'healthConditions', 'lifestyle'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile section'
      });
    }

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Create new profile if doesn't exist
      profile = new Profile({ userId });
    }

    // Update the specific section
    if (section === 'activityLevel') {
      profile.activityLevel = sectionData.activityLevel;
    } else {
      profile[section] = { ...profile[section], ...sectionData };
    }

    await profile.save();

    // Update user's profileCompleted status
    if (profile.isComplete) {
      await User.findByIdAndUpdate(userId, { profileCompleted: true });
    }

    res.status(200).json({
      success: true,
      message: `${section} updated successfully`,
      data: {
        profile: {
          ...profile.toObject(),
          bmi: profile.bmi,
          bmiCategory: profile.bmiCategory
        },
        completionStatus: profile.completionStatus,
        isComplete: profile.isComplete
      }
    });

  } catch (error) {
    console.error('Update profile section error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile section',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete user's health profile
// @route   DELETE /api/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update user's profileCompleted status
    await User.findByIdAndUpdate(userId, { profileCompleted: false });

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get profile completion status
// @route   GET /api/profile/status
// @access  Private
const getProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          exists: false,
          isComplete: false,
          completionStatus: {
            personalInfo: false,
            healthGoals: false,
            activityLevel: false,
            dietaryInfo: false,
            healthConditions: false,
            lifestyle: false
          },
          completionPercentage: 0
        }
      });
    }

    const completedSections = Object.values(profile.completionStatus).filter(status => status).length;
    const totalSections = Object.keys(profile.completionStatus).length;
    const completionPercentage = Math.round((completedSections / totalSections) * 100);

    res.status(200).json({
      success: true,
      data: {
        exists: true,
        isComplete: profile.isComplete,
        completionStatus: profile.completionStatus,
        completionPercentage,
        bmi: profile.bmi,
        bmiCategory: profile.bmiCategory
      }
    });

  } catch (error) {
    console.error('Get profile status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  updateProfileSection,
  deleteProfile,
  getProfileStatus
};
