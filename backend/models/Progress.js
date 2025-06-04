const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  // Daily nutrition tracking
  nutrition: {
    meals: [{
      name: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
      },
      foods: [String],
      calories: {
        type: Number,
        min: 0
      },
      completed: {
        type: Boolean,
        default: false
      },
      notes: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    waterIntake: {
      glasses: {
        type: Number,
        default: 0,
        min: 0,
        max: 20
      },
      target: {
        type: Number,
        default: 8
      }
    },
    supplements: [{
      name: String,
      taken: {
        type: Boolean,
        default: false
      },
      time: Date
    }],
    totalCalories: {
      type: Number,
      default: 0
    },
    adherenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  // Daily workout tracking
  workout: {
    exercises: [{
      name: String,
      sets: Number,
      reps: String,
      weight: Number,
      duration: Number, // in minutes
      completed: {
        type: Boolean,
        default: false
      },
      notes: String
    }],
    totalDuration: {
      type: Number,
      default: 0 // in minutes
    },
    caloriesBurned: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    adherenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  // Wellness tracking
  wellness: {
    sleep: {
      hours: {
        type: Number,
        min: 0,
        max: 24
      },
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      },
      bedtime: Date,
      wakeTime: Date
    },
    mood: {
      type: String,
      enum: ['very-low', 'low', 'neutral', 'good', 'excellent']
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10
    },
    energy: {
      type: Number,
      min: 1,
      max: 10
    },
    meditation: {
      minutes: {
        type: Number,
        default: 0
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  },
  // Overall daily metrics
  metrics: {
    overallAdherence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    goalsCompleted: {
      type: Number,
      default: 0
    },
    totalGoals: {
      type: Number,
      default: 0
    },
    streakDay: {
      type: Boolean,
      default: false
    }
  },
  // Notes and reflections
  notes: {
    daily: String,
    challenges: String,
    wins: String,
    tomorrowGoals: String
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, date: 1 }, { unique: true });

// Pre-save middleware to update timestamps and calculate metrics
progressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate overall adherence score
  const nutritionScore = this.nutrition.adherenceScore || 0;
  const workoutScore = this.workout.adherenceScore || 0;
  
  this.metrics.overallAdherence = Math.round((nutritionScore + workoutScore) / 2);
  
  // Calculate goals completed
  let completed = 0;
  let total = 0;
  
  // Count nutrition goals
  if (this.nutrition.meals && this.nutrition.meals.length > 0) {
    total += this.nutrition.meals.length;
    completed += this.nutrition.meals.filter(meal => meal.completed).length;
  }
  
  // Count workout goals
  if (this.workout.exercises && this.workout.exercises.length > 0) {
    total += this.workout.exercises.length;
    completed += this.workout.exercises.filter(exercise => exercise.completed).length;
  }
  
  // Count wellness goals
  if (this.wellness.meditation && this.wellness.meditation.completed) {
    total += 1;
    completed += 1;
  }
  
  this.metrics.goalsCompleted = completed;
  this.metrics.totalGoals = total;
  
  // Determine if this is a streak day (>= 70% adherence)
  this.metrics.streakDay = this.metrics.overallAdherence >= 70;
  
  next();
});

// Static method to get user's current streak
progressSchema.statics.getCurrentStreak = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const progressEntries = await this.find({
    userId,
    date: { $lte: today }
  }).sort({ date: -1 }).limit(30);
  
  let streak = 0;
  for (const entry of progressEntries) {
    if (entry.metrics.streakDay) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Static method to get weekly stats
progressSchema.statics.getWeeklyStats = async function(userId, startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        avgAdherence: { $avg: '$metrics.overallAdherence' },
        totalGoalsCompleted: { $sum: '$metrics.goalsCompleted' },
        totalGoals: { $sum: '$metrics.totalGoals' },
        streakDays: { $sum: { $cond: ['$metrics.streakDay', 1, 0] } },
        totalDays: { $sum: 1 }
      }
    }
  ]);
  
  return stats[0] || {
    avgAdherence: 0,
    totalGoalsCompleted: 0,
    totalGoals: 0,
    streakDays: 0,
    totalDays: 0
  };
};

module.exports = mongoose.model('Progress', progressSchema);
