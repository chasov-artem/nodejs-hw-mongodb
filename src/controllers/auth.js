import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
  resetPassword,
} from '../services/auth.js';
import { generateOAuthURL } from '../utils/googleOAuth2.js';

export const registrationCtrl = async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);

  res.send({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
};

export const loginCtrl = async (req, res) => {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutCtrl = async (req, res) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    return res.status(400).json({
      status: 400,
      message: 'No session found',
    });
  }

  await logoutUser(sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

export const refreshCtrl = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Session refreshed',
    data: { accessToken: session.accessToken },
  });
};

export const requestResetPasswordCtrl = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  await requestResetPassword(email);

  res.send({ status: 200, massage: 'Reset email was sended', data: null });
};

export const resetPasswordCtrl = async (req, res) => {
  const { password, token } = req.body;

  console.log({ password, token });

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getOAuthURLCtrl = async (req, res) => {
  const url = generateOAuthURL();

  res.send({
    status: 200,
    message: 'Successfully get Google OAuth URL',
    data: url,
  });
};
