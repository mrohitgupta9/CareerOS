const {
  refreshTokenCookieOptions,
} = require("./cookie");

// =====================================================
// Clear Refresh Token Cookie
// =====================================================

const clearRefreshTokenCookie = (
  res
) => {
  res.clearCookie(
    process.env.REFRESH_TOKEN_COOKIE_NAME ||
      "refreshToken",
    {
      ...refreshTokenCookieOptions,
      maxAge: undefined,
    }
  );
};

module.exports = {
  clearRefreshTokenCookie,
};