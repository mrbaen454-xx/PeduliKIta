const { errorResponse } = require('../utils/response');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Akses ditolak. Anda tidak memiliki izin.', null, 403);
    }
    next();
  };
};

module.exports = authorize;
