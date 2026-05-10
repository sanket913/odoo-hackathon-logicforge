const express = require('express');
const controller = require('./admin.controller');
const { protect, requireAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/admin/analytics', protect, requireAdmin, controller.analytics);

module.exports = router;
