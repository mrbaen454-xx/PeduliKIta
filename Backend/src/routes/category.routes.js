const express = require('express');
const categoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const { categorySchema } = require('../validators/index.validator');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), validate(categorySchema), categoryController.create);
router.put('/:id', authenticate, authorize('ADMIN'), validate(categorySchema), categoryController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.remove);

module.exports = router;
