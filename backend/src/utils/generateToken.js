const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const appConfig = require("../config/appConfig");

// =====================================================
// Token Configuration
// =====================================================

const ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "15m";

const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// =====================================================
// Generate Access Token
// =====================================================

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      type: "access",
    },
    appConfig.jwtSecret,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

// =====================================================
// Generate Refresh Token
// =====================================================

const generateRefreshToken = (user, jti) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      jti,
      type: "refresh",
    },
    appConfig.jwtSecret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

// =====================================================
// Generate Refresh Token ID
// =====================================================

const generateTokenId = () => {
  return crypto.randomUUID();
};

// =====================================================
// Verify Token
// =====================================================

const verifyToken = (token) => {
  return jwt.verify(token, appConfig.jwtSecret);
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenId,
  verifyToken,
};