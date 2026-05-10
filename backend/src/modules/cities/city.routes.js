const express = require('express');
const controller = require('./city.controller');
const validate = require('../../middleware/validate.middleware');
const { citySearchSchema, activitySearchSchema } = require('./city.validation');

const router = express.Router();

router.get('/cities', validate(citySearchSchema), controller.searchCities);
router.get('/activity-suggestions', validate(activitySearchSchema), controller.searchActivitySuggestions);

module.exports = router;
