const commentRepository = require('../repositories/commentRepository');
const complaintRepository = require('../repositories/complaintRepository');
const assignmentRepository = require('../repositories/assignmentRepository');
const ROLES = require('../constants/roles');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const checkAccess = async (complaintId, userId, userRole) => {
  const complaint = await complaintRepository.findById(complaintId);
  if (!complaint) {
    throw createError(404, 'Complaint not found.');
  }

  if (userRole === ROLES.ADMIN) {
    return complaint;
  }

  if (userRole === ROLES.CUSTOMER) {
    if (complaint.customer_id !== userId) {
      throw createError(403, 'Access denied. You can only comment on your own complaints.');
    }
    return complaint;
  }

  if (userRole === ROLES.ENGINEER) {
    const assignments = await assignmentRepository.findByEngineerId(userId);
    const isAssigned = assignments.some(a => a.complaint_id === parseInt(complaintId));
    if (!isAssigned) {
      throw createError(403, 'Access denied. This complaint is not assigned to you.');
    }
    return complaint;
  }

  throw createError(403, 'Access denied.');
};

const addComment = async (complaintId, userId, userRole, message) => {
  await checkAccess(complaintId, userId, userRole);

  const commentId = await commentRepository.create(complaintId, userId, message);
  
  // Return the created comment with user info
  const comments = await commentRepository.findByComplaintId(complaintId);
  return comments.find(c => c.id === commentId);
};

const getComments = async (complaintId, userId, userRole) => {
  await checkAccess(complaintId, userId, userRole);
  return await commentRepository.findByComplaintId(complaintId);
};

module.exports = { addComment, getComments };
