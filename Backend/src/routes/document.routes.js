const express = require('express');
const documentController = require('../controllers/document.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');

const router = express.Router({ mergeParams: true });

router.get('/', documentController.getByCampaign);
router.post('/', authenticate, authorize('CAMPAIGNER'), upload.single('document'), handleUploadError, documentController.upload);

module.exports = router;
