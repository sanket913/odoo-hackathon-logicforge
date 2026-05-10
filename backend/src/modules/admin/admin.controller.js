const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const analytics = asyncHandler(async (_req, res) => {
  const [users, trips, publicTrips, cities] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.trip.count({ where: { isPublic: true } }),
    prisma.city.count()
  ]);

  ApiResponse.success(res, {
    analytics: {
      users,
      trips,
      publicTrips,
      cities
    }
  });
});

module.exports = { analytics };
