// =====================================================
// SECURITY CONFIGURATION
// =====================================================

const isProduction =
  process.env.NODE_ENV === "production";

// =====================================================
// CORS ORIGINS
// =====================================================

const getAllowedOrigins = () => {
  const corsOrigin =
    process.env.CORS_ORIGIN ||
    (isProduction
      ? ""
      : "http://localhost:5173");

  return corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins =
  getAllowedOrigins();

// =====================================================
// CORS ORIGIN VALIDATION
// =====================================================

const validateProductionOrigins = () => {
  if (!isProduction) {
    return;
  }

  for (const origin of allowedOrigins) {
    let parsedOrigin;

    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error(
        `Invalid CORS_ORIGIN: ${origin}`
      );
    }

    const isLocalOrigin =
      parsedOrigin.hostname === "localhost" ||
      parsedOrigin.hostname === "127.0.0.1";

    const isHttps =
      parsedOrigin.protocol === "https:";

    // -------------------------------------------------
    // Production local Docker testing
    // -------------------------------------------------

    if (isLocalOrigin) {
      if (
        parsedOrigin.protocol !== "http:" &&
        parsedOrigin.protocol !== "https:"
      ) {
        throw new Error(
          `Invalid local CORS_ORIGIN protocol: ${origin}`
        );
      }

      continue;
    }

    // -------------------------------------------------
    // Real production origins must use HTTPS
    // -------------------------------------------------

    if (!isHttps) {
      throw new Error(
        "CORS_ORIGIN must use HTTPS in production"
      );
    }
  }
};

validateProductionOrigins();

// =====================================================
// CORS OPTIONS
// =====================================================

const corsOptions = {
  origin: (
    origin,
    callback
  ) => {

    // Allow requests with no Origin header.
    //
    // Examples:
    // - Postman
    // - curl
    // - server-to-server requests
    //
    if (!origin) {
      return callback(
        null,
        true
      );
    }

    if (
      allowedOrigins.includes(origin)
    ) {
      return callback(
        null,
        true
      );
    }

    const error =
      new Error(
        "Origin not allowed by CORS"
      );

    error.status = 403;

    return callback(
      error
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Request-ID",
  ],

  exposedHeaders: [
    "X-Request-ID",
  ],

  optionsSuccessStatus: 204,

  maxAge: 600,
};

// =====================================================
// HELMET
// =====================================================

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
      ],

      baseUri: [
        "'self'",
      ],

      formAction: [
        "'self'",
      ],

      frameAncestors: [
        "'none'",
      ],

      objectSrc: [
        "'none'",
      ],

      scriptSrc: [
        "'self'",
      ],

      styleSrc: [
        "'self'",
      ],

      imgSrc: [
        "'self'",
        "data:",
        "https:",
      ],

      connectSrc: [
        "'self'",
      ],
    },
  },

  crossOriginEmbedderPolicy:
    false,

  crossOriginResourcePolicy: {
    policy:
      "same-origin",
  },

  referrerPolicy: {
    policy:
      "strict-origin-when-cross-origin",
  },

  hsts:
    isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false,
        }
      : false,
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  corsOptions,
  helmetOptions,
  getAllowedOrigins,
};