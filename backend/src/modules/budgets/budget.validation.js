const { z } = require('zod');

const tripIdParams = z.object({ tripId: z.string().min(1) });
const idParams = z.object({ id: z.string().min(1) });
const category = z
  .string()
  .trim()
  .toUpperCase()
  .pipe(z.enum(['TRANSPORT', 'STAY', 'FOOD', 'ACTIVITIES', 'MISC']));

const budgetBody = {
  category,
  title: z.string().trim().min(2).max(140),
  amount: z.coerce.number().min(0),
  currency: z.string().trim().length(3).toUpperCase().optional(),
  date: z.coerce.date().nullable().optional()
};

const getBudgetSchema = z.object({ params: tripIdParams });
const createBudgetSchema = z.object({ params: tripIdParams, body: z.object(budgetBody) });
const updateBudgetSchema = z.object({
  params: idParams,
  body: z.object({
    category: budgetBody.category.optional(),
    title: budgetBody.title.optional(),
    amount: budgetBody.amount.optional(),
    currency: budgetBody.currency,
    date: budgetBody.date
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});
const deleteBudgetSchema = z.object({ params: idParams });

module.exports = { getBudgetSchema, createBudgetSchema, updateBudgetSchema, deleteBudgetSchema };
