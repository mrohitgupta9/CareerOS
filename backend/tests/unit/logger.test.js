const {
  logger,
  serializeError,
} = require(
  "../../src/utils/logger"
);

describe(
  "Central Logger",
  () => {
    let consoleInfoSpy;
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeEach(() => {
      consoleInfoSpy =
        jest
          .spyOn(
            console,
            "info"
          )
          .mockImplementation();

      consoleWarnSpy =
        jest
          .spyOn(
            console,
            "warn"
          )
          .mockImplementation();

      consoleErrorSpy =
        jest
          .spyOn(
            console,
            "error"
          )
          .mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it(
      "should create structured info logs",
      () => {
        const result =
          logger.info({
            message:
              "Test message",

            requestId:
              "request-123",

            metadata: {
              route:
                "/api/test",
            },
          });

        expect(
          result.level
        ).toBe("info");

        expect(
          result.message
        ).toBe(
          "Test message"
        );

        expect(
          result.requestId
        ).toBe(
          "request-123"
        );

        expect(
          result.metadata.route
        ).toBe(
          "/api/test"
        );

        expect(
          consoleInfoSpy
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "should create warning logs",
      () => {
        logger.warn({
          message:
            "Warning message",
        });

        expect(
          consoleWarnSpy
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "should create error logs",
      () => {
        const error =
          new Error(
            "Test error"
          );

        logger.error({
          message:
            "Something failed",

          requestId:
            "request-456",

          error,
        });

        expect(
          consoleErrorSpy
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "should serialize errors",
      () => {
        const error =
          new Error(
            "Test error"
          );

        const result =
          serializeError(
            error
          );

        expect(
          result.name
        ).toBe("Error");

        expect(
          result.message
        ).toBe(
          "Test error"
        );
      }
    );
  }
);