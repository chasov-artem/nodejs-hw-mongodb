import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return session;
};

export const logoutUser = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (session) {
    session.accessTokenValidUntil = new Date(0);
    await session.save();
  }
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );
  console.log(resetToken);
};
