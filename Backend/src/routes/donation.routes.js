const express = require('express');
const donationController = require('../controllers/donation.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');
const validate = require('../middleware/validation.middleware');
const { donationSchema } = require('../validators/index.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('DONOR'), upload.single('proof'), handleUploadError, validate(donationSchema), donationController.create);
router.get('/my', authorize('DONOR'), donationController.getMyDonations);
router.get('/:id', authorize('DONOR'), donationController.getById);

module.exports = router;
