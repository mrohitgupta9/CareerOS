jest.mock(
  "../../src/utils/logger",
  () => ({
    logger: {
      warn: jest.fn(),
    },
  })
);

const {
  logger,
} = require(
  "../../src/utils/logger"
);

const {
  logQueryPerformance,
} = require(
  "../../src/utils/queryLogger"
);

describe(
  "Query Logger",
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(
      "should not log fast queries",
      () => {
        logQueryPerformance({
          operation: "find",
          collection: "users",
          durationMs: 100,
        });

        expect(
          logger.warn
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "should log slow queries",
      () => {
        logQueryPerformance({
          operation: "find",
          collection: "users",
          durationMs: 700,
        });

        expect(
          logger.warn
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              "Slow database query detected",
          })
        );
      }
    );
  }
);