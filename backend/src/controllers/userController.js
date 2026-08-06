const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return sendSuccess(res, 200, 'Profile retrieved successfully.', user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
