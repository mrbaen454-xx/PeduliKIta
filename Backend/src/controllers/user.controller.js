const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, 'Berhasil mengambil semua user', users);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const getById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return errorResponse(res, 'User tidak ditemukan', null, 404);
    return successResponse(res, 'Berhasil mengambil user', user);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await userService.updateUserStatus(req.params.id, status);
    return successResponse(res, 'Berhasil update status user', user);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

module.exports = { getAll, getById, updateStatus };
