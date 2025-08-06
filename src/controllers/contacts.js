import {
  getAllContacts,
  findContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsCtrl = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdCtrl = async (req, res, next) => {
  const { id } = req.params;

  const contact = await findContactById(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully found contact with id {contactId}!',
    data: contact,
  });
};

export const createContactCtrl = async (req, res) => {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const result = await createContact(contact);

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const deleteContactCtrl = async (req, res) => {
  const { id } = req.params;
  const result = await deleteContact(id);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const updateContactCtrl = async (req, res) => {
  const { id } = req.params;

  const result = await updateContact(id, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
