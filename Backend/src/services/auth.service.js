const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');

const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error('Email sudah digunakan');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role || 'DONOR'
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('Akun tidak aktif');
  }

  const token = generateToken({ id: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

module.exports = { registerUser, loginUser };
