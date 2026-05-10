const express = require('express');
const controller = require('./activity.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { createActivitySchema, updateActivitySchema, deleteActivitySchema } = require('./activity.validation');

const router = express.Router();

router.use(protect);
router.post('/stops/:stopId/activities', validate(createActivitySchema), controller.createActivity);
router.put('/activities/:id', validate(updateActivitySchema), controller.updateActivity);
router.delete('/activities/:id', validate(deleteActivitySchema), controller.deleteActivity);

module.exports = router;
