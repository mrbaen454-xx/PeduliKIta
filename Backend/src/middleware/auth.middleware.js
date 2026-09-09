const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Akses ditolak. Token tidak ditemukan.', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, status: true }
    });

    if (!user) {
      return errorResponse(res, 'User tidak ditemukan.', null, 401);
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse(res, 'Akun anda tidak aktif.', null, 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Token tidak valid.', null, 401);
  }
};

module.exports = authenticate;
