const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['nutrition', 'workout', 'wellness', 'comprehensive'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    // For structured AI responses
    structured: {
      type: Boolean,
      default: false
    },
    // Raw AI response text
    rawContent: {
      type: String,
      required: true
    },
    // Parsed structured data (if available)
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    // Summary for quick display
    summary: {
      type: String,
      trim: true
    }
  },
  // Nutrition-specific fields
  nutrition: {
    dailyCalories: Number,
    macros: {
      protein: Number,
      carbs: Number,
      fats: Number
    },
    meals: [{
      name: String,
      time: String,
      foods: [String],
      calories: Number
    }],
    hydration: String,
    supplements: [String]
  },
  // Workout-specific fields
  workout: {
    weeklySchedule: [{
      day: String,
      duration: Number,
      exercises: [{
        name: String,
        sets: Number,
        reps: String,
        rest: String,
        notes: String
      }]
    }],
    warmup: [String],
    cooldown: [String],
    progressionNotes: String
  },
  // Wellness-specific fields
  wellness: {
    sleepRecommendations: [String],
    stressManagement: [String],
    mentalHealth: [String],
    mindfulness: [String],
    socialWellness: [String],
    habitFormation: [String]
  },
  // Metadata
  metadata: {
    aiModel: {
      type: String,
      default: 'gpt-4'
    },
    promptVersion: {
      type: String,
      default: '1.0'
    },
    generationTime: {
      type: Number, // milliseconds
      default: 0
    },
    tokensUsed: {
      type: Number,
      default: 0
    }
  },
  // User interaction
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: {
      type: Boolean
    },
    comments: {
      type: String,
      trim: true
    },
    followedPlan: {
      type: Boolean,
      default: false
    }
  },
  // Status and lifecycle
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    // Recommendations expire after 30 days by default
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  // Profile snapshot at time of generation
  profileSnapshot: {
    age: Number,
    goals: String,
    activityLevel: String,
    weight: Number,
    height: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
recommendationSchema.index({ userId: 1, type: 1 });
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ userId: 1, isActive: 1 });
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for age of recommendation
recommendationSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for time until expiration
recommendationSchema.virtual('daysUntilExpiry').get(function() {
  return Math.floor((this.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
});

// Instance methods
recommendationSchema.methods.markAsFollowed = function() {
  this.userFeedback.followedPlan = true;
  return this.save();
};

recommendationSchema.methods.addFeedback = function(rating, helpful, comments) {
  this.userFeedback.rating = rating;
  this.userFeedback.helpful = helpful;
  this.userFeedback.comments = comments;
  return this.save();
};

recommendationSchema.methods.archive = function() {
  this.status = 'archived';
  this.isActive = false;
  return this.save();
};

recommendationSchema.methods.extend = function(days = 30) {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.save();
};

// Static methods
recommendationSchema.statics.findActiveByUser = function(userId, type = null) {
  const query = { userId, isActive: true, status: 'active' };
  if (type) query.type = type;
  return this.find(query).sort({ createdAt: -1 });
};

recommendationSchema.statics.findLatestByType = function(userId, type) {
  return this.findOne({ 
    userId, 
    type, 
    isActive: true, 
    status: 'active' 
  }).sort({ createdAt: -1 });
};

recommendationSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgRating: { $avg: '$userFeedback.rating' },
        followedCount: {
          $sum: { $cond: ['$userFeedback.followedPlan', 1, 0] }
        }
      }
    }
  ]);
};

// Pre-save middleware
recommendationSchema.pre('save', function(next) {
  // Generate title if not provided
  if (!this.title) {
    const typeMap = {
      nutrition: 'Personalized Nutrition Plan',
      workout: 'Custom Workout Routine',
      wellness: 'Wellness Recommendations',
      comprehensive: 'Complete Health Plan'
    };
    this.title = typeMap[this.type] || 'Health Recommendation';
  }
  
  // Generate summary if not provided and content exists
  if (!this.content.summary && this.content.rawContent) {
    this.content.summary = this.content.rawContent.substring(0, 200) + '...';
  }
  
  next();
});

// Pre-remove middleware to clean up related data
recommendationSchema.pre('remove', function(next) {
  // Could add cleanup logic here if needed
  next();
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
