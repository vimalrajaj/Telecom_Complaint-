const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/users/profile
router.get('/profile', authenticate, userController.getProfile);

// PUT /api/users/profile
router.put('/profile', authenticate, userController.updateProfile);

module.exports = router;
