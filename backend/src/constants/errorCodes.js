const ERROR_CODES = Object.freeze({

  // =====================================================
  // GENERAL
  // =====================================================

  INTERNAL_SERVER_ERROR:
    "INTERNAL_SERVER_ERROR",

  ROUTE_NOT_FOUND:
    "ROUTE_NOT_FOUND",

  BAD_REQUEST:
    "BAD_REQUEST",

  INVALID_REQUEST:
    "INVALID_REQUEST",

  SERVICE_UNAVAILABLE:
    "SERVICE_UNAVAILABLE",

  // =====================================================
  // VALIDATION
  // =====================================================

  VALIDATION_ERROR:
    "VALIDATION_ERROR",

  INVALID_ID:
    "INVALID_ID",

  MISSING_REQUIRED_FIELD:
    "MISSING_REQUIRED_FIELD",

  INVALID_FIELD:
    "INVALID_FIELD",

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  AUTHENTICATION_REQUIRED:
    "AUTHENTICATION_REQUIRED",

  INVALID_TOKEN:
    "INVALID_TOKEN",

  TOKEN_EXPIRED:
    "TOKEN_EXPIRED",

  INVALID_CREDENTIALS:
    "INVALID_CREDENTIALS",

  REFRESH_TOKEN_REQUIRED:
    "REFRESH_TOKEN_REQUIRED",

  INVALID_REFRESH_TOKEN:
    "INVALID_REFRESH_TOKEN",

  REFRESH_TOKEN_EXPIRED:
    "REFRESH_TOKEN_EXPIRED",

  // =====================================================
  // AUTHORIZATION
  // =====================================================

  FORBIDDEN:
    "FORBIDDEN",

  INSUFFICIENT_PERMISSIONS:
    "INSUFFICIENT_PERMISSIONS",

  // =====================================================
  // RESOURCE
  // =====================================================

  RESOURCE_NOT_FOUND:
    "RESOURCE_NOT_FOUND",

  RESOURCE_ALREADY_EXISTS:
    "RESOURCE_ALREADY_EXISTS",

  CONFLICT:
    "CONFLICT",

  // =====================================================
  // RATE LIMITING
  // =====================================================

  RATE_LIMIT_EXCEEDED:
    "RATE_LIMIT_EXCEEDED",

  // =====================================================
  // CORS
  // =====================================================

  CORS_ORIGIN_NOT_ALLOWED:
    "CORS_ORIGIN_NOT_ALLOWED",

  // =====================================================
  // DATABASE
  // =====================================================

  DATABASE_ERROR:
    "DATABASE_ERROR",

  DATABASE_CONNECTION_ERROR:
    "DATABASE_CONNECTION_ERROR",

  DATABASE_QUERY_ERROR:
    "DATABASE_QUERY_ERROR",

  DATABASE_TIMEOUT:
    "DATABASE_TIMEOUT",

  // =====================================================
  // REDIS / CACHE
  // =====================================================

  REDIS_ERROR:
    "REDIS_ERROR",

  REDIS_CONNECTION_ERROR:
    "REDIS_CONNECTION_ERROR",

  CACHE_ERROR:
    "CACHE_ERROR",

  CACHE_MISS:
    "CACHE_MISS",

  // =====================================================
  // BACKGROUND JOBS
  // =====================================================

  JOB_ERROR:
    "JOB_ERROR",

  JOB_QUEUE_ERROR:
    "JOB_QUEUE_ERROR",

  JOB_NOT_FOUND:
    "JOB_NOT_FOUND",

  // =====================================================
  // HEALTH / READINESS
  // =====================================================

  HEALTH_CHECK_FAILED:
    "HEALTH_CHECK_FAILED",

  READINESS_CHECK_FAILED:
    "READINESS_CHECK_FAILED",

  DATABASE_NOT_READY:
    "DATABASE_NOT_READY",

  REDIS_NOT_READY:
    "REDIS_NOT_READY",

  // =====================================================
  // SECURITY
  // =====================================================

  SECURITY_ERROR:
    "SECURITY_ERROR",

  CSRF_ERROR:
    "CSRF_ERROR",

  INVALID_ORIGIN:
    "INVALID_ORIGIN",

  // =====================================================
  // CONFIGURATION
  // =====================================================

  CONFIGURATION_ERROR:
    "CONFIGURATION_ERROR",

  MISSING_ENVIRONMENT_VARIABLE:
    "MISSING_ENVIRONMENT_VARIABLE",

});

module.exports = {
  ERROR_CODES,
};