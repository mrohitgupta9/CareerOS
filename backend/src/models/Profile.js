const mongoose = require("mongoose");

// =====================================================
// EDUCATION SCHEMA
// =====================================================

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      trim: true,
      maxlength: [150, "Institution cannot exceed 150 characters"],
    },

    degree: {
      type: String,
      trim: true,
      maxlength: [100, "Degree cannot exceed 100 characters"],
    },

    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: [120, "Field of study cannot exceed 120 characters"],
    },

    startYear: {
      type: Number,
      min: [1950, "Start year is invalid"],
      max: [2100, "Start year is invalid"],
    },

    endYear: {
      type: Number,
      min: [1950, "End year is invalid"],
      max: [2100, "End year is invalid"],
    },

    grade: {
      type: String,
      trim: true,
      maxlength: [50, "Grade cannot exceed 50 characters"],
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// EXPERIENCE SCHEMA
// =====================================================

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
      maxlength: [150, "Company cannot exceed 150 characters"],
    },

    jobTitle: {
      type: String,
      trim: true,
      maxlength: [120, "Job title cannot exceed 120 characters"],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [120, "Location cannot exceed 120 characters"],
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
      default: null,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        2000,
        "Experience description cannot exceed 2000 characters",
      ],
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// CAREER PREFERENCE SCHEMA
// =====================================================

const careerPreferenceSchema = new mongoose.Schema(
  {
    preferredRoles: {
      type: [String],
      default: [],
    },

    preferredLocations: {
      type: [String],
      default: [],
    },

    workMode: {
      type: String,
      enum: {
        values: ["onsite", "hybrid", "remote", "any"],
        message: "Invalid work mode",
      },
      default: "any",
    },

    employmentType: {
      type: String,
      enum: {
        values: [
          "full-time",
          "part-time",
          "contract",
          "internship",
          "any",
        ],
        message: "Invalid employment type",
      },
      default: "any",
    },

    expectedSalary: {
      type: Number,
      min: [0, "Expected salary cannot be negative"],
      default: null,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// PROFILE SCHEMA
// =====================================================

const profileSchema = new mongoose.Schema(
  {
    // ---------------------------------------------------
    // User Reference
    // ---------------------------------------------------

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
      index: true,
    },

    // ---------------------------------------------------
    // Personal Information
    // ---------------------------------------------------

    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters"],
      default: "",
    },

    location: {
      city: {
        type: String,
        trim: true,
        maxlength: [100, "City cannot exceed 100 characters"],
        default: "",
      },

      state: {
        type: String,
        trim: true,
        maxlength: [100, "State cannot exceed 100 characters"],
        default: "",
      },

      country: {
        type: String,
        trim: true,
        maxlength: [100, "Country cannot exceed 100 characters"],
        default: "",
      },
    },

    headline: {
      type: String,
      trim: true,
      maxlength: [160, "Headline cannot exceed 160 characters"],
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
      default: "",
    },

    // ---------------------------------------------------
    // Professional Information
    // ---------------------------------------------------

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    // ---------------------------------------------------
    // Career Preferences
    // ---------------------------------------------------

    careerPreferences: {
      type: careerPreferenceSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model(
  "Profile",
  profileSchema
);