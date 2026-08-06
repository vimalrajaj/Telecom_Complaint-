const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createAssignmentValidator, updateAssignmentValidator } = require('../validators/complaintValidator');
const { validateRequest } = require('../middleware/validateRequest');
const ROLES = require('../constants/roles');

// POST /api/assignments - Admin only
router.post('/', authenticate, authorize(ROLES.ADMIN), createAssignmentValidator, validateRequest, assignmentController.createAssignment);

// GET /api/assignments - Admin only
router.get('/', authenticate, authorize(ROLES.ADMIN), assignmentController.getAssignments);

// GET /api/assignments/me - Engineer only
router.get('/me', authenticate, authorize(ROLES.ENGINEER), assignmentController.getMyAssignments);

// PUT /api/assignments/:id - Engineer only
router.put('/:id', authenticate, authorize(ROLES.ENGINEER), updateAssignmentValidator, validateRequest, assignmentController.updateAssignment);

module.exports = router;
