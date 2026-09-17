const jwt = require("jsonwebtoken");

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const protect = (req, res, next) => {
  try {
    // -------------------------------------------------
    // 1. Get Authorization Header
    // -------------------------------------------------

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -------------------------------------------------
    // 2. Validate Bearer Token Format
    // -------------------------------------------------

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token format",
      });
    }

    // -------------------------------------------------
    // 3. Validate JWT Secret
    // -------------------------------------------------

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next(
        new Error(
          "JWT_SECRET is not defined in environment variables"
        )
      );
    }

    // -------------------------------------------------
    // 4. Verify JWT
    // -------------------------------------------------

    const decoded = jwt.verify(token, jwtSecret, {
      issuer: "careeros-api",
      audience: "careeros-client",
    });

    // -------------------------------------------------
    // 5. Attach Authenticated User Information
    // -------------------------------------------------

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // -------------------------------------------------
    // 6. Continue to Protected Route
    // -------------------------------------------------

    next();
  } catch (error) {
    // -------------------------------------------------
    // JWT Errors
    // -------------------------------------------------

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    next(error);
  }
};

module.exports = {
  protect,
};