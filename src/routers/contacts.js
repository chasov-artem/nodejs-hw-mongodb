import express from 'express';
import { getContacts, getContactById } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', ctrlWrapper(getContactById));

export default router;
