const sanitizeMetadata = (
  metadata = {}
) => {
  const sensitiveKeys = new Set([
    "password",
    "newpassword",
    "oldpassword",
    "token",
    "accesstoken",
    "refreshtoken",
    "authorization",
    "cookie",
    "jwt",
    "secret",
  ]);

  const sanitized = {};

  for (const [key, value] of Object.entries(
    metadata
  )) {
    if (
      sensitiveKeys.has(
        key.toLowerCase()
      )
    ) {
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
};

const logSecurityEvent = ({
  event,
  userId = null,
  tokenId = null,
  familyId = null,
  ipAddress = null,
  userAgent = null,
  metadata = {},
}) => {
  const securityEvent = {
    type: "security_event",
    event,
    timestamp:
      new Date().toISOString(),

    userId:
      userId
        ? String(userId)
        : null,

    tokenId:
      tokenId || null,

    familyId:
      familyId || null,

    ipAddress:
      ipAddress || null,

    userAgent:
      userAgent || null,

    metadata:
      sanitizeMetadata(
        metadata
      ),
  };

  console.info(
    "[SECURITY_EVENT]",
    JSON.stringify(
      securityEvent
    )
  );

  return securityEvent;
};

module.exports = {
  logSecurityEvent,
  sanitizeMetadata,
};