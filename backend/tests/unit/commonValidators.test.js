const express = require("express");
const request = require("supertest");

const {
  mongoIdParam,
  requiredString,
  emailValidator,
  paginationValidators,
} = require("../../src/validators/commonValidators");

const {
  validate,
} = require("../../src/middleware/validationMiddleware");

describe(
  "Common Validators",
  () => {
    // =====================================================
    // MongoDB ID
    // =====================================================

    it(
      "should reject an invalid MongoDB ID",
      async () => {
        const app = express();

        app.get(
          "/users/:id",
          [
            mongoIdParam("id"),
            validate,
          ],
          (req, res) => {
            res.json({
              success: true,
            });
          }
        );

        // Validation middleware now forwards
        // AppError to Express error handler.
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

        const response =
          await request(app)
            .get(
              "/users/invalid-id"
            );

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
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: "id",
            }),
          ])
        );
      }
    );

    // =====================================================
    // Invalid Email
    // =====================================================

    it(
      "should reject an invalid email",
      async () => {
        const app = express();

        app.use(
          express.json()
        );

        app.post(
          "/users",
          [
            emailValidator(),
            validate,
          ],
          (req, res) => {
            res.json({
              success: true,
              email:
                req.body.email,
            });
          }
        );

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

        const response =
          await request(app)
            .post("/users")
            .send({
              email: "INVALID",
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
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: "email",
            }),
          ])
        );
      }
    );

    // =====================================================
    // Valid Email
    // =====================================================

    it(
      "should accept a valid email",
      async () => {
        const app = express();

        app.use(
          express.json()
        );

        app.post(
          "/users",
          [
            emailValidator(),
            validate,
          ],
          (req, res) => {
            res.json({
              success: true,
              email:
                req.body.email,
            });
          }
        );

        const response =
          await request(app)
            .post("/users")
            .send({
              email:
                "  TEST@Example.COM ",
            });

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.email
        ).toBe(
          "test@example.com"
        );
      }
    );

    // =====================================================
    // Pagination
    // =====================================================

    it(
      "should reject invalid pagination values",
      async () => {
        const app = express();

        app.get(
          "/items",
          [
            ...paginationValidators(),
            validate,
          ],
          (req, res) => {
            res.json({
              success: true,
              page:
                req.query.page,
              limit:
                req.query.limit,
            });
          }
        );

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

        const response =
          await request(app)
            .get(
              "/items?page=0&limit=500"
            );

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
          response.body.errors.length
        ).toBeGreaterThanOrEqual(
          2
        );
      }
    );

    // =====================================================
    // Required String
    // =====================================================

    it(
      "should reject an empty required string",
      async () => {
        const app = express();

        app.use(
          express.json()
        );

        app.post(
          "/users",
          [
            requiredString(
              "name",
              2,
              50
            ),
            validate,
          ],
          (req, res) => {
            res.json({
              success: true,
            });
          }
        );

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

        const response =
          await request(app)
            .post("/users")
            .send({
              name: " ",
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
      }
    );
  }
);