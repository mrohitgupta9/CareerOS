const CACHE_CONFIG = Object.freeze({
  DEFAULT_TTL_SECONDS: 300,

  MAX_TTL_SECONDS: 86400,

  KEY_PREFIX:
    process.env.REDIS_CACHE_PREFIX ||
    "app:cache",
});

module.exports = {
  CACHE_CONFIG,
};