import express from 'express';
import { registrationSchema, loginSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registrationCtrl,
  loginCtrl,
  logoutCtrl,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registrationSchema),
  ctrlWrapper(registrationCtrl),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginCtrl),
);

router.post('/logout', ctrlWrapper(logoutCtrl));

export default router;
