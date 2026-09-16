const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
  generateAccessToken,
  generateRefreshToken,
  generateTokenId,
  verifyToken,
} = require("../utils/generateToken");

const { getRedisClient } = require("../config/redis");

// =====================================================
// CONFIGURATION
// =====================================================

const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

// =====================================================
// HELPERS
// =====================================================

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 128) {
    return "Password cannot exceed 128 characters";
  }

  return null;
};

const getRefreshCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
  };
};

const setRefreshCookie = (res, token) => {
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    token,
    getRefreshCookieOptions()
  );
};

const clearRefreshCookie = (res) => {
  const options = getRefreshCookieOptions();

  delete options.maxAge;

  res.clearCookie(
    REFRESH_TOKEN_COOKIE_NAME,
    options
  );
};

const refreshSessionKey = (jti) => {
  return `auth:refresh:${jti}`;
};

const getRedis = () => {
  return getRedisClient();
};

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);

    // ---------------------------------------------------
    // Validate name
    // ---------------------------------------------------

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (cleanName.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 80 characters",
      });
    }

    // ---------------------------------------------------
    // Validate email
    // ---------------------------------------------------

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ---------------------------------------------------
    // Validate password
    // ---------------------------------------------------

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    // ---------------------------------------------------
    // Check existing user
    // ---------------------------------------------------

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // ---------------------------------------------------
    // Hash password
    // ---------------------------------------------------

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    // ---------------------------------------------------
    // Create user
    // ---------------------------------------------------

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: "user",
      isActive: true,
    });

    // ---------------------------------------------------
    // Generate tokens
    // ---------------------------------------------------

    const accessToken =
      generateAccessToken(user);

    const jti = generateTokenId();

    const refreshToken =
      generateRefreshToken(user, jti);

    // ---------------------------------------------------
    // Store refresh session in Redis
    // ---------------------------------------------------

    const redis = getRedis();

    await redis.set(
      refreshSessionKey(jti),
      user._id.toString(),
      {
        EX: REFRESH_TOKEN_TTL_SECONDS,
      }
    );

    // ---------------------------------------------------
    // Set refresh cookie
    // ---------------------------------------------------

    setRefreshCookie(
      res,
      refreshToken
    );

    // ---------------------------------------------------
    // Response
    // ---------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: user.toSafeObject(),
        accessToken,
      },
    });
  } catch (error) {
    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    next(error);
  }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = normalizeEmail(email);

    // ---------------------------------------------------
    // Validate input
    // ---------------------------------------------------

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ---------------------------------------------------
    // Find user
    // ---------------------------------------------------

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ---------------------------------------------------
    // Check account status
    // ---------------------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // ---------------------------------------------------
    // Compare password
    // ---------------------------------------------------

    const passwordValid =
      await user.comparePassword(password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ---------------------------------------------------
    // Update last login
    // ---------------------------------------------------

    user.lastLoginAt = new Date();

    await user.save();

    // ---------------------------------------------------
    // Generate tokens
    // ---------------------------------------------------

    const accessToken =
      generateAccessToken(user);

    const jti = generateTokenId();

    const refreshToken =
      generateRefreshToken(user, jti);

    // ---------------------------------------------------
    // Store refresh session
    // ---------------------------------------------------

    const redis = getRedis();

    await redis.set(
      refreshSessionKey(jti),
      user._id.toString(),
      {
        EX: REFRESH_TOKEN_TTL_SECONDS,
      }
    );

    // ---------------------------------------------------
    // Set cookie
    // ---------------------------------------------------

    setRefreshCookie(
      res,
      refreshToken
    );

    // ---------------------------------------------------
    // Response
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toSafeObject(),
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// REFRESH TOKEN
// =====================================================

const refresh = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.[
        REFRESH_TOKEN_COOKIE_NAME
      ];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    // ---------------------------------------------------
    // Verify refresh token
    // ---------------------------------------------------

    const decoded =
      verifyToken(refreshToken);

    if (
      decoded.type !== "refresh" ||
      !decoded.sub ||
      !decoded.jti
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // ---------------------------------------------------
    // Redis session
    // ---------------------------------------------------

    const redis = getRedis();

    const sessionKey =
      refreshSessionKey(decoded.jti);

    const sessionUserId =
      await redis.get(sessionKey);

    if (!sessionUserId) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Refresh session expired or revoked",
      });
    }

    // ---------------------------------------------------
    // Verify session ownership
    // ---------------------------------------------------

    if (sessionUserId !== decoded.sub) {
      await redis.del(sessionKey);

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh session",
      });
    }

    // ---------------------------------------------------
    // Find user
    // ---------------------------------------------------

    const user = await User.findById(
      decoded.sub
    );

    if (!user || !user.isActive) {
      await redis.del(sessionKey);

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "User account unavailable",
      });
    }

    // ---------------------------------------------------
    // Rotate refresh token
    // ---------------------------------------------------

    await redis.del(sessionKey);

    const newJti = generateTokenId();

    const newRefreshToken =
      generateRefreshToken(
        user,
        newJti
      );

    await redis.set(
      refreshSessionKey(newJti),
      user._id.toString(),
      {
        EX: REFRESH_TOKEN_TTL_SECONDS,
      }
    );

    const accessToken =
      generateAccessToken(user);

    // ---------------------------------------------------
    // Set rotated cookie
    // ---------------------------------------------------

    setRefreshCookie(
      res,
      newRefreshToken
    );

    // ---------------------------------------------------
    // Response
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        user: user.toSafeObject(),
        accessToken,
      },
    });
  } catch (error) {
    clearRefreshCookie(res);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired refresh token",
      });
    }

    next(error);
  }
};

// =====================================================
// LOGOUT
// =====================================================

const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.[
        REFRESH_TOKEN_COOKIE_NAME
      ];

    if (refreshToken) {
      try {
        const decoded =
          verifyToken(refreshToken);

        if (decoded?.jti) {
          const redis = getRedis();

          await redis.del(
            refreshSessionKey(
              decoded.jti
            )
          );
        }
      } catch {
        // Invalid/expired token.
        // Cookie will still be cleared.
      }
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CURRENT USER
// =====================================================

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
    },
  });
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};