const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// =====================================================
// USER SCHEMA
// =====================================================

const userSchema = new mongoose.Schema(
  {
    // ---------------------------------------------------
    // Name
    // ---------------------------------------------------

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    // ---------------------------------------------------
    // Email
    // ---------------------------------------------------

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    // ---------------------------------------------------
    // Password Hash
    // ---------------------------------------------------

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    // ---------------------------------------------------
    // Role
    // ---------------------------------------------------

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Invalid user role",
      },
      default: "user",
    },

    // ---------------------------------------------------
    // Account Status
    // ---------------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
    },

    // ---------------------------------------------------
    // Last Login
    // ---------------------------------------------------

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =====================================================
// INSTANCE METHODS
// =====================================================

/**
 * Compare plain-text password with stored hash.
 */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

/**
 * Return safe user object.
 *
 * Never expose passwordHash.
 */
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model("User", userSchema);