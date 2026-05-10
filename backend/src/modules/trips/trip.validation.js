const { z } = require('zod');

const idParams = z.object({ id: z.string().min(1) });

const statusSchema = z
  .string()
  .trim()
  .toUpperCase()
  .pipe(z.enum(['PLANNED', 'ACTIVE', 'COMPLETED']));

const baseTrip = {
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  coverImageUrl: z.string().trim().min(1).max(2000).nullable().optional(),
  status: statusSchema.optional(),
  totalEstimatedBudget: z.coerce.number().min(0).optional(),
  isPublic: z.boolean().optional()
};

const createTripSchema = z.object({
  body: z.object(baseTrip).refine((data) => data.endDate >= data.startDate, {
    message: 'endDate must be after or equal to startDate',
    path: ['endDate']
  })
});

const updateTripSchema = z.object({
  params: idParams,
  body: z.object({
    title: baseTrip.title.optional(),
    description: baseTrip.description,
    startDate: baseTrip.startDate.optional(),
    endDate: baseTrip.endDate.optional(),
    coverImageUrl: baseTrip.coverImageUrl,
    status: baseTrip.status,
    totalEstimatedBudget: baseTrip.totalEstimatedBudget,
    isPublic: baseTrip.isPublic
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});

const tripIdParamSchema = z.object({
  params: idParams
});

module.exports = { createTripSchema, updateTripSchema, tripIdParamSchema };
