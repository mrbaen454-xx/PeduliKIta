const express = require('express');
const donorController = require('../controllers/donor.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('DONOR'));

router.get('/dashboard', donorController.getDashboard);

module.exports = router;
