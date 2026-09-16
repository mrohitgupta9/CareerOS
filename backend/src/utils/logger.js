const serializeError = (error) => {
  if (!error) {
    return null;
  }

  return {
    name: error.name || "Error",

    message:
      error.message || "Unknown error",

    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : error.stack,
  };
};

// =====================================================
// STRUCTURED LOG WRITER
// =====================================================

const writeLog = ({
  level,
  event,
  message,
  requestId = null,
  metadata = {},
  error = null,
}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),

    level,

    event,

    message,

    requestId: requestId || null,

    metadata,

    error: error
      ? serializeError(error)
      : null,
  };

  const output = JSON.stringify(logEntry);

  switch (level) {
    case "error":
      console.error(output);
      break;

    case "warn":
      console.warn(output);
      break;

    case "debug":
      if (
        process.env.NODE_ENV !== "production"
      ) {
        console.debug(output);
      }
      break;

    case "info":
    default:
      console.info(output);
      break;
  }

  return logEntry;
};

// =====================================================
// LOGGER
// =====================================================

const logger = {
  info: ({
    event = "application",
    message,
    requestId = null,
    metadata = {},
  }) =>
    writeLog({
      level: "info",
      event,
      message,
      requestId,
      metadata,
    }),

  warn: ({
    event = "application",
    message,
    requestId = null,
    metadata = {},
  }) =>
    writeLog({
      level: "warn",
      event,
      message,
      requestId,
      metadata,
    }),

  error: ({
    event = "application_error",
    message,
    requestId = null,
    metadata = {},
    error = null,
  }) =>
    writeLog({
      level: "error",
      event,
      message,
      requestId,
      metadata,
      error,
    }),

  debug: ({
    event = "debug",
    message,
    requestId = null,
    metadata = {},
  }) =>
    writeLog({
      level: "debug",
      event,
      message,
      requestId,
      metadata,
    }),
};

module.exports = {
  logger,
  serializeError,
};
