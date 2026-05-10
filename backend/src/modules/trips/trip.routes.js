const express = require('express');
const controller = require('./trip.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { createTripSchema, updateTripSchema, tripIdParamSchema } = require('./trip.validation');

const router = express.Router();

router.use(protect);
router.get('/', controller.listTrips);
router.post('/', validate(createTripSchema), controller.createTrip);
router.get('/:id', validate(tripIdParamSchema), controller.getTrip);
router.put('/:id', validate(updateTripSchema), controller.updateTrip);
router.delete('/:id', validate(tripIdParamSchema), controller.deleteTrip);

module.exports = router;
