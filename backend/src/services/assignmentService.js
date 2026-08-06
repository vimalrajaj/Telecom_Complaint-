const assignmentRepository = require('../repositories/assignmentRepository');
const complaintRepository = require('../repositories/complaintRepository');
const userRepository = require('../repositories/userRepository');
const { pool } = require('../config/db');
const ROLES = require('../constants/roles');
const { COMPLAINT_STATUS, ASSIGNMENT_STATUS } = require('../constants/complaintStatus');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createAssignment = async (complaintId, engineerId, adminId) => {
  // Verify complaint exists
  const complaint = await complaintRepository.findById(complaintId);
  if (!complaint) {
    throw createError(404, 'Complaint not found.');
  }

  // Verify complaint is OPEN
  if (complaint.status !== COMPLAINT_STATUS.OPEN) {
    throw createError(400, 'Complaint is not in OPEN status. Cannot assign.');
  }

  // Verify engineer exists and has ENGINEER role
  const engineer = await userRepository.findById(engineerId);
  if (!engineer || engineer.role !== ROLES.ENGINEER) {
    throw createError(404, 'Engineer not found.');
  }

  // Check if assignment already exists
  const existingAssignment = await assignmentRepository.findByComplaintId(complaintId);
  if (existingAssignment) {
    throw createError(409, 'An assignment already exists for this complaint.');
  }

  // Use transaction: insert assignment + update complaint status
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const assignmentId = await assignmentRepository.createWithConnection(
      connection, complaintId, engineerId, adminId
    );

    await complaintRepository.updateStatusWithConnection(
      connection, complaintId, COMPLAINT_STATUS.ASSIGNED
    );

    await connection.commit();

    const assignment = await assignmentRepository.findById(assignmentId);
    return assignment;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getAssignments = async () => {
  return await assignmentRepository.findAll();
};

const getMyAssignments = async (engineerId) => {
  return await assignmentRepository.findByEngineerId(engineerId);
};

const updateAssignment = async (assignmentId, status, engineerId) => {
  const assignment = await assignmentRepository.findById(assignmentId);
  if (!assignment) {
    throw createError(404, 'Assignment not found.');
  }

  // Verify the engineer is assigned to this complaint
  if (assignment.engineer_id !== engineerId) {
    throw createError(403, 'Access denied. You are not assigned to this complaint.');
  }

  // Update assignment status
  await assignmentRepository.updateStatus(assignmentId, status);

  // If resolved, also update complaint status
  if (status === ASSIGNMENT_STATUS.RESOLVED) {
    await complaintRepository.updateStatus(assignment.complaint_id, COMPLAINT_STATUS.RESOLVED);
  }

  const updatedAssignment = await assignmentRepository.findById(assignmentId);
  return updatedAssignment;
};

module.exports = { createAssignment, getAssignments, getMyAssignments, updateAssignment };
