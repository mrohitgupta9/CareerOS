const crypto = require("crypto");

// =====================================================
// HASH TOKEN
// =====================================================

const hashToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error(
      "Token is required for hashing"
    );
  }

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  hashToken,
};