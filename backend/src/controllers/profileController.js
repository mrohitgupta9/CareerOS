const {
  validateProfileInput,
} = require("../validators/profileValidator");

const {
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../services/profile/profileService");

// =====================================================
// GET CURRENT USER PROFILE
// GET /api/profile
// =====================================================

const getProfile = async (req, res, next) => {
  try {
    const profile = await getProfileByUserId(
      req.user.userId
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CREATE PROFILE
// POST /api/profile
// =====================================================

const create = async (req, res, next) => {
  try {
    const validation = validateProfileInput(
      req.body
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const existingProfile =
      await getProfileByUserId(
        req.user.userId
      );

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await createProfile(
      req.user.userId,
      validation.data
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    next(error);
  }
};

// =====================================================
// UPDATE PROFILE
// PUT /api/profile
// =====================================================

const update = async (req, res, next) => {
  try {
    const validation = validateProfileInput(
      req.body
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const existingProfile =
      await getProfileByUserId(
        req.user.userId
      );

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const profile = await updateProfile(
      req.user.userId,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE PROFILE
// DELETE /api/profile
// =====================================================

const remove = async (req, res, next) => {
  try {
    const profile = await deleteProfile(
      req.user.userId
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getProfile,
  create,
  update,
  remove,
};