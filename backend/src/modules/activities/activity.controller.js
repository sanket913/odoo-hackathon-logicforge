const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { ensureStopOwner, ensureActivityOwner } = require('../../middleware/ownership.middleware');

const createActivity = asyncHandler(async (req, res) => {
  await ensureStopOwner(req.params.stopId, req.user.id);
  const activity = await prisma.activity.create({
    data: { ...req.body, stopId: req.params.stopId }
  });
  ApiResponse.success(res, { activity }, 201);
});

const updateActivity = asyncHandler(async (req, res) => {
  const existing = await ensureActivityOwner(req.params.id, req.user.id);
  const activity = await prisma.activity.update({
    where: { id: existing.id },
    data: req.body
  });
  ApiResponse.success(res, { activity });
});

const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await ensureActivityOwner(req.params.id, req.user.id);
  await prisma.activity.delete({ where: { id: activity.id } });
  ApiResponse.success(res, { message: 'Activity deleted' });
});

module.exports = { createActivity, updateActivity, deleteActivity };
