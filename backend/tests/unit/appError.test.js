const AppError =
  require("../../src/utils/AppError");

describe(
  "AppError",
  () => {
    it(
      "should create an operational error",
      () => {
        const error =
          new AppError(
            "User not found",
            404,
            "RESOURCE_NOT_FOUND"
          );

        expect(
          error.message
        ).toBe(
          "User not found"
        );

        expect(
          error.statusCode
        ).toBe(404);

        expect(
          error.code
        ).toBe(
          "RESOURCE_NOT_FOUND"
        );

        expect(
          error.isOperational
        ).toBe(true);
      }
    );

    it(
      "should support error details",
      () => {
        const error =
          new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            [
              {
                field: "email",
                message:
                  "Invalid email",
              },
            ]
          );

        expect(
          error.details
        ).toEqual([
          {
            field: "email",
            message:
              "Invalid email",
          },
        ]);
      }
    );
  }
);