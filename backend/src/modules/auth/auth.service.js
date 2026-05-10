const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  refreshTokenExpiresAt
} = require('../../utils/jwt');

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

const createSession = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: refreshTokenExpiresAt()
    }
  });

  return { accessToken, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ApiError.conflict('Email is already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: publicUserSelect
  });

  const tokens = await createSession(user);
  return { user, ...tokens };
};

const login = async ({ email, password }) => {
  const userWithPassword = await prisma.user.findUnique({ where: { email } });
  if (!userWithPassword) throw ApiError.unauthorized('Invalid email or password');

  const isValid = await bcrypt.compare(password, userWithPassword.passwordHash);
  if (!isValid) throw ApiError.unauthorized('Invalid email or password');

  const user = await prisma.user.findUnique({ where: { id: userWithPassword.id }, select: publicUserSelect });
  const tokens = await createSession(user);
  return { user, ...tokens };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized('Refresh token is required');

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== 'refresh') throw ApiError.unauthorized('Refresh token is invalid', 'TOKEN_INVALID');

    const tokenHash = hashToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { select: publicUserSelect } }
    });

    if (!storedToken || storedToken.userId !== payload.sub) {
      throw ApiError.unauthorized('Refresh token is invalid', 'TOKEN_INVALID');
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw ApiError.unauthorized('Refresh token has expired', 'TOKEN_EXPIRED');
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    const tokens = await createSession(storedToken.user);
    return { user: storedToken.user, ...tokens };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Refresh token has expired', 'TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Refresh token is invalid', 'TOKEN_INVALID');
    }
    throw error;
  }
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await prisma.refreshToken.deleteMany({ where: { tokenHash: hashToken(refreshToken) } });
};

module.exports = { register, login, refresh, logout, publicUserSelect };
