const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s'-]+$/.test(v);
      },
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't include password in queries by default
    validate: {
      validator: function(v) {
        // Strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  securityQuestions: [{
    question: String,
    answer: {
      type: String,
      select: false
    }
  }],
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    success: Boolean
  }],
  passwordHistory: [{
    password: {
      type: String,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for faster queries and security
userSchema.index({ email: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ lockUntil: 1 });

// Constants for account locking
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving with password history
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Check password history (prevent reusing last 5 passwords)
    if (this.passwordHistory && this.passwordHistory.length > 0) {
      for (const oldPassword of this.passwordHistory.slice(-5)) {
        const isReused = await bcrypt.compare(this.password, oldPassword.password);
        if (isReused) {
          const error = new Error('Cannot reuse recent passwords');
          error.name = 'PasswordReuseError';
          return next(error);
        }
      }
    }

    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Add current password to history before updating
    if (this.isNew || this.password !== hashedPassword) {
      this.passwordHistory = this.passwordHistory || [];
      if (this.password && !this.isNew) {
        this.passwordHistory.push({
          password: this.password,
          createdAt: new Date()
        });
      }

      // Keep only last 10 passwords in history
      if (this.passwordHistory.length > 10) {
        this.passwordHistory = this.passwordHistory.slice(-10);
      }
    }

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password with account locking
userSchema.methods.matchPassword = async function(enteredPassword) {
  // If account is locked, don't allow password check
  if (this.isLocked) {
    return false;
  }

  const isMatch = await bcrypt.compare(enteredPassword, this.password);

  // If password doesn't match, increment login attempts
  if (!isMatch) {
    this.loginAttempts = (this.loginAttempts || 0) + 1;

    // Lock account if max attempts reached
    if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      this.lockUntil = Date.now() + LOCK_TIME;
    }

    await this.save();
    return false;
  }

  // If password matches and account was locked, unlock it
  if (this.loginAttempts > 0 || this.lockUntil) {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save();
  }

  return true;
};

// Method to record login attempt
userSchema.methods.recordLoginAttempt = async function(ip, userAgent, success) {
  this.loginHistory = this.loginHistory || [];
  this.loginHistory.push({
    ip,
    userAgent,
    timestamp: new Date(),
    success
  });

  // Keep only last 50 login attempts
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }

  if (success) {
    this.lastLogin = new Date();
  }

  await this.save();
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  return verificationToken;
};

// Instance method to get user data without sensitive info
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.twoFactorSecret;
  delete userObject.securityQuestions;
  delete userObject.passwordHistory;
  delete userObject.loginHistory;
  return userObject;
};

// Method to get safe user data for responses
userSchema.methods.getSafeUserData = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    profileCompleted: this.profileCompleted,
    emailVerified: this.emailVerified,
    twoFactorEnabled: this.twoFactorEnabled,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by reset token
userSchema.statics.findByPasswordResetToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
};

// Static method to find by email verification token
userSchema.statics.findByEmailVerificationToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    emailVerificationToken: hashedToken
  });
};

// Method to check for suspicious login patterns
userSchema.methods.checkSuspiciousActivity = function(ip, userAgent) {
  if (!this.loginHistory || this.loginHistory.length === 0) {
    return { suspicious: false };
  }

  const recentLogins = this.loginHistory.slice(-10);
  const uniqueIPs = [...new Set(recentLogins.map(login => login.ip))];
  const uniqueUserAgents = [...new Set(recentLogins.map(login => login.userAgent))];

  // Check for multiple IPs in short time
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const recentIPLogins = recentLogins.filter(login =>
    login.timestamp > oneHourAgo && login.ip !== ip
  );

  const suspicious = {
    suspicious: false,
    reasons: []
  };

  if (uniqueIPs.length > 5) {
    suspicious.suspicious = true;
    suspicious.reasons.push('Multiple IP addresses');
  }

  if (uniqueUserAgents.length > 3) {
    suspicious.suspicious = true;
    suspicious.reasons.push('Multiple user agents');
  }

  if (recentIPLogins.length > 0) {
    suspicious.suspicious = true;
    suspicious.reasons.push('Login from different IP within 1 hour');
  }

  return suspicious;
};

// Method to unlock account (admin function)
userSchema.methods.unlockAccount = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
