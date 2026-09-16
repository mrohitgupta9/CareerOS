const {
  sanitizeMetadata,
  logSecurityEvent,
} = require(
  "../../src/utils/securityLogger"
);

describe(
  "Security Logger",
  () => {
    it(
      "should remove sensitive metadata",
      () => {
        const result =
          sanitizeMetadata({
            reason: "test",
            password: "secret",
            refreshToken:
              "refresh-secret",
            accessToken:
              "access-secret",
            authorization:
              "Bearer secret",
            safeValue: "allowed",
          });

        expect(result).toEqual({
          reason: "test",
          safeValue: "allowed",
        });
      }
    );

    it(
      "should create structured security event",
      () => {
        const result =
          logSecurityEvent({
            event: "TEST_EVENT",
            userId: "user-123",
            tokenId: "token-123",
            familyId: "family-123",
            ipAddress: "127.0.0.1",
            userAgent: "Chrome",
            metadata: {
              reason: "test",
            },
          });

        expect(result).toMatchObject({
          type: "security_event",
          event: "TEST_EVENT",
          userId: "user-123",
          tokenId: "token-123",
          familyId: "family-123",
          ipAddress: "127.0.0.1",
          userAgent: "Chrome",
          metadata: {
            reason: "test",
          },
        });

        expect(
          result.timestamp
        ).toBeDefined();
      }
    );
  }
);