const express = require('express');
const cors = require('cors');
const connectDB = require('../config/database');

// Import routes
const authRoutes = require('../routes/auth');
const profileRoutes = require('../routes/profile');
const progressRoutes = require('../routes/progress');
const aiRoutes = require('../routes/ai');

// Create Express app for testing
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AgFit API Test Server',
    version: '1.0.0',
    status: 'running'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to database for tests
const initializeTestServer = async () => {
  try {
    await connectDB();
    console.log('Test database connected');
    return true;
  } catch (error) {
    console.error('Test database connection failed:', error);
    console.log('Running tests without database connection (some tests may be skipped)');
    return false;
  }
};

// Initialize if this file is run directly
if (require.main === module) {
  initializeTestServer();
}

module.exports = { app, initializeTestServer };
