const express = require('express');
const controller = require('./ai.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { aiRequestSchema } = require('./ai.validation');

const router = express.Router();

router.use(protect);
router.post('/ai/ask', validate(aiRequestSchema), controller.ask);
router.post('/ai/recommend', validate(aiRequestSchema), controller.recommend);
router.post('/ai/improve-itinerary', validate(aiRequestSchema), controller.improveItinerary);
router.post('/ai/optimize-budget', validate(aiRequestSchema), controller.optimizeBudget);
router.post('/ai/generate-summary', validate(aiRequestSchema), controller.generateSummary);
router.post('/ai/analyze-stress', validate(aiRequestSchema), controller.analyzeStress);
router.post('/ai/stress-meter', validate(aiRequestSchema), controller.stressMeter);

module.exports = router;
