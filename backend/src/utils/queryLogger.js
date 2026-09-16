const {
  logger,
} = require("./logger");

const {
  DATABASE_PERFORMANCE,
} = require(
  "../config/databasePerformance"
);

// =====================================================
// Log Query Performance
// =====================================================

const logQueryPerformance = ({
  operation,
  collection,
  durationMs,
  metadata = {},
}) => {
  if (
    durationMs <
    DATABASE_PERFORMANCE.SLOW_QUERY_THRESHOLD_MS
  ) {
    return;
  }

  logger.warn({
    message:
      "Slow database query detected",

    metadata: {
      operation,
      collection,
      durationMs,
      ...metadata,
    },
  });
};

module.exports = {
  logQueryPerformance,
};