const {
  revokeRefreshSession,
  revokeTokenFamily,
} = require("./refreshTokenService");

const {
  getUserSessionFamilies,
  removeSession,
  removeAllSessions,
} = require("./sessionRegistryService");

// =====================================================
// Revoke Current Session
// =====================================================

const revokeCurrentSession = async ({
  tokenId,
  userId,
}) => {
  if (!tokenId) {
    const error = new Error(
      "tokenId is required"
    );

    error.status = 400;

    throw error;
  }

  if (!userId) {
    const error = new Error(
      "userId is required"
    );

    error.status = 400;

    throw error;
  }

  await revokeRefreshSession(
    tokenId,
    userId
  );

  return true;
};

// =====================================================
// Revoke Complete Session Family
// =====================================================

const revokeCompleteSessionFamily =
  async ({
    familyId,
  }) => {
    if (!familyId) {
      const error = new Error(
        "familyId is required"
      );

      error.status = 400;

      throw error;
    }

    await revokeTokenFamily(
      familyId
    );

    return true;
  };

// =====================================================
// Logout Current Session
// =====================================================

const logout = async ({
  tokenId,
  userId,
  familyId,
  revokeFamily = false,
}) => {
  if (!tokenId) {
    const error = new Error(
      "tokenId is required"
    );

    error.status = 400;

    throw error;
  }

  if (!userId) {
    const error = new Error(
      "userId is required"
    );

    error.status = 400;

    throw error;
  }

  await revokeRefreshSession(
    tokenId,
    userId
  );

  if (revokeFamily) {
    if (!familyId) {
      const error = new Error(
        "familyId is required when revokeFamily is true"
      );

      error.status = 400;

      throw error;
    }

    await revokeTokenFamily(
      familyId
    );

    await removeSession({
      userId,
      tokenId,
    });
  }

  return true;
};

// =====================================================
// Logout All Devices
// =====================================================

const logoutAllDevices = async ({
  userId,
}) => {
  if (!userId) {
    const error = new Error(
      "userId is required"
    );

    error.status = 400;

    throw error;
  }

  // Discover all active session families
  const familyIds =
    await getUserSessionFamilies(
      userId
    );

  // Revoke every session family
  for (const familyId of familyIds) {
    await revokeTokenFamily(
      familyId
    );
  }

  // Remove complete session registry
  await removeAllSessions(
    userId
  );

  return {
    success: true,
    revokedFamilies:
      familyIds.length,
  };
};

// =====================================================
// Export
// =====================================================

module.exports = {
  revokeCurrentSession,
  revokeCompleteSessionFamily,
  logout,
  logoutAllDevices,
};