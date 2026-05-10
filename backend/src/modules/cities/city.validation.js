const { z } = require('zod');

const budgetLevel = z.enum(['low', 'medium', 'high']).transform((value) => value.toUpperCase()).optional();

const citySearchSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    country: z.string().trim().optional(),
    region: z.string().trim().optional(),
    budgetLevel,
    popularity: z.coerce.number().int().min(0).max(100).optional()
  })
});

const activitySearchSchema = z.object({
  query: z.object({
    city: z.string().trim().optional(),
    category: z.string().trim().optional(),
    budgetLevel
  })
});

module.exports = { citySearchSchema, activitySearchSchema };
