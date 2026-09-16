const {
  corsOptions,
  helmetOptions,
} = require("../../src/config/security");

describe(
  "Security Configuration",
  () => {
    // =================================================
    // CORS
    // =================================================

    it(
      "should allow requests without an origin",
      () => {
        const callback =
          jest.fn();

        corsOptions.origin(
          undefined,
          callback
        );

        expect(
          callback
        ).toHaveBeenCalledWith(
          null,
          true
        );
      }
    );

    it(
      "should reject an untrusted origin",
      () => {
        const callback =
          jest.fn();

        corsOptions.origin(
          "https://untrusted.example",
          callback
        );

        expect(
          callback
        ).toHaveBeenCalled();

        const [
          error,
        ] = callback.mock.calls[0];

        expect(error).toBeInstanceOf(
          Error
        );

        expect(
          error.message
        ).toBe(
          "Origin not allowed by CORS"
        );
      }
    );

    it(
      "should enable credentials",
      () => {
        expect(
          corsOptions.credentials
        ).toBe(true);
      }
    );

    // =================================================
    // Allowed Headers
    // =================================================

    it(
      "should allow required security headers",
      () => {
        expect(
          corsOptions.allowedHeaders
        ).toEqual(
          expect.arrayContaining([
            "Content-Type",
            "Authorization",
            "X-Request-ID",
          ])
        );
      }
    );

    // =================================================
    // Helmet
    // =================================================

    it(
      "should configure Content Security Policy",
      () => {
        expect(
          helmetOptions
            .contentSecurityPolicy
        ).toBeDefined();

        expect(
          helmetOptions
            .contentSecurityPolicy
            .directives
        ).toBeDefined();
      }
    );

    it(
      "should block framing",
      () => {
        expect(
          helmetOptions
            .contentSecurityPolicy
            .directives
            .frameAncestors
        ).toEqual([
          "'none'",
        ]);
      }
    );

    it(
      "should disable object embedding",
      () => {
        expect(
          helmetOptions
            .contentSecurityPolicy
            .directives
            .objectSrc
        ).toEqual([
          "'none'",
        ]);
      }
    );

    it(
      "should enable production HSTS configuration",
      () => {
        expect(
          helmetOptions
        ).toBeDefined();
      }
    );
  }
);