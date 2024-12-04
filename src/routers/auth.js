import express from 'express';
import { registrationSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registrationCtrl } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registrationSchema),
  ctrlWrapper(registrationCtrl),
);

export default router;
