jest.mock(
  "../../src/utils/securityLogger",
  () => ({
    logSecurityEvent:
      jest.fn((event) => event),
  })
);

const {
  logSecurityEvent,
} = require(
  "../../src/utils/securityLogger"
);

const {
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
} = require(
  "../../src/services/securityEventService"
);

const {
  SECURITY_EVENTS,
} = require(
  "../../src/constants/securityEvents"
);

describe(
  "Security Event Service",
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(
      "should record successful login",
      () => {
        recordLoginSuccess({
          userId: "user-123",
          ipAddress: "127.0.0.1",
          userAgent: "Chrome",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.LOGIN_SUCCESS,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: "127.0.0.1",
          userAgent: "Chrome",
          metadata: {},
        });
      }
    );

    it(
      "should record failed login",
      () => {
        recordLoginFailure({
          userId: "user-123",
          reason: "invalid_password",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.LOGIN_FAILED,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {
            reason:
              "invalid_password",
          },
        });
      }
    );

    it(
      "should record session creation",
      () => {
        recordSessionCreated({
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.SESSION_CREATED,
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record session revocation",
      () => {
        recordSessionRevoked({
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.SESSION_REVOKED,
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record logout",
      () => {
        recordLogout({
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.LOGOUT,
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record logout from all devices",
      () => {
        recordLogoutAllDevices({
          userId: "user-123",
          revokedFamilies: 3,
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.LOGOUT_ALL_DEVICES,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {
            revokedFamilies: 3,
          },
        });
      }
    );

    it(
      "should record token refresh",
      () => {
        recordTokenRefreshed({
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.TOKEN_REFRESHED,
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record token refresh failure",
      () => {
        recordTokenRefreshFailure({
          userId: "user-123",
          reason: "expired",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.TOKEN_REFRESH_FAILED,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {
            reason: "expired",
          },
        });
      }
    );

    it(
      "should record token reuse detection",
      () => {
        recordTokenReuseDetected({
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.TOKEN_REUSE_DETECTED,
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record token family revocation",
      () => {
        recordTokenFamilyRevoked({
          userId: "user-123",
          familyId: "family-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.TOKEN_FAMILY_REVOKED,
          userId: "user-123",
          tokenId: null,
          familyId: "family-123",
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record password change",
      () => {
        recordPasswordChanged({
          userId: "user-123",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.PASSWORD_CHANGED,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {},
        });
      }
    );

    it(
      "should record account lock",
      () => {
        recordAccountLocked({
          userId: "user-123",
          reason: "too_many_attempts",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.ACCOUNT_LOCKED,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {
            reason:
              "too_many_attempts",
          },
        });
      }
    );

    it(
      "should record suspicious activity",
      () => {
        recordSuspiciousActivity({
          userId: "user-123",
          reason: "unusual_location",
        });

        expect(
          logSecurityEvent
        ).toHaveBeenCalledWith({
          event:
            SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
          userId: "user-123",
          tokenId: null,
          familyId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {
            reason:
              "unusual_location",
          },
        });
      }
    );
  }
);