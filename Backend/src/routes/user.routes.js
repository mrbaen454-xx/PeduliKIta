const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id/status', userController.updateStatus);

module.exports = router;
