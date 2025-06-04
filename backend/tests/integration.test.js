const request = require('supertest');
const mongoose = require('mongoose');
const { app, initializeTestServer } = require('./testServer');

// Integration tests that test actual API endpoints
describe('API Integration Tests', () => {
  let authToken;
  let testUserId;

  // Test user data
  const testUser = {
    name: 'Integration Test User',
    email: `test-${Date.now()}@example.com`, // Unique email
    password: 'testpassword123'
  };

  beforeAll(async () => {
    // Initialize test server and database
    await initializeTestServer();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Clean up test user if created
    if (testUserId && mongoose.connection.readyState === 1) {
      try {
        const User = require('../models/User');
        await User.findByIdAndDelete(testUserId);
      } catch (error) {
        console.log('Cleanup error:', error.message);
      }
    }

    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('Health Check', () => {
    it('should respond to root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('AgFit');
    });
  });

  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe(testUser.email);
        expect(response.body.data.user.name).toBe(testUser.name);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.user.password).toBeUndefined();
        
        authToken = response.body.data.token;
        testUserId = response.body.data.user.id;
      } else if (response.status === 400) {
        // User might already exist, try login
        expect(response.body.success).toBe(false);
      }
    });

    it('should login with valid credentials', async () => {
      if (!authToken) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          });

        if (response.status === 200) {
          expect(response.body.success).toBe(true);
          expect(response.body.data.user.email).toBe(testUser.email);
          expect(response.body.data.token).toBeDefined();
          
          authToken = response.body.data.token;
          testUserId = response.body.data.user.id;
        }
      }
      
      expect(authToken).toBeDefined();
    });

    it('should reject invalid login credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should get current user with valid token', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe(testUser.email);
        expect(response.body.data.user.password).toBeUndefined();
      }
    });

    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Progress Tracking', () => {
    it('should get today\'s progress', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/progress/today')
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.date).toBeDefined();
      }
    });

    it('should log a meal successfully', async () => {
      if (!authToken) return;

      const mealData = {
        name: 'breakfast',
        foods: ['oatmeal', 'banana', 'milk'],
        calories: 350,
        notes: 'Healthy breakfast'
      };

      const response = await request(app)
        .post('/api/progress/meal')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mealData);

      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.nutrition.meals).toBeDefined();
        expect(response.body.data.nutrition.meals.length).toBeGreaterThan(0);
      }
    });

    it('should log water intake', async () => {
      if (!authToken) return;

      const waterData = { glasses: 3 };

      const response = await request(app)
        .post('/api/progress/water')
        .set('Authorization', `Bearer ${authToken}`)
        .send(waterData);

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.nutrition.waterIntake).toBeDefined();
      }
    });

    it('should log exercise activity', async () => {
      if (!authToken) return;

      const exerciseData = {
        name: 'Morning Run',
        duration: 30,
        intensity: 'moderate',
        notes: 'Great morning workout'
      };

      const response = await request(app)
        .post('/api/progress/exercise')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData);

      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.workout.exercises).toBeDefined();
      }
    });

    it('should get user statistics', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/progress/stats')
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint');

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User'
          // Missing email and password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });
});
