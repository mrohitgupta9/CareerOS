// =====================================================
// Mock Refresh Token Service
// =====================================================

jest.mock(
  "../../src/services/refreshTokenService",
  () => ({
    revokeRefreshSession:
      jest.fn(),

    revokeTokenFamily:
      jest.fn(),
  })
);

// =====================================================
// Mock Session Registry Service
// =====================================================

jest.mock(
  "../../src/services/sessionRegistryService",
  () => ({
    getUserSessionFamilies:
      jest.fn(),

    removeSession:
      jest.fn(),

    removeAllSessions:
      jest.fn(),
  })
);

// =====================================================
// Imports
// =====================================================

const {
  revokeRefreshSession,
  revokeTokenFamily,
} = require(
  "../../src/services/refreshTokenService"
);

const {
  getUserSessionFamilies,
  removeSession,
  removeAllSessions,
} = require(
  "../../src/services/sessionRegistryService"
);

const {
  revokeCurrentSession,
  revokeCompleteSessionFamily,
  logout,
  logoutAllDevices,
} = require(
  "../../src/services/authSessionService"
);

// =====================================================
// Test Suite
// =====================================================

describe("Auth Session Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    revokeRefreshSession.mockResolvedValue(
      true
    );

    revokeTokenFamily.mockResolvedValue(
      true
    );

    getUserSessionFamilies.mockResolvedValue(
      []
    );

    removeSession.mockResolvedValue(
      true
    );

    removeAllSessions.mockResolvedValue(
      true
    );
  });

  // =====================================================
  // Current Session
  // =====================================================

  it("should revoke the current session", async () => {
    const result =
      await revokeCurrentSession({
        tokenId: "session-123",
        userId: "user-123",
      });

    expect(result).toBe(true);

    expect(
      revokeRefreshSession
    ).toHaveBeenCalledWith(
      "session-123",
      "user-123"
    );
  });

  // =====================================================
  // Current Session Validation - Token
  // =====================================================

  it("should reject current session revocation without tokenId", async () => {
    await expect(
      revokeCurrentSession({
        userId: "user-123",
      })
    ).rejects.toMatchObject({
      message:
        "tokenId is required",
      status: 400,
    });

    expect(
      revokeRefreshSession
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Current Session Validation - User
  // =====================================================

  it("should reject current session revocation without userId", async () => {
    await expect(
      revokeCurrentSession({
        tokenId: "session-123",
      })
    ).rejects.toMatchObject({
      message:
        "userId is required",
      status: 400,
    });

    expect(
      revokeRefreshSession
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Complete Session Family
  // =====================================================

  it("should revoke a complete session family", async () => {
    const result =
      await revokeCompleteSessionFamily({
        familyId: "family-123",
      });

    expect(result).toBe(true);

    expect(
      revokeTokenFamily
    ).toHaveBeenCalledWith(
      "family-123"
    );
  });

  // =====================================================
  // Family Validation
  // =====================================================

  it("should reject family revocation without familyId", async () => {
    await expect(
      revokeCompleteSessionFamily({})
    ).rejects.toMatchObject({
      message:
        "familyId is required",
      status: 400,
    });

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Logout
  // =====================================================

  it("should logout and revoke current session", async () => {
    const result =
      await logout({
        tokenId: "session-123",
        userId: "user-123",
      });

    expect(result).toBe(true);

    expect(
      revokeRefreshSession
    ).toHaveBeenCalledWith(
      "session-123",
      "user-123"
    );

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Logout + Family Revocation
  // =====================================================

  it("should logout and revoke the complete token family", async () => {
    const result =
      await logout({
        tokenId: "session-123",
        userId: "user-123",
        familyId: "family-123",
        revokeFamily: true,
      });

    expect(result).toBe(true);

    expect(
      revokeRefreshSession
    ).toHaveBeenCalledWith(
      "session-123",
      "user-123"
    );

    expect(
      revokeTokenFamily
    ).toHaveBeenCalledWith(
      "family-123"
    );

    expect(
      removeSession
    ).toHaveBeenCalledWith({
      userId: "user-123",
      tokenId: "session-123",
    });
  });

  // =====================================================
  // Family Revocation Validation
  // =====================================================

  it("should reject family logout without familyId", async () => {
    await expect(
      logout({
        tokenId: "session-123",
        userId: "user-123",
        revokeFamily: true,
      })
    ).rejects.toMatchObject({
      message:
        "familyId is required when revokeFamily is true",
      status: 400,
    });

    expect(
      revokeRefreshSession
    ).toHaveBeenCalledWith(
      "session-123",
      "user-123"
    );

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Missing Token ID
  // =====================================================

  it("should reject logout without tokenId", async () => {
    await expect(
      logout({
        userId: "user-123",
      })
    ).rejects.toMatchObject({
      message:
        "tokenId is required",
      status: 400,
    });

    expect(
      revokeRefreshSession
    ).not.toHaveBeenCalled();

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Missing User ID
  // =====================================================

  it("should reject logout without userId", async () => {
    await expect(
      logout({
        tokenId: "session-123",
      })
    ).rejects.toMatchObject({
      message:
        "userId is required",
      status: 400,
    });

    expect(
      revokeRefreshSession
    ).not.toHaveBeenCalled();

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Logout All Devices
  // =====================================================

  it("should logout the user from all devices", async () => {
    getUserSessionFamilies.mockResolvedValue([
      "family-1",
      "family-2",
      "family-3",
    ]);

    const result =
      await logoutAllDevices({
        userId: "user-123",
      });

    expect(
      getUserSessionFamilies
    ).toHaveBeenCalledWith(
      "user-123"
    );

    expect(
      revokeTokenFamily
    ).toHaveBeenCalledTimes(3);

    expect(
      revokeTokenFamily
    ).toHaveBeenNthCalledWith(
      1,
      "family-1"
    );

    expect(
      revokeTokenFamily
    ).toHaveBeenNthCalledWith(
      2,
      "family-2"
    );

    expect(
      revokeTokenFamily
    ).toHaveBeenNthCalledWith(
      3,
      "family-3"
    );

    expect(
      removeAllSessions
    ).toHaveBeenCalledWith(
      "user-123"
    );

    expect(result).toEqual({
      success: true,
      revokedFamilies: 3,
    });
  });

  // =====================================================
  // Logout All Devices - No Sessions
  // =====================================================

  it("should logout all devices when no active sessions exist", async () => {
    getUserSessionFamilies.mockResolvedValue(
      []
    );

    const result =
      await logoutAllDevices({
        userId: "user-123",
      });

    expect(
      getUserSessionFamilies
    ).toHaveBeenCalledWith(
      "user-123"
    );

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();

    expect(
      removeAllSessions
    ).toHaveBeenCalledWith(
      "user-123"
    );

    expect(result).toEqual({
      success: true,
      revokedFamilies: 0,
    });
  });

  // =====================================================
  // Logout All Devices Validation
  // =====================================================

  it("should reject logout all devices without userId", async () => {
    await expect(
      logoutAllDevices({})
    ).rejects.toMatchObject({
      message:
        "userId is required",
      status: 400,
    });

    expect(
      getUserSessionFamilies
    ).not.toHaveBeenCalled();

    expect(
      revokeTokenFamily
    ).not.toHaveBeenCalled();

    expect(
      removeAllSessions
    ).not.toHaveBeenCalled();
  });

  // =====================================================
  // Logout All Devices - Unique Families
  // =====================================================

  it("should revoke each discovered session family", async () => {
    getUserSessionFamilies.mockResolvedValue([
      "family-1",
      "family-2",
    ]);

    const result =
      await logoutAllDevices({
        userId: "user-123",
      });

    expect(
      revokeTokenFamily
    ).toHaveBeenCalledTimes(2);

    expect(
      revokeTokenFamily
    ).toHaveBeenCalledWith(
      "family-1"
    );

    expect(
      revokeTokenFamily
    ).toHaveBeenCalledWith(
      "family-2"
    );

    expect(result.revokedFamilies).toBe(
      2
    );
  });
});