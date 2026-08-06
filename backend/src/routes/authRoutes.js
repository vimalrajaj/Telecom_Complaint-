const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { validateRequest } = require('../middleware/validateRequest');

// POST /api/auth/register
router.post('/register', registerValidator, validateRequest, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, validateRequest, authController.login);

module.exports = router;
