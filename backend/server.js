const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import security middleware
const {
  generalLimiter,
  authLimiter,
  aiLimiter,
  passwordResetLimiter,
  speedLimiter,
  securityHeaders,
  xssProtection,
  requestLogger,
  suspiciousActivityDetector,
  ipFilter,
  hppProtection
} = require('./middleware/security');

const { sanitizeInput } = require('./middleware/validation');

const app = express();

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security middleware (order matters!)
app.use(securityHeaders); // Security headers first
app.use(ipFilter); // IP filtering
app.use(speedLimiter); // Slow down repeated requests
app.use(generalLimiter); // General rate limiting
app.use(hppProtection); // HTTP Parameter Pollution protection
app.use(suspiciousActivityDetector); // Detect malicious patterns
app.use(requestLogger); // Log all requests

// CORS configuration with enhanced security
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) only in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'https://yourusername.github.io', // Replace with your actual GitHub Pages URL
      'https://your-app-name.vercel.app', // Add your production URLs
      'https://your-app-name.netlify.app'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // In development, be more lenient
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parsing middleware with size limits
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Input sanitization
app.use(sanitizeInput);
app.use(xssProtection);

// Health check route (no rate limiting)
app.get('/', (req, res) => {
  res.json({
    message: 'AgFit API Server is running!',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status route
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'API is operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Import routes with specific rate limiting
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/ai', aiLimiter, require('./routes/ai'));
app.use('/api/progress', require('./routes/progress'));

// Password reset specific rate limiting
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api/auth/reset-password', passwordResetLimiter);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  const { securityLogger } = require('./middleware/security');

  // Log the error with context
  securityLogger.error('Application error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user._id : null,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  let statusCode = 500;
  let message = 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'PasswordReuseError') {
    statusCode = 400;
    message = 'Cannot reuse recent passwords';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// 404 handler with logging
app.use('*', (req, res) => {
  const { securityLogger } = require('./middleware/security');

  securityLogger.warn('404 - Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Database connection (commented out for initial testing)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('⚠️  MongoDB URI not provided - running without database');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('⚠️  Continuing without database connection');
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
