const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Personal Information
  personalInfo: {
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be less than 120']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [100, 'Height must be at least 100cm'],
      max: [250, 'Height must be less than 250cm']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [30, 'Weight must be at least 30kg'],
      max: [300, 'Weight must be less than 300kg']
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(v) {
          return v <= new Date();
        },
        message: 'Date of birth cannot be in the future'
      }
    }
  },

  // Health Goals
  healthGoals: {
    primary: {
      type: String,
      required: [true, 'Primary health goal is required'],
      enum: [
        'weight_loss',
        'weight_gain', 
        'muscle_gain',
        'general_fitness',
        'endurance',
        'strength',
        'flexibility',
        'stress_management',
        'better_sleep',
        'disease_prevention'
      ]
    },
    secondary: [{
      type: String,
      enum: [
        'weight_loss',
        'weight_gain',
        'muscle_gain', 
        'general_fitness',
        'endurance',
        'strength',
        'flexibility',
        'stress_management',
        'better_sleep',
        'disease_prevention'
      ]
    }],
    targetWeight: {
      type: Number,
      min: [30, 'Target weight must be at least 30kg'],
      max: [300, 'Target weight must be less than 300kg']
    },
    timeframe: {
      type: String,
      enum: ['1_month', '3_months', '6_months', '1_year', 'long_term'],
      default: '3_months'
    }
  },

  // Activity Level
  activityLevel: {
    type: String,
    required: [true, 'Activity level is required'],
    enum: [
      'sedentary',        // Little to no exercise
      'lightly_active',   // Light exercise 1-3 days/week
      'moderately_active', // Moderate exercise 3-5 days/week
      'very_active',      // Hard exercise 6-7 days/week
      'extremely_active'  // Very hard exercise, physical job
    ]
  },

  // Dietary Information
  dietaryInfo: {
    restrictions: [{
      type: String,
      enum: [
        'vegetarian',
        'vegan',
        'pescatarian',
        'keto',
        'paleo',
        'gluten_free',
        'dairy_free',
        'low_carb',
        'low_fat',
        'mediterranean',
        'intermittent_fasting',
        'none'
      ]
    }],
    allergies: [{
      type: String,
      enum: [
        'nuts',
        'shellfish',
        'dairy',
        'eggs',
        'soy',
        'wheat',
        'fish',
        'sesame',
        'none'
      ]
    }],
    preferences: [{
      type: String,
      enum: [
        'spicy_food',
        'sweet_food',
        'organic',
        'local_produce',
        'meal_prep_friendly',
        'quick_meals',
        'traditional_cuisine'
      ]
    }],
    mealsPerDay: {
      type: Number,
      min: [1, 'Must have at least 1 meal per day'],
      max: [8, 'Cannot have more than 8 meals per day'],
      default: 3
    }
  },

  // Health Conditions
  healthConditions: {
    existing: [{
      type: String,
      enum: [
        'diabetes_type1',
        'diabetes_type2',
        'hypertension',
        'heart_disease',
        'asthma',
        'arthritis',
        'thyroid_disorder',
        'depression',
        'anxiety',
        'sleep_apnea',
        'high_cholesterol',
        'none'
      ]
    }],
    medications: [String], // Free text for medication names
    injuries: [{
      type: String,
      enum: [
        'knee_injury',
        'back_injury',
        'shoulder_injury',
        'ankle_injury',
        'wrist_injury',
        'neck_injury',
        'hip_injury',
        'none'
      ]
    }]
  },

  // Lifestyle Factors
  lifestyle: {
    sleepHours: {
      type: Number,
      min: [3, 'Sleep hours must be at least 3'],
      max: [12, 'Sleep hours must be less than 12'],
      default: 8
    },
    stressLevel: {
      type: Number,
      min: [1, 'Stress level must be between 1-10'],
      max: [10, 'Stress level must be between 1-10'],
      default: 5
    },
    smokingStatus: {
      type: String,
      enum: ['never', 'former', 'current_light', 'current_heavy'],
      default: 'never'
    },
    alcoholConsumption: {
      type: String,
      enum: ['never', 'rarely', 'occasionally', 'regularly', 'daily'],
      default: 'rarely'
    }
  },

  // Completion tracking
  completionStatus: {
    personalInfo: { type: Boolean, default: false },
    healthGoals: { type: Boolean, default: false },
    activityLevel: { type: Boolean, default: false },
    dietaryInfo: { type: Boolean, default: false },
    healthConditions: { type: Boolean, default: false },
    lifestyle: { type: Boolean, default: false }
  },

  isComplete: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Index for faster queries
profileSchema.index({ userId: 1 });

// Calculate BMI
profileSchema.virtual('bmi').get(function() {
  if (this.personalInfo.height && this.personalInfo.weight) {
    const heightInMeters = this.personalInfo.height / 100;
    return Math.round((this.personalInfo.weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }
  return null;
});

// Calculate BMI category
profileSchema.virtual('bmiCategory').get(function() {
  const bmi = this.bmi;
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
});

// Method to check if profile is complete
profileSchema.methods.checkCompletion = function() {
  const status = this.completionStatus;
  const isComplete = Object.values(status).every(step => step === true);
  this.isComplete = isComplete;
  return isComplete;
};

// Method to update completion status
profileSchema.methods.updateCompletionStatus = function() {
  this.completionStatus.personalInfo = !!(
    this.personalInfo.age && 
    this.personalInfo.gender && 
    this.personalInfo.height && 
    this.personalInfo.weight
  );
  
  this.completionStatus.healthGoals = !!(this.healthGoals.primary);
  this.completionStatus.activityLevel = !!(this.activityLevel);
  this.completionStatus.dietaryInfo = true; // Optional section
  this.completionStatus.healthConditions = true; // Optional section
  this.completionStatus.lifestyle = true; // Optional section
  
  this.checkCompletion();
};

// Pre-save middleware to update completion status
profileSchema.pre('save', function(next) {
  this.updateCompletionStatus();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
