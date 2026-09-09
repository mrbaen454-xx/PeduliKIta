const prisma = require('../config/database');

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, role: true, status: true, created_at: true }
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, phone: true, role: true, status: true, created_at: true }
  });
};

const updateUserStatus = async (id, status) => {
  return prisma.user.update({
    where: { id: Number(id) },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};

module.exports = { getAllUsers, getUserById, updateUserStatus };
