const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/password');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  // Don't allow role changes via profile update
  delete updateData.role;

  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  const updated = await userRepository.updateUser(userId, updateData);
  if (!updated) {
    throw createError(400, 'No valid fields to update.');
  }

  const user = await userRepository.findById(userId);
  return user;
};

module.exports = { getProfile, updateProfile };
