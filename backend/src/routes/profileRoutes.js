const express = require("express");

const {
  getProfile,
  create,
  update,
  remove,
} = require("../controllers/profileController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PROFILE ROUTES
// =====================================================

// GET /api/profile
router.get(
  "/",
  protect,
  getProfile
);

// POST /api/profile
router.post(
  "/",
  protect,
  create
);

// PUT /api/profile
router.put(
  "/",
  protect,
  update
);

// DELETE /api/profile
router.delete(
  "/",
  protect,
  remove
);

module.exports = router;