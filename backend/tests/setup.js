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
