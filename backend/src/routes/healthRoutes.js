const express = require("express");

const {
  healthCheck,
  readinessCheck,
} = require(
  "../controllers/healthController"
);

const router =
  express.Router();

// =====================================================
// Health
// =====================================================

router.get(
  "/",
  healthCheck
);

// =====================================================
// Readiness
// =====================================================

router.get(
  "/ready",
  readinessCheck
);

module.exports = router;