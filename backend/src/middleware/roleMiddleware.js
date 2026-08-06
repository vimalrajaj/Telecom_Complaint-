const { sendError } = require('../utils/response');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'Access denied. Insufficient permissions.');
    }
    next();
  };
};

module.exports = { authorize };
