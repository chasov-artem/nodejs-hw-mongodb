import { registerUser } from '../services/auth.js';

export const registrationCtrl = async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await registerUser(payload);

  console.log(user);

  res.send('Register');
};
