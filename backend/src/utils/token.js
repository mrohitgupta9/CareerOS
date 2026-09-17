const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const JWT_ISSUER = "careeros-api";
const JWT_AUDIENCE = "careeros-client";

const generateAccessToken = (user) => {
  if (!user || !user._id) {
    throw new Error("Valid user is required to generate access token");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role || "user",
      type: "access",
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};

const verifyAccessToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Access token is required");
  }

  return jwt.verify(token, getJwtSecret(), {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};