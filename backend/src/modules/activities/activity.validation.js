const { z } = require('zod');

const stopIdParams = z.object({ stopId: z.string().min(1) });
const idParams = z.object({ id: z.string().min(1) });

const activityBody = {
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
  category: z.string().trim().min(2).max(80),
  startTime: z.coerce.date().nullable().optional(),
  durationMinutes: z.coerce.number().int().positive().nullable().optional(),
  estimatedCost: z.coerce.number().min(0).optional(),
  location: z.string().trim().max(160).nullable().optional()
};

const createActivitySchema = z.object({
  params: stopIdParams,
  body: z.object(activityBody)
});

const updateActivitySchema = z.object({
  params: idParams,
  body: z.object({
    title: activityBody.title.optional(),
    description: activityBody.description,
    category: activityBody.category.optional(),
    startTime: activityBody.startTime,
    durationMinutes: activityBody.durationMinutes,
    estimatedCost: activityBody.estimatedCost,
    location: activityBody.location
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});

const deleteActivitySchema = z.object({ params: idParams });

module.exports = { createActivitySchema, updateActivitySchema, deleteActivitySchema };
