const prisma = require('../config/database');

const getAllCategories = async () => {
  return prisma.category.findMany();
};

const getCategoryById = async (id) => {
  return prisma.category.findUnique({ where: { id: Number(id) } });
};

const createCategory = async (data) => {
  return prisma.category.create({ data });
};

const updateCategory = async (id, data) => {
  return prisma.category.update({
    where: { id: Number(id) },
    data
  });
};

const deleteCategory = async (id) => {
  return prisma.category.delete({ where: { id: Number(id) } });
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
