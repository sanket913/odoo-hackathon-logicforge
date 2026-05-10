const express = require('express');
const controller = require('./stop.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { createStopSchema, updateStopSchema, deleteStopSchema, reorderStopsSchema } = require('./stop.validation');

const router = express.Router();

router.use(protect);
router.post('/trips/:tripId/stops', validate(createStopSchema), controller.createStop);
router.put('/stops/:id', validate(updateStopSchema), controller.updateStop);
router.delete('/stops/:id', validate(deleteStopSchema), controller.deleteStop);
router.put('/trips/:tripId/stops/reorder', validate(reorderStopsSchema), controller.reorderStops);

module.exports = router;
