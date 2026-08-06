const assignmentService = require('../services/assignmentService');
const { sendSuccess } = require('../utils/response');

const createAssignment = async (req, res, next) => {
  try {
    const { complaint_id, engineer_id } = req.body;
    const assignment = await assignmentService.createAssignment(complaint_id, engineer_id, req.user.id);
    return sendSuccess(res, 201, 'Engineer assigned successfully.', assignment);
  } catch (error) {
    next(error);
  }
};

const getAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAssignments();
    return sendSuccess(res, 200, 'Assignments retrieved successfully.', assignments);
  } catch (error) {
    next(error);
  }
};

const getMyAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getMyAssignments(req.user.id);
    return sendSuccess(res, 200, 'Assignments retrieved successfully.', assignments);
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const { status } = req.body;
    const assignment = await assignmentService.updateAssignment(req.params.id, status, req.user.id);
    return sendSuccess(res, 200, 'Assignment updated successfully.', assignment);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAssignment, getAssignments, getMyAssignments, updateAssignment };
