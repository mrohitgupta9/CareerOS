describe(
  "Environment Configuration",
  () => {
    const originalEnv =
      process.env;

    beforeEach(() => {
      jest.resetModules();

      process.env = {
        ...originalEnv,
      };
    });

    afterAll(() => {
      process.env =
        originalEnv;
    });

    it(
      "should validate required environment variables",
      () => {
        process.env.MONGO_URI =
          "mongodb://localhost/test";

        process.env.REDIS_URL =
          "redis://localhost:6379";

        process.env.CORS_ORIGIN =
          "http://localhost:5173";

        process.env.JWT_SECRET =
          "development-secret";

        process.env.NODE_ENV =
          "development";

        const {
          validateEnvironment,
        } = require(
          "../../src/config/environment"
        );

        expect(
          validateEnvironment()
        ).toBe(true);
      }
    );

    it(
      "should reject missing environment variables",
      () => {
        delete process.env.MONGO_URI;

        process.env.REDIS_URL =
          "redis://localhost:6379";

        process.env.CORS_ORIGIN =
          "http://localhost:5173";

        process.env.JWT_SECRET =
          "development-secret";

        process.env.NODE_ENV =
          "development";

        const {
          validateEnvironment,
        } = require(
          "../../src/config/environment"
        );

        expect(() =>
          validateEnvironment()
        ).toThrow(
          "Missing required environment variables"
        );
      }
    );

    it(
      "should reject insecure production CORS",
      () => {
        process.env.MONGO_URI =
          "mongodb://localhost/test";

        process.env.REDIS_URL =
          "redis://localhost:6379";

        process.env.CORS_ORIGIN =
          "http://example.com";

        process.env.JWT_SECRET =
          "a".repeat(64);

        process.env.NODE_ENV =
          "production";

        const {
          validateEnvironment,
        } = require(
          "../../src/config/environment"
        );

        expect(() =>
          validateEnvironment()
        ).toThrow(
          "CORS_ORIGIN must use HTTPS in production"
        );
      }
    );
  }
);