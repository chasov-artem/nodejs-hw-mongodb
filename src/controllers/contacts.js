import { getAllContacts, findContactById } from '../services/contacts.js';
import createHttpErrors from 'http-errors';

export const getContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);
  if (!contact) {
    throw new createHttpErrors.NotFound();
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found contact with id {contactId}!',
    data: contact,
  });
};
