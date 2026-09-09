const express = require('express');
const campaignController = require('../controllers/campaign.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');
const updateRoutes = require('./campaignUpdate.routes');
const documentRoutes = require('./document.routes');
const donationController = require('../controllers/donation.controller');
const validate = require('../middleware/validation.middleware');
const { campaignSchema } = require('../validators/index.validator');

const router = express.Router();

router.get('/', campaignController.getAll);
router.get('/my', authenticate, authorize('CAMPAIGNER'), campaignController.getMyCampaigns);
router.get('/:id', campaignController.getById);

router.post('/', authenticate, authorize('CAMPAIGNER'), upload.single('image'), handleUploadError, validate(campaignSchema), campaignController.create);
router.put('/:id', authenticate, authorize('CAMPAIGNER'), upload.single('image'), handleUploadError, validate(campaignSchema), campaignController.update);
router.delete('/:id', authenticate, authorize('CAMPAIGNER'), campaignController.remove);
router.put('/:id/close', authenticate, authorize('CAMPAIGNER'), campaignController.close);

// Nested routes
router.use('/:campaignId/updates', updateRoutes);
router.use('/:campaignId/documents', documentRoutes);
router.get('/:campaignId/donations', authenticate, authorize('CAMPAIGNER'), donationController.getCampaignDonations);

module.exports = router;
