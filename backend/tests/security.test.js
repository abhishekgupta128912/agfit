const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const { connectDB, clearDB, closeDB } = require('./setup');

describe('Security Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  describe('Rate Limiting', () => {
    test('should enforce general rate limiting', async () => {
      const requests = [];
      
      // Make 101 requests (exceeds limit of 100)
      for (let i = 0; i < 101; i++) {
        requests.push(request(app).get('/api/status'));
      }
      
      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 30000);

    test('should enforce auth rate limiting', async () => {
      const requests = [];
      
      // Make 6 login requests (exceeds limit of 5)
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'wrongpassword' })
        );
      }
      
      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation', () => {
    test('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'ValidPass123!',
          confirmPassword: 'ValidPass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('should reject weak passwords', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak',
          confirmPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should sanitize XSS attempts', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '<script>alert("xss")</script>',
          email: 'test@example.com',
          password: 'ValidPass123!',
          confirmPassword: 'ValidPass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('malicious content');
    });
  });

  describe('Authentication Security', () => {
    let testUser;

    beforeEach(async () => {
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'ValidPass123!'
      });
      await testUser.save();
    });

    test('should lock account after failed attempts', async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });
      }

      // 6th attempt should be locked
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(423);
      expect(response.body.message).toContain('locked');
    });

    test('should prevent password reuse', async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123!'
        });

      const token = loginResponse.body.data.token;

      // Try to change password to the same password
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'ValidPass123!',
          newPassword: 'ValidPass123!',
          confirmPassword: 'ValidPass123!'
        });

      expect(response.status).toBe(400);
    });

    test('should invalidate token on logout', async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123!'
        });

      const token = loginResponse.body.data.token;

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      // Try to use token after logout
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app).get('/');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('0');
      expect(response.headers['strict-transport-security']).toBeDefined();
    });
  });

  describe('CORS Security', () => {
    test('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/api/status')
        .set('Origin', 'https://malicious-site.com');

      expect(response.status).toBe(500); // CORS error
    });
  });

  describe('SQL Injection Prevention', () => {
    test('should prevent SQL injection in login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin@example.com' OR '1'='1",
          password: "password' OR '1'='1"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('malicious content');
    });
  });

  describe('Error Handling', () => {
    test('should not expose sensitive information in errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Route not found');
      expect(response.body.stack).toBeUndefined();
    });
  });

  describe('File Upload Security', () => {
    test('should reject malicious file uploads', async () => {
      // This test would be implemented if file upload is added
      // For now, we ensure no file upload endpoints exist
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('malicious content'), 'malicious.exe');

      expect(response.status).toBe(404);
    });
  });

  describe('Session Security', () => {
    test('should not expose session information', async () => {
      const response = await request(app).get('/');

      expect(response.headers['set-cookie']).toBeUndefined();
    });
  });

  describe('Information Disclosure', () => {
    test('should not expose server information', async () => {
      const response = await request(app).get('/');

      expect(response.headers['server']).toBeUndefined();
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    test('should not expose database errors', async () => {
      // Simulate database error by using invalid ObjectId
      const response = await request(app)
        .get('/api/profile/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid ID format');
      expect(response.body.error).not.toContain('mongoose');
      expect(response.body.error).not.toContain('mongodb');
    });
  });

  describe('Timing Attack Prevention', () => {
    test('should have consistent response times for invalid users', async () => {
      const start1 = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'another-nonexistent@example.com',
          password: 'password123'
        });
      const time2 = Date.now() - start2;

      // Response times should be similar (within 100ms)
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
  });
});
