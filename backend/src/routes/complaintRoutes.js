const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createComplaintValidator, updateComplaintValidator } = require('../validators/complaintValidator');
const { validateRequest } = require('../middleware/validateRequest');
const ROLES = require('../constants/roles');

// POST /api/complaints - Customer only
router.post('/', authenticate, authorize(ROLES.CUSTOMER), createComplaintValidator, validateRequest, complaintController.createComplaint);

// GET /api/complaints - Customer (own), Admin (all), Engineer (assigned)
router.get('/', authenticate, complaintController.getComplaints);

// GET /api/complaints/:id
router.get('/:id', authenticate, complaintController.getComplaintById);

// PUT /api/complaints/:id - Customer only (own, before assignment)
router.put('/:id', authenticate, authorize(ROLES.CUSTOMER), updateComplaintValidator, validateRequest, complaintController.updateComplaint);

// DELETE /api/complaints/:id - Customer only (own, before assignment)
router.delete('/:id', authenticate, authorize(ROLES.CUSTOMER), complaintController.deleteComplaint);

module.exports = router;
