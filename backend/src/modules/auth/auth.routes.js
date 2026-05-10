const express = require('express');
const controller = require('./auth.controller');
const validate = require('../../middleware/validate.middleware');
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', authLimiter, controller.refresh);
router.post('/logout', controller.logout);

module.exports = router;
