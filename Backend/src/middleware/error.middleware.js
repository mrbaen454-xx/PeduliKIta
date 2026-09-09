const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err.message || err);
  
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation Error', err.message, 400);
  }

  // Handle Prisma known errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'Data sudah ada (Unique constraint failed)', null, 400);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Data tidak ditemukan', null, 404);
  }

  return errorResponse(res, 'Internal Server Error', null, 500);
};

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 'Endpoint tidak ditemukan', null, 404);
};

module.exports = { errorHandler, notFoundHandler };
