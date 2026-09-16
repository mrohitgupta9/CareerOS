const {
  verifyAccessToken,
} = require("../utils/token");

// =====================================================
// Authentication Middleware
// =====================================================

const authenticate = (
  req,
  res,
  next
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token =
      authorization.split(" ")[1];

    const decoded =
      verifyAccessToken(token);

    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authenticate,
};