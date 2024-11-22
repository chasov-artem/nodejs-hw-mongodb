import express from 'express';
import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  deleteContactCtrl,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const jsonParser = express.json();

const router = express.Router();

router.get('/', ctrlWrapper(getContactsCtrl));

router.get('/:contactId', ctrlWrapper(getContactByIdCtrl));

router.post('/', jsonParser, ctrlWrapper(createContactCtrl));

router.delete('/:id', ctrlWrapper(deleteContactCtrl));

export default router;
