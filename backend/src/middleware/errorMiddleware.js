const { logger } = require("../utils/logger");

const { ERROR_CODES } = require("../constants/errorCodes");

// =====================================================
// 404 - Route Not Found
// =====================================================

const notFound = (req, res) => {
  const requestId = req.requestId || null;

  return res.status(404).json({
    success: false,

    code: ERROR_CODES.ROUTE_NOT_FOUND,

    message: `Route not found: ${req.method} ${req.originalUrl}`,

    requestId,
  });
};

// =====================================================
// Normalize Error
// =====================================================

const normalizeError = (err) => {
  // -----------------------------------------------
  // Custom AppError
  // -----------------------------------------------

  if (err.isOperational) {
    return {
      statusCode: err.statusCode || 500,

      code: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR,

      message: err.message || "An error occurred",

      details: err.details || null,
    };
  }

  // -----------------------------------------------
  // Mongoose Validation Error
  // -----------------------------------------------

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((error) => ({
      field: error.path,

      message: error.message,
    }));

    return {
      statusCode: 400,

      code: ERROR_CODES.VALIDATION_ERROR,

      message: "Validation failed",

      details: errors,
    };
  }

  // -----------------------------------------------
  // Mongoose Cast Error
  // -----------------------------------------------

  if (err.name === "CastError") {
    return {
      statusCode: 400,

      code: ERROR_CODES.INVALID_ID,

      message: "Invalid resource identifier",

      details: null,
    };
  }

  // -----------------------------------------------
  // MongoDB Duplicate Key
  // -----------------------------------------------

  if (err.code === 11000) {
    return {
      statusCode: 409,

      code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,

      message: "Resource already exists",

      details: null,
    };
  }

  // -----------------------------------------------
  // JWT Errors
  // -----------------------------------------------

  if (err.name === "JsonWebTokenError") {
    return {
      statusCode: 401,

      code: ERROR_CODES.INVALID_TOKEN,

      message: "Invalid authentication token",

      details: null,
    };
  }

  if (err.name === "TokenExpiredError") {
    return {
      statusCode: 401,

      code: ERROR_CODES.TOKEN_EXPIRED,

      message: "Authentication token has expired",

      details: null,
    };
  }

  // -----------------------------------------------
  // CORS Error
  // -----------------------------------------------

  if (err.message === "Origin not allowed by CORS") {
    return {
      statusCode: 403,

      code: ERROR_CODES.CORS_ORIGIN_NOT_ALLOWED,

      message: "Origin not allowed by CORS",

      details: null,
    };
  }

  // -----------------------------------------------
  // Express Rate Limit
  // -----------------------------------------------

  if (err.status === 429 || err.statusCode === 429) {
    return {
      statusCode: 429,

      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,

      message: "Too many requests. Please try again later.",

      details: null,
    };
  }

  // -----------------------------------------------
  // Unknown Error
  // -----------------------------------------------

  return {
    statusCode: 500,

    code: ERROR_CODES.INTERNAL_SERVER_ERROR,

    message: "Internal server error",

    details: null,
  };
};

// =====================================================
// Global Error Handler
// =====================================================

const errorHandler = (err, req, res, next) => {
  const normalized = normalizeError(err);

  const requestId = req.requestId || null;

  // -----------------------------------------------
  // Logging
  // -----------------------------------------------

  logger.error({
    event: "http_request_failed",

    message: "Request failed",

    requestId,

    metadata: {
      method: req.method,

      path: req.originalUrl,

      statusCode: normalized.statusCode,

      code: normalized.code,
    },

    error: err,
  });

  // -----------------------------------------------
  // Response
  // -----------------------------------------------

  const response = {
    success: false,

    code: normalized.code,

    message:
      process.env.NODE_ENV === "production" && normalized.statusCode >= 500
        ? "Internal server error"
        : normalized.message,

    requestId,
  };

  // -----------------------------------------------
  // Optional details
  // -----------------------------------------------

  if (normalized.details) {
    response.errors = normalized.details;
  }

  return res.status(normalized.statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
  normalizeError,
};
