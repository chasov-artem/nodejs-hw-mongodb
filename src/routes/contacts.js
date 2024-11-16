import express from 'express';
import { getContacts } from '../controllers/contacts.js';

const router = express.Router();

router.get('/', getContacts);

export default router;
