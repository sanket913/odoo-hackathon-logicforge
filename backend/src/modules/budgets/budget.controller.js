const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { ensureTripOwner, ensureBudgetItemOwner } = require('../../middleware/ownership.middleware');

const toNumber = (value) => Number(value || 0);

const buildSummary = (trip, items) => {
  const totalEstimatedCost = items.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const costByCategory = items.reduce((acc, item) => {
    const key = item.category.toLowerCase();
    acc[key] = (acc[key] || 0) + toNumber(item.amount);
    return acc;
  }, {});

  const days = Math.max(1, Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24)) + 1);
  const budgetCap = toNumber(trip.totalEstimatedBudget);
  const overBudgetAlerts = budgetCap > 0 && totalEstimatedCost > budgetCap
    ? [{ type: 'trip_total', message: `Estimated cost exceeds trip budget by ${Math.round(totalEstimatedCost - budgetCap)}` }]
    : [];

  return {
    totalEstimatedCost,
    costByCategory,
    averageCostPerDay: Math.round((totalEstimatedCost / days) * 100) / 100,
    overBudgetAlerts
  };
};

const getBudget = asyncHandler(async (req, res) => {
  const trip = await ensureTripOwner(req.params.tripId, req.user.id);
  const items = await prisma.budgetItem.findMany({
    where: { tripId: trip.id },
    orderBy: { createdAt: 'desc' }
  });
  ApiResponse.success(res, { items, summary: buildSummary(trip, items) });
});

const createBudgetItem = asyncHandler(async (req, res) => {
  await ensureTripOwner(req.params.tripId, req.user.id);
  const item = await prisma.budgetItem.create({
    data: { ...req.body, tripId: req.params.tripId }
  });
  ApiResponse.success(res, { item }, 201);
});

const updateBudgetItem = asyncHandler(async (req, res) => {
  const existing = await ensureBudgetItemOwner(req.params.id, req.user.id);
  const item = await prisma.budgetItem.update({ where: { id: existing.id }, data: req.body });
  ApiResponse.success(res, { item });
});

const deleteBudgetItem = asyncHandler(async (req, res) => {
  const item = await ensureBudgetItemOwner(req.params.id, req.user.id);
  await prisma.budgetItem.delete({ where: { id: item.id } });
  ApiResponse.success(res, { message: 'Budget item deleted' });
});

module.exports = { getBudget, createBudgetItem, updateBudgetItem, deleteBudgetItem, buildSummary };
