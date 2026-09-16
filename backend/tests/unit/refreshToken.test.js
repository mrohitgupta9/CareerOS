const {
  generateRefreshToken,
  hashRefreshToken,
} = require("../../src/utils/refreshToken");

describe("Refresh Token Security", () => {
  it("should generate a secure refresh token", () => {
    const token =
      generateRefreshToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    expect(token.length).toBe(128);
  });

  it("should generate different tokens", () => {
    const token1 =
      generateRefreshToken();

    const token2 =
      generateRefreshToken();

    expect(token1).not.toBe(token2);
  });

  it("should hash a refresh token", () => {
    const token =
      generateRefreshToken();

    const hash =
      hashRefreshToken(token);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");

    expect(hash).not.toBe(token);
    expect(hash.length).toBe(64);
  });

  it("should produce the same hash for the same token", () => {
    const token =
      generateRefreshToken();

    const hash1 =
      hashRefreshToken(token);

    const hash2 =
      hashRefreshToken(token);

    expect(hash1).toBe(hash2);
  });
});