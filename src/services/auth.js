import createHttpError from 'http-errors';

import { User } from '../models/user.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }

  return User.create(payload);
};
