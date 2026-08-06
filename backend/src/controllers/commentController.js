const commentService = require('../services/commentService');
const { sendSuccess } = require('../utils/response');

const addComment = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { message } = req.body;
    const comment = await commentService.addComment(complaintId, req.user.id, req.user.role, message);
    return sendSuccess(res, 201, 'Comment added successfully.', comment);
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const comments = await commentService.getComments(complaintId, req.user.id, req.user.role);
    return sendSuccess(res, 200, 'Comments retrieved successfully.', comments);
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments };
