const {
  redisClient,
} = require("../config/redis");

const {
  generateRefreshToken,
  hashRefreshToken,
} = require("../utils/refreshToken");

const {
  registerSession,
  removeSession,
} = require("./sessionRegistryService");

// =====================================================
// Configuration
// =====================================================

const SESSION_PREFIX =
  "auth:refresh:";

const FAMILY_PREFIX =
  "auth:family:";

const REFRESH_TOKEN_TTL =
  7 * 24 * 60 * 60;

// =====================================================
// Internal Helpers
// =====================================================

const getSessionKey = (tokenId) => {
  return `${SESSION_PREFIX}${tokenId}`;
};

const getFamilyKey = (familyId) => {
  return `${FAMILY_PREFIX}${familyId}`;
};

// =====================================================
// Create Refresh Session
// =====================================================

const createRefreshSession = async ({
  userId,
  tokenId,
  familyId,
  device = "unknown",
  userAgent = null,
  ipAddress = null,
}) => {
  if (
    !userId ||
    !tokenId ||
    !familyId
  ) {
    throw new Error(
      "userId, tokenId and familyId are required"
    );
  }

  const refreshToken =
    generateRefreshToken();

  const tokenHash =
    hashRefreshToken(
      refreshToken
    );

  const redisKey =
    getSessionKey(tokenId);

  const session = {
    userId: String(userId),
    tokenHash,
    familyId,
    createdAt:
      new Date().toISOString(),
  };

  // -----------------------------------------------
  // Store refresh session
  // -----------------------------------------------

  await redisClient.set(
    redisKey,
    JSON.stringify(session),
    {
      EX: REFRESH_TOKEN_TTL,
    }
  );

  // -----------------------------------------------
  // Register device session
  // -----------------------------------------------

  await registerSession({
    userId,
    tokenId,
    familyId,
    device,
    userAgent,
    ipAddress,
  });

  return {
    refreshToken,
    tokenId,
    familyId,
  };
};

// =====================================================
// Get Refresh Session
// =====================================================

const getRefreshSession = async (
  tokenId
) => {
  if (!tokenId) {
    return null;
  }

  const session =
    await redisClient.get(
      getSessionKey(tokenId)
    );

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
};

// =====================================================
// Validate Refresh Session
// =====================================================

const validateRefreshSession = async ({
  tokenId,
  refreshToken,
}) => {
  if (
    !tokenId ||
    !refreshToken
  ) {
    return null;
  }

  const session =
    await getRefreshSession(
      tokenId
    );

  if (!session) {
    return null;
  }

  const tokenHash =
    hashRefreshToken(
      refreshToken
    );

  if (
    tokenHash !== session.tokenHash
  ) {
    return null;
  }

  return session;
};

// =====================================================
// Revoke Refresh Session
// =====================================================

const revokeRefreshSession = async (
  tokenId,
  userId = null
) => {
  if (!tokenId) {
    return false;
  }

  const deleted =
    await redisClient.del(
      getSessionKey(tokenId)
    );

  // -----------------------------------------------
  // Remove from device registry
  // -----------------------------------------------

  if (userId) {
    await removeSession({
      userId,
      tokenId,
    });
  }

  return deleted === 1;
};

// =====================================================
// Revoke Token Family
// =====================================================

const revokeTokenFamily = async (
  familyId
) => {
  if (!familyId) {
    return false;
  }

  await redisClient.set(
    getFamilyKey(familyId),
    "revoked",
    {
      EX: REFRESH_TOKEN_TTL,
    }
  );

  return true;
};

// =====================================================
// Check Token Family
// =====================================================

const isTokenFamilyRevoked = async (
  familyId
) => {
  if (!familyId) {
    return false;
  }

  const status =
    await redisClient.get(
      getFamilyKey(familyId)
    );

  return status === "revoked";
};

// =====================================================
// Rotate Refresh Session
// =====================================================

const rotateRefreshSession = async ({
  oldTokenId,
  oldRefreshToken,
  device = "unknown",
  userAgent = null,
  ipAddress = null,
}) => {
  if (
    !oldTokenId ||
    !oldRefreshToken
  ) {
    throw new Error(
      "oldTokenId and oldRefreshToken are required"
    );
  }

  // -----------------------------------------------
  // 1. Get old session
  // -----------------------------------------------

  const oldSession =
    await getRefreshSession(
      oldTokenId
    );

  if (!oldSession) {
    const error =
      new Error(
        "Invalid refresh token"
      );

    error.status = 401;

    throw error;
  }

  // -----------------------------------------------
  // 2. Check family revocation
  // -----------------------------------------------

  const familyRevoked =
    await isTokenFamilyRevoked(
      oldSession.familyId
    );

  if (familyRevoked) {
    const error =
      new Error(
        "Refresh token family has been revoked"
      );

    error.status = 401;

    throw error;
  }

  // -----------------------------------------------
  // 3. Validate token
  // -----------------------------------------------

  const suppliedHash =
    hashRefreshToken(
      oldRefreshToken
    );

  if (
    suppliedHash !==
    oldSession.tokenHash
  ) {
    // Possible token reuse
    await revokeTokenFamily(
      oldSession.familyId
    );

    const error =
      new Error(
        "Refresh token reuse detected"
      );

    error.status = 401;

    throw error;
  }

  // -----------------------------------------------
  // 4. Revoke old session
  // -----------------------------------------------

  await revokeRefreshSession(
    oldTokenId,
    oldSession.userId
  );

  // -----------------------------------------------
  // 5. Generate new token ID
  // -----------------------------------------------

  const newTokenId =
    generateRefreshToken();

  // -----------------------------------------------
  // 6. Create new session
  // -----------------------------------------------

  return createRefreshSession({
    userId: oldSession.userId,
    tokenId: newTokenId,
    familyId: oldSession.familyId,
    device,
    userAgent,
    ipAddress,
  });
};

// =====================================================
// Export
// =====================================================

module.exports = {
  createRefreshSession,
  getRefreshSession,
  validateRefreshSession,
  revokeRefreshSession,
  rotateRefreshSession,
  revokeTokenFamily,
  isTokenFamilyRevoked,
};