const {
  normalizePagination,
  createPaginationMeta,
} = require(
  "../../src/utils/pagination"
);

describe(
  "Pagination Utilities",
  () => {
    // =====================================================
    // Defaults
    // =====================================================

    it(
      "should use default pagination values",
      () => {
        const result =
          normalizePagination();

        expect(
          result.page
        ).toBe(1);

        expect(
          result.limit
        ).toBe(20);

        expect(
          result.skip
        ).toBe(0);
      }
    );

    // =====================================================
    // Custom Values
    // =====================================================

    it(
      "should calculate skip correctly",
      () => {
        const result =
          normalizePagination({
            page: 3,
            limit: 10,
          });

        expect(
          result.page
        ).toBe(3);

        expect(
          result.limit
        ).toBe(10);

        expect(
          result.skip
        ).toBe(20);
      }
    );

    // =====================================================
    // Maximum Limit
    // =====================================================

    it(
      "should enforce maximum limit",
      () => {
        const result =
          normalizePagination({
            page: 1,
            limit: 1000,
          });

        expect(
          result.limit
        ).toBe(100);
      }
    );

    // =====================================================
    // Invalid Values
    // =====================================================

    it(
      "should fallback for invalid values",
      () => {
        const result =
          normalizePagination({
            page: 0,
            limit: -10,
          });

        expect(
          result.page
        ).toBe(1);

        expect(
          result.limit
        ).toBe(20);

        expect(
          result.skip
        ).toBe(0);
      }
    );

    // =====================================================
    // Pagination Metadata
    // =====================================================

    it(
      "should create pagination metadata",
      () => {
        const result =
          createPaginationMeta({
            page: 2,
            limit: 10,
            total: 35,
          });

        expect(
          result
        ).toEqual({
          page: 2,
          limit: 10,
          total: 35,
          totalPages: 4,
          hasNextPage: true,
          hasPreviousPage: true,
        });
      }
    );

    // =====================================================
    // Last Page
    // =====================================================

    it(
      "should identify the last page",
      () => {
        const result =
          createPaginationMeta({
            page: 4,
            limit: 10,
            total: 35,
          });

        expect(
          result.hasNextPage
        ).toBe(false);

        expect(
          result.hasPreviousPage
        ).toBe(true);
      }
    );

    // =====================================================
    // Empty Result
    // =====================================================

    it(
      "should handle empty results",
      () => {
        const result =
          createPaginationMeta({
            page: 1,
            limit: 20,
            total: 0,
          });

        expect(
          result.totalPages
        ).toBe(0);

        expect(
          result.hasNextPage
        ).toBe(false);

        expect(
          result.hasPreviousPage
        ).toBe(false);
      }
    );
  }
);