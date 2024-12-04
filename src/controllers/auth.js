import { registerUser } from '../services/auth.js';

export const registrationCtrl = async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);

  res.send({
    status: 200,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
};
