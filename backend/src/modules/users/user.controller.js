const prisma = require('../../config/prisma');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { publicUserSelect } = require('../auth/auth.service');

const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { user: req.user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: req.body,
    select: publicUserSelect
  });
  ApiResponse.success(res, { user });
});

const deleteMe = asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { id: req.user.id } });
  ApiResponse.success(res, { message: 'Account deleted' });
});

module.exports = { getMe, updateMe, deleteMe };
