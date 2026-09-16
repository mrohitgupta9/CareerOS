const {
  normalizeError,
} = require(
  "../../src/middleware/errorMiddleware"
);

describe(
  "Error Middleware",
  () => {
    it(
      "should normalize AppError",
      () => {
        const error = {
          isOperational: true,
          statusCode: 404,
          code:
            "RESOURCE_NOT_FOUND",
          message:
            "User not found",
        };

        const result =
          normalizeError(error);

        expect(
          result.statusCode
        ).toBe(404);

        expect(
          result.code
        ).toBe(
          "RESOURCE_NOT_FOUND"
        );

        expect(
          result.message
        ).toBe(
          "User not found"
        );
      }
    );

    it(
      "should normalize Mongoose validation errors",
      () => {
        const error = {
          name:
            "ValidationError",

          errors: {
            email: {
              path: "email",
              message:
                "Email is required",
            },
          },
        };

        const result =
          normalizeError(error);

        expect(
          result.statusCode
        ).toBe(400);

        expect(
          result.code
        ).toBe(
          "VALIDATION_ERROR"
        );

        expect(
          result.details
        ).toEqual([
          {
            field: "email",
            message:
              "Email is required",
          },
        ]);
      }
    );

    it(
      "should normalize duplicate key errors",
      () => {
        const error = {
          code: 11000,
        };

        const result =
          normalizeError(error);

        expect(
          result.statusCode
        ).toBe(409);

        expect(
          result.code
        ).toBe(
          "RESOURCE_ALREADY_EXISTS"
        );
      }
    );

    it(
      "should normalize JWT errors",
      () => {
        const error = {
          name:
            "JsonWebTokenError",
        };

        const result =
          normalizeError(error);

        expect(
          result.statusCode
        ).toBe(401);

        expect(
          result.code
        ).toBe(
          "INVALID_TOKEN"
        );
      }
    );

    it(
      "should normalize expired JWT errors",
      () => {
        const error = {
          name:
            "TokenExpiredError",
        };

        const result =
          normalizeError(error);

        expect(
          result.statusCode
        ).toBe(401);

        expect(
          result.code
        ).toBe(
          "TOKEN_EXPIRED"
        );
      }
    );

    it(
      "should hide unknown errors",
      () => {
        const error =
          new Error(
            "Sensitive internal database details"
          );

        const result =
          normalizeError(error);

        expect(
          result.statusCode
        ).toBe(500);

        expect(
          result.code
        ).toBe(
          "INTERNAL_SERVER_ERROR"
        );

        expect(
          result.message
        ).toBe(
          "Internal server error"
        );
      }
    );
  }
);