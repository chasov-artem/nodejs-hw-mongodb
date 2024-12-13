import express from 'express';
import {
  registrationSchema,
  loginSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registrationCtrl,
  loginCtrl,
  logoutCtrl,
  refreshCtrl,
  requestResetPasswordCtrl,
  resetPasswordCtrl,
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

router.post('/refresh', ctrlWrapper(refreshCtrl));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordCtrl),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordCtrl),
);

export default router;
