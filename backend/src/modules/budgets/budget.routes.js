const express = require('express');
const controller = require('./budget.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { getBudgetSchema, createBudgetSchema, updateBudgetSchema, deleteBudgetSchema } = require('./budget.validation');

const router = express.Router();

router.use(protect);
router.get('/trips/:tripId/budget', validate(getBudgetSchema), controller.getBudget);
router.post('/trips/:tripId/budget', validate(createBudgetSchema), controller.createBudgetItem);
router.put('/budget/:id', validate(updateBudgetSchema), controller.updateBudgetItem);
router.delete('/budget/:id', validate(deleteBudgetSchema), controller.deleteBudgetItem);

module.exports = router;
