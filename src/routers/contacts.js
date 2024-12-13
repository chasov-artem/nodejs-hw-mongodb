import express from 'express';
import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  deleteContactCtrl,
  updateContactCtrl,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema, replaceContactSchema } from '../validation/contacts.js';
import { upload } from '../middlewares/upload.js';

const jsonParser = express.json();

const router = express.Router();

router.get('/', ctrlWrapper(getContactsCtrl));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdCtrl));

router.post(
  '/',
  upload.single('photo'),
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactCtrl),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactCtrl));

router.patch(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(replaceContactSchema),
  ctrlWrapper(updateContactCtrl),
);

export default router;
