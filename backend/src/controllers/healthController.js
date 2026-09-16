const mongoose = require("mongoose");

const {
  getDatabaseStatus,
} = require("../config/database");

const {
  getRedisStatus,
} = require("../config/redis");

const {
  HEALTH_CONFIG,
} = require("../config/health");

// =====================================================
// Health Check
// =====================================================

const healthCheck = (
  req,
  res
) => {
  return res.status(200).json({
    success: true,

    status: "ok",

    service:
      HEALTH_CONFIG.SERVICE_NAME,

    version:
      HEALTH_CONFIG.VERSION,

    timestamp:
      new Date().toISOString(),

    requestId:
      req.requestId || null,
  });
};

// =====================================================
// Readiness Check
// =====================================================

const readinessCheck = (
  req,
  res
) => {
  const database =
    getDatabaseStatus();

  const redis =
    getRedisStatus();

  const databaseReady =
    mongoose.connection.readyState === 1;

  const redisReady =
    redis.ready === true;

  const ready =
    databaseReady &&
    redisReady;

  return res
    .status(
      ready ? 200 : 503
    )
    .json({
      success: ready,

      status:
        ready
          ? "ready"
          : "not_ready",

      service:
        HEALTH_CONFIG.SERVICE_NAME,

      version:
        HEALTH_CONFIG.VERSION,

      timestamp:
        new Date().toISOString(),

      dependencies: {
        database: {
          status:
            database.status,

          ready:
            databaseReady,
        },

        redis: {
          status:
            redis.status,

          ready:
            redisReady,
        },
      },

      requestId:
        req.requestId || null,
    });
};

// =====================================================
// Export
// =====================================================

module.exports = {
  healthCheck,
  readinessCheck,
};