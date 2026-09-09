const express = require('express');
const documentController = require('../controllers/document.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.delete('/:id', authenticate, authorize('CAMPAIGNER'), documentController.remove);

module.exports = router;
