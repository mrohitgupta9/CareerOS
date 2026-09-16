const {
  Worker,
} = require("bullmq");

const {
  JOB_CONFIG,
} = require("../jobConfig");

const redisUrl =
  process.env.REDIS_URL ||
  "redis://localhost:6379";

const redisConnection =
  new URL(redisUrl);

// =====================================================
// Job Processor
// =====================================================

const processJob = async (
  job
) => {
  console.log(
    `Processing job: ${job.name}`,
    {
      jobId: job.id,
    }
  );

  switch (job.name) {
    default:
      console.warn(
        `Unknown job type: ${job.name}`
      );

      throw new Error(
        `Unknown job type: ${job.name}`
      );
  }
};

// =====================================================
// Worker
// =====================================================

const jobWorker =
  new Worker(
    "application-jobs",
    processJob,
    {
      connection: {
        host:
          redisConnection.hostname,

        port:
          Number(
            redisConnection.port ||
              6379
          ),

        username:
          redisConnection.username ||
          undefined,

        password:
          redisConnection.password ||
          undefined,

        maxRetriesPerRequest:
          null,
      },

      concurrency:
        JOB_CONFIG.DEFAULT_CONCURRENCY,
    }
  );

// =====================================================
// Worker Events
// =====================================================

jobWorker.on(
  "completed",
  (job) => {
    console.log(
      `Job completed: ${job.name}`,
      {
        jobId: job.id,
      }
    );
  }
);

jobWorker.on(
  "failed",
  (job, error) => {
    console.error(
      "Job failed:",
      {
        jobId:
          job?.id || null,

        jobName:
          job?.name || null,

        error:
          error.message,
      }
    );
  }
);

jobWorker.on(
  "error",
  (error) => {
    console.error(
      "Worker error:",
      error.message
    );
  }
);

// =====================================================
// Shutdown
// =====================================================

const closeJobWorker =
  async () => {
    await jobWorker.close();
  };

module.exports = {
  jobWorker,
  closeJobWorker,
};