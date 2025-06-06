/**
 * Security Configuration
 * Environment-specific security settings
 */

const securityConfig = {
  development: {
    // Rate limiting (more lenient for development)
    rateLimiting: {
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200, // Higher limit for development
        message: 'Too many requests from this IP, please try again later.'
      },
      auth: {
        windowMs: 15 * 60 * 1000,
        max: 10, // More attempts for testing
        message: 'Too many authentication attempts, please try again later.'
      },
      ai: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20, // More AI requests for development
        message: 'AI generation limit exceeded. Please try again later.'
      },
      passwordReset: {
        windowMs: 60 * 60 * 1000,
        max: 5, // More reset attempts for testing
        message: 'Too many password reset attempts, please try again later.'
      }
    },

    // JWT settings
    jwt: {
      expiresIn: '7d', // Shorter expiration for development
      issuer: 'agfit-api-dev',
      audience: 'agfit-app-dev'
    },

    // Account security
    account: {
      maxLoginAttempts: 10, // More lenient for development
      lockTime: 5 * 60 * 1000, // 5 minutes lock
      passwordHistory: 3 // Keep fewer passwords in history
    },

    // CORS settings
    cors: {
      origins: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ],
      credentials: true
    },

    // Security headers (less strict for development)
    headers: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-eval'"], // Allow eval for development
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.openai.com", "ws:", "wss:"]
        }
      }
    },

    // Logging
    logging: {
      level: 'debug',
      console: true,
      file: true
    }
  },

  production: {
    // Rate limiting (strict for production)
    rateLimiting: {
      general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Strict limit
        message: 'Too many requests from this IP, please try again later.'
      },
      auth: {
        windowMs: 15 * 60 * 1000,
        max: 5, // Very strict for auth
        message: 'Too many authentication attempts, please try again later.'
      },
      ai: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // Limited AI requests
        message: 'AI generation limit exceeded. Please try again later.'
      },
      passwordReset: {
        windowMs: 60 * 60 * 1000,
        max: 3, // Very limited reset attempts
        message: 'Too many password reset attempts, please try again later.'
      }
    },

    // JWT settings
    jwt: {
      expiresIn: '30d',
      issuer: 'agfit-api',
      audience: 'agfit-app'
    },

    // Account security
    account: {
      maxLoginAttempts: 5, // Strict login attempts
      lockTime: 2 * 60 * 60 * 1000, // 2 hours lock
      passwordHistory: 5 // Keep more passwords in history
    },

    // CORS settings
    cors: {
      origins: [
        process.env.FRONTEND_URL,
        'https://yourdomain.com',
        'https://www.yourdomain.com'
      ].filter(Boolean), // Remove undefined values
      credentials: true
    },

    // Security headers (strict for production)
    headers: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.openai.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      }
    },

    // Logging
    logging: {
      level: 'warn',
      console: false,
      file: true
    }
  },

  test: {
    // Rate limiting (disabled for testing)
    rateLimiting: {
      general: {
        windowMs: 15 * 60 * 1000,
        max: 1000, // Very high for testing
        message: 'Too many requests from this IP, please try again later.'
      },
      auth: {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many authentication attempts, please try again later.'
      },
      ai: {
        windowMs: 60 * 60 * 1000,
        max: 100,
        message: 'AI generation limit exceeded. Please try again later.'
      },
      passwordReset: {
        windowMs: 60 * 60 * 1000,
        max: 50,
        message: 'Too many password reset attempts, please try again later.'
      }
    },

    // JWT settings
    jwt: {
      expiresIn: '1h', // Short expiration for testing
      issuer: 'agfit-api-test',
      audience: 'agfit-app-test'
    },

    // Account security
    account: {
      maxLoginAttempts: 3, // Quick testing
      lockTime: 1000, // 1 second lock for testing
      passwordHistory: 2
    },

    // CORS settings
    cors: {
      origins: ['http://localhost:3000'],
      credentials: true
    },

    // Security headers (minimal for testing)
    headers: {
      contentSecurityPolicy: false // Disable CSP for testing
    },

    // Logging
    logging: {
      level: 'error',
      console: false,
      file: false
    }
  }
};

// Get configuration for current environment
const getSecurityConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return securityConfig[env] || securityConfig.development;
};

// Validation rules
const validationRules = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  
  email: {
    maxLength: 100,
    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/
  },
  
  general: {
    maxStringLength: 1000,
    maxArrayLength: 100,
    maxObjectDepth: 5
  }
};

// Suspicious patterns to detect
const suspiciousPatterns = [
  // XSS patterns
  /(\<script[^>]*\>|\<\/script\>)/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*['"]/gi,

  // SQL injection patterns
  /(union\s+select|select\s+.*\s+from|insert\s+into|delete\s+from|drop\s+table)/gi,
  /(or\s+['"]?1['"]?\s*=\s*['"]?1['"]?|and\s+['"]?1['"]?\s*=\s*['"]?1['"]?)/gi,

  // Path traversal
  /(\.\.\/|\.\.\\)/g,

  // Command injection (more specific)
  /(\|\s*\w+|\&\&\s*\w+|\$\(\w+\)|;\s*\w+|`\w+`)/g,

  // NoSQL injection
  /(\$where\s*:|{\s*\$ne\s*:|{\s*\$gt\s*:|{\s*\$lt\s*:)/gi
];

// IP blacklist (can be extended)
const ipBlacklist = [
  // Add known malicious IPs here
  // '192.168.1.100',
  // '10.0.0.50'
];

// Security constants
const securityConstants = {
  JWT_MIN_SECRET_LENGTH: 32,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_REQUEST_SIZE: 10 * 1024 * 1024, // 10MB
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  BCRYPT_ROUNDS: 12,
  TOKEN_CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
  LOG_RETENTION_DAYS: 30
};

module.exports = {
  getSecurityConfig,
  validationRules,
  suspiciousPatterns,
  ipBlacklist,
  securityConstants
};
