const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const budgetFilter = (level) => {
  if (level === 'LOW') return { lte: 2.5 };
  if (level === 'MEDIUM') return { gt: 2.5, lte: 3.8 };
  if (level === 'HIGH') return { gt: 3.8 };
  return undefined;
};

const searchCities = asyncHandler(async (req, res) => {
  const { search, country, region, budgetLevel, popularity } = req.query;
  const cities = await prisma.city.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(country ? { country: { contains: country, mode: 'insensitive' } } : {}),
      ...(region ? { region: { contains: region, mode: 'insensitive' } } : {}),
      ...(budgetLevel ? { costIndex: budgetFilter(budgetLevel) } : {}),
      ...(popularity ? { popularity: { gte: popularity } } : {})
    },
    orderBy: [{ popularity: 'desc' }, { name: 'asc' }],
    take: 50
  });

  ApiResponse.success(res, { cities });
});

const searchActivitySuggestions = asyncHandler(async (req, res) => {
  const { city, category, budgetLevel } = req.query;
  const suggestions = await prisma.activitySuggestion.findMany({
    where: {
      ...(city ? { cityName: { contains: city, mode: 'insensitive' } } : {}),
      ...(category ? { category: { contains: category, mode: 'insensitive' } } : {}),
      ...(budgetLevel ? { budgetLevel } : {})
    },
    orderBy: { estimatedCost: 'asc' },
    take: 50
  });

  ApiResponse.success(res, { suggestions });
});

module.exports = { searchCities, searchActivitySuggestions };
