const {
  redisClient,
} = require("../config/redis");

const {
  CACHE_CONFIG,
} = require("../config/cache");

// =====================================================
// Get Cache
// =====================================================

const getCache = async (
  key
) => {
  if (
    !redisClient.isReady
  ) {
    return null;
  }

  try {
    const value =
      await redisClient.get(key);

    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(
      "Cache GET failed:",
      error.message
    );

    return null;
  }
};

// =====================================================
// Set Cache
// =====================================================

const setCache = async (
  key,
  value,
  ttlSeconds =
    CACHE_CONFIG.DEFAULT_TTL_SECONDS
) => {
  if (
    !redisClient.isReady
  ) {
    return false;
  }

  try {
    const parsedTtl =
      Number(ttlSeconds);

    const ttl =
      Number.isFinite(
        parsedTtl
      )
        ? Math.min(
            Math.max(
              Math.floor(
                parsedTtl
              ),
              1
            ),
            CACHE_CONFIG.MAX_TTL_SECONDS
          )
        : CACHE_CONFIG.DEFAULT_TTL_SECONDS;

    const serialized =
      typeof value === "string"
        ? value
        : JSON.stringify(value);

    await redisClient.set(
      key,
      serialized,
      {
        EX: ttl,
      }
    );

    return true;
  } catch (error) {
    console.error(
      "Cache SET failed:",
      error.message
    );

    return false;
  }
};

// =====================================================
// Delete Cache
// =====================================================

const deleteCache = async (
  key
) => {
  if (
    !redisClient.isReady
  ) {
    return false;
  }

  try {
    await redisClient.del(key);

    return true;
  } catch (error) {
    console.error(
      "Cache DELETE failed:",
      error.message
    );

    return false;
  }
};

// =====================================================
// Check Cache
// =====================================================

const hasCache = async (
  key
) => {
  if (
    !redisClient.isReady
  ) {
    return false;
  }

  try {
    const exists =
      await redisClient.exists(key);

    return exists === 1;
  } catch (error) {
    console.error(
      "Cache EXISTS failed:",
      error.message
    );

    return false;
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  getCache,
  setCache,
  deleteCache,
  hasCache,
};