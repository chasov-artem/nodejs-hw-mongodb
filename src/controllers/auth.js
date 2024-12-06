import { registerUser, loginUser } from '../services/auth.js';

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
  res.send();
};
