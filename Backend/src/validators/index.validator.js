const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Nama minimal 3 karakter',
    'any.required': 'Nama wajib diisi'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  }),
  role: Joi.string().valid('DONOR', 'CAMPAIGNER').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const campaignSchema = Joi.object({
  title: Joi.string().min(10).required(),
  description: Joi.string().min(20).required(),
  targetAmount: Joi.number().min(10000).required(),
  endDate: Joi.date().greater('now').required(),
  categoryId: Joi.number().required()
});

const donationSchema = Joi.object({
  campaignId: Joi.number().required(),
  amount: Joi.number().min(1000).required(),
  message: Joi.string().allow('', null).optional(),
  isAnonymous: Joi.boolean().optional().default(false)
});

const categorySchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
});

module.exports = { registerSchema, loginSchema, campaignSchema, donationSchema, categorySchema };
