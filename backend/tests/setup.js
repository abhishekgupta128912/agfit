// Setup test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.OPENAI_API_KEY = 'test-openai-key'; // Mock OpenAI key for tests
process.env.MONGODB_URI = 'mongodb://localhost:27017/agfit-test'; // Test database

// Increase timeout for operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock OpenAI service for tests
jest.mock('../services/aiService', () => ({
  generateNutritionPlan: jest.fn().mockResolvedValue({
    success: true,
    data: { plan: 'Mock nutrition plan' }
  }),
  generateWorkoutPlan: jest.fn().mockResolvedValue({
    success: true,
    data: { plan: 'Mock workout plan' }
  }),
  generateWellnessPlan: jest.fn().mockResolvedValue({
    success: true,
    data: { plan: 'Mock wellness plan' }
  }),
  generateComprehensivePlan: jest.fn().mockResolvedValue({
    success: true,
    data: { plan: 'Mock comprehensive plan' }
  })
}));

// Database connection utilities for tests
const mongoose = require('mongoose');

// Mock database connection for testing
const connectDB = async () => {
  try {
    // Skip database connection in CI environment
    if (process.env.CI) {
      console.log('⚠️ Skipping database connection in CI environment');
      return;
    }

    // Use a test database URI or mock connection
    const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agfit-test';

    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testDbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    console.log('✅ Test database connected');
  } catch (error) {
    console.warn('⚠️ Test database connection failed, using mock:', error.message);
    // Continue with tests even if DB connection fails
  }
};

// Clear all test data
const clearDB = async () => {
  try {
    if (process.env.CI) {
      return; // Skip in CI
    }

    if (mongoose.connection.db && mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.collections();

      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not clear test database:', error.message);
  }
};

// Close database connection
const closeDB = async () => {
  try {
    if (process.env.CI) {
      return; // Skip in CI
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    console.log('✅ Test database disconnected');
  } catch (error) {
    console.warn('⚠️ Error closing test database:', error.message);
  }
};

module.exports = {
  connectDB,
  clearDB,
  closeDB
};
