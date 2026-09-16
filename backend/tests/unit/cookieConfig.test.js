describe(
  "Cookie Configuration",
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
      "should configure secure cookie settings in production",
      () => {
        process.env.NODE_ENV =
          "production";

        process.env.REFRESH_TOKEN_COOKIE_NAME =
          "refreshToken";

        process.env.REFRESH_TOKEN_EXPIRES_IN =
          "7d";

        const {
          refreshTokenCookieOptions,
          refreshTokenCookieName,
        } = require(
          "../../src/config/cookie"
        );

        expect(
          refreshTokenCookieName
        ).toBe("refreshToken");

        expect(
          refreshTokenCookieOptions
            .httpOnly
        ).toBe(true);

        expect(
          refreshTokenCookieOptions
            .secure
        ).toBe(true);

        expect(
          refreshTokenCookieOptions
            .sameSite
        ).toBe("strict");

        expect(
          refreshTokenCookieOptions
            .path
        ).toBe("/");

        expect(
          refreshTokenCookieOptions
            .maxAge
        ).toBe(
          7 * 24 * 60 * 60 * 1000
        );
      }
    );

    it(
      "should allow local development cookies",
      () => {
        process.env.NODE_ENV =
          "development";

        process.env.REFRESH_TOKEN_COOKIE_NAME =
          "refreshToken";

        process.env.REFRESH_TOKEN_EXPIRES_IN =
          "7d";

        const {
          refreshTokenCookieOptions,
        } = require(
          "../../src/config/cookie"
        );

        expect(
          refreshTokenCookieOptions
            .httpOnly
        ).toBe(true);

        expect(
          refreshTokenCookieOptions
            .secure
        ).toBe(false);

        expect(
          refreshTokenCookieOptions
            .sameSite
        ).toBe("lax");
      }
    );

    it(
      "should configure the refresh token cookie name",
      () => {
        process.env.NODE_ENV =
          "development";

        process.env.REFRESH_TOKEN_COOKIE_NAME =
          "productionRefresh";

        const {
          refreshTokenCookieName,
        } = require(
          "../../src/config/cookie"
        );

        expect(
          refreshTokenCookieName
        ).toBe(
          "productionRefresh"
        );
      }
    );
  }
);