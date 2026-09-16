jest.mock(
  "../../src/config/redis",
  () => ({
    redisClient: {
      isReady: true,

      get: jest.fn(),

      set: jest.fn(),

      del: jest.fn(),

      exists: jest.fn(),
    },
  })
);

const {
  redisClient,
} = require(
  "../../src/config/redis"
);

const {
  getCache,
  setCache,
  deleteCache,
  hasCache,
} = require(
  "../../src/utils/cache"
);

describe(
  "Cache Utilities",
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    // -------------------------------------------------
    // GET
    // -------------------------------------------------

    it(
      "should return parsed JSON cache",
      async () => {
        redisClient.get.mockResolvedValue(
          JSON.stringify({
            id: 1,
            name: "Test",
          })
        );

        const result =
          await getCache(
            "test:key"
          );

        expect(result).toEqual({
          id: 1,
          name: "Test",
        });

        expect(
          redisClient.get
        ).toHaveBeenCalledWith(
          "test:key"
        );
      }
    );

    // -------------------------------------------------
    // CACHE MISS
    // -------------------------------------------------

    it(
      "should return null on cache miss",
      async () => {
        redisClient.get.mockResolvedValue(
          null
        );

        const result =
          await getCache(
            "test:key"
          );

        expect(result).toBeNull();
      }
    );

    // -------------------------------------------------
    // SET
    // -------------------------------------------------

    it(
      "should set cache with TTL",
      async () => {
        redisClient.set.mockResolvedValue(
          "OK"
        );

        const result =
          await setCache(
            "test:key",
            {
              value: true,
            },
            60
          );

        expect(
          redisClient.set
        ).toHaveBeenCalledWith(
          "test:key",
          JSON.stringify({
            value: true,
          }),
          {
            EX: 60,
          }
        );

        expect(result).toBe(true);
      }
    );

    // -------------------------------------------------
    // TTL LIMIT
    // -------------------------------------------------

    it(
      "should cap TTL at maximum",
      async () => {
        redisClient.set.mockResolvedValue(
          "OK"
        );

        await setCache(
          "test:key",
          {
            value: true,
          },
          999999
        );

        expect(
          redisClient.set
        ).toHaveBeenCalledWith(
          "test:key",
          JSON.stringify({
            value: true,
          }),
          {
            EX: 86400,
          }
        );
      }
    );

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    it(
      "should delete cache",
      async () => {
        redisClient.del.mockResolvedValue(
          1
        );

        const result =
          await deleteCache(
            "test:key"
          );

        expect(
          redisClient.del
        ).toHaveBeenCalledWith(
          "test:key"
        );

        expect(result).toBe(true);
      }
    );

    // -------------------------------------------------
    // EXISTS
    // -------------------------------------------------

    it(
      "should return true when cache exists",
      async () => {
        redisClient.exists.mockResolvedValue(
          1
        );

        const result =
          await hasCache(
            "test:key"
          );

        expect(
          redisClient.exists
        ).toHaveBeenCalledWith(
          "test:key"
        );

        expect(result).toBe(true);
      }
    );

    // -------------------------------------------------
    // EXISTS FALSE
    // -------------------------------------------------

    it(
      "should return false when cache does not exist",
      async () => {
        redisClient.exists.mockResolvedValue(
          0
        );

        const result =
          await hasCache(
            "test:key"
          );

        expect(result).toBe(false);
      }
    );
  }
);