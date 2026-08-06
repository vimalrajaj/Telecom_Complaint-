const complaintService = require('../services/complaintService');
const { sendSuccess } = require('../utils/response');

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    const complaint = await complaintService.createComplaint(title, description, priority, req.user.id);
    return sendSuccess(res, 201, 'Complaint created successfully.', complaint);
  } catch (error) {
    next(error);
  }
};

const getComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getComplaints(req.user);
    return sendSuccess(res, 200, 'Complaints retrieved successfully.', complaints);
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.user);
    return sendSuccess(res, 200, 'Complaint retrieved successfully.', complaint);
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.updateComplaint(req.params.id, req.body, req.user);
    return sendSuccess(res, 200, 'Complaint updated successfully.', complaint);
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    await complaintService.deleteComplaint(req.params.id, req.user);
    return sendSuccess(res, 200, 'Complaint deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint };
