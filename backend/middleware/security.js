const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss');
const winston = require('winston');
const { getSecurityConfig, suspiciousPatterns, ipBlacklist } = require('../config/security');

// Configure Winston logger for security events
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'agfit-security' },
  transports: [
    new winston.transports.File({ filename: 'logs/security-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/security-combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  securityLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Get security configuration
const config = getSecurityConfig();

// Rate limiting configurations
const createRateLimit = (configKey, skipSuccessfulRequests = false) => {
  const rateLimitConfig = config.rateLimiting[configKey];

  return rateLimit({
    windowMs: rateLimitConfig.windowMs,
    max: rateLimitConfig.max,
    message: {
      success: false,
      message: rateLimitConfig.message,
      retryAfter: Math.ceil(rateLimitConfig.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      securityLogger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method,
        limit: rateLimitConfig.max,
        window: rateLimitConfig.windowMs
      });
      res.status(429).json({
        success: false,
        message: rateLimitConfig.message,
        retryAfter: Math.ceil(rateLimitConfig.windowMs / 1000)
      });
    }
  });
};

// Environment-specific rate limiters
const generalLimiter = createRateLimit('general');
const authLimiter = createRateLimit('auth', true);
const aiLimiter = createRateLimit('ai');
const passwordResetLimiter = createRateLimit('passwordReset');

// Slow down middleware for repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request above 50
  maxDelayMs: 20000, // maximum delay of 20 seconds
  validate: { delayMs: false } // Disable warning
});

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API compatibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user.id : null
    };

    if (res.statusCode >= 400) {
      securityLogger.warn('HTTP Error', logData);
    } else {
      securityLogger.info('HTTP Request', logData);
    }
  });

  next();
};

// Suspicious activity detection
const suspiciousActivityDetector = (req, res, next) => {
  // Skip OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Skip health check endpoints
  if (req.originalUrl === '/' || req.originalUrl === '/api/status') {
    return next();
  }

  const checkSuspicious = (value) => {
    if (!value || typeof value !== 'string') return false;
    return suspiciousPatterns.some(pattern => pattern.test(value));
  };

  let suspicious = false;
  const suspiciousData = [];

  // Check URL (but exclude normal query parameters)
  const urlWithoutQuery = req.originalUrl.split('?')[0];
  if (checkSuspicious(urlWithoutQuery)) {
    suspicious = true;
    suspiciousData.push({ type: 'URL', value: urlWithoutQuery });
  }

  // Check specific headers (exclude user-agent and common headers)
  const headersToCheck = ['x-forwarded-for', 'referer', 'x-real-ip'];
  headersToCheck.forEach(header => {
    if (req.headers[header] && checkSuspicious(req.headers[header])) {
      suspicious = true;
      suspiciousData.push({ type: 'Header', key: header, value: req.headers[header] });
    }
  });

  // Check body content
  if (req.body && typeof req.body === 'object') {
    const bodyString = JSON.stringify(req.body);
    if (checkSuspicious(bodyString)) {
      suspicious = true;
      suspiciousData.push({ type: 'Body', content: 'Contains suspicious patterns' });
    }
  }

  if (suspicious) {
    securityLogger.error('Suspicious activity detected', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      suspiciousData,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({
      success: false,
      message: 'Request contains potentially malicious content'
    });
  }

  next();
};

// IP whitelist/blacklist middleware
const ipFilter = (req, res, next) => {
  const clientIP = req.ip;

  if (ipBlacklist.includes(clientIP)) {
    securityLogger.error('Blocked IP attempt', {
      ip: clientIP,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  next();
};

module.exports = {
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
  securityLogger,
  // HTTP Parameter Pollution protection
  hppProtection: hpp()
};
