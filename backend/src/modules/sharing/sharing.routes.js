const express = require('express');
const controller = require('./sharing.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { shareTripSchema, publicItinerarySchema } = require('./sharing.validation');

const router = express.Router();

router.post('/trips/:id/share', protect, validate(shareTripSchema), controller.shareTrip);
router.get('/public/itinerary/:shareToken', validate(publicItinerarySchema), controller.getPublicItinerary);
router.post('/public/itinerary/:shareToken/copy', protect, validate(publicItinerarySchema), controller.copyPublicItinerary);

module.exports = router;
