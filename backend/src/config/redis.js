const { createClient } = require("redis");

// =====================================================
// CONFIGURATION
// =====================================================

const isProduction =
  process.env.NODE_ENV === "production";

const redisUrl =
  process.env.REDIS_URL ||
  (isProduction
    ? null
    : "redis://localhost:6379");

// =====================================================
// VALIDATE REDIS URL
// =====================================================

if (!redisUrl) {
  throw new Error(
    "REDIS_URL is not defined in production environment"
  );
}

let parsedRedisUrl;

try {
  parsedRedisUrl = new URL(redisUrl);
} catch (error) {
  throw new Error(
    "REDIS_URL is not a valid Redis connection URL"
  );
}

const supportedProtocols = [
  "redis:",
  "rediss:",
];

if (
  !supportedProtocols.includes(
    parsedRedisUrl.protocol
  )
) {
  throw new Error(
    "REDIS_URL must use redis:// or rediss:// protocol"
  );
}

// =====================================================
// REDIS CLIENT
// =====================================================

const redisClient = createClient({
  url: redisUrl,

  socket: {
    reconnectStrategy: (retries) => {
      return Math.min(
        retries * 500,
        5000
      );
    },
  },
});

// =====================================================
// EVENTS
// =====================================================

redisClient.on("connect", () => {
  console.log(
    "Redis connection established"
  );
});

redisClient.on("ready", () => {
  console.log(
    "Redis connected successfully"
  );
});

redisClient.on("error", (error) => {
  console.error(
    "Redis error:",
    error.message
  );
});

redisClient.on("reconnecting", () => {
  console.log(
    "Redis reconnecting..."
  );
});

redisClient.on("end", () => {
  console.log(
    "Redis connection closed"
  );
});

// =====================================================
// CONNECT
// =====================================================

const connectRedis = async () => {
  if (redisClient.isReady) {
    return redisClient;
  }

  if (redisClient.isOpen) {
    return redisClient;
  }

  try {
    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error(
      "Redis connection failed:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// DISCONNECT
// =====================================================

const disconnectRedis = async () => {
  if (!redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.quit();

    console.log(
      "Redis disconnected"
    );
  } catch (error) {
    console.error(
      "Redis disconnect failed:",
      error.message
    );

    // Force-close if graceful shutdown fails
    try {
      redisClient.destroy();
    } catch {
      // Ignore secondary cleanup error
    }
  }
};

// =====================================================
// STATUS
// =====================================================

const getRedisStatus = () => ({
  status: redisClient.isReady
    ? "connected"
    : "disconnected",

  ready: redisClient.isReady,

  open: redisClient.isOpen,
});

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
  getRedisStatus,
};