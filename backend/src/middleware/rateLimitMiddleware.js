const rateLimit = require("express-rate-limit");

// =====================================================
// Global API Rate Limiter
// =====================================================

const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

// =====================================================
// Authentication Rate Limiter
// =====================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  // Strict limit for login/register endpoints
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

// =====================================================
// Export
// =====================================================

module.exports = {
  globalApiLimiter,
  authLimiter,
};