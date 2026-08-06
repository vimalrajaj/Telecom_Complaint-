const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const { createCommentValidator } = require('../validators/complaintValidator');
const { validateRequest } = require('../middleware/validateRequest');

// POST /api/complaints/:id/comments
router.post('/', authenticate, createCommentValidator, validateRequest, commentController.addComment);

// GET /api/complaints/:id/comments
router.get('/', authenticate, commentController.getComments);

module.exports = router;
