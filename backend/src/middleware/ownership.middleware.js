const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const ensureTripOwner = async (tripId, userId, options = {}) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    ...options
  });
  if (!trip) throw ApiError.notFound('Trip not found');
  return trip;
};

const ensureStopOwner = async (stopId, userId, options = {}) => {
  const stop = await prisma.tripStop.findFirst({
    where: { id: stopId, trip: { userId } },
    ...options
  });
  if (!stop) throw ApiError.notFound('Stop not found');
  return stop;
};

const ensureActivityOwner = async (activityId, userId, options = {}) => {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId, stop: { trip: { userId } } },
    ...options
  });
  if (!activity) throw ApiError.notFound('Activity not found');
  return activity;
};

const ensureBudgetItemOwner = async (itemId, userId, options = {}) => {
  const item = await prisma.budgetItem.findFirst({
    where: { id: itemId, trip: { userId } },
    ...options
  });
  if (!item) throw ApiError.notFound('Budget item not found');
  return item;
};

const ensureChecklistItemOwner = async (itemId, userId, options = {}) => {
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, trip: { userId } },
    ...options
  });
  if (!item) throw ApiError.notFound('Checklist item not found');
  return item;
};

const ensureNoteOwner = async (noteId, userId, options = {}) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, trip: { userId } },
    ...options
  });
  if (!note) throw ApiError.notFound('Note not found');
  return note;
};

module.exports = {
  ensureTripOwner,
  ensureStopOwner,
  ensureActivityOwner,
  ensureBudgetItemOwner,
  ensureChecklistItemOwner,
  ensureNoteOwner
};
