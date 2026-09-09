const express = require('express');
const updateController = require('../controllers/campaignUpdate.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');

const router = express.Router();

router.put('/:id', authenticate, authorize('CAMPAIGNER'), upload.single('image'), handleUploadError, updateController.update);
router.delete('/:id', authenticate, authorize('CAMPAIGNER'), updateController.remove);

module.exports = router;
