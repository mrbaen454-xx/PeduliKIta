const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, 'Registrasi berhasil', user, 201);
  } catch (error) {
    if (error.message === 'Email sudah digunakan') {
      return errorResponse(res, error.message, null, 409);
    }
    return errorResponse(res, 'Server error', null, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return successResponse(res, 'Login berhasil', data, 200);
  } catch (error) {
    console.error('[Login Error]:', error);
    if (error.message === 'Email atau password salah' || error.message === 'Akun tidak aktif') {
      return errorResponse(res, error.message, null, 401);
    }
    return errorResponse(res, error.message || 'Internal Server Error', null, 500);
  }
};

const getMe = async (req, res) => {
  return successResponse(res, 'Berhasil mengambil data profil', req.user, 200);
};

module.exports = { register, login, getMe };
