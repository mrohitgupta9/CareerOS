const Profile = require("../../models/Profile");

// =====================================================
// GET PROFILE
// =====================================================

const getProfileByUserId = async (userId) => {
  return Profile.findOne({
    user: userId,
  });
};

// =====================================================
// CREATE PROFILE
// =====================================================

const createProfile = async (userId, profileData) => {
  return Profile.create({
    user: userId,
    ...profileData,
  });
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (userId, profileData) => {
  return Profile.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: profileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// =====================================================
// DELETE PROFILE
// =====================================================

const deleteProfile = async (userId) => {
  return Profile.findOneAndDelete({
    user: userId,
  });
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
};