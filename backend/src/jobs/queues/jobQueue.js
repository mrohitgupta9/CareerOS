const {
  Queue,
} = require("bullmq");

const {
  JOB_CONFIG,
} = require("../jobConfig");

// =====================================================
// Redis Connection
// =====================================================

const redisUrl =
  process.env.REDIS_URL ||
  "redis://localhost:6379";

const redisConnection =
  new URL(redisUrl);

// =====================================================
// BullMQ Redis Configuration
// =====================================================

const connection = {
  host:
    redisConnection.hostname ||
    "localhost",

  port:
    Number(
      redisConnection.port || 6379
    ),

  maxRetriesPerRequest: null,
};

if (redisConnection.username) {
  connection.username =
    decodeURIComponent(
      redisConnection.username
    );
}

if (redisConnection.password) {
  connection.password =
    decodeURIComponent(
      redisConnection.password
    );
}

// =====================================================
// Job Queue
// =====================================================

const jobQueue = new Queue(
  "application-jobs",
  {
    connection,

    defaultJobOptions: {
      attempts:
        JOB_CONFIG.DEFAULT_ATTEMPTS,

      backoff: {
        type: "exponential",

        delay:
          JOB_CONFIG.DEFAULT_BACKOFF_MS,
      },

      removeOnComplete: {
        count:
          JOB_CONFIG.DEFAULT_REMOVE_ON_COMPLETE,
      },

      removeOnFail: {
        count:
          JOB_CONFIG.DEFAULT_REMOVE_ON_FAIL,
      },
    },
  }
);

// =====================================================
// Queue Error
// =====================================================

jobQueue.on(
  "error",
  (error) => {
    console.error(
      "Job queue error:",
      error.message
    );
  }
);

// =====================================================
// Add Job
// =====================================================

const addJob = async (
  name,
  data = {},
  options = {}
) => {
  if (
    !name ||
    typeof name !== "string"
  ) {
    throw new Error(
      "Job name is required"
    );
  }

  return jobQueue.add(
    name,
    data,
    options
  );
};

// =====================================================
// Close Queue
// =====================================================

const closeJobQueue =
  async () => {
    await jobQueue.close();
  };

// =====================================================
// Export
// =====================================================

module.exports = {
  jobQueue,
  addJob,
  closeJobQueue,
};