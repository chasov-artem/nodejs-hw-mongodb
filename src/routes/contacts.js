import express from 'express';
import { getContacts, getContactById } from '../controllers/contacts.js';

const router = express.Router();

router.get('/', getContacts);

router.get('/:contactId', getContactById);

export default router;
