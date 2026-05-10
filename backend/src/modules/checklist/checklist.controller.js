const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { ensureTripOwner, ensureChecklistItemOwner } = require('../../middleware/ownership.middleware');

const getChecklist = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  const items = await prisma.checklistItem.findMany({
    where: { tripId: req.params.tripId },
    orderBy: [{ isPacked: 'asc' }, { createdAt: 'asc' }]
  });
  ApiResponse.success(res, { items });
});

const createChecklistItem = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  const item = await prisma.checklistItem.create({
    data: { ...req.body, tripId: req.params.tripId }
  });
  ApiResponse.success(res, { item }, 201);
});

const updateChecklistItem = asyncHandler(async (req, res) => {
  const existing = await ensureChecklistItemOwner(req.params.id, req.user.id);
  const item = await prisma.checklistItem.update({ where: { id: existing.id }, data: req.body });
  ApiResponse.success(res, { item });
});

const deleteChecklistItem = asyncHandler(async (req, res) => {
  const item = await ensureChecklistItemOwner(req.params.id, req.user.id);
  await prisma.checklistItem.delete({ where: { id: item.id } });
  ApiResponse.success(res, { message: 'Checklist item deleted' });
});

module.exports = { getChecklist, createChecklistItem, updateChecklistItem, deleteChecklistItem };
