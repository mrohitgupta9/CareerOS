jest.mock(
  "bullmq",
  () => {
    const add = jest.fn();

    const close = jest.fn();

    const on = jest.fn();

    const Queue = jest.fn(
      () => ({
        add,
        close,
        on,
      })
    );

    return {
      Queue,

      __mockQueue: {
        add,
        close,
        on,
      },
    };
  }
);

describe(
  "Job Queue",
  () => {
    let Queue;
    let mockQueue;
    let addJob;
    let closeJobQueue;

    beforeEach(() => {
      jest.resetModules();

      const bullmq =
        require("bullmq");

      Queue =
        bullmq.Queue;

      mockQueue =
        bullmq.__mockQueue;

      const jobQueueModule =
        require(
          "../../src/jobs/queues/jobQueue"
        );

      addJob =
        jobQueueModule.addJob;

      closeJobQueue =
        jobQueueModule.closeJobQueue;
    });

    // =================================================
    // Queue Initialization
    // =================================================

    it(
      "should initialize the application job queue",
      () => {
        expect(
          Queue
        ).toHaveBeenCalledTimes(1);

        const [
          queueName,
          options,
        ] = Queue.mock.calls[0];

        expect(
          queueName
        ).toBe(
          "application-jobs"
        );

        expect(
          options
        ).toBeDefined();

        expect(
          options.connection
        ).toBeDefined();

        expect(
          options.connection.host
        ).toBeDefined();

        expect(
          options.connection.port
        ).toBeDefined();

        expect(
          options.connection
            .maxRetriesPerRequest
        ).toBeNull();
      }
    );

    // =================================================
    // Default Job Options
    // =================================================

    it(
      "should configure default job options",
      () => {
        const [
          ,
          options,
        ] = Queue.mock.calls[0];

        expect(
          options.defaultJobOptions
        ).toBeDefined();

        expect(
          options.defaultJobOptions
            .attempts
        ).toBe(3);

        expect(
          options.defaultJobOptions
            .backoff
        ).toEqual({
          type: "exponential",
          delay: 5000,
        });

        expect(
          options.defaultJobOptions
            .removeOnComplete
        ).toEqual({
          count: 100,
        });

        expect(
          options.defaultJobOptions
            .removeOnFail
        ).toEqual({
          count: 100,
        });
      }
    );

    // =================================================
    // Add Job
    // =================================================

    it(
      "should add a job",
      async () => {
        mockQueue.add.mockResolvedValue({
          id: "job-1",
        });

        const result =
          await addJob(
            "test-job",
            {
              value: true,
            }
          );

        expect(
          mockQueue.add
        ).toHaveBeenCalledWith(
          "test-job",
          {
            value: true,
          },
          {}
        );

        expect(
          result
        ).toEqual({
          id: "job-1",
        });
      }
    );

    // =================================================
    // Job Name Validation
    // =================================================

    it(
      "should reject missing job name",
      async () => {
        await expect(
          addJob()
        ).rejects.toThrow(
          "Job name is required"
        );
      }
    );

    // =================================================
    // Close Queue
    // =================================================

    it(
      "should close the queue",
      async () => {
        mockQueue.close
          .mockResolvedValue();

        await closeJobQueue();

        expect(
          mockQueue.close
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );
  }
);