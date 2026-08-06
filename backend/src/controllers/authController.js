const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const userId = await authService.register(name, email, password, phone);
    return sendSuccess(res, 201, 'User registered successfully.', { userId });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, 200, 'Login successful.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
