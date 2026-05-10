const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { ensureTripOwner } = require('../../middleware/ownership.middleware');

const tripListInclude = {
  _count: {
    select: { stops: true, budgetItems: true, checklistItems: true, notes: true }
  }
};

const tripDetailInclude = {
  stops: { orderBy: { orderIndex: 'asc' }, include: { activities: { orderBy: { createdAt: 'asc' } } } },
  budgetItems: { orderBy: { createdAt: 'desc' } },
  checklistItems: { orderBy: { createdAt: 'asc' } },
  notes: { orderBy: { updatedAt: 'desc' } }
};

const listTrips = asyncHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: 'desc' },
    include: tripListInclude
  });
  ApiResponse.success(res, { trips });
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await prisma.trip.create({
    data: { ...req.body, userId: req.user.id },
    include: tripDetailInclude
  });
  ApiResponse.success(res, { trip }, 201);
});

const getTrip = asyncHandler(async (req, res) => {
  const trip = await ensureTripOwner(req.params.id, req.user.id, { include: tripDetailInclude });
  ApiResponse.success(res, { trip });
});

const updateTrip = asyncHandler(async (req, res) => {
  const existing = await ensureTripOwner(req.params.id, req.user.id);
  const nextStart = req.body.startDate || existing.startDate;
  const nextEnd = req.body.endDate || existing.endDate;
  if (nextEnd < nextStart) throw ApiError.badRequest('endDate must be after or equal to startDate');

  const trip = await prisma.trip.update({
    where: { id: existing.id },
    data: req.body,
    include: tripDetailInclude
  });
  ApiResponse.success(res, { trip });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await ensureTripOwner(req.params.id, req.user.id);
  await prisma.trip.delete({ where: { id: trip.id } });
  ApiResponse.success(res, { message: 'Trip deleted' });
});

module.exports = { listTrips, createTrip, getTrip, updateTrip, deleteTrip };
