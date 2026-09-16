// =====================================================
// Mock Redis
// =====================================================

jest.mock("../../src/config/redis", () => ({
  redisClient: {
    hSet: jest.fn(),
    hGetAll: jest.fn(),
    hGet: jest.fn(),
    hDel: jest.fn(),
    del: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
  },
}));

// =====================================================
// Imports
// =====================================================

const {
  redisClient,
} = require("../../src/config/redis");

const {
  registerSession,
  getUserSessions,
  getUserSession,
  getUserSessionFamilies,
  cleanupUserSessions,
  removeSession,
  removeAllSessions,
} = require(
  "../../src/services/sessionRegistryService"
);

// =====================================================
// Test Suite
// =====================================================

describe("Session Registry Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // Register Session
  // =====================================================

  it("should register a user session", async () => {
    redisClient.hSet.mockResolvedValue(1);

    redisClient.expire.mockResolvedValue(
      true
    );

    const result =
      await registerSession({
        userId: "user-123",
        tokenId: "session-123",
        familyId: "family-123",
        device: "laptop",
        userAgent: "Chrome",
        ipAddress: "127.0.0.1",
      });

    expect(result).toMatchObject({
      tokenId: "session-123",
      familyId: "family-123",
      device: "laptop",
      userAgent: "Chrome",
      ipAddress: "127.0.0.1",
    });

    expect(
      redisClient.hSet
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      "session-123",
      expect.any(String)
    );

    expect(
      redisClient.expire
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      7 * 24 * 60 * 60
    );

    const savedSession =
      JSON.parse(
        redisClient.hSet.mock.calls[0][2]
      );

    expect(
      savedSession.tokenId
    ).toBe("session-123");

    expect(
      savedSession.familyId
    ).toBe("family-123");
  });

  // =====================================================
  // Get All Sessions
  // =====================================================

  it("should return all user sessions", async () => {
    redisClient.hGetAll.mockResolvedValue({
      "session-1": JSON.stringify({
        tokenId: "session-1",
        familyId: "family-1",
        device: "laptop",
      }),

      "session-2": JSON.stringify({
        tokenId: "session-2",
        familyId: "family-2",
        device: "mobile",
      }),
    });

    const sessions =
      await getUserSessions(
        "user-123"
      );

    expect(sessions).toHaveLength(2);

    expect(sessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tokenId: "session-1",
          familyId: "family-1",
          device: "laptop",
        }),

        expect.objectContaining({
          tokenId: "session-2",
          familyId: "family-2",
          device: "mobile",
        }),
      ])
    );

    expect(
      redisClient.hGetAll
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123"
    );
  });

  // =====================================================
  // Get Single Session
  // =====================================================

  it("should return a single user session", async () => {
    redisClient.hGet.mockResolvedValue(
      JSON.stringify({
        tokenId: "session-123",
        familyId: "family-123",
        device: "laptop",
      })
    );

    const session =
      await getUserSession({
        userId: "user-123",
        tokenId: "session-123",
      });

    expect(session).toEqual({
      tokenId: "session-123",
      familyId: "family-123",
      device: "laptop",
    });

    expect(
      redisClient.hGet
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      "session-123"
    );
  });

  // =====================================================
  // Missing Single Session
  // =====================================================

  it("should return null for missing session", async () => {
    redisClient.hGet.mockResolvedValue(
      null
    );

    const session =
      await getUserSession({
        userId: "user-123",
        tokenId: "missing-session",
      });

    expect(session).toBeNull();
  });

  // =====================================================
  // Get Unique Session Families
  // =====================================================

  it("should return unique session family IDs", async () => {
    redisClient.hGetAll.mockResolvedValue({
      "session-1": JSON.stringify({
        tokenId: "session-1",
        familyId: "family-1",
        device: "laptop",
      }),

      "session-2": JSON.stringify({
        tokenId: "session-2",
        familyId: "family-1",
        device: "mobile",
      }),

      "session-3": JSON.stringify({
        tokenId: "session-3",
        familyId: "family-2",
        device: "tablet",
      }),
    });

    const families =
      await getUserSessionFamilies(
        "user-123"
      );

    expect(families).toEqual([
      "family-1",
      "family-2",
    ]);

    expect(
      redisClient.hGetAll
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123"
    );
  });

  // =====================================================
  // Empty Session Families
  // =====================================================

  it("should return an empty array when no sessions exist", async () => {
    redisClient.hGetAll.mockResolvedValue(
      {}
    );

    const families =
      await getUserSessionFamilies(
        "user-123"
      );

    expect(families).toEqual([]);
  });

  // =====================================================
  // Remove Session
  // =====================================================

  it("should remove a single session", async () => {
    redisClient.hDel.mockResolvedValue(
      1
    );

    const result =
      await removeSession({
        userId: "user-123",
        tokenId: "session-123",
      });

    expect(result).toBe(true);

    expect(
      redisClient.hDel
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      "session-123"
    );
  });

  // =====================================================
  // Remove Missing Session
  // =====================================================

  it("should return false when removing a missing session", async () => {
    redisClient.hDel.mockResolvedValue(
      0
    );

    const result =
      await removeSession({
        userId: "user-123",
        tokenId: "missing-session",
      });

    expect(result).toBe(false);
  });

  // =====================================================
  // Remove All Sessions
  // =====================================================

  it("should remove all user sessions", async () => {
    redisClient.del.mockResolvedValue(
      1
    );

    const result =
      await removeAllSessions(
        "user-123"
      );

    expect(result).toBe(true);

    expect(
      redisClient.del
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123"
    );
  });

  // =====================================================
  // Remove All Missing Sessions
  // =====================================================

  it("should return false when no session registry exists", async () => {
    redisClient.del.mockResolvedValue(
      0
    );

    const result =
      await removeAllSessions(
        "user-123"
      );

    expect(result).toBe(false);
  });

  // =====================================================
  // Cleanup Stale Sessions
  // =====================================================

  it("should remove stale sessions from registry", async () => {
    redisClient.hGetAll.mockResolvedValue({
      "session-1": JSON.stringify({
        tokenId: "session-1",
        familyId: "family-1",
        device: "laptop",
      }),

      "session-2": JSON.stringify({
        tokenId: "session-2",
        familyId: "family-2",
        device: "mobile",
      }),
    });

    redisClient.get
      .mockResolvedValueOnce(
        JSON.stringify({
          userId: "user-123",
        })
      )
      .mockResolvedValueOnce(
        null
      );

    redisClient.hDel.mockResolvedValue(
      1
    );

    const result =
      await cleanupUserSessions(
        "user-123"
      );

    expect(
      redisClient.hGetAll
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123"
    );

    expect(
      redisClient.get
    ).toHaveBeenNthCalledWith(
      1,
      "auth:refresh:session-1"
    );

    expect(
      redisClient.get
    ).toHaveBeenNthCalledWith(
      2,
      "auth:refresh:session-2"
    );

    expect(
      redisClient.hDel
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      "session-2"
    );

    expect(result).toEqual({
      removed: 1,
      remaining: 1,
    });

    expect(
      redisClient.del
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Cleanup All Stale Sessions
  // =====================================================

  it("should remove the session registry when all sessions are stale", async () => {
    redisClient.hGetAll.mockResolvedValue({
      "session-1": JSON.stringify({
        tokenId: "session-1",
        familyId: "family-1",
      }),

      "session-2": JSON.stringify({
        tokenId: "session-2",
        familyId: "family-2",
      }),
    });

    redisClient.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    redisClient.hDel.mockResolvedValue(
      1
    );

    redisClient.del.mockResolvedValue(
      1
    );

    const result =
      await cleanupUserSessions(
        "user-123"
      );

    expect(
      redisClient.hDel
    ).toHaveBeenCalledTimes(2);

    expect(
      redisClient.hDel
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      "session-1"
    );

    expect(
      redisClient.hDel
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123",
      "session-2"
    );

    expect(
      redisClient.del
    ).toHaveBeenCalledWith(
      "auth:sessions:user-123"
    );

    expect(result).toEqual({
      removed: 2,
      remaining: 0,
    });
  });

  // =====================================================
  // Cleanup With No User ID
  // =====================================================

  it("should return zero cleanup result without userId", async () => {
    const result =
      await cleanupUserSessions();

    expect(result).toEqual({
      removed: 0,
      remaining: 0,
    });

    expect(
      redisClient.hGetAll
    ).not.toHaveBeenCalled();

    expect(
      redisClient.get
    ).not.toHaveBeenCalled();
  });
});