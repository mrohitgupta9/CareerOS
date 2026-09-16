// =====================================================
// Environment Configuration
// =====================================================

const REQUIRED_ENV_VARIABLES = [
  "MONGO_URI",
  "REDIS_URL",
  "CORS_ORIGIN",
  "JWT_SECRET",
];

// =====================================================
// Validate Environment
// =====================================================

const validateEnvironment = () => {
  const missingVariables =
    REQUIRED_ENV_VARIABLES.filter(
      (variable) =>
        !process.env[variable] ||
        !process.env[variable].trim()
    );

  if (
    missingVariables.length > 0
  ) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(
        ", "
      )}`
    );
  }

  // ===================================================
  // Production Validation
  // ===================================================

  if (
    process.env.NODE_ENV ===
    "production"
  ) {
    // -------------------------------------------------
    // JWT Secret
    // -------------------------------------------------

    if (
      process.env.JWT_SECRET.length <
      32
    ) {
      throw new Error(
        "JWT_SECRET must contain at least 32 characters in production"
      );
    }

    // -------------------------------------------------
    // CORS Origins
    // -------------------------------------------------

    const allowedOrigins =
      process.env.CORS_ORIGIN
        .split(",")
        .map((origin) =>
          origin.trim()
        )
        .filter(Boolean);

    for (const origin of allowedOrigins) {
      let parsedOrigin;

      try {
        parsedOrigin =
          new URL(origin);
      } catch {
        throw new Error(
          `Invalid CORS_ORIGIN: ${origin}`
        );
      }

      const isLocalOrigin =
        parsedOrigin.hostname ===
          "localhost" ||
        parsedOrigin.hostname ===
          "127.0.0.1";

      const isHttps =
        parsedOrigin.protocol ===
        "https:";

      // -----------------------------------------------
      // Local Docker production testing
      // -----------------------------------------------

      if (isLocalOrigin) {
        if (
          parsedOrigin.protocol !==
            "http:" &&
          parsedOrigin.protocol !==
            "https:"
        ) {
          throw new Error(
            `Invalid local CORS_ORIGIN protocol: ${origin}`
          );
        }

        continue;
      }

      // -----------------------------------------------
      // Real production origins
      // -----------------------------------------------

      if (!isHttps) {
        throw new Error(
          "CORS_ORIGIN must use HTTPS in production"
        );
      }
    }
  }

  return true;
};

// =====================================================
// Environment Helpers
// =====================================================

const getEnvironment = () =>
  process.env.NODE_ENV ||
  "development";

const isProduction = () =>
  getEnvironment() ===
  "production";

const isDevelopment = () =>
  getEnvironment() ===
  "development";

const isTest = () =>
  getEnvironment() ===
  "test";

// =====================================================
// Export
// =====================================================

module.exports = {
  REQUIRED_ENV_VARIABLES,
  validateEnvironment,
  getEnvironment,
  isProduction,
  isDevelopment,
  isTest,
};