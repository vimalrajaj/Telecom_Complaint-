const authRepository = require('../repositories/authRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const register = async (name, email, password, phone) => {
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    throw createError(409, 'Email already in use.');
  }

  const hashedPassword = await hashPassword(password);
  const userId = await authRepository.createUser(name, email, hashedPassword, phone);
  return userId;
};

const login = async (email, password) => {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw createError(401, 'Invalid email or password.');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password.');
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = { register, login };
