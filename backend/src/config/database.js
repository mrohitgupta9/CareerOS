const mongoose = require("mongoose");

const {
  DATABASE_PERFORMANCE,
} = require("./databasePerformance");

// =====================================================
// Database Configuration
// =====================================================

const DATABASE_OPTIONS = {
  serverSelectionTimeoutMS: 10000,

  connectTimeoutMS: 10000,

  socketTimeoutMS: 45000,

  maxPoolSize: 10,

  minPoolSize: 2,

  maxIdleTimeMS: 30000,
};

// =====================================================
// Connect Database
// =====================================================

const connectDatabase = async () => {
  const mongoUri =
    process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is not defined in environment variables"
    );
  }

  try {
    const connection =
      await mongoose.connect(
        mongoUri,
        DATABASE_OPTIONS
      );

    console.log(
      `MongoDB connected: ${connection.connection.name}`
    );

    console.log(
      `MongoDB pool: min=${DATABASE_OPTIONS.minPoolSize}, max=${DATABASE_OPTIONS.maxPoolSize}`
    );

    console.log(
      `MongoDB query timeout: ${DATABASE_PERFORMANCE.QUERY_MAX_TIME_MS}ms`
    );

    return connection;
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// Disconnect Database
// =====================================================

const disconnectDatabase =
  async () => {
    if (
      mongoose.connection
        .readyState !== 0
    ) {
      await mongoose.connection.close();

      console.log(
        "MongoDB disconnected"
      );
    }
  };

// =====================================================
// Database Status
// =====================================================

const getDatabaseStatus =
  () => {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      status:
        states[
          mongoose.connection
            .readyState
        ] || "unknown",

      name:
        mongoose.connection
          .name || null,

      host:
        mongoose.connection
          .host || null,

      port:
        mongoose.connection
          .port || null,
    };
  };

// =====================================================
// Export
// =====================================================

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
  DATABASE_OPTIONS,
};