const {
  body,
  param,
  query,
} = require("express-validator");

// =====================================================
// Common ID Validator
// =====================================================

const mongoIdParam = (
  field = "id"
) => {
  return param(field)
    .trim()
    .isMongoId()
    .withMessage(
      `${field} must be a valid MongoDB ID`
    );
};

// =====================================================
// Common String Validator
// =====================================================

const requiredString = (
  field,
  min = 1,
  max = 255
) => {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage(
      `${field} is required`
    )
    .isLength({
      min,
      max,
    })
    .withMessage(
      `${field} must be between ${min} and ${max} characters`
    );
};

// =====================================================
// Common Email Validator
// =====================================================

const emailValidator = (
  field = "email"
) => {
  return body(field)
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage(
      "A valid email address is required"
    )
    .isLength({
      max: 254,
    })
    .withMessage(
      "Email address is too long"
    );
};

// =====================================================
// Common Pagination Validators
// =====================================================

const paginationValidators = () => [
  query("page")
    .optional()
    .isInt({
      min: 1,
      max: 100000,
    })
    .withMessage(
      "page must be a positive integer"
    )
    .toInt(),

  query("limit")
    .optional()
    .isInt({
      min: 1,
      max: 100,
    })
    .withMessage(
      "limit must be between 1 and 100"
    )
    .toInt(),
];

module.exports = {
  mongoIdParam,
  requiredString,
  emailValidator,
  paginationValidators,
};