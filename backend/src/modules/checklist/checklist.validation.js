const { z } = require('zod');

const tripIdParams = z.object({ tripId: z.string().min(1) });
const idParams = z.object({ id: z.string().min(1) });
const category = z
  .string()
  .trim()
  .toUpperCase()
  .pipe(z.enum(['CLOTHING', 'DOCUMENTS', 'ELECTRONICS', 'MEDICINES', 'OTHER']));

const checklistBody = {
  title: z.string().trim().min(2).max(140),
  category,
  isPacked: z.boolean().optional()
};

const getChecklistSchema = z.object({ params: tripIdParams });
const createChecklistSchema = z.object({ params: tripIdParams, body: z.object(checklistBody) });
const updateChecklistSchema = z.object({
  params: idParams,
  body: z.object({
    title: checklistBody.title.optional(),
    category: checklistBody.category.optional(),
    isPacked: z.boolean().optional()
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});
const deleteChecklistSchema = z.object({ params: idParams });

module.exports = { getChecklistSchema, createChecklistSchema, updateChecklistSchema, deleteChecklistSchema };
