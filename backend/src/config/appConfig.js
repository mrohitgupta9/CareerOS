// =====================================================
// Application Configuration
// =====================================================

const {
  getEnvironment,
} = require("./environment");

// =====================================================
// Application
// =====================================================

const appConfig = Object.freeze({
  environment:
    getEnvironment(),

  port:
    Number(
      process.env.PORT || 5000
    ),

  apiBaseUrl:
    process.env.API_BASE_URL ||
    "http://localhost:5000",

  version:
    process.env.APP_VERSION ||
    "0.1.0",
});

// =====================================================
// Database
// =====================================================

const databaseConfig =
  Object.freeze({
    mongoUri:
      process.env.MONGO_URI || "",
  });

// =====================================================
// Redis
// =====================================================

const redisConfig =
  Object.freeze({
    url:
      process.env.REDIS_URL ||
      "redis://localhost:6379",

    cachePrefix:
      process.env.REDIS_CACHE_PREFIX ||
      "app:cache",
  });

// =====================================================
// CORS
// =====================================================

const corsConfig =
  Object.freeze({
    origin:
      process.env.CORS_ORIGIN ||
      "http://localhost:5173",
  });

// =====================================================
// JWT
// =====================================================

const jwtConfig =
  Object.freeze({
    secret:
      process.env.JWT_SECRET || "",

    expiresIn:
      process.env.JWT_EXPIRES_IN ||
      "15m",
  });

// =====================================================
// Refresh Token
// =====================================================

const refreshTokenConfig =
  Object.freeze({
    expiresIn:
      process.env
        .REFRESH_TOKEN_EXPIRES_IN ||
      "7d",

    cookieName:
      process.env
        .REFRESH_TOKEN_COOKIE_NAME ||
      "refreshToken",
  });

// =====================================================
// Export
// =====================================================

module.exports = {
  appConfig,
  databaseConfig,
  redisConfig,
  corsConfig,
  jwtConfig,
  refreshTokenConfig,
};