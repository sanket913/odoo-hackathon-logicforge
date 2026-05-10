const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { ensureTripOwner, ensureNoteOwner } = require('../../middleware/ownership.middleware');

const ensureStopBelongsToTrip = async (stopId, tripId) => {
  if (!stopId) return;
  const stop = await prisma.tripStop.findFirst({ where: { id: stopId, tripId } });
  if (!stop) throw ApiError.forbidden('Stop does not belong to this trip');
};

const getNotes = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  const notes = await prisma.note.findMany({
    where: { tripId: req.params.tripId },
    orderBy: { updatedAt: 'desc' }
  });
  ApiResponse.success(res, { notes });
});

const createNote = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  await ensureStopBelongsToTrip(req.body.stopId, req.params.tripId);
  const note = await prisma.note.create({
    data: { ...req.body, tripId: req.params.tripId }
  });
  ApiResponse.success(res, { note }, 201);
});

const updateNote = asyncHandler(async (req, res) => {
  const existing = await ensureNoteOwner(req.params.id, req.user.id);
  await ensureStopBelongsToTrip(req.body.stopId, existing.tripId);
  const note = await prisma.note.update({ where: { id: existing.id }, data: req.body });
  ApiResponse.success(res, { note });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await ensureNoteOwner(req.params.id, req.user.id);
  await prisma.note.delete({ where: { id: note.id } });
  ApiResponse.success(res, { message: 'Note deleted' });
});

module.exports = { getNotes, createNote, updateNote, deleteNote };
