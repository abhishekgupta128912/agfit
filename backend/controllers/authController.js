const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { securityLogger } = require('../middleware/security');

// Enhanced JWT secret validation
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'fallback_secret_key' || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
  }
  return secret;
};

// Generate JWT Token with enhanced security
const generateToken = (id) => {
  return jwt.sign(
    {
      id,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomBytes(16).toString('hex') // JWT ID for token tracking
    },
    getJWTSecret(),
    {
      expiresIn: '30d',
      issuer: 'agfit-api',
      audience: 'agfit-app'
    }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.ip;
    const userAgent = req.get('User-Agent');

    // Check for user and include password for comparison
    const user = await User.findByEmail(email).select('+password');

    if (!user) {
      securityLogger.warn('Login attempt with non-existent email', {
        email,
        ip: clientIP,
        userAgent
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      securityLogger.warn('Login attempt on locked account', {
        userId: user._id,
        email: user.email,
        ip: clientIP,
        userAgent,
        lockUntil: user.lockUntil
      });

      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      securityLogger.warn('Login attempt on inactive account', {
        userId: user._id,
        email: user.email,
        ip: clientIP,
        userAgent
      });

      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password (this will handle account locking internally)
    const isPasswordMatch = await user.matchPassword(password);

    // Record login attempt
    await user.recordLoginAttempt(clientIP, userAgent, isPasswordMatch);

    if (!isPasswordMatch) {
      securityLogger.warn('Failed login attempt', {
        userId: user._id,
        email: user.email,
        ip: clientIP,
        userAgent,
        loginAttempts: user.loginAttempts
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check for suspicious activity
    const suspiciousActivity = user.checkSuspiciousActivity(clientIP, userAgent);
    if (suspiciousActivity.suspicious) {
      securityLogger.warn('Suspicious login activity detected', {
        userId: user._id,
        email: user.email,
        ip: clientIP,
        userAgent,
        reasons: suspiciousActivity.reasons
      });

      // You might want to require additional verification here
      // For now, we'll just log it and continue
    }

    // Generate token
    const token = generateToken(user._id);

    // Log successful login
    securityLogger.info('Successful login', {
      userId: user._id,
      email: user.email,
      ip: clientIP,
      userAgent
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getSafeUserData(),
        token
      }
    });

  } catch (error) {
    securityLogger.error('Login error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (10 minutes)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send email with reset link
    // For now, we'll just log the token (in production, send via email)
    console.log('Password reset token:', resetToken);
    console.log('Reset URL would be:', `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending password reset email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide token and new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new JWT token
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword
};
