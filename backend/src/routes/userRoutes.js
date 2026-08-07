const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');

// GET /api/users/profile
router.get('/profile', authenticate, userController.getProfile);

// PUT /api/users/profile
router.put('/profile', authenticate, userController.updateProfile);

// GET /api/users/engineers - Admin only
router.get('/engineers', authenticate, authorize(ROLES.ADMIN), userController.getEngineers);

module.exports = router;
