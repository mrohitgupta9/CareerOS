const {
  requestIdMiddleware,
} = require(
  "../../src/middleware/requestIdMiddleware"
);

describe(
  "Request ID Middleware",
  () => {
    it(
      "should generate a request ID when one is not provided",
      () => {
        const req = {
          headers: {},
        };

        const headers = {};

        const res = {
          setHeader: jest.fn(
            (key, value) => {
              headers[key] = value;
            }
          ),
        };

        const next =
          jest.fn();

        requestIdMiddleware(
          req,
          res,
          next
        );

        expect(
          req.requestId
        ).toBeDefined();

        expect(
          typeof req.requestId
        ).toBe("string");

        expect(
          res.setHeader
        ).toHaveBeenCalledWith(
          "X-Request-ID",
          req.requestId
        );

        expect(next).toHaveBeenCalled();
      }
    );

    it(
      "should preserve an incoming request ID",
      () => {
        const req = {
          headers: {
            "x-request-id":
              "test-request-123",
          },
        };

        const res = {
          setHeader: jest.fn(),
        };

        const next =
          jest.fn();

        requestIdMiddleware(
          req,
          res,
          next
        );

        expect(
          req.requestId
        ).toBe(
          "test-request-123"
        );

        expect(
          res.setHeader
        ).toHaveBeenCalledWith(
          "X-Request-ID",
          "test-request-123"
        );

        expect(next).toHaveBeenCalled();
      }
    );
  }
);