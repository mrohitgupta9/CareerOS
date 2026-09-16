describe(
  "Application Configuration",
  () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it(
      "should load application configuration",
      () => {
        process.env.NODE_ENV =
          "development";

        process.env.PORT =
          "5000";

        process.env.API_BASE_URL =
          "http://localhost:5000";

        process.env.APP_VERSION =
          "0.1.0";

        const {
          appConfig,
        } = require(
          "../../src/config/appConfig"
        );

        expect(
          appConfig.environment
        ).toBe("development");

        expect(
          appConfig.port
        ).toBe(5000);

        expect(
          appConfig.apiBaseUrl
        ).toBe(
          "http://localhost:5000"
        );

        expect(
          appConfig.version
        ).toBe("0.1.0");
      }
    );

    it(
      "should load Redis configuration",
      () => {
        process.env.REDIS_URL =
          "redis://localhost:6379";

        process.env.REDIS_CACHE_PREFIX =
          "app:cache";

        const {
          redisConfig,
        } = require(
          "../../src/config/appConfig"
        );

        expect(
          redisConfig.url
        ).toBe(
          "redis://localhost:6379"
        );

        expect(
          redisConfig.cachePrefix
        ).toBe("app:cache");
      }
    );

    it(
      "should load JWT configuration",
      () => {
        process.env.JWT_SECRET =
          "test-secret";

        process.env.JWT_EXPIRES_IN =
          "15m";

        const {
          jwtConfig,
        } = require(
          "../../src/config/appConfig"
        );

        expect(
          jwtConfig.secret
        ).toBe("test-secret");

        expect(
          jwtConfig.expiresIn
        ).toBe("15m");
      }
    );

    it(
      "should load refresh token configuration",
      () => {
        process.env.REFRESH_TOKEN_EXPIRES_IN =
          "7d";

        process.env.REFRESH_TOKEN_COOKIE_NAME =
          "refreshToken";

        const {
          refreshTokenConfig,
        } = require(
          "../../src/config/appConfig"
        );

        expect(
          refreshTokenConfig.expiresIn
        ).toBe("7d");

        expect(
          refreshTokenConfig.cookieName
        ).toBe(
          "refreshToken"
        );
      }
    );
  }
);