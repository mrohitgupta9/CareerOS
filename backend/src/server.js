const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// =====================================================
// CONFIG
// =====================================================

const {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
} = require("./config/database");

const {
  connectRedis,
  disconnectRedis,
  getRedisStatus,
} = require("./config/redis");

const {
  corsOptions,
  helmetOptions,
} = require("./config/security");

const {
  validateEnvironment,
} = require("./config/environment");

const {
  appConfig,
} = require("./config/appConfig");

// =====================================================
// MIDDLEWARE
// =====================================================

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const {
  globalApiLimiter,
} = require("./middleware/rateLimitMiddleware");

const {
  requestIdMiddleware,
} = require("./middleware/requestIdMiddleware");

const {
  requestLoggerMiddleware,
} = require("./middleware/requestLoggerMiddleware");

const {
  setupSwagger,
} = require("./middleware/swaggerMiddleware");

// =====================================================
// ROUTES
// =====================================================

const healthRoutes = require("./routes/healthRoutes");

// =====================================================
// APP CONFIG
// =====================================================

const app = express();

const PORT = appConfig.port;

let server = null;
let isShuttingDown = false;

// =====================================================
// PROXY
// =====================================================

// Render / Nginx can terminate HTTPS before the request
// reaches Express. Trust the first reverse proxy in production
// so req.protocol and secure-cookie behavior work correctly.
if (appConfig.environment === "production") {
  app.set("trust proxy", 1);
}

// =====================================================
// SECURITY
// =====================================================

// Production-grade security headers
app.use(helmet(helmetOptions));

// Strict CORS policy
app.use(cors(corsOptions));

// =====================================================
// REQUEST CORRELATION
// =====================================================

// Generate or preserve X-Request-ID
app.use(requestIdMiddleware);

// Log every completed request
app.use(requestLoggerMiddleware);

// =====================================================
// REQUEST PARSING
// =====================================================

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// Parse HTTP cookies
app.use(cookieParser());

// =====================================================
// RATE LIMITING
// =====================================================

// Global protection for all API endpoints
app.use("/api", globalApiLimiter);

// =====================================================
// API DOCUMENTATION
// =====================================================

// Swagger / OpenAPI documentation
setupSwagger(app);

// =====================================================
// INFRASTRUCTURE ROUTES
// =====================================================

// Health check
app.use("/health", healthRoutes);

// API status
app.get("/api/status", (req, res) => {
  res.status(200).json({
    success: true,
    services: {
      api: "running",

      database: getDatabaseStatus().status,

      redis: getRedisStatus().status,
    },

    requestId: req.requestId || null,
  });
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

// =====================================================
// SERVER STARTUP
// =====================================================

const startServer = async () => {
  try {
    console.log("========================================");
    console.log("Starting application...");
    console.log("========================================");

    // ===================================================
    // ENVIRONMENT VALIDATION
    // ===================================================

    validateEnvironment();

    console.log(
      "Environment configuration validated"
    );

    // ===================================================
    // DATABASE
    // ===================================================

    await connectDatabase();

    // ===================================================
    // REDIS
    // ===================================================

    await connectRedis();

    // ===================================================
    // HTTP SERVER
    // ===================================================

    server = app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log("========================================");
        console.log(
          `Server running on port ${PORT}`
        );
        console.log(
          `Environment: ${appConfig.environment}`
        );
        console.log(
          `API Docs: http://localhost:${PORT}/api-docs`
        );
        console.log(
          `Health: http://localhost:${PORT}/health`
        );
        console.log("========================================");
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    // ===================================================
    // STARTUP CLEANUP
    // ===================================================

    try {
      await disconnectRedis();
    } catch (cleanupError) {
      console.error(
        "Redis startup cleanup failed:",
        cleanupError.message
      );
    }

    try {
      await disconnectDatabase();
    } catch (cleanupError) {
      console.error(
        "Database startup cleanup failed:",
        cleanupError.message
      );
    }

    process.exit(1);
  }
};

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

const shutdown = async (signal) => {
  // Prevent multiple shutdown executions
  if (isShuttingDown) {
    console.log(
      "Shutdown already in progress..."
    );

    return;
  }

  isShuttingDown = true;

  console.log(
    `${signal} received. Shutting down...`
  );

  // ===================================================
  // SHUTDOWN TIMEOUT
  // ===================================================

  const shutdownTimeout = setTimeout(() => {
    console.error(
      "Forced shutdown: timeout exceeded"
    );

    process.exit(1);
  }, 10000);

  try {
    // ===================================================
    // STOP HTTP SERVER
    // ===================================================

    if (server) {
      await new Promise(
        (resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);

              return;
            }

            console.log(
              "HTTP server closed"
            );

            resolve();
          });
        }
      );
    }

    // ===================================================
    // REDIS
    // ===================================================

    await disconnectRedis();

    // ===================================================
    // DATABASE
    // ===================================================

    await disconnectDatabase();

    // ===================================================
    // COMPLETE
    // ===================================================

    clearTimeout(shutdownTimeout);

    console.log(
      "Application shutdown complete"
    );

    process.exit(0);
  } catch (error) {
    clearTimeout(shutdownTimeout);

    console.error(
      "Shutdown error:",
      error.message
    );

    process.exit(1);
  }
};

// =====================================================
// PROCESS SIGNALS
// =====================================================

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

// =====================================================
// START
// =====================================================

startServer();