const { z } = require('zod');

const updateMeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    avatarUrl: z.string().url().nullable().optional()
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});

module.exports = { updateMeSchema };
