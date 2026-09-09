const express = require('express');
const campaignerController = require('../controllers/campaigner.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('CAMPAIGNER'));

router.get('/dashboard', campaignerController.getDashboard);

module.exports = router;
