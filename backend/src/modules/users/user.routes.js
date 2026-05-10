const express = require('express');
const controller = require('./user.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { updateMeSchema } = require('./user.validation');

const router = express.Router();

router.get('/me', protect, controller.getMe);
router.put('/me', protect, validate(updateMeSchema), controller.updateMe);
router.delete('/me', protect, controller.deleteMe);

module.exports = router;
