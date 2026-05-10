const express = require('express');
const controller = require('./checklist.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { getChecklistSchema, createChecklistSchema, updateChecklistSchema, deleteChecklistSchema } = require('./checklist.validation');

const router = express.Router();

router.use(protect);
router.get('/trips/:tripId/checklist', validate(getChecklistSchema), controller.getChecklist);
router.post('/trips/:tripId/checklist', validate(createChecklistSchema), controller.createChecklistItem);
router.put('/checklist/:id', validate(updateChecklistSchema), controller.updateChecklistItem);
router.delete('/checklist/:id', validate(deleteChecklistSchema), controller.deleteChecklistItem);

module.exports = router;
