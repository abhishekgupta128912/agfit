const { body, param, query, validationResult } = require('express-validator');
const { securityLogger } = require('./security');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    securityLogger.warn('Validation failed', {
      ip: req.ip,
      url: req.originalUrl,
      errors: errors.array(),
      body: req.body
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters'),

  password: body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  age: body('personalInfo.age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),

  weight: body('personalInfo.weight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),

  height: body('personalInfo.height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  mongoId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  rating: body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  comments: body('comments')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comments must be less than 1000 characters')
    .escape(), // Escape HTML characters

  // Pagination validation
  page: query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be between 1 and 1000'),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
};

// Authentication validation rules
const authValidation = {
  register: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    handleValidationErrors
  ],

  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ max: 128 })
      .withMessage('Password is too long'),
    handleValidationErrors
  ],

  forgotPassword: [
    commonValidations.email,
    handleValidationErrors
  ],

  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required')
      .isLength({ min: 10, max: 200 })
      .withMessage('Invalid token format'),
    commonValidations.password,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    handleValidationErrors
  ]
};

// Profile validation rules
const profileValidation = {
  create: [
    body('personalInfo.gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be male, female, or other'),
    commonValidations.age,
    commonValidations.weight,
    commonValidations.height,
    body('healthGoals.primary')
      .optional()
      .isIn(['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'endurance', 'strength'])
      .withMessage('Invalid primary health goal'),
    body('healthGoals.targetWeight')
      .optional()
      .isFloat({ min: 20, max: 500 })
      .withMessage('Target weight must be between 20 and 500 kg'),
    body('activityLevel')
      .optional()
      .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
      .withMessage('Invalid activity level'),
    body('dietaryInfo.restrictions')
      .optional()
      .isArray()
      .withMessage('Dietary restrictions must be an array'),
    body('dietaryInfo.allergies')
      .optional()
      .isArray()
      .withMessage('Allergies must be an array'),
    body('dietaryInfo.mealsPerDay')
      .optional()
      .isInt({ min: 1, max: 8 })
      .withMessage('Meals per day must be between 1 and 8'),
    body('lifestyle.sleepHours')
      .optional()
      .isFloat({ min: 3, max: 12 })
      .withMessage('Sleep hours must be between 3 and 12'),
    body('lifestyle.stressLevel')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Stress level must be between 1 and 10'),
    handleValidationErrors
  ],

  update: [
    commonValidations.mongoId,
    // Same validations as create but all optional
    body('personalInfo.gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be male, female, or other'),
    body('personalInfo.age')
      .optional()
      .isInt({ min: 13, max: 120 })
      .withMessage('Age must be between 13 and 120'),
    handleValidationErrors
  ]
};

// AI generation validation
const aiValidation = {
  generatePlan: [
    body('profileId')
      .optional()
      .isMongoId()
      .withMessage('Invalid profile ID'),
    body('type')
      .optional()
      .isIn(['nutrition', 'workout', 'wellness', 'comprehensive'])
      .withMessage('Invalid plan type'),
    handleValidationErrors
  ],

  feedback: [
    commonValidations.mongoId,
    commonValidations.rating,
    body('helpful')
      .optional()
      .isBoolean()
      .withMessage('Helpful must be a boolean'),
    commonValidations.comments,
    handleValidationErrors
  ]
};

// Progress tracking validation
const progressValidation = {
  logWeight: [
    body('weight')
      .isFloat({ min: 20, max: 500 })
      .withMessage('Weight must be between 20 and 500 kg'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be in ISO 8601 format'),
    handleValidationErrors
  ],

  logWorkout: [
    body('exercises')
      .isArray({ min: 1 })
      .withMessage('Exercises must be a non-empty array'),
    body('exercises.*.name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Exercise name must be between 1 and 100 characters'),
    body('exercises.*.sets')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Sets must be between 1 and 50'),
    body('exercises.*.reps')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Reps must be between 1 and 1000'),
    body('exercises.*.weight')
      .optional()
      .isFloat({ min: 0, max: 1000 })
      .withMessage('Weight must be between 0 and 1000 kg'),
    body('duration')
      .optional()
      .isInt({ min: 1, max: 600 })
      .withMessage('Duration must be between 1 and 600 minutes'),
    handleValidationErrors
  ],

  logNutrition: [
    body('meals')
      .isArray({ min: 1 })
      .withMessage('Meals must be a non-empty array'),
    body('meals.*.name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Meal name must be between 1 and 100 characters'),
    body('meals.*.calories')
      .optional()
      .isInt({ min: 0, max: 5000 })
      .withMessage('Calories must be between 0 and 5000'),
    body('waterIntake')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Water intake must be between 0 and 50 glasses'),
    handleValidationErrors
  ]
};

// General validation utilities
const sanitizeInput = (req, res, next) => {
  // Remove any null bytes
  const removeNullBytes = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/\0/g, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = removeNullBytes(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = removeNullBytes(req.body);
  }
  if (req.query) {
    req.query = removeNullBytes(req.query);
  }
  if (req.params) {
    req.params = removeNullBytes(req.params);
  }

  next();
};

module.exports = {
  authValidation,
  profileValidation,
  aiValidation,
  progressValidation,
  sanitizeInput,
  handleValidationErrors,
  commonValidations
};
