const jwt = require("jsonwebtoken");

// =====================================================
// ACCESS TOKEN
// =====================================================

const generateAccessToken = (user) => {
  if (!user || !user._id) {
    throw new Error(
      "User is required to generate access token"
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  const jwtExpiresIn =
    process.env.JWT_EXPIRES_IN || "15m";

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is not defined in environment variables"
    );
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      type: "access",
    },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn,
      issuer: "careeros-api",
      audience: "careeros-client",
    }
  );
};

// =====================================================
// REFRESH TOKEN
// =====================================================

const generateRefreshToken = (user) => {
  if (!user || !user._id) {
    throw new Error(
      "User is required to generate refresh token"
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  const refreshTokenExpiresIn =
    process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is not defined in environment variables"
    );
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      type: "refresh",
    },
    jwtSecret,
    {
      expiresIn: refreshTokenExpiresIn,
      issuer: "careeros-api",
      audience: "careeros-client",
    }
  );
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};