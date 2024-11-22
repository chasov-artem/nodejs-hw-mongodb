import { getAllContacts, findContactById } from '../services/contacts.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

export const getContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError.NotFound('Student not found');
    }

    const contact = await findContactById(contactId);
    if (!contact) {
      throw createError.NotFound('Student not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
