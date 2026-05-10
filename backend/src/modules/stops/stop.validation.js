const { z } = require('zod');

const tripIdParams = z.object({ tripId: z.string().min(1) });
const idParams = z.object({ id: z.string().min(1) });

const stopBody = {
  cityName: z.string().trim().min(2).max(120),
  country: z.string().trim().min(2).max(120),
  arrivalDate: z.coerce.date(),
  departureDate: z.coerce.date(),
  orderIndex: z.coerce.number().int().min(0).optional(),
  costIndex: z.coerce.number().min(0).nullable().optional()
};

const createStopSchema = z.object({
  params: tripIdParams,
  body: z.object(stopBody).refine((data) => data.departureDate >= data.arrivalDate, {
    message: 'departureDate must be after or equal to arrivalDate',
    path: ['departureDate']
  })
});

const updateStopSchema = z.object({
  params: idParams,
  body: z.object({
    cityName: stopBody.cityName.optional(),
    country: stopBody.country.optional(),
    arrivalDate: stopBody.arrivalDate.optional(),
    departureDate: stopBody.departureDate.optional(),
    orderIndex: stopBody.orderIndex,
    costIndex: stopBody.costIndex
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});

const deleteStopSchema = z.object({ params: idParams });

const reorderStopsSchema = z.object({
  params: tripIdParams,
  body: z.object({
    stops: z.array(z.object({ id: z.string().min(1), orderIndex: z.coerce.number().int().min(0) })).min(1)
  })
});

module.exports = { createStopSchema, updateStopSchema, deleteStopSchema, reorderStopsSchema };
