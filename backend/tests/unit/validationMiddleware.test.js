const express = require("express");
const request = require("supertest");

const {
  body,
} = require("express-validator");

const {
  validate,
  normalizeEmail,
  sanitizeString,
} = require("../../src/middleware/validationMiddleware");

describe(
  "Validation Middleware",
  () => {
    // =====================================================
    // Test App Factory
    // =====================================================

    const createApp = (
      validators
    ) => {
      const app = express();

      app.use(
        express.json()
      );

      app.post(
        "/test",
        validators,
        validate,
        (req, res) => {
          res.status(200).json({
            success: true,
            body: req.body,
          });
        }
      );

      // -------------------------------------------------
      // Test error handler
      // Mirrors production error structure
      // -------------------------------------------------

      app.use(
        (
          err,
          req,
          res,
          next
        ) => {
          res.status(
            err.statusCode || 500
          ).json({
            success: false,
            code: err.code,
            message: err.message,
            errors: err.details,
          });
        }
      );

      return app;
    };

    // =====================================================
    // Invalid Input
    // =====================================================

    it(
      "should reject invalid input",
      async () => {
        const app =
          createApp([
            body("name")
              .trim()
              .notEmpty()
              .withMessage(
                "name is required"
              ),
          ]);

        const response =
          await request(app)
            .post("/test")
            .send({
              name: "",
            });

        expect(
          response.statusCode
        ).toBe(400);

        expect(
          response.body.success
        ).toBe(false);

        expect(
          response.body.code
        ).toBe(
          "VALIDATION_ERROR"
        );

        expect(
          response.body.message
        ).toBe(
          "Validation failed"
        );

        expect(
          response.body.errors
        ).toHaveLength(1);

        expect(
          response.body.errors[0].field
        ).toBe("name");

        expect(
          response.body.errors[0].message
        ).toBe(
          "name is required"
        );

        // Sensitive/raw input should not be exposed
        expect(
          response.body.errors[0]
        ).not.toHaveProperty(
          "value"
        );
      }
    );

    // =====================================================
    // Valid Input
    // =====================================================

    it(
      "should allow valid input",
      async () => {
        const app =
          createApp([
            body("name")
              .trim()
              .notEmpty(),
          ]);

        const response =
          await request(app)
            .post("/test")
            .send({
              name: "Test User",
            });

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.body.name
        ).toBe(
          "Test User"
        );
      }
    );

    // =====================================================
    // Email Normalization
    // =====================================================

    it(
      "should normalize email",
      () => {
        expect(
          normalizeEmail(
            "  TEST@Example.COM  "
          )
        ).toBe(
          "test@example.com"
        );
      }
    );

    // =====================================================
    // Control Character Sanitization
    // =====================================================

    it(
      "should sanitize control characters",
      () => {
        expect(
          sanitizeString(
            "Hello\u0000World"
          )
        ).toBe(
          "HelloWorld"
        );
      }
    );

    // =====================================================
    // Non-string Values
    // =====================================================

    it(
      "should preserve non-string values",
      () => {
        expect(
          sanitizeString(123)
        ).toBe(123);
      }
    );

    // =====================================================
    // Multiple Validation Errors
    // =====================================================

    it(
      "should return multiple validation errors",
      async () => {
        const app =
          createApp([
            body("name")
              .trim()
              .notEmpty()
              .withMessage(
                "name is required"
              ),

            body("email")
              .trim()
              .isEmail()
              .withMessage(
                "email must be valid"
              ),
          ]);

        const response =
          await request(app)
            .post("/test")
            .send({
              name: "",
              email: "invalid",
            });

        expect(
          response.statusCode
        ).toBe(400);

        expect(
          response.body.success
        ).toBe(false);

        expect(
          response.body.code
        ).toBe(
          "VALIDATION_ERROR"
        );

        expect(
          response.body.errors
        ).toHaveLength(2);

        expect(
          response.body.errors.map(
            (error) =>
              error.field
          )
        ).toEqual(
          expect.arrayContaining([
            "name",
            "email",
          ])
        );
      }
    );
  }
);

