// =====================================================
// Cookie Configuration
// =====================================================

const {
  isProduction,
} = require("./environment");

const {
  refreshTokenConfig,
} = require("./appConfig");

// =====================================================
// Refresh Token Cookie
// =====================================================

const refreshTokenCookieOptions =
  Object.freeze({
    httpOnly: true,

    secure:
      isProduction(),

    sameSite:
      isProduction()
        ? "strict"
        : "lax",

    path: "/",

    maxAge:
      7 * 24 * 60 * 60 * 1000,
  });

// =====================================================
// Cookie Name
// =====================================================

const refreshTokenCookieName =
  refreshTokenConfig.cookieName;

// =====================================================
// Export
// =====================================================

module.exports = {
  refreshTokenCookieOptions,
  refreshTokenCookieName,
};