const express = require('express');
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);

router.get('/campaigns/pending', adminController.getPendingCampaigns);
router.put('/campaigns/:id/approve', adminController.approveCampaign);
router.put('/campaigns/:id/reject', adminController.rejectCampaign);

router.get('/donations/pending', adminController.getPendingDonations);
router.put('/donations/:id/verify', adminController.verifyDonationAction);
router.put('/donations/:id/reject', adminController.rejectDonationAction);

module.exports = router;
