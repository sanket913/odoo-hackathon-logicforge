const { z } = require('zod');

const shareTripSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const publicItinerarySchema = z.object({ params: z.object({ shareToken: z.string().min(12) }) });

module.exports = { shareTripSchema, publicItinerarySchema };
