import express from 'express';
import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  deleteContactCtrl,
  updateContactCtrl,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const jsonParser = express.json();

const router = express.Router();

router.get('/', ctrlWrapper(getContactsCtrl));

router.get('/:id', ctrlWrapper(getContactByIdCtrl));

router.post('/', jsonParser, ctrlWrapper(createContactCtrl));

router.delete('/:id', ctrlWrapper(deleteContactCtrl));

router.patch('/:id', ctrlWrapper(updateContactCtrl));

export default router;
