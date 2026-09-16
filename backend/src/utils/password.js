const bcrypt = require("bcryptjs");

// =====================================================
// Password Security
// =====================================================

const SALT_ROUNDS = 12;

// Hash password
const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  return bcrypt.hash(
    password,
    SALT_ROUNDS
  );
};

// Compare plain password with hash
const comparePassword = async (
  password,
  hashedPassword
) => {
  if (!password || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(
    password,
    hashedPassword
  );
};

module.exports = {
  hashPassword,
  comparePassword,
};