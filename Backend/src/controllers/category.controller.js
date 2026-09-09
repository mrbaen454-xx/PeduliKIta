const categoryService = require('../services/category.service');
const { successResponse, errorResponse } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(res, 'Berhasil mengambil kategori', categories);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const getById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return errorResponse(res, 'Kategori tidak ditemukan', null, 404);
    return successResponse(res, 'Berhasil mengambil kategori', category);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const create = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return successResponse(res, 'Berhasil membuat kategori', category, 201);
  } catch (error) {
    return errorResponse(res, 'Gagal membuat kategori (mungkin nama sudah ada)', null, 400);
  }
};

const update = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return successResponse(res, 'Berhasil update kategori', category);
  } catch (error) {
    return errorResponse(res, 'Gagal update kategori', null, 400);
  }
};

const remove = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return successResponse(res, 'Berhasil menghapus kategori');
  } catch (error) {
    return errorResponse(res, 'Gagal menghapus kategori', null, 400);
  }
};

module.exports = { getAll, getById, create, update, remove };
