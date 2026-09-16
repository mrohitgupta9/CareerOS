const {
  CACHE_CONFIG,
} = require("../config/cache");

// =====================================================
// Normalize Cache Key Part
// =====================================================

const normalizePart = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "null";
  }

  return String(value)
    .trim()
    .replace(/\s+/g, "_");
};

// =====================================================
// Create Cache Key
// =====================================================

const createCacheKey = (
  namespace,
  identifier = null
) => {
  if (
    !namespace ||
    typeof namespace !== "string"
  ) {
    throw new Error(
      "Cache namespace is required"
    );
  }

  const parts = [
    CACHE_CONFIG.KEY_PREFIX,
    normalizePart(namespace),
  ];

  if (
    identifier !== null &&
    identifier !== undefined
  ) {
    parts.push(
      normalizePart(identifier)
    );
  }

  return parts.join(":");
};

// =====================================================
// Export
// =====================================================

module.exports = {
  createCacheKey,
};