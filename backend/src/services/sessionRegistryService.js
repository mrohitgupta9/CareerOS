const {
  redisClient,
} = require("../config/redis");

// =====================================================
// Configuration
// =====================================================

const USER_SESSIONS_PREFIX =
  "auth:sessions:";

const REFRESH_SESSION_PREFIX =
  "auth:refresh:";

const SESSION_TTL =
  7 * 24 * 60 * 60;

// =====================================================
// Internal Helpers
// =====================================================

const getUserSessionsKey = (
  userId
) => {
  return `${USER_SESSIONS_PREFIX}${userId}`;
};

const getRefreshSessionKey = (
  tokenId
) => {
  return `${REFRESH_SESSION_PREFIX}${tokenId}`;
};

// =====================================================
// Register Session
// =====================================================

const registerSession = async ({
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

  const session = {
    tokenId,
    familyId,
    device,
    userAgent,
    ipAddress,
    createdAt:
      new Date().toISOString(),
  };

  const key =
    getUserSessionsKey(
      userId
    );

  await redisClient.hSet(
    key,
    tokenId,
    JSON.stringify(session)
  );

  await redisClient.expire(
    key,
    SESSION_TTL
  );

  return session;
};

// =====================================================
// Get All User Sessions
// =====================================================

const getUserSessions = async (
  userId
) => {
  if (!userId) {
    return [];
  }

  const key =
    getUserSessionsKey(
      userId
    );

  const sessions =
    await redisClient.hGetAll(
      key
    );

  return Object.values(
    sessions
  ).reduce(
    (result, session) => {
      try {
        result.push(
          JSON.parse(session)
        );
      } catch {
        // Ignore invalid Redis session data
      }

      return result;
    },
    []
  );
};

// =====================================================
// Get Single User Session
// =====================================================

const getUserSession = async ({
  userId,
  tokenId,
}) => {
  if (
    !userId ||
    !tokenId
  ) {
    return null;
  }

  const key =
    getUserSessionsKey(
      userId
    );

  const session =
    await redisClient.hGet(
      key,
      tokenId
    );

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(
      session
    );
  } catch {
    return null;
  }
};

// =====================================================
// Get Unique Session Families
// =====================================================

const getUserSessionFamilies =
  async (userId) => {
    if (!userId) {
      return [];
    }

    const sessions =
      await getUserSessions(
        userId
      );

    const familyIds =
      sessions
        .map(
          (session) =>
            session.familyId
        )
        .filter(Boolean);

    return [
      ...new Set(
        familyIds
      ),
    ];
  };

// =====================================================
// Cleanup Stale User Sessions
// =====================================================

const cleanupUserSessions =
  async (userId) => {
    if (!userId) {
      return {
        removed: 0,
        remaining: 0,
      };
    }

    const key =
      getUserSessionsKey(
        userId
      );

    const sessions =
      await redisClient.hGetAll(
        key
      );

    let removed = 0;
    let remaining = 0;

    for (const [
      tokenId,
      sessionData,
    ] of Object.entries(
      sessions
    )) {
      // Check whether refresh session still exists
      const refreshSession =
        await redisClient.get(
          getRefreshSessionKey(
            tokenId
          )
        );

      if (!refreshSession) {
        await redisClient.hDel(
          key,
          tokenId
        );

        removed += 1;
      } else {
        remaining += 1;
      }
    }

    // If no active sessions remain,
    // remove the registry itself.
    if (remaining === 0) {
      await redisClient.del(
        key
      );
    }

    return {
      removed,
      remaining,
    };
  };

// =====================================================
// Remove Single Session
// =====================================================

const removeSession = async ({
  userId,
  tokenId,
}) => {
  if (
    !userId ||
    !tokenId
  ) {
    return false;
  }

  const key =
    getUserSessionsKey(
      userId
    );

  const deleted =
    await redisClient.hDel(
      key,
      tokenId
    );

  return deleted === 1;
};

// =====================================================
// Remove All Sessions
// =====================================================

const removeAllSessions = async (
  userId
) => {
  if (!userId) {
    return false;
  }

  const key =
    getUserSessionsKey(
      userId
    );

  const deleted =
    await redisClient.del(
      key
    );

  return deleted === 1;
};

// =====================================================
// Export
// =====================================================

module.exports = {
  registerSession,
  getUserSessions,
  getUserSession,
  getUserSessionFamilies,
  cleanupUserSessions,
  removeSession,
  removeAllSessions,
};