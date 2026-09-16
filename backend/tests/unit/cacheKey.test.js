const {
  createCacheKey,
} = require(
  "../../src/utils/cacheKey"
);

describe(
  "Cache Key Utilities",
  () => {
    it(
      "should create a namespaced cache key",
      () => {
        const key =
          createCacheKey(
            "users",
            "123"
          );

        expect(key).toBe(
          "app:cache:users:123"
        );
      }
    );

    it(
      "should create a namespace-only key",
      () => {
        const key =
          createCacheKey(
            "settings"
          );

        expect(key).toBe(
          "app:cache:settings"
        );
      }
    );

    it(
      "should normalize whitespace",
      () => {
        const key =
          createCacheKey(
            "user profile",
            "user 123"
          );

        expect(key).toBe(
          "app:cache:user_profile:user_123"
        );
      }
    );

    it(
      "should throw when namespace is missing",
      () => {
        expect(() =>
          createCacheKey()
        ).toThrow(
          "Cache namespace is required"
        );
      }
    );
  }
);