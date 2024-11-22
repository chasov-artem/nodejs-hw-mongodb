import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const findContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contact) => {
  return await Contact.create(contact);
};

export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
