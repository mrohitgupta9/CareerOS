const crypto = require("crypto");

// =====================================================
// Refresh Token Configuration
// =====================================================

const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN ||
  "7d";

// =====================================================
// Generate Refresh Token
// =====================================================

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// =====================================================
// Hash Refresh Token
// =====================================================

const hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

// =====================================================
// Export
// =====================================================

module.exports = {
  REFRESH_TOKEN_EXPIRES_IN,
  generateRefreshToken,
  hashRefreshToken,
};