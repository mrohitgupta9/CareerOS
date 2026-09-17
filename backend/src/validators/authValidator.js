// =====================================================
// AUTH VALIDATION
// =====================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =====================================================
// REGISTER VALIDATION
// =====================================================

const validateRegisterInput = ({
  name,
  email,
  password,
} = {}) => {
  // ---------------------------------------------------
  // Normalize input
  // ---------------------------------------------------

  const cleanName = String(name || "").trim();

  const cleanEmail = String(email || "")
    .trim()
    .toLowerCase();

  // ---------------------------------------------------
  // Name validation
  // ---------------------------------------------------

  if (!cleanName) {
    return {
      valid: false,
      message: "Name is required",
    };
  }

  if (cleanName.length < 2) {
    return {
      valid: false,
      message: "Name must be at least 2 characters",
    };
  }

  if (cleanName.length > 80) {
    return {
      valid: false,
      message: "Name cannot exceed 80 characters",
    };
  }

  // ---------------------------------------------------
  // Email validation
  // ---------------------------------------------------

  if (!cleanEmail) {
    return {
      valid: false,
      message: "Email is required",
    };
  }

  if (cleanEmail.length > 254) {
    return {
      valid: false,
      message: "Email cannot exceed 254 characters",
    };
  }

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return {
      valid: false,
      message: "Please provide a valid email address",
    };
  }

  // ---------------------------------------------------
  // Password validation
  // ---------------------------------------------------

  if (!password || typeof password !== "string") {
    return {
      valid: false,
      message: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters",
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      message: "Password cannot exceed 128 characters",
    };
  }

  // ---------------------------------------------------
  // Validation successful
  // ---------------------------------------------------

  return {
    valid: true,
    data: {
      name: cleanName,
      email: cleanEmail,
      password,
    },
  };
};

// =====================================================
// LOGIN VALIDATION
// =====================================================

const validateLoginInput = ({
  email,
  password,
} = {}) => {
  // ---------------------------------------------------
  // Normalize email
  // ---------------------------------------------------

  const cleanEmail = String(email || "")
    .trim()
    .toLowerCase();

  // ---------------------------------------------------
  // Email validation
  // ---------------------------------------------------

  if (!cleanEmail) {
    return {
      valid: false,
      message: "Email is required",
    };
  }

  if (cleanEmail.length > 254) {
    return {
      valid: false,
      message: "Email cannot exceed 254 characters",
    };
  }

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return {
      valid: false,
      message: "Please provide a valid email address",
    };
  }

  // ---------------------------------------------------
  // Password validation
  // ---------------------------------------------------

  if (!password || typeof password !== "string") {
    return {
      valid: false,
      message: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Invalid email or password",
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      message: "Invalid email or password",
    };
  }

  // ---------------------------------------------------
  // Validation successful
  // ---------------------------------------------------

  return {
    valid: true,
    data: {
      email: cleanEmail,
      password,
    },
  };
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};