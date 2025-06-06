const axios = require('axios');
const { securityLogger } = require('./security');

/**
 * reCAPTCHA v3 Verification Middleware
 * Verifies reCAPTCHA tokens sent from the frontend
 */

// reCAPTCHA verification function
const verifyRecaptcha = async (token, remoteip = null) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('RECAPTCHA_SECRET_KEY is not configured');
    }

    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
    
    const params = new URLSearchParams({
      secret: secretKey,
      response: token
    });

    // Add remote IP if provided
    if (remoteip) {
      params.append('remoteip', remoteip);
    }

    const response = await axios.post(verificationURL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000 // 10 second timeout
    });

    return response.data;
  } catch (error) {
    securityLogger.error('reCAPTCHA verification error', {
      error: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      'error-codes': ['network-error']
    };
  }
};

/**
 * Middleware to verify reCAPTCHA v3 token
 * @param {number} minScore - Minimum score required (0.0 to 1.0)
 * @param {string} expectedAction - Expected action name
 */
const recaptchaMiddleware = (minScore = 0.5, expectedAction = null) => {
  return async (req, res, next) => {
    try {
      // Skip reCAPTCHA in test environment
      if (process.env.NODE_ENV === 'test') {
        return next();
      }

      const recaptchaToken = req.body.recaptchaToken || req.headers['x-recaptcha-token'];
      
      if (!recaptchaToken) {
        securityLogger.warn('Missing reCAPTCHA token', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.originalUrl
        });

        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification required'
        });
      }

      // Verify the token with Google
      const clientIP = req.ip;
      const verificationResult = await verifyRecaptcha(recaptchaToken, clientIP);

      if (!verificationResult.success) {
        securityLogger.warn('reCAPTCHA verification failed', {
          ip: clientIP,
          userAgent: req.get('User-Agent'),
          endpoint: req.originalUrl,
          errorCodes: verificationResult['error-codes']
        });

        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification failed',
          errors: verificationResult['error-codes']
        });
      }

      // Check score (for v3)
      if (verificationResult.score !== undefined) {
        if (verificationResult.score < minScore) {
          securityLogger.warn('reCAPTCHA score too low', {
            ip: clientIP,
            userAgent: req.get('User-Agent'),
            endpoint: req.originalUrl,
            score: verificationResult.score,
            minScore: minScore
          });

          return res.status(400).json({
            success: false,
            message: 'reCAPTCHA verification failed - suspicious activity detected'
          });
        }
      }

      // Check action (for v3)
      if (expectedAction && verificationResult.action !== expectedAction) {
        securityLogger.warn('reCAPTCHA action mismatch', {
          ip: clientIP,
          userAgent: req.get('User-Agent'),
          endpoint: req.originalUrl,
          expectedAction: expectedAction,
          actualAction: verificationResult.action
        });

        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification failed - invalid action'
        });
      }

      // Log successful verification
      securityLogger.info('reCAPTCHA verification successful', {
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        score: verificationResult.score,
        action: verificationResult.action
      });

      // Add verification result to request for further processing
      req.recaptcha = {
        success: true,
        score: verificationResult.score,
        action: verificationResult.action,
        challenge_ts: verificationResult.challenge_ts,
        hostname: verificationResult.hostname
      };

      next();
    } catch (error) {
      securityLogger.error('reCAPTCHA middleware error', {
        error: error.message,
        stack: error.stack,
        ip: req.ip,
        endpoint: req.originalUrl
      });

      return res.status(500).json({
        success: false,
        message: 'reCAPTCHA verification error'
      });
    }
  };
};

/**
 * Predefined middleware configurations for different use cases
 */
const recaptchaConfigs = {
  // High security for login attempts
  login: recaptchaMiddleware(0.7, 'login'),
  
  // Medium security for registration
  register: recaptchaMiddleware(0.5, 'register'),
  
  // Medium security for password reset
  forgotPassword: recaptchaMiddleware(0.5, 'forgot_password'),
  
  // Low security for general forms
  general: recaptchaMiddleware(0.3),
  
  // Custom configuration
  custom: (minScore, expectedAction) => recaptchaMiddleware(minScore, expectedAction)
};

module.exports = {
  verifyRecaptcha,
  recaptchaMiddleware,
  recaptchaConfigs
};
