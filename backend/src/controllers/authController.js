const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshSession = require("../models/RefreshSession");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../validators/authValidator");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const {
  hashToken,
} = require("../utils/hashToken");

// =====================================================
// CONFIG
// =====================================================

const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME ||
  "careeros_refresh_token";

const isProduction =
  process.env.NODE_ENV === "production";

// =====================================================
// REFRESH COOKIE OPTIONS
// =====================================================

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// =====================================================
// GET REFRESH TOKEN EXPIRATION
// =====================================================

const getRefreshTokenExpiry = (refreshToken) => {
  const decoded = jwt.decode(refreshToken);

  if (!decoded || !decoded.exp) {
    throw new Error(
      "Invalid refresh token expiration"
    );
  }

  return new Date(decoded.exp * 1000);
};

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

const register = async (req, res, next) => {
  try {
    const validation = validateRegisterInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      name,
      email,
      password,
    } = validation.data;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "user",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
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
// POST /api/auth/login
// =====================================================

const login = async (req, res, next) => {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      email,
      password,
    } = validation.data;

    const user = await User.findOne({
      email,
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    const passwordMatches =
      await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLoginAt = new Date();

    await user.save();

    // -------------------------------------------------
    // Generate Tokens
    // -------------------------------------------------

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    // -------------------------------------------------
    // Store Refresh Token Hash
    // -------------------------------------------------

    const tokenHash =
      hashToken(refreshToken);

    const expiresAt =
      getRefreshTokenExpiry(refreshToken);

    await RefreshSession.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    // -------------------------------------------------
    // Set HttpOnly Cookie
    // -------------------------------------------------

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      getRefreshCookieOptions()
    );

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

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
// REFRESH ACCESS TOKEN
// POST /api/auth/refresh
// =====================================================

const refresh = async (req, res, next) => {
  try {
    // -------------------------------------------------
    // Get Refresh Token From Cookie
    // -------------------------------------------------

    const refreshToken =
      req.cookies?.[
        REFRESH_TOKEN_COOKIE_NAME
      ];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // -------------------------------------------------
    // Verify JWT
    // -------------------------------------------------

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next(
        new Error(
          "JWT_SECRET is not defined in environment variables"
        )
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        jwtSecret,
        {
          issuer: "careeros-api",
          audience: "careeros-client",
        }
      );
    } catch (error) {
      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired refresh token",
      });
    }

    // -------------------------------------------------
    // Verify Token Type
    // -------------------------------------------------

    if (
      decoded.type !== "refresh" ||
      !decoded.userId
    ) {
      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired refresh token",
      });
    }

    // -------------------------------------------------
    // Find Refresh Session
    // -------------------------------------------------

    const tokenHash =
      hashToken(refreshToken);

    const session =
      await RefreshSession.findOne({
        user: decoded.userId,
        tokenHash,
        revokedAt: null,
        expiresAt: {
          $gt: new Date(),
        },
      }).select("+tokenHash");

    if (!session) {
      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired refresh token",
      });
    }

    // -------------------------------------------------
    // Find User
    // -------------------------------------------------

    const user = await User.findById(
      decoded.userId
    );

    if (!user || !user.isActive) {
      session.revokedAt = new Date();
      await session.save();

      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getRefreshCookieOptions()
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired refresh token",
      });
    }

    // -------------------------------------------------
    // Generate New Token Pair
    // -------------------------------------------------

    const newAccessToken =
      generateAccessToken(user);

    const newRefreshToken =
      generateRefreshToken(user);

    // -------------------------------------------------
    // Revoke Old Refresh Session
    // -------------------------------------------------

    session.revokedAt = new Date();

    await session.save();

    // -------------------------------------------------
    // Store New Refresh Session
    // -------------------------------------------------

    const newTokenHash =
      hashToken(newRefreshToken);

    const newExpiresAt =
      getRefreshTokenExpiry(
        newRefreshToken
      );

    await RefreshSession.create({
      user: user._id,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
    });

    // -------------------------------------------------
    // Replace Refresh Cookie
    // -------------------------------------------------

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      newRefreshToken,
      getRefreshCookieOptions()
    );

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// LOGOUT
// POST /api/auth/logout
// =====================================================

const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);

      await RefreshSession.findOneAndUpdate(
        {
          tokenHash,
          revokedAt: null,
        },
        {
          revokedAt: new Date(),
        }
      );
    }

    res.clearCookie(
      REFRESH_TOKEN_COOKIE_NAME,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Authenticated user retrieved successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
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