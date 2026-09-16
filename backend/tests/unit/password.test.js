const {
  hashPassword,
  comparePassword,
} = require("../../src/utils/password");

describe("Password Security", () => {
  it("should hash a password", async () => {
    const password = "TestPassword123!";

    const hash =
      await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it("should validate the correct password", async () => {
    const password = "TestPassword123!";

    const hash =
      await hashPassword(password);

    const result =
      await comparePassword(
        password,
        hash
      );

    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "TestPassword123!";
    const wrongPassword = "WrongPassword123!";

    const hash =
      await hashPassword(password);

    const result =
      await comparePassword(
        wrongPassword,
        hash
      );

    expect(result).toBe(false);
  });
});