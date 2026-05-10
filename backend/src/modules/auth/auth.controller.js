const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { refreshCookieOptions } = require('../../utils/jwt');

const cookieName = 'routewise_refresh';

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.cookie(cookieName, result.refreshToken, refreshCookieOptions());
  ApiResponse.success(res, { user: result.user, accessToken: result.accessToken }, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.cookie(cookieName, result.refreshToken, refreshCookieOptions());
  ApiResponse.success(res, { user: result.user, accessToken: result.accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.cookies[cookieName]);
  res.cookie(cookieName, result.refreshToken, refreshCookieOptions());
  ApiResponse.success(res, { user: result.user, accessToken: result.accessToken });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies[cookieName]);
  res.clearCookie(cookieName, refreshCookieOptions());
  ApiResponse.success(res, { message: 'Logged out' });
});

module.exports = { register, login, refresh, logout, cookieName };
