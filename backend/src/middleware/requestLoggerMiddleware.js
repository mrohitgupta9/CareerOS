const {
  logger,
} = require("../utils/logger");

const requestLoggerMiddleware = (
  req,
  res,
  next
) => {
  const startTime =
    process.hrtime.bigint();

  res.on("finish", () => {
    const endTime =
      process.hrtime.bigint();

    const durationMs =
      Number(
        endTime - startTime
      ) / 1_000_000;

    logger.info({
      event: "http_request_completed",

      message: "Request completed",

      requestId:
        req.requestId || null,

      metadata: {
        method: req.method,

        path: req.originalUrl,

        protocol: req.protocol,

        hostname: req.hostname,

        statusCode:
          res.statusCode,

        durationMs:
          Number(
            durationMs.toFixed(2)
          ),

        contentLength:
          res.getHeader(
            "content-length"
          ) || null,

        ip:
          req.ip || null,

        userAgent:
          req.get(
            "user-agent"
          ) || null,
      },
    });
  });

  next();
};

module.exports = {
  requestLoggerMiddleware,
};
