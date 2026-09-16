const {
  DATABASE_PERFORMANCE,
} = require(
  "../config/databasePerformance"
);

// =====================================================
// Normalize Pagination
// =====================================================

const normalizePagination = ({
  page,
  limit,
} = {}) => {
  let normalizedPage =
    Number(page);

  let normalizedLimit =
    Number(limit);

  if (
    !Number.isInteger(
      normalizedPage
    ) ||
    normalizedPage < 1
  ) {
    normalizedPage =
      DATABASE_PERFORMANCE.DEFAULT_PAGE;
  }

  if (
    !Number.isInteger(
      normalizedLimit
    ) ||
    normalizedLimit < 1
  ) {
    normalizedLimit =
      DATABASE_PERFORMANCE.DEFAULT_LIMIT;
  }

  normalizedLimit =
    Math.min(
      normalizedLimit,
      DATABASE_PERFORMANCE.MAX_LIMIT
    );

  const skip =
    (normalizedPage - 1) *
    normalizedLimit;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip,
  };
};

// =====================================================
// Pagination Metadata
// =====================================================

const createPaginationMeta = ({
  page,
  limit,
  total,
}) => {
  const totalPages =
    total === 0
      ? 0
      : Math.ceil(
          total / limit
        );

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage:
      page < totalPages,
    hasPreviousPage:
      page > 1 &&
      totalPages > 0,
  };
};

module.exports = {
  normalizePagination,
  createPaginationMeta,
};