// =====================================================
// Health Check Configuration
// =====================================================

const HEALTH_CONFIG = Object.freeze({
  SERVICE_NAME:
    "application",

  VERSION:
    process.env.APP_VERSION ||
    "0.1.0",

  READINESS_TIMEOUT_MS: 5000,
});

module.exports = {
  HEALTH_CONFIG,
};