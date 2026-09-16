// =====================================================
// Mock Redis
// =====================================================

jest.mock("../../src/config/redis", () => ({
  redisClient: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

// =====================================================
// Mock Session Registry
// =====================================================

jest.mock(
  "../../src/services/sessionRegistryService",
  () => ({
    registerSession: jest.fn(),
    removeSession: jest.fn(),
  })
);

// =====================================================
// Imports
// =====================================================

const {
  redisClient,
} = require("../../src/config/redis");

const {
  registerSession,
  removeSession,
} = require(
  "../../src/services/sessionRegistryService"
);

const {
  createRefreshSession,
  getRefreshSession,
  validateRefreshSession,
  revokeRefreshSession,
  rotateRefreshSession,
  revokeTokenFamily,
  isTokenFamilyRevoked,
} = require(
  "../../src/services/refreshTokenService"
);

const {
  hashRefreshToken,
} = require("../../src/utils/refreshToken");

// =====================================================
// Test Suite
// =====================================================

describe("Refresh Token Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    registerSession.mockResolvedValue(
      {}
    );

    removeSession.mockResolvedValue(
      true
    );
  });

  // =====================================================
  // Create Refresh Session
  // =====================================================

  it("should create a refresh session", async () => {
    redisClient.set.mockResolvedValue(
      "OK"
    );

    const result =
      await createRefreshSession({
        userId: "user-123",
        tokenId: "session-123",
        familyId: "family-123",
      });

    expect(
      result.refreshToken
    ).toBeDefined();

    expect(
      result.tokenId
    ).toBe("session-123");

    expect(
      result.familyId
    ).toBe("family-123");

    expect(
      redisClient.set
    ).toHaveBeenCalledWith(
      "auth:refresh:session-123",
      expect.any(String),
      {
        EX: 7 * 24 * 60 * 60,
      }
    );

    const savedSession =
      JSON.parse(
        redisClient.set.mock.calls[0][1]
      );

    expect(
      savedSession.userId
    ).toBe("user-123");

    expect(
      savedSession.familyId
    ).toBe("family-123");

    expect(
      savedSession.tokenHash
    ).toBeDefined();

    // Session Registry Integration
    expect(
      registerSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: "session-123",
      familyId: "family-123",
      device: "unknown",
      userAgent: null,
      ipAddress: null,
    });
  });

  // =====================================================
  // Create Session With Device Information
  // =====================================================

  it("should register device information when creating a session", async () => {
    redisClient.set.mockResolvedValue(
      "OK"
    );

    await createRefreshSession({
      userId: "user-123",
      tokenId: "session-123",
      familyId: "family-123",
      device: "laptop",
      userAgent: "Chrome",
      ipAddress: "127.0.0.1",
    });

    expect(
      registerSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: "session-123",
      familyId: "family-123",
      device: "laptop",
      userAgent: "Chrome",
      ipAddress: "127.0.0.1",
    });
  });

  // =====================================================
  // Get Refresh Session
  // =====================================================

  it("should return an existing session", async () => {
    redisClient.get.mockResolvedValue(
      JSON.stringify({
        userId: "user-123",
        tokenHash: "hash",
        familyId: "family-123",
        createdAt:
          "2026-01-01T00:00:00.000Z",
      })
    );

    const session =
      await getRefreshSession(
        "session-123"
      );

    expect(session).toEqual({
      userId: "user-123",
      tokenHash: "hash",
      familyId: "family-123",
      createdAt:
        "2026-01-01T00:00:00.000Z",
    });

    expect(
      redisClient.get
    ).toHaveBeenCalledWith(
      "auth:refresh:session-123"
    );
  });

  // =====================================================
  // Missing Refresh Session
  // =====================================================

  it("should return null for missing session", async () => {
    redisClient.get.mockResolvedValue(
      null
    );

    const session =
      await getRefreshSession(
        "missing-session"
      );

    expect(session).toBeNull();
  });

  // =====================================================
  // Validate Refresh Session
  // =====================================================

  it("should validate a correct refresh token", async () => {
    const refreshToken =
      "test-refresh-token";

    const tokenHash =
      hashRefreshToken(
        refreshToken
      );

    redisClient.get.mockResolvedValue(
      JSON.stringify({
        userId: "user-123",
        tokenHash,
        familyId: "family-123",
        createdAt:
          "2026-01-01T00:00:00.000Z",
      })
    );

    const session =
      await validateRefreshSession({
        tokenId: "session-123",
        refreshToken,
      });

    expect(session).toEqual({
      userId: "user-123",
      tokenHash,
      familyId: "family-123",
      createdAt:
        "2026-01-01T00:00:00.000Z",
    });
  });

  // =====================================================
  // Invalid Refresh Token
  // =====================================================

  it("should reject an incorrect refresh token", async () => {
    const validToken =
      "valid-refresh-token";

    const invalidToken =
      "invalid-refresh-token";

    const tokenHash =
      hashRefreshToken(
        validToken
      );

    redisClient.get.mockResolvedValue(
      JSON.stringify({
        userId: "user-123",
        tokenHash,
        familyId: "family-123",
        createdAt:
          "2026-01-01T00:00:00.000Z",
      })
    );

    const session =
      await validateRefreshSession({
        tokenId: "session-123",
        refreshToken:
          invalidToken,
      });

    expect(session).toBeNull();
  });

  // =====================================================
  // Revoke Refresh Session
  // =====================================================

  it("should revoke a refresh session", async () => {
    redisClient.del.mockResolvedValue(
      1
    );

    const result =
      await revokeRefreshSession(
        "session-123"
      );

    expect(result).toBe(true);

    expect(
      redisClient.del
    ).toHaveBeenCalledWith(
      "auth:refresh:session-123"
    );

    // Without userId, registry should not be touched
    expect(
      removeSession
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Revoke Refresh Session + Registry
  // =====================================================

  it("should revoke refresh session and remove registry entry", async () => {
    redisClient.del.mockResolvedValue(
      1
    );

    removeSession.mockResolvedValue(
      true
    );

    const result =
      await revokeRefreshSession(
        "session-123",
        "user-123"
      );

    expect(result).toBe(true);

    expect(
      redisClient.del
    ).toHaveBeenCalledWith(
      "auth:refresh:session-123"
    );

    expect(
      removeSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: "session-123",
    });
  });

  // =====================================================
  // Revoke Missing Session
  // =====================================================

  it("should return false when session does not exist", async () => {
    redisClient.del.mockResolvedValue(
      0
    );

    const result =
      await revokeRefreshSession(
        "missing-session"
      );

    expect(result).toBe(false);
  });

  // =====================================================
  // Revoke Token Family
  // =====================================================

  it("should revoke a token family", async () => {
    redisClient.set.mockResolvedValue(
      "OK"
    );

    const result =
      await revokeTokenFamily(
        "family-123"
      );

    expect(result).toBe(true);

    expect(
      redisClient.set
    ).toHaveBeenCalledWith(
      "auth:family:family-123",
      "revoked",
      {
        EX: 7 * 24 * 60 * 60,
      }
    );
  });

  // =====================================================
  // Check Revoked Token Family
  // =====================================================

  it("should detect a revoked token family", async () => {
    redisClient.get.mockResolvedValue(
      "revoked"
    );

    const result =
      await isTokenFamilyRevoked(
        "family-123"
      );

    expect(result).toBe(true);

    expect(
      redisClient.get
    ).toHaveBeenCalledWith(
      "auth:family:family-123"
    );
  });

  // =====================================================
  // Check Active Token Family
  // =====================================================

  it("should return false for an active token family", async () => {
    redisClient.get.mockResolvedValue(
      null
    );

    const result =
      await isTokenFamilyRevoked(
        "family-123"
      );

    expect(result).toBe(false);
  });

  // =====================================================
  // Invalid Rotation
  // =====================================================

  it("should reject rotation with an invalid refresh token", async () => {
    redisClient.get.mockResolvedValue(
      JSON.stringify({
        userId: "user-123",
        tokenHash:
          "different-hash",
        familyId: "family-123",
        createdAt:
          "2026-01-01T00:00:00.000Z",
      })
    );

    await expect(
      rotateRefreshSession({
        oldTokenId: "session-123",
        oldRefreshToken:
          "invalid-refresh-token",
      })
    ).rejects.toMatchObject({
      message:
        "Refresh token reuse detected",
      status: 401,
    });

    expect(
      redisClient.set
    ).toHaveBeenCalledWith(
      "auth:family:family-123",
      "revoked",
      {
        EX: 7 * 24 * 60 * 60,
      }
    );

    expect(
      redisClient.del
    ).not.toHaveBeenCalled();

    expect(
      removeSession
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Revoked Family Should Reject Rotation
  // =====================================================

  it("should reject rotation when token family is revoked", async () => {
    redisClient.get
      .mockResolvedValueOnce(
        JSON.stringify({
          userId: "user-123",
          tokenHash:
            hashRefreshToken(
              "valid-refresh-token"
            ),
          familyId: "family-123",
          createdAt:
            "2026-01-01T00:00:00.000Z",
        })
      )
      .mockResolvedValueOnce(
        "revoked"
      );

    await expect(
      rotateRefreshSession({
        oldTokenId: "session-123",
        oldRefreshToken:
          "valid-refresh-token",
      })
    ).rejects.toMatchObject({
      message:
        "Refresh token family has been revoked",
      status: 401,
    });

    expect(
      redisClient.del
    ).not.toHaveBeenCalled();

    expect(
      removeSession
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Valid Rotation
  // =====================================================

  it("should rotate a valid refresh session", async () => {
    const oldRefreshToken =
      "old-refresh-token";

    const oldTokenHash =
      hashRefreshToken(
        oldRefreshToken
      );

    redisClient.get
      .mockResolvedValueOnce(
        JSON.stringify({
          userId: "user-123",
          tokenHash:
            oldTokenHash,
          familyId: "family-123",
          createdAt:
            "2026-01-01T00:00:00.000Z",
        })
      )
      .mockResolvedValueOnce(
        null
      );

    redisClient.del.mockResolvedValue(
      1
    );

    redisClient.set.mockResolvedValue(
      "OK"
    );

    const result =
      await rotateRefreshSession({
        oldTokenId: "session-123",
        oldRefreshToken,
      });

    expect(
      result.refreshToken
    ).toBeDefined();

    expect(
      result.tokenId
    ).toBeDefined();

    expect(
      result.familyId
    ).toBe("family-123");

    expect(
      result.tokenId
    ).not.toBe(
      "session-123"
    );

    expect(
      result.refreshToken
    ).not.toBe(
      oldRefreshToken
    );

    // Old refresh session revoked
    expect(
      redisClient.del
    ).toHaveBeenCalledWith(
      "auth:refresh:session-123"
    );

    // Old registry entry removed
    expect(
      removeSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: "session-123",
    });

    // New refresh session created
    expect(
      redisClient.set
    ).toHaveBeenCalledWith(
      expect.stringMatching(
        /^auth:refresh:/
      ),
      expect.any(String),
      {
        EX: 7 * 24 * 60 * 60,
      }
    );

    // New registry entry created
    expect(
      registerSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: result.tokenId,
      familyId: "family-123",
      device: "unknown",
      userAgent: null,
      ipAddress: null,
    });
  });

  // =====================================================
  // Valid Rotation With Device Information
  // =====================================================

  it("should preserve device information during rotation", async () => {
    const oldRefreshToken =
      "old-refresh-token";

    const oldTokenHash =
      hashRefreshToken(
        oldRefreshToken
      );

    redisClient.get
      .mockResolvedValueOnce(
        JSON.stringify({
          userId: "user-123",
          tokenHash:
            oldTokenHash,
          familyId: "family-123",
          createdAt:
            "2026-01-01T00:00:00.000Z",
        })
      )
      .mockResolvedValueOnce(
        null
      );

    redisClient.del.mockResolvedValue(
      1
    );

    redisClient.set.mockResolvedValue(
      "OK"
    );

    const result =
      await rotateRefreshSession({
        oldTokenId: "session-123",
        oldRefreshToken,
        device: "mobile",
        userAgent: "Chrome Mobile",
        ipAddress: "127.0.0.1",
      });

    expect(
      registerSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: result.tokenId,
      familyId: "family-123",
      device: "mobile",
      userAgent: "Chrome Mobile",
      ipAddress: "127.0.0.1",
    });
  });
});