const crypto = require('crypto');
const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { ensureTripOwner } = require('../../middleware/ownership.middleware');

const publicInclude = {
  stops: { orderBy: { orderIndex: 'asc' }, include: { activities: { orderBy: { createdAt: 'asc' } } } },
  budgetItems: true,
  checklistItems: true,
  notes: true,
  user: { select: { id: true, name: true, avatarUrl: true } }
};

const createShareToken = () => crypto.randomBytes(24).toString('hex');

const shareTrip = asyncHandler(async (req, res) => {
  const trip = await ensureTripOwner(req.params.id, req.user.id);
  const shareToken = trip.shareToken || createShareToken();
  const updated = await prisma.trip.update({
    where: { id: trip.id },
    data: { isPublic: true, shareToken },
    select: { id: true, isPublic: true, shareToken: true }
  });
  ApiResponse.success(res, { trip: updated, publicUrl: `/api/v1/public/itinerary/${updated.shareToken}` });
});

const getPublicItinerary = asyncHandler(async (req, res) => {
  const trip = await prisma.trip.findFirst({
    where: { shareToken: req.params.shareToken, isPublic: true },
    include: publicInclude
  });
  if (!trip) throw ApiError.notFound('Public itinerary not found');
  ApiResponse.success(res, { trip });
});

const copyPublicItinerary = asyncHandler(async (req, res) => {
  const source = await prisma.trip.findFirst({
    where: { shareToken: req.params.shareToken, isPublic: true },
    include: publicInclude
  });
  if (!source) throw ApiError.notFound('Public itinerary not found');

  const trip = await prisma.trip.create({
    data: {
      userId: req.user.id,
      title: `${source.title} (Copy)`,
      description: source.description,
      startDate: source.startDate,
      endDate: source.endDate,
      coverImageUrl: source.coverImageUrl,
      status: 'PLANNED',
      totalEstimatedBudget: source.totalEstimatedBudget,
      stops: {
        create: source.stops.map((stop) => ({
          cityName: stop.cityName,
          country: stop.country,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          orderIndex: stop.orderIndex,
          costIndex: stop.costIndex,
          activities: {
            create: stop.activities.map((activity) => ({
              title: activity.title,
              description: activity.description,
              category: activity.category,
              startTime: activity.startTime,
              durationMinutes: activity.durationMinutes,
              estimatedCost: activity.estimatedCost,
              location: activity.location
            }))
          }
        }))
      },
      budgetItems: {
        create: source.budgetItems.map((item) => ({
          category: item.category,
          title: item.title,
          amount: item.amount,
          currency: item.currency,
          date: item.date
        }))
      },
      checklistItems: {
        create: source.checklistItems.map((item) => ({
          title: item.title,
          category: item.category,
          isPacked: false
        }))
      },
      notes: {
        create: source.notes.map((note) => ({
          title: note.title,
          content: note.content
        }))
      }
    },
    include: {
      stops: { include: { activities: true } },
      budgetItems: true,
      checklistItems: true,
      notes: true
    }
  });

  ApiResponse.success(res, { trip }, 201);
});

module.exports = { shareTrip, getPublicItinerary, copyPublicItinerary };
