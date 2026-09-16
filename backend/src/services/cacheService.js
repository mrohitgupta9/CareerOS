const {
  getCache,
  setCache,
  deleteCache,
  hasCache,
} = require("../utils/cache");

const {
  createCacheKey,
} = require("../utils/cacheKey");

// =====================================================
// Cache Service
// =====================================================

const cacheService = {
  // ---------------------------------------------------
  // Build Key
  // ---------------------------------------------------

  buildKey(
    namespace,
    identifier = null
  ) {
    return createCacheKey(
      namespace,
      identifier
    );
  },

  // ---------------------------------------------------
  // Get
  // ---------------------------------------------------

  async get(
    namespace,
    identifier = null
  ) {
    const key =
      createCacheKey(
        namespace,
        identifier
      );

    return getCache(key);
  },

  // ---------------------------------------------------
  // Set
  // ---------------------------------------------------

  async set(
    namespace,
    identifier,
    value,
    ttlSeconds
  ) {
    const key =
      createCacheKey(
        namespace,
        identifier
      );

    return setCache(
      key,
      value,
      ttlSeconds
    );
  },

  // ---------------------------------------------------
  // Delete
  // ---------------------------------------------------

  async delete(
    namespace,
    identifier = null
  ) {
    const key =
      createCacheKey(
        namespace,
        identifier
      );

    return deleteCache(key);
  },

  // ---------------------------------------------------
  // Exists
  // ---------------------------------------------------

  async has(
    namespace,
    identifier = null
  ) {
    const key =
      createCacheKey(
        namespace,
        identifier
      );

    return hasCache(key);
  },
};

// =====================================================
// Export
// =====================================================

module.exports = {
  cacheService,
};