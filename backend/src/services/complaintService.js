const complaintRepository = require('../repositories/complaintRepository');
const assignmentRepository = require('../repositories/assignmentRepository');
const ROLES = require('../constants/roles');

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createComplaint = async (title, description, priority, customerId) => {
  const complaintId = await complaintRepository.create(title, description, priority, customerId);
  const complaint = await complaintRepository.findById(complaintId);
  return complaint;
};

const getComplaints = async (user) => {
  if (user.role === ROLES.ADMIN) {
    return await complaintRepository.findAll();
  }

  if (user.role === ROLES.CUSTOMER) {
    return await complaintRepository.findByCustomerId(user.id);
  }

  if (user.role === ROLES.ENGINEER) {
    // Get complaints assigned to this engineer
    const assignments = await assignmentRepository.findByEngineerId(user.id);
    return assignments.map(a => ({
      id: a.complaint_id,
      title: a.complaint_title,
      description: a.complaint_description,
      priority: a.complaint_priority,
      status: a.complaint_status,
      customer_name: a.customer_name,
      customer_email: a.customer_email,
      assignment_status: a.status
    }));
  }

  return [];
};

const getComplaintById = async (id, user) => {
  const complaint = await complaintRepository.findById(id);
  if (!complaint) {
    throw createError(404, 'Complaint not found.');
  }

  if (user.role === ROLES.ADMIN) {
    return complaint;
  }

  if (user.role === ROLES.CUSTOMER) {
    if (complaint.customer_id !== user.id) {
      throw createError(403, 'Access denied. You can only view your own complaints.');
    }
    return complaint;
  }

  if (user.role === ROLES.ENGINEER) {
    const assignments = await assignmentRepository.findByEngineerId(user.id);
    const isAssigned = assignments.some(a => a.complaint_id === parseInt(id));
    if (!isAssigned) {
      throw createError(403, 'Access denied. This complaint is not assigned to you.');
    }
    return complaint;
  }

  throw createError(403, 'Access denied.');
};

const updateComplaint = async (id, updateData, user) => {
  const complaint = await complaintRepository.findById(id);
  if (!complaint) {
    throw createError(404, 'Complaint not found.');
  }

  if (complaint.customer_id !== user.id) {
    throw createError(403, 'Access denied. You can only update your own complaints.');
  }

  if (complaint.status !== 'OPEN') {
    throw createError(403, 'Cannot update complaint. Only OPEN complaints can be modified.');
  }

  // Only allow updating title, description, priority
  const allowedFields = {};
  if (updateData.title) allowedFields.title = updateData.title;
  if (updateData.description) allowedFields.description = updateData.description;
  if (updateData.priority) allowedFields.priority = updateData.priority;

  await complaintRepository.update(id, allowedFields);
  const updatedComplaint = await complaintRepository.findById(id);
  return updatedComplaint;
};

const deleteComplaint = async (id, user) => {
  const complaint = await complaintRepository.findById(id);
  if (!complaint) {
    throw createError(404, 'Complaint not found.');
  }

  if (complaint.customer_id !== user.id) {
    throw createError(403, 'Access denied. You can only delete your own complaints.');
  }

  if (complaint.status !== 'OPEN') {
    throw createError(403, 'Cannot delete complaint. Only OPEN complaints can be deleted.');
  }

  await complaintRepository.remove(id);
  return true;
};

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint };
