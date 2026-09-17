const mongoose = require("mongoose");

// =====================================================
// REFRESH SESSION SCHEMA
// =====================================================

const refreshSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =====================================================
// TTL INDEX
// Automatically removes expired refresh sessions
// =====================================================

refreshSessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  "RefreshSession",
  refreshSessionSchema
);