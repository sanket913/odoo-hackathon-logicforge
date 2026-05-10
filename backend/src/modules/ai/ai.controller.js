const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const prisma = require('../../config/prisma');
const { ensureTripOwner } = require('../../middleware/ownership.middleware');
const service = require('./ai.service');

const withOptionalTripOwnership = (handler) => asyncHandler(async (req, res) => {
  let tripContext = null;
  if (req.body.tripId) {
    const trip = await ensureTripOwner(req.body.tripId, req.user.id);
    tripContext = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: {
        stops: { orderBy: { orderIndex: 'asc' }, include: { activities: { orderBy: { createdAt: 'asc' } } } },
        budgetItems: { orderBy: { createdAt: 'desc' } },
        checklistItems: true,
        notes: true
      }
    });
  }
  const result = await handler({ ...req.body, trip: tripContext });
  ApiResponse.success(res, result);
});

module.exports = {
  recommend: withOptionalTripOwnership(async (body) => ({ result: await service.recommend(body) })),
  improveItinerary: withOptionalTripOwnership(async (body) => ({ result: await service.improveItinerary(body) })),
  optimizeBudget: withOptionalTripOwnership(async (body) => ({ result: await service.optimizeBudget(body) })),
  generateSummary: withOptionalTripOwnership(async (body) => ({ result: await service.generateSummary(body) })),
  analyzeStress: withOptionalTripOwnership(async (body) => ({ result: await service.stressMeter(body) })),
  stressMeter: withOptionalTripOwnership(async (body) => ({ result: await service.stressMeter(body) }))
};
