const {
  SECURITY_EVENTS,
} = require("../constants/securityEvents");

const {
  logSecurityEvent,
} = require("../utils/securityLogger");

// =====================================================
// Internal Event Helper
// =====================================================

const recordEvent = ({
  event,
  userId = null,
  tokenId = null,
  familyId = null,
  ipAddress = null,
  userAgent = null,
  metadata = {},
}) => {
  return logSecurityEvent({
    event,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
    metadata,
  });
};

// =====================================================
// Authentication Events
// =====================================================

const recordLoginSuccess = ({
  userId,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.LOGIN_SUCCESS,
    userId,
    ipAddress,
    userAgent,
  });
};

const recordLoginFailure = ({
  userId = null,
  ipAddress = null,
  userAgent = null,
  reason = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.LOGIN_FAILED,
    userId,
    ipAddress,
    userAgent,
    metadata: {
      reason,
    },
  });
};

// =====================================================
// Session Events
// =====================================================

const recordSessionCreated = ({
  userId,
  tokenId,
  familyId,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.SESSION_CREATED,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
  });
};

const recordSessionRevoked = ({
  userId,
  tokenId,
  familyId = null,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.SESSION_REVOKED,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
  });
};

const recordLogout = ({
  userId,
  tokenId,
  familyId = null,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.LOGOUT,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
  });
};

const recordLogoutAllDevices = ({
  userId,
  ipAddress = null,
  userAgent = null,
  revokedFamilies = 0,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.LOGOUT_ALL_DEVICES,
    userId,
    ipAddress,
    userAgent,
    metadata: {
      revokedFamilies,
    },
  });
};

// =====================================================
// Token Events
// =====================================================

const recordTokenRefreshed = ({
  userId,
  tokenId,
  familyId,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.TOKEN_REFRESHED,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
  });
};

const recordTokenRefreshFailure = ({
  userId = null,
  tokenId = null,
  familyId = null,
  ipAddress = null,
  userAgent = null,
  reason = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.TOKEN_REFRESH_FAILED,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
    metadata: {
      reason,
    },
  });
};

const recordTokenReuseDetected = ({
  userId = null,
  tokenId = null,
  familyId = null,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.TOKEN_REUSE_DETECTED,
    userId,
    tokenId,
    familyId,
    ipAddress,
    userAgent,
  });
};

const recordTokenFamilyRevoked = ({
  userId = null,
  familyId,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.TOKEN_FAMILY_REVOKED,
    userId,
    familyId,
    ipAddress,
    userAgent,
  });
};

// =====================================================
// Account Security Events
// =====================================================

const recordPasswordChanged = ({
  userId,
  ipAddress = null,
  userAgent = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.PASSWORD_CHANGED,
    userId,
    ipAddress,
    userAgent,
  });
};

const recordAccountLocked = ({
  userId,
  ipAddress = null,
  userAgent = null,
  reason = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.ACCOUNT_LOCKED,
    userId,
    ipAddress,
    userAgent,
    metadata: {
      reason,
    },
  });
};

const recordSuspiciousActivity = ({
  userId = null,
  ipAddress = null,
  userAgent = null,
  reason = null,
}) => {
  return recordEvent({
    event:
      SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
    userId,
    ipAddress,
    userAgent,
    metadata: {
      reason,
    },
  });
};

// =====================================================
// Export
// =====================================================

module.exports = {
  recordLoginSuccess,
  recordLoginFailure,

  recordSessionCreated,
  recordSessionRevoked,

  recordLogout,
  recordLogoutAllDevices,

  recordTokenRefreshed,
  recordTokenRefreshFailure,
  recordTokenReuseDetected,
  recordTokenFamilyRevoked,

  recordPasswordChanged,
  recordAccountLocked,
  recordSuspiciousActivity,
};