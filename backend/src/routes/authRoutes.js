const express = require("express");

const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Register
router.post(
  "/register",
  register
);

// Login
router.post(
  "/login",
  login
);

// Refresh access token
router.post(
  "/refresh",
  refresh
);

// Logout
router.post(
  "/logout",
  logout
);

// =====================================================
// PROTECTED ROUTES
// =====================================================

// Current authenticated user
router.get(
  "/me",
  protect,
  getMe
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;