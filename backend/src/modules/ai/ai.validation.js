const { z } = require('zod');

const aiRequestSchema = z.object({
  body: z.object({
    tripId: z.string().min(1).optional(),
    destination: z.string().trim().min(2).optional(),
    preferences: z.array(z.string().trim().min(1)).max(20).optional(),
    budget: z.coerce.number().min(0).optional(),
    durationDays: z.coerce.number().int().positive().optional(),
    travelStyle: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(4000).optional(),
    stops: z.array(z.unknown()).optional(),
    activities: z.array(z.unknown()).optional()
  }).refine((data) => data.tripId || data.destination || data.notes, {
    message: 'Provide tripId, destination, or notes'
  })
});

module.exports = { aiRequestSchema };
