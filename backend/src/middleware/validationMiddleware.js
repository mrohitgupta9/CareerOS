const {
  validationResult,
} = require("express-validator");

const AppError =
  require("../utils/AppError");

const {
  ERROR_CODES,
} = require("../constants/errorCodes");

// =====================================================
// Validation Middleware
// =====================================================

const validate = (
  req,
  res,
  next
) => {
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors =
      errors.array().map(
        (error) => ({
          field:
            error.path ||
            error.param,

          message:
            error.msg,
        })
      );

    return next(
      new AppError(
        "Validation failed",
        400,
        ERROR_CODES.VALIDATION_ERROR,
        validationErrors
      )
    );
  }

  next();
};

// =====================================================
// String Helpers
// =====================================================

const trimString = (
  value
) => {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value.trim();
};

const normalizeEmail = (
  value
) => {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value
    .trim()
    .toLowerCase();
};

const sanitizeString = (
  value
) => {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value
    .trim()
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    );
};

module.exports = {
  validate,
  trimString,
  normalizeEmail,
  sanitizeString,
};