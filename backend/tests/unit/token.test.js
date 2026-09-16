process.env.JWT_SECRET =
  "test-secret-for-unit-tests";

process.env.JWT_EXPIRES_IN =
  "15m";

const {
  generateAccessToken,
  verifyAccessToken,
} = require("../../src/utils/token");

describe("JWT Security", () => {
  it("should generate a JWT", () => {
    const token =
      generateAccessToken({
        userId: "test-user-id",
      });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should verify a valid JWT", () => {
    const token =
      generateAccessToken({
        userId: "test-user-id",
        role: "user",
      });

    const decoded =
      verifyAccessToken(token);

    expect(decoded.userId).toBe(
      "test-user-id"
    );

    expect(decoded.role).toBe("user");
  });

  it("should reject an invalid JWT", () => {
    expect(() => {
      verifyAccessToken(
        "invalid-token"
      );
    }).toThrow();
  });
});