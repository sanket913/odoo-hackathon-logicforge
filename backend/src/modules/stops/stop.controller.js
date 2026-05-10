const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { ensureTripOwner, ensureStopOwner } = require('../../middleware/ownership.middleware');

const createStop = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  const orderIndex = req.body.orderIndex ?? await prisma.tripStop.count({ where: { tripId: req.params.tripId } });
  const stop = await prisma.tripStop.create({
    data: { ...req.body, tripId: req.params.tripId, orderIndex }
  });
  ApiResponse.success(res, { stop }, 201);
});

const updateStop = asyncHandler(async (req, res) => {
  const existing = await ensureStopOwner(req.params.id, req.user.id);
  const nextArrival = req.body.arrivalDate || existing.arrivalDate;
  const nextDeparture = req.body.departureDate || existing.departureDate;
  if (nextDeparture < nextArrival) throw ApiError.badRequest('departureDate must be after or equal to arrivalDate');

  const stop = await prisma.tripStop.update({
    where: { id: existing.id },
    data: req.body,
    include: { activities: true }
  });
  ApiResponse.success(res, { stop });
});

const deleteStop = asyncHandler(async (req, res) => {
  const stop = await ensureStopOwner(req.params.id, req.user.id);
  await prisma.tripStop.delete({ where: { id: stop.id } });
  ApiResponse.success(res, { message: 'Stop deleted' });
});

const reorderStops = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  const requestedIds = req.body.stops.map((stop) => stop.id);
  const ownedStops = await prisma.tripStop.findMany({
    where: { id: { in: requestedIds }, tripId: req.params.tripId }
  });

  if (ownedStops.length !== requestedIds.length) {
    throw ApiError.forbidden('One or more stops do not belong to this trip');
  }

  await prisma.$transaction(
    req.body.stops.map((stop) =>
      prisma.tripStop.update({
        where: { id: stop.id },
        data: { orderIndex: stop.orderIndex }
      })
    )
  );

  const stops = await prisma.tripStop.findMany({
    where: { tripId: req.params.tripId },
    orderBy: { orderIndex: 'asc' },
    include: { activities: true }
  });
  ApiResponse.success(res, { stops });
});

module.exports = { createStop, updateStop, deleteStop, reorderStops };
