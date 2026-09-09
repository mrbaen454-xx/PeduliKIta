const express = require('express');
const updateController = require('../controllers/campaignUpdate.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');

const router = express.Router({ mergeParams: true });

router.get('/', updateController.getByCampaign);
router.post('/', authenticate, authorize('CAMPAIGNER'), upload.single('image'), handleUploadError, updateController.create);

module.exports = router;
