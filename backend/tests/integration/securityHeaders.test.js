const express =
  require("express");

const request =
  require("supertest");

const cors =
  require("cors");

const helmet =
  require("helmet");

const {
  corsOptions,
  helmetOptions,
} = require(
  "../../src/config/security"
);

describe(
  "Security Headers and CORS",
  () => {
    const createApp = () => {
      const app =
        express();

      app.use(
        helmet(
          helmetOptions
        )
      );

      app.use(
        cors(
          corsOptions
        )
      );

      app.get(
        "/test",
        (req, res) => {
          res.json({
            success: true,
          });
        }
      );

      return app;
    };

    it(
      "should include security headers",
      async () => {
        const app =
          createApp();

        const response =
          await request(app)
            .get("/test");

        expect(
          response.headers[
            "x-content-type-options"
          ]
        ).toBe(
          "nosniff"
        );

        expect(
          response.headers[
            "x-frame-options"
          ]
        ).toBeDefined();

        expect(
          response.headers[
            "referrer-policy"
          ]
        ).toBe(
          "strict-origin-when-cross-origin"
        );
      }
    );

    it(
      "should allow configured origin",
      async () => {
        const app =
          createApp();

        const response =
          await request(app)
            .get("/test")
            .set(
              "Origin",
              "http://localhost:5173"
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.headers[
            "access-control-allow-origin"
          ]
        ).toBe(
          "http://localhost:5173"
        );
      }
    );

    it(
      "should expose request ID header",
      async () => {
        const app =
          createApp();

        const response =
          await request(app)
            .options("/test")
            .set(
              "Origin",
              "http://localhost:5173"
            )
            .set(
              "Access-Control-Request-Method",
              "GET"
            );

        expect(
          response.headers[
            "access-control-expose-headers"
          ]
        ).toContain(
          "X-Request-ID"
        );
      }
    );
  }
);