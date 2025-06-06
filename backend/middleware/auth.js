const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { securityLogger } = require('./security');

// Token blacklist (in production, use Redis or database)
const tokenBlacklist = new Set();

// Add token to blacklist
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Enhanced JWT secret validation
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'fallback_secret_key' || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
  }
  return secret;
};

// Protect routes - verify JWT token with enhanced security
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      if (isTokenBlacklisted(token)) {
        securityLogger.warn('Blacklisted token used', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          token: token.substring(0, 20) + '...'
        });

        return res.status(401).json({
          success: false,
          message: 'Token has been revoked'
        });
      }

      // Verify token with enhanced secret validation
      const decoded = jwt.verify(token, getJWTSecret());

      // Check token age (optional: implement token refresh)
      const tokenAge = Date.now() / 1000 - decoded.iat;
      const maxTokenAge = 30 * 24 * 60 * 60; // 30 days in seconds

      if (tokenAge > maxTokenAge) {
        securityLogger.warn('Expired token used', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: decoded.id,
          tokenAge: Math.floor(tokenAge / 86400) + ' days'
        });

        return res.status(401).json({
          success: false,
          message: 'Token has expired, please login again'
        });
      }

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        securityLogger.warn('Token with non-existent user', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: decoded.id
        });

        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        securityLogger.warn('Inactive user attempted access', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: req.user._id
        });

        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Check for suspicious login patterns
      const lastLogin = req.user.lastLogin;
      if (lastLogin) {
        const timeSinceLastLogin = Date.now() - lastLogin.getTime();
        const oneHour = 60 * 60 * 1000;

        // If last login was more than 1 hour ago, log this access
        if (timeSinceLastLogin > oneHour) {
          securityLogger.info('User access after extended period', {
            userId: req.user._id,
            email: req.user.email,
            lastLogin: lastLogin,
            ip: req.ip,
            userAgent: req.get('User-Agent')
          });
        }
      }

      // Store token in request for potential blacklisting
      req.token = token;

      next();
    } catch (error) {
      securityLogger.error('Token verification error', {
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        token: token ? token.substring(0, 20) + '...' : 'none'
      });

      let message = 'Not authorized';
      let statusCode = 401;

      if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token';
      } else if (error.name === 'TokenExpiredError') {
        message = 'Token expired';
      } else if (error.message.includes('JWT_SECRET')) {
        message = 'Authentication service unavailable';
        statusCode = 503;
      }

      return res.status(statusCode).json({
        success: false,
        message
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

// Admin only access with enhanced logging
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    securityLogger.info('Admin access granted', {
      userId: req.user._id,
      email: req.user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl
    });
    next();
  } else {
    securityLogger.warn('Unauthorized admin access attempt', {
      userId: req.user ? req.user._id : null,
      email: req.user ? req.user.email : null,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl
    });

    res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

// Optional auth - doesn't fail if no token (with security logging)
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      if (isTokenBlacklisted(token)) {
        req.user = null;
        return next();
      }

      const decoded = jwt.verify(token, getJWTSecret());
      req.user = await User.findById(decoded.id).select('-password');

      if (req.user && !req.user.isActive) {
        req.user = null;
      }
    } catch (error) {
      // Continue without user if token is invalid
      req.user = null;
    }
  }

  next();
};

// Logout middleware - blacklist token
const logout = (req, res, next) => {
  if (req.token) {
    blacklistToken(req.token);
    securityLogger.info('User logged out', {
      userId: req.user ? req.user._id : null,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }
  next();
};

// Check if user owns resource
const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    // For route parameters
    if (req.params.userId && req.params.userId !== req.user._id.toString()) {
      securityLogger.warn('Unauthorized resource access attempt', {
        userId: req.user._id,
        attemptedUserId: req.params.userId,
        ip: req.ip,
        endpoint: req.originalUrl
      });

      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) return next();

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (userRequests.has(userId)) {
      const requests = userRequests.get(userId).filter(time => time > windowStart);
      userRequests.set(userId, requests);
    } else {
      userRequests.set(userId, []);
    }

    const userRequestCount = userRequests.get(userId).length;

    if (userRequestCount >= maxRequests) {
      securityLogger.warn('User rate limit exceeded', {
        userId: userId,
        requestCount: userRequestCount,
        ip: req.ip,
        endpoint: req.originalUrl
      });

      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please slow down.'
      });
    }

    // Add current request
    userRequests.get(userId).push(now);
    next();
  };
};

module.exports = {
  protect,
  admin,
  optionalAuth,
  logout,
  checkResourceOwnership,
  userRateLimit,
  blacklistToken,
  isTokenBlacklisted
};
