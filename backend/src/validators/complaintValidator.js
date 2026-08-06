const { body } = require('express-validator');

const createComplaintValidator = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters.'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters.'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Priority must be one of: LOW, MEDIUM, HIGH, CRITICAL.')
];

const updateComplaintValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters.'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Priority must be one of: LOW, MEDIUM, HIGH, CRITICAL.')
];

const createCommentValidator = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message is required and must not exceed 1000 characters.')
];

const createAssignmentValidator = [
  body('complaint_id')
    .isInt({ min: 1 })
    .withMessage('Valid complaint ID is required.'),
  body('engineer_id')
    .isInt({ min: 1 })
    .withMessage('Valid engineer ID is required.')
];

const updateAssignmentValidator = [
  body('status')
    .isIn(['ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
    .withMessage('Status must be one of: ACCEPTED, IN_PROGRESS, RESOLVED, REJECTED.')
];

module.exports = {
  createComplaintValidator,
  updateComplaintValidator,
  createCommentValidator,
  createAssignmentValidator,
  updateAssignmentValidator
};
