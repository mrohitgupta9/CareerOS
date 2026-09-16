const {
  DATABASE_PERFORMANCE,
} = require(
  "../config/databasePerformance"
);

// =====================================================
// Apply Query Timeout
// =====================================================

const applyQueryTimeout = (
  query,
  maxTimeMS =
    DATABASE_PERFORMANCE.QUERY_MAX_TIME_MS
) => {
  return query.maxTimeMS(
    maxTimeMS
  );
};

// =====================================================
// Apply Pagination
// =====================================================

const applyPagination = (
  query,
  {
    skip,
    limit,
  }
) => {
  return query
    .skip(skip)
    .limit(limit);
};

// =====================================================
// Apply Safe Projection
// =====================================================

const applyProjection = (
  query,
  projection
) => {
  if (
    !projection
  ) {
    return query;
  }

  return query.select(
    projection
  );
};

// =====================================================
// Use Lean Query
// =====================================================

const applyLean = (
  query
) => {
  return query.lean();
};

module.exports = {
  applyQueryTimeout,
  applyPagination,
  applyProjection,
  applyLean,
};