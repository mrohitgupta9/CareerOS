const request = require("supertest");

const express = require("express");

const healthRoutes =
  require("../../src/routes/healthRoutes");

const app = express();

app.use(
  "/health",
  healthRoutes
);

describe(
  "Health API",
  () => {
    // =================================================
    // Health Check
    // =================================================

    it(
      "should return API health status",
      async () => {
        const response =
          await request(app)
            .get("/health");

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body
        ).toHaveProperty(
          "success",
          true
        );

        expect(
          response.body
        ).toHaveProperty(
          "status",
          "ok"
        );

        expect(
          response.body
        ).toHaveProperty(
          "service",
          "application"
        );

        expect(
          response.body
        ).toHaveProperty(
          "version"
        );

        expect(
          response.body
        ).toHaveProperty(
          "timestamp"
        );
      }
    );

    // =================================================
    // Readiness Check
    // =================================================

    it(
      "should expose readiness endpoint",
      async () => {
        const response =
          await request(app)
            .get("/health/ready");

        expect(
          [200, 503]
        ).toContain(
          response.statusCode
        );

        expect(
          response.body
        ).toHaveProperty(
          "success"
        );

        expect(
          response.body
        ).toHaveProperty(
          "status"
        );

        expect(
          response.body
        ).toHaveProperty(
          "dependencies"
        );
      }
    );
  }
);