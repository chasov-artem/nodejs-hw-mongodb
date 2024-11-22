import {
  getAllContacts,
  findContactById,
  createContact,
  deleteContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

export const getContactsCtrl = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdCtrl = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError.NotFound('Student not found');
    }

    const contact = await findContactById(contactId);
    if (!contact) {
      throw createError.NotFound('Student not found');
    }
    res.status(200).send({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
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
  const result = deleteContact(id);
  if (!result) {
    throw createError.NotFound('Student not found');
  }
  res.status(204);
};
